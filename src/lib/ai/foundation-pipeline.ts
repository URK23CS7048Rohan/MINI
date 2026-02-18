import { v4 as uuidv4 } from 'uuid';
import {
    FoundationPipelineResult,
    PipelineStage,
    ConsensusResult,
    ModelVote,
    FoundationModelType,
    SegmentationResult,
    RetinalAnalysis,
    EndoscopyAnalysis,
    MedicalNLPResult,
    TrackingTrajectory,
    SegmentationPrompt,
    BoundingBox,
} from '@/types';
import { OpenMedOrchestrator, openMedOrchestrator } from './openmed';
import { MixFormerTracker, TemporalEvolutionAnalyzer, temporalAnalyzer } from './mixformer';
import { analyzeFrame, DETECTION_MODELS } from './detection';

// ============================================
// Foundation Pipeline — Multi-Stage Processing
// ============================================

export class FoundationPipeline {
    private orchestrator: OpenMedOrchestrator;
    private tracker: MixFormerTracker;
    private evolutionAnalyzer: TemporalEvolutionAnalyzer;

    constructor(orchestrator?: OpenMedOrchestrator) {
        this.orchestrator = orchestrator || openMedOrchestrator;
        this.tracker = new MixFormerTracker('mixvit_large');
        this.evolutionAnalyzer = temporalAnalyzer;
    }

    /**
     * Run the complete multi-stage pipeline:
     * Stage 1: YOLO Quick Detection (existing)
     * Stage 2: OpenMed Foundation Analysis (segmentation, retinal, endoscopy)
     * Stage 3: MixFormer Tracking (for video/multi-frame)
     * Stage 4: Consensus Engine (aggregate all outputs)
     */
    async runPipeline(
        imageBase64: string,
        imageType: 'xray' | 'ct' | 'mri' | 'retinal' | 'endoscopy' | 'skin' | 'general' = 'general',
        options?: {
            enableTracking?: boolean;
            templateBBox?: BoundingBox;
            additionalFrames?: string[];
            segmentationPrompts?: SegmentationPrompt[];
            generateReport?: boolean;
        }
    ): Promise<FoundationPipelineResult> {
        const pipelineId = uuidv4();
        const stages: PipelineStage[] = [];
        const startTime = performance.now();

        // =====================
        // Stage 1: YOLO Quick Detection
        // =====================
        const stage1: PipelineStage = {
            name: 'YOLO Quick Detection',
            model: 'Roboflow YOLO',
            status: 'processing',
            processingTime: 0,
            confidence: 0,
        };
        stages.push(stage1);

        try {
            const modelKey = this.mapImageTypeToModel(imageType);
            const yoloStart = performance.now();
            const yoloDetections = await analyzeFrame(imageBase64, modelKey);
            stage1.processingTime = performance.now() - yoloStart;
            stage1.confidence = yoloDetections.length > 0
                ? yoloDetections.reduce((sum, d) => sum + d.confidence, 0) / yoloDetections.length
                : 0;
            stage1.status = 'completed';
        } catch (error) {
            stage1.status = 'error';
        }

        // =====================
        // Stage 2: OpenMed Foundation Analysis
        // =====================
        const stage2: PipelineStage = {
            name: 'OpenMed Foundation Analysis',
            model: this.getOpenMedModelName(imageType),
            status: 'processing',
            processingTime: 0,
            confidence: 0,
        };
        stages.push(stage2);

        try {
            const openMedStart = performance.now();
            const openMedResult = await this.orchestrator.analyzeImage(
                imageBase64,
                imageType,
                {
                    prompts: options?.segmentationPrompts,
                    generateReport: options?.generateReport !== false,
                }
            );
            stage2.processingTime = performance.now() - openMedStart;

            if (openMedResult.segmentation) {
                stage2.result = openMedResult.segmentation;
                stage2.confidence = openMedResult.segmentation.masks.length > 0
                    ? openMedResult.segmentation.masks.reduce((sum, m) => sum + m.confidence, 0) / openMedResult.segmentation.masks.length
                    : 0;
            } else if (openMedResult.retinal) {
                stage2.result = openMedResult.retinal;
                stage2.confidence = openMedResult.retinal.diseases.length > 0
                    ? openMedResult.retinal.diseases.reduce((sum, d) => sum + d.confidence, 0) / openMedResult.retinal.diseases.length
                    : 0;
            } else if (openMedResult.endoscopy) {
                stage2.result = openMedResult.endoscopy;
                const allPathologies = openMedResult.endoscopy.frames.flatMap(f => f.pathologies);
                stage2.confidence = allPathologies.length > 0
                    ? allPathologies.reduce((sum, p) => sum + p.confidence, 0) / allPathologies.length
                    : 0;
            }
            stage2.status = 'completed';

            // Add NLP report as additional stage if available
            if (openMedResult.nlpReport) {
                const nlpStage: PipelineStage = {
                    name: 'PULSE Medical NLP',
                    model: 'PULSE LLM',
                    status: 'completed',
                    result: openMedResult.nlpReport,
                    processingTime: openMedResult.nlpReport.processingTime,
                    confidence: openMedResult.nlpReport.diseaseClassification.length > 0
                        ? openMedResult.nlpReport.diseaseClassification.reduce((sum, d) => sum + d.confidence, 0) / openMedResult.nlpReport.diseaseClassification.length
                        : 0,
                };
                stages.push(nlpStage);
            }
        } catch (error) {
            stage2.status = 'error';
        }

        // =====================
        // Stage 3: MixFormer Tracking (if enabled)
        // =====================
        if (options?.enableTracking && options.templateBBox) {
            const stage3: PipelineStage = {
                name: 'MixFormer Lesion Tracking',
                model: 'MixViT-L (CVPR 2022)',
                status: 'processing',
                processingTime: 0,
                confidence: 0,
            };
            stages.push(stage3);

            try {
                const trackStart = performance.now();
                await this.tracker.initTrack(imageBase64, options.templateBBox);

                // Track across additional frames
                const frames = options.additionalFrames || [];
                for (const frame of frames) {
                    await this.tracker.track(frame);
                }

                const trajectory = this.tracker.getTrajectory();
                stage3.result = trajectory;
                stage3.processingTime = performance.now() - trackStart;
                stage3.confidence = trajectory.avgConfidence;
                stage3.status = 'completed';

                this.tracker.reset();
            } catch (error) {
                stage3.status = 'error';
            }
        }

        // =====================
        // Stage 4: Consensus Engine
        // =====================
        const consensus = this.buildConsensus(stages);

        return {
            id: pipelineId,
            stages,
            consensus,
            totalProcessingTime: performance.now() - startTime,
            timestamp: new Date().toISOString(),
        };
    }

    private mapImageTypeToModel(imageType: string): keyof typeof DETECTION_MODELS {
        const mapping: Record<string, keyof typeof DETECTION_MODELS> = {
            skin: 'skin_disease',
            xray: 'chest_xray',
            ct: 'ct_scan',
            mri: 'mri',
            retinal: 'eye_disease',
            endoscopy: 'endoscopy',
            general: 'skin_disease',
        };
        return mapping[imageType] || 'skin_disease';
    }

    private getOpenMedModelName(imageType: string): string {
        const mapping: Record<string, string> = {
            retinal: 'RETFound (ViT-Large, 1.6M images)',
            endoscopy: 'Endo-FM (Video Transformer)',
            ct: 'SAM-Med3D (3D Volumetric)',
            mri: 'SAM-Med3D (3D Volumetric)',
            xray: 'SAM-Med2D (4.6M images)',
            skin: 'SAM-Med2D (4.6M images)',
            general: 'SAM-Med2D (4.6M images)',
        };
        return mapping[imageType] || 'SAM-Med2D';
    }

    /**
     * Build consensus from all pipeline stages
     */
    private buildConsensus(stages: PipelineStage[]): ConsensusResult {
        const completedStages = stages.filter(s => s.status === 'completed' && s.result);
        const votes: ModelVote[] = [];
        const allRecommendations: string[] = [];
        const allDifferentials: string[] = [];

        for (const stage of completedStages) {
            const result = stage.result;
            if (!result) continue;

            if ('masks' in result) {
                // Segmentation result
                const segResult = result as SegmentationResult;
                const pathologies = segResult.masks.filter(m => m.pathology);
                if (pathologies.length > 0) {
                    votes.push({
                        modelName: stage.model,
                        modelType: segResult.modelType as FoundationModelType,
                        diagnosis: pathologies.map(p => p.pathology || p.label || 'unknown').join(', '),
                        confidence: stage.confidence,
                        weight: 0.85,
                    });
                }
            }

            if ('diseases' in result) {
                // Retinal analysis
                const retResult = result as RetinalAnalysis;
                const significant = retResult.diseases.filter(d => d.severity !== 'none');
                if (significant.length > 0) {
                    votes.push({
                        modelName: stage.model,
                        modelType: 'retfound',
                        diagnosis: significant.map(d => `${d.name} (${d.severity})`).join(', '),
                        confidence: stage.confidence,
                        weight: 0.95,
                    });
                    allRecommendations.push(...significant.map(d => d.recommendation));
                }
            }

            if ('frames' in result) {
                // Endoscopy analysis
                const endoResult = result as EndoscopyAnalysis;
                votes.push({
                    modelName: stage.model,
                    modelType: 'endo_fm',
                    diagnosis: endoResult.overallFindings.join(', '),
                    confidence: stage.confidence,
                    weight: 0.90,
                });
            }

            if ('clinicalSummary' in result) {
                // NLP result
                const nlpResult = result as MedicalNLPResult;
                if (nlpResult.diseaseClassification.length > 0) {
                    votes.push({
                        modelName: stage.model,
                        modelType: 'pulse',
                        diagnosis: nlpResult.diseaseClassification[0].name,
                        confidence: stage.confidence,
                        weight: 0.80,
                    });
                    allRecommendations.push(...nlpResult.treatmentSuggestions);
                    allDifferentials.push(...nlpResult.differentialDiagnosis);
                }
            }

            if ('evolution' in result) {
                // Tracking result
                const trackResult = result as TrackingTrajectory;
                votes.push({
                    modelName: stage.model,
                    modelType: trackResult.results[0]?.modelType || 'mixformer_vit',
                    diagnosis: `Lesion tracking: ${trackResult.evolution.riskAssessment} (${trackResult.evolution.morphologyChange})`,
                    confidence: trackResult.avgConfidence,
                    weight: 0.75,
                });
            }
        }

        // Calculate weighted consensus
        const totalWeight = votes.reduce((sum, v) => sum + v.weight, 0);
        const weightedConfidence = totalWeight > 0
            ? votes.reduce((sum, v) => sum + v.confidence * v.weight, 0) / totalWeight
            : 0;

        // Agreement score: how closely models agree
        const agreementScore = votes.length > 1
            ? 1 - (Math.max(...votes.map(v => v.confidence)) - Math.min(...votes.map(v => v.confidence)))
            : votes.length === 1 ? votes[0].confidence : 0;

        // Determine severity
        const maxConfidence = Math.max(...votes.map(v => v.confidence), 0);
        let severity: ConsensusResult['severity'] = 'normal';
        if (maxConfidence > 0.9) severity = 'high';
        else if (maxConfidence > 0.7) severity = 'medium';
        else if (maxConfidence > 0.5) severity = 'low';

        // Check for critical findings
        const hasCritical = votes.some(v =>
            v.diagnosis.toLowerCase().includes('critical') ||
            v.diagnosis.toLowerCase().includes('urgent') ||
            v.diagnosis.toLowerCase().includes('tumor') ||
            v.diagnosis.toLowerCase().includes('malignant')
        );
        if (hasCritical) severity = 'critical';

        return {
            primaryDiagnosis: votes.length > 0
                ? votes.sort((a, b) => b.confidence * b.weight - a.confidence * a.weight)[0].diagnosis
                : 'No significant findings',
            confidence: weightedConfidence,
            agreementScore,
            modelVotes: votes,
            severity,
            recommendations: [...new Set(allRecommendations)].slice(0, 8),
            differentialDiagnoses: [...new Set(allDifferentials)].slice(0, 6),
        };
    }

    getTracker(): MixFormerTracker {
        return this.tracker;
    }

    getOrchestrator(): OpenMedOrchestrator {
        return this.orchestrator;
    }
}

// ============================================
// Consensus Engine — Standalone
// ============================================

export class ConsensusEngine {
    /**
     * Run a multi-model vote on a set of independent results
     */
    static buildConsensusFromVotes(votes: ModelVote[]): ConsensusResult {
        if (votes.length === 0) {
            return {
                primaryDiagnosis: 'Insufficient data',
                confidence: 0,
                agreementScore: 0,
                modelVotes: [],
                severity: 'normal',
                recommendations: ['Additional imaging or clinical evaluation recommended'],
                differentialDiagnoses: [],
            };
        }

        const totalWeight = votes.reduce((sum, v) => sum + v.weight, 0);
        const weightedConfidence = votes.reduce((sum, v) => sum + v.confidence * v.weight, 0) / totalWeight;
        const agreementScore = 1 - (Math.max(...votes.map(v => v.confidence)) - Math.min(...votes.map(v => v.confidence)));

        const sortedVotes = [...votes].sort((a, b) => b.confidence * b.weight - a.confidence * a.weight);

        return {
            primaryDiagnosis: sortedVotes[0].diagnosis,
            confidence: weightedConfidence,
            agreementScore,
            modelVotes: votes,
            severity: weightedConfidence > 0.85 ? 'high' : weightedConfidence > 0.6 ? 'medium' : 'low',
            recommendations: ['Follow-up with specialist', 'Additional imaging recommended'],
            differentialDiagnoses: sortedVotes.slice(1).map(v => v.diagnosis),
        };
    }
}

// Export singleton instance
export const foundationPipeline = new FoundationPipeline();
