import { Detection, DetectionCategory, DetectionType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Roboflow and YOLO Detection Configuration
export const DETECTION_MODELS = {
    // Dermatology Models
    skin_disease: {
        modelId: 'skin-disease-detection',
        version: '1',
        categories: ['melanoma', 'psoriasis', 'eczema', 'acne', 'rosacea', 'dermatitis', 'vitiligo', 'ringworm'],
    },
    skin_cancer: {
        modelId: 'skin-cancer-detection',
        version: '1',
        categories: ['melanoma', 'basal_cell_carcinoma', 'squamous_cell_carcinoma', 'benign_keratosis'],
    },
    wound: {
        modelId: 'wound-detection',
        version: '1',
        categories: ['laceration', 'abrasion', 'puncture', 'surgical_wound', 'pressure_ulcer', 'diabetic_ulcer'],
    },
    burn: {
        modelId: 'burn-severity-assessment',
        version: '1',
        categories: ['first_degree', 'second_degree_superficial', 'second_degree_deep', 'third_degree'],
    },

    // Radiology Models
    chest_xray: {
        modelId: 'chest-xray-detection',
        version: '1',
        categories: ['pneumonia', 'covid19', 'tuberculosis', 'lung_cancer', 'cardiomegaly', 'pleural_effusion', 'normal'],
    },
    bone_fracture: {
        modelId: 'bone-fracture-detection',
        version: '1',
        categories: ['fracture', 'hairline_fracture', 'compound_fracture', 'stress_fracture', 'normal'],
    },
    ct_scan: {
        modelId: 'ct-scan-analysis',
        version: '1',
        categories: ['tumor', 'hemorrhage', 'stroke', 'aneurysm', 'normal'],
    },
    mri: {
        modelId: 'mri-analysis',
        version: '1',
        categories: ['brain_tumor', 'ms_lesion', 'alzheimer', 'normal'],
    },

    // Ophthalmology Models
    eye_disease: {
        modelId: 'eye-disease-detection',
        version: '1',
        categories: ['cataract', 'glaucoma', 'diabetic_retinopathy', 'macular_degeneration', 'uveitis', 'normal'],
    },
    retinal: {
        modelId: 'retinal-analysis',
        version: '1',
        categories: ['retinal_detachment', 'retinal_tear', 'hemorrhage', 'drusen', 'normal'],
    },

    // Dentistry Models
    dental: {
        modelId: 'dental-xray-detection',
        version: '1',
        categories: ['cavity', 'abscess', 'periodontitis', 'impacted_tooth', 'root_canal_issue', 'fracture', 'normal'],
    },

    // Cardiology Models
    ecg: {
        modelId: 'ecg-analysis',
        version: '1',
        categories: ['arrhythmia', 'atrial_fibrillation', 'bradycardia', 'tachycardia', 'st_elevation', 'normal'],
    },
    echocardiogram: {
        modelId: 'echo-analysis',
        version: '1',
        categories: ['valve_disease', 'cardiomyopathy', 'pericardial_effusion', 'normal'],
    },

    // Gastroenterology Models
    endoscopy: {
        modelId: 'endoscopy-detection',
        version: '1',
        categories: ['polyp', 'ulcer', 'inflammation', 'tumor', 'bleeding', 'normal'],
    },

    // Pathology Models
    microscopy: {
        modelId: 'pathology-microscopy',
        version: '1',
        categories: ['malignant_cells', 'benign_cells', 'inflammatory', 'necrosis', 'normal'],
    },
};

// Severity assessment based on detection
export function assessSeverity(
    detectionType: DetectionType,
    label: string,
    confidence: number
): Detection['severity'] {
    const criticalConditions = [
        'melanoma', 'third_degree', 'hemorrhage', 'stroke', 'aneurysm',
        'brain_tumor', 'malignant_cells', 'st_elevation', 'retinal_detachment',
        'compound_fracture', 'lung_cancer', 'tumor'
    ];

    const highSeverityConditions = [
        'second_degree_deep', 'pneumonia', 'covid19', 'diabetic_retinopathy',
        'glaucoma', 'arrhythmia', 'atrial_fibrillation', 'ulcer', 'abscess',
        'fracture', 'tuberculosis', 'cardiomyopathy'
    ];

    const mediumSeverityConditions = [
        'second_degree_superficial', 'periodontitis', 'cavity', 'polyp',
        'inflammation', 'cataract', 'psoriasis', 'stress_fracture',
        'macular_degeneration', 'pleural_effusion'
    ];

    if (criticalConditions.some(c => label.toLowerCase().includes(c))) {
        return 'critical';
    }
    if (highSeverityConditions.some(c => label.toLowerCase().includes(c))) {
        return 'high';
    }
    if (mediumSeverityConditions.some(c => label.toLowerCase().includes(c))) {
        return 'medium';
    }
    if (label.toLowerCase().includes('normal')) {
        return 'normal';
    }
    return 'low';
}

// Get category from detection type
export function getDetectionCategory(type: DetectionType): DetectionCategory {
    const categoryMap: Record<DetectionType, DetectionCategory> = {
        skin_lesion: 'dermatology',
        wound: 'dermatology',
        burn: 'dermatology',
        fracture: 'orthopedics',
        tumor: 'oncology',
        dental: 'dentistry',
        eye_condition: 'ophthalmology',
        chest_xray: 'radiology',
        ct_scan: 'radiology',
        mri: 'neurology',
        ecg: 'cardiology',
        ultrasound: 'radiology',
        endoscopy: 'gastroenterology',
        microscopy: 'pathology',
        other: 'general',
    };
    return categoryMap[type];
}

// Simulate AI detection on video frame
export async function analyzeFrame(
    imageData: string,
    modelType: keyof typeof DETECTION_MODELS = 'skin_disease'
): Promise<Detection[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    const model = DETECTION_MODELS[modelType];
    const detections: Detection[] = [];

    // Simulate random detections for demo
    const shouldDetect = Math.random() > 0.6;
    if (shouldDetect) {
        const numDetections = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < numDetections; i++) {
            const category = model.categories[Math.floor(Math.random() * model.categories.length)];
            const confidence = 0.7 + Math.random() * 0.25;

            const detection: Detection = {
                id: uuidv4(),
                timestamp: new Date().toISOString(),
                type: modelType as DetectionType,
                category: getDetectionCategory(modelType as DetectionType),
                label: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                confidence,
                severity: assessSeverity(modelType as DetectionType, category, confidence),
                boundingBox: {
                    x: Math.random() * 0.6 + 0.1,
                    y: Math.random() * 0.6 + 0.1,
                    width: Math.random() * 0.2 + 0.1,
                    height: Math.random() * 0.2 + 0.1,
                },
                imageSnapshot: imageData,
                analysis: generateAnalysis(category, confidence),
                recommendations: generateRecommendations(category),
                relatedConditions: getRelatedConditions(category),
            };

            detections.push(detection);
        }
    }

    return detections;
}

// Generate AI analysis text
function generateAnalysis(condition: string, confidence: number): string {
    const analyses: Record<string, string> = {
        melanoma: 'Detected asymmetric pigmented lesion with irregular borders. ABCDE criteria suggest possible malignant melanoma. Urgent dermatological evaluation recommended.',
        pneumonia: 'Bilateral infiltrates detected in lower lung fields. Pattern consistent with bacterial pneumonia. Recommend sputum culture and targeted antibiotic therapy.',
        fracture: 'Visible discontinuity in cortical bone structure. Complete fracture with minimal displacement. Immobilization and orthopedic consultation recommended.',
        cataract: 'Lens opacity detected affecting visual axis. Grade 2-3 nuclear cataract observed. Surgical intervention may be considered if vision significantly impaired.',
        cavity: 'Dental caries detected extending to dentin layer. Moderate depth cavity requiring restorative treatment. Risk of pulp involvement if untreated.',
        polyp: 'Sessile polyp detected in colonic mucosa. Size approximately 8mm. Recommend polypectomy and histological examination.',
        arrhythmia: 'Irregular R-R intervals detected with premature ventricular complexes. Frequency suggests need for cardiac monitoring and possible intervention.',
    };

    return analyses[condition] ||
        `Detected ${condition.replace(/_/g, ' ')} with ${(confidence * 100).toFixed(1)}% confidence. Further clinical correlation recommended.`;
}

// Generate treatment recommendations
function generateRecommendations(condition: string): string[] {
    const recommendations: Record<string, string[]> = {
        melanoma: [
            'Immediate referral to dermatology/oncology',
            'Excisional biopsy with appropriate margins',
            'Sentinel lymph node assessment',
            'Full body skin examination',
            'Patient education on sun protection',
        ],
        pneumonia: [
            'Initiate empiric antibiotic therapy',
            'Order sputum culture and sensitivity',
            'Monitor oxygen saturation',
            'Consider chest physiotherapy',
            'Follow-up chest X-ray in 6-8 weeks',
        ],
        fracture: [
            'Immobilize the affected area',
            'Refer to orthopedic surgery',
            'Pain management protocol',
            'Monitor for compartment syndrome',
            'Physical therapy post-healing',
        ],
        cavity: [
            'Schedule dental restoration',
            'Assess need for root canal',
            'Oral hygiene education',
            'Fluoride treatment recommendation',
            'Regular dental follow-up',
        ],
    };

    return recommendations[condition] || [
        'Clinical correlation required',
        'Consider specialist referral',
        'Document findings for follow-up',
        'Patient education on condition',
        'Schedule follow-up appointment',
    ];
}

// Get related conditions
function getRelatedConditions(condition: string): string[] {
    const related: Record<string, string[]> = {
        melanoma: ['Basal Cell Carcinoma', 'Squamous Cell Carcinoma', 'Dysplastic Nevus'],
        pneumonia: ['Bronchitis', 'COVID-19', 'Tuberculosis', 'Lung Abscess'],
        fracture: ['Stress Fracture', 'Osteoporosis', 'Bone Contusion'],
        diabetes_retinopathy: ['Macular Edema', 'Glaucoma', 'Cataracts'],
        cavity: ['Periodontitis', 'Abscess', 'Tooth Decay'],
    };

    return related[condition] || [];
}

// Real-time video analysis class
export class VideoAnalyzer {
    private isAnalyzing: boolean = false;
    private analysisInterval: NodeJS.Timeout | null = null;
    private frameCallback: ((detections: Detection[]) => void) | null = null;
    private videoElement: HTMLVideoElement | null = null;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private currentModel: keyof typeof DETECTION_MODELS = 'skin_disease';

    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
    }

    setVideoElement(video: HTMLVideoElement) {
        this.videoElement = video;
        this.canvas.width = video.videoWidth || 640;
        this.canvas.height = video.videoHeight || 480;
    }

    setModel(model: keyof typeof DETECTION_MODELS) {
        this.currentModel = model;
    }

    setCallback(callback: (detections: Detection[]) => void) {
        this.frameCallback = callback;
    }

    start(intervalMs: number = 2000) {
        if (this.isAnalyzing) return;

        this.isAnalyzing = true;
        this.analysisInterval = setInterval(async () => {
            if (this.videoElement && this.frameCallback) {
                const frame = this.captureFrame();
                if (frame) {
                    const detections = await analyzeFrame(frame, this.currentModel);
                    this.frameCallback(detections);
                }
            }
        }, intervalMs);
    }

    stop() {
        this.isAnalyzing = false;
        if (this.analysisInterval) {
            clearInterval(this.analysisInterval);
            this.analysisInterval = null;
        }
    }

    private captureFrame(): string | null {
        if (!this.videoElement) return null;

        this.ctx.drawImage(
            this.videoElement,
            0, 0,
            this.canvas.width,
            this.canvas.height
        );

        return this.canvas.toDataURL('image/jpeg', 0.8);
    }

    captureSnapshot(): string | null {
        return this.captureFrame();
    }
}

// Roboflow API client (for real API integration)
export class RoboflowClient {
    private apiKey: string;
    private baseUrl: string = 'https://detect.roboflow.com';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async detect(
        imageBase64: string,
        modelId: string,
        version: string = '1'
    ): Promise<RoboflowPrediction[]> {
        try {
            const response = await fetch(
                `${this.baseUrl}/${modelId}/${version}?api_key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: imageBase64,
                }
            );

            if (!response.ok) {
                throw new Error(`Roboflow API error: ${response.status}`);
            }

            const data = await response.json();
            return data.predictions || [];
        } catch (error) {
            console.error('Roboflow detection error:', error);
            return [];
        }
    }
}

export interface RoboflowPrediction {
    class: string;
    confidence: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

