// Patient Types
export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    email: string;
    phone: string;
    avatar?: string;
    bloodType?: string;
    allergies: string[];
    conditions: string[];
    medications: Medication[];
    vitals: VitalReading[];
    consultations: Consultation[];
    labResults: LabResult[];
    createdAt: string;
    updatedAt: string;
}

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    prescribedBy: string;
    notes?: string;
}

export interface VitalReading {
    id: string;
    timestamp: string;
    heartRate: number;
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    temperature: number;
    oxygenSaturation: number;
    respiratoryRate: number;
    weight?: number;
    glucoseLevel?: number;
}

export interface LabResult {
    id: string;
    testName: string;
    testType: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'abnormal' | 'critical';
    orderedBy: string;
    orderedAt: string;
    resultAt: string;
    notes?: string;
}

// Consultation Types
export interface Consultation {
    id: string;
    patientId: string;
    doctorId: string;
    specialistId?: string;
    roomId: string;
    type: 'video' | 'audio' | 'chat';
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    scheduledAt: string;
    startedAt?: string;
    endedAt?: string;
    duration?: number;
    chiefComplaint: string;
    soapNote?: SOAPNote;
    detections: Detection[];
    prescriptions: Prescription[];
    recordings?: Recording[];
    notes: string;
    followUpDate?: string;
}

export interface SOAPNote {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    generatedAt: string;
    editedAt?: string;
    confidence: number;
}

export interface Prescription {
    id: string;
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    prescribedAt: string;
}

export interface Recording {
    id: string;
    type: 'video' | 'audio' | 'screen';
    url: string;
    duration: number;
    startTime: string;
    endTime: string;
}

// AI Detection Types
export interface Detection {
    id: string;
    timestamp: string;
    type: DetectionType;
    category: DetectionCategory;
    label: string;
    confidence: number;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'normal';
    boundingBox: BoundingBox;
    imageSnapshot?: string;
    analysis?: string;
    recommendations?: string[];
    relatedConditions?: string[];
}

export type DetectionType =
    | 'skin_lesion'
    | 'wound'
    | 'burn'
    | 'fracture'
    | 'tumor'
    | 'dental'
    | 'eye_condition'
    | 'chest_xray'
    | 'ct_scan'
    | 'mri'
    | 'ecg'
    | 'ultrasound'
    | 'endoscopy'
    | 'microscopy'
    | 'other';

export type DetectionCategory =
    | 'dermatology'
    | 'radiology'
    | 'cardiology'
    | 'ophthalmology'
    | 'dentistry'
    | 'orthopedics'
    | 'oncology'
    | 'neurology'
    | 'gastroenterology'
    | 'pathology'
    | 'general';

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

// Doctor/User Types
export interface Doctor {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    specialty: Specialty;
    subspecialties?: string[];
    licenseNumber: string;
    hospital?: string;
    location: {
        city: string;
        country: string;
        timezone: string;
    };
    experience: number; // years
    rating: number;
    totalConsultations: number;
    languages: string[];
    availability: Availability[];
    isOnline: boolean;
    isVerified: boolean;
}

export type Specialty =
    | 'general_practice'
    | 'dermatology'
    | 'cardiology'
    | 'neurology'
    | 'orthopedics'
    | 'ophthalmology'
    | 'dentistry'
    | 'oncology'
    | 'radiology'
    | 'surgery'
    | 'pediatrics'
    | 'psychiatry'
    | 'emergency'
    | 'pathology'
    | 'gastroenterology'
    | 'pulmonology'
    | 'nephrology'
    | 'endocrinology'
    | 'rheumatology'
    | 'urology'
    | 'gynecology'
    | 'anesthesiology';

export interface Availability {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

// Live Streaming Types
export interface LiveStream {
    id: string;
    title: string;
    description: string;
    hostDoctor: Doctor;
    type: 'surgery' | 'procedure' | 'lecture' | 'case_study' | 'diagnosis' | 'discussion';
    specialty: Specialty;
    status: 'scheduled' | 'live' | 'ended';
    scheduledAt: string;
    startedAt?: string;
    endedAt?: string;
    viewerCount: number;
    maxViewers: number;
    isRecorded: boolean;
    recordingUrl?: string;
    thumbnail?: string;
    tags: string[];
    participants: Doctor[];
    chatEnabled: boolean;
    qnaEnabled: boolean;
}

export interface CaseStudy {
    id: string;
    title: string;
    description: string;
    specialty: Specialty;
    condition: string;
    authorDoctor: Doctor;
    createdAt: string;
    updatedAt: string;
    images: CaseImage[];
    detections: Detection[];
    diagnosis: string;
    treatment: string;
    outcome: string;
    learningPoints: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    views: number;
    likes: number;
    comments: CaseComment[];
    tags: string[];
    isPublic: boolean;
    isVerified: boolean;
}

export interface CaseImage {
    id: string;
    url: string;
    type: string;
    annotations: Annotation[];
    description?: string;
}

export interface Annotation {
    id: string;
    type: 'marker' | 'circle' | 'rectangle' | 'arrow' | 'text';
    x: number;
    y: number;
    width?: number;
    height?: number;
    text?: string;
    color: string;
    authorId: string;
}

export interface CaseComment {
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: string;
    likes: number;
    replies: CaseComment[];
}

// Agent Types
export interface Agent {
    id: string;
    name: string;
    type: AgentType;
    status: 'idle' | 'processing' | 'completed' | 'error';
    lastOutput?: string;
    confidence?: number;
    processingTime?: number;
}

export type AgentType =
    | 'vision'
    | 'reasoning'
    | 'documentation'
    | 'summary'
    | 'triage'
    | 'prescription'
    | 'research';

export interface AgentOutput {
    agentId: string;
    agentType: AgentType;
    timestamp: string;
    input: string;
    output: string;
    confidence: number;
    metadata?: Record<string, unknown>;
}

// WebRTC Types
export interface WebRTCConnection {
    peerId: string;
    status: 'connecting' | 'connected' | 'disconnected' | 'failed';
    localStream?: MediaStream;
    remoteStream?: MediaStream;
    dataChannel?: RTCDataChannel;
}

export interface RoomParticipant {
    id: string;
    name: string;
    role: 'host' | 'doctor' | 'specialist' | 'patient' | 'observer';
    isVideo: boolean;
    isAudio: boolean;
    isScreenSharing: boolean;
    joinedAt: string;
}

// Audit Types
export interface AuditLog {
    id: string;
    userId: string;
    action: string;
    resource: string;
    resourceId: string;
    details: string;
    ipAddress: string;
    userAgent: string;
    timestamp: string;
}

// Notification Types
export interface Notification {
    id: string;
    userId: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'alert';
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    actionUrl?: string;
}

// Analytics Types
export interface AnalyticsSummary {
    totalPatients: number;
    totalConsultations: number;
    totalDetections: number;
    avgConsultationDuration: number;
    detectionAccuracy: number;
    patientSatisfaction: number;
    topConditions: { condition: string; count: number }[];
    consultationsByDay: { date: string; count: number }[];
    detectionsByType: { type: string; count: number }[];
}

// ============================================
// OpenMEDLab Foundation Model Types
// ============================================

export type FoundationModelType =
    | 'sam_med_2d'
    | 'sam_med_3d'
    | 'retfound'
    | 'endo_fm'
    | 'pulse'
    | 'mixformer_cvt'
    | 'mixformer_vit';

export type FoundationModelCategory =
    | 'segmentation'
    | 'retinal'
    | 'endoscopy'
    | 'medical_nlp'
    | 'tracking';

export interface FoundationModel {
    id: string;
    name: string;
    type: FoundationModelType;
    category: FoundationModelCategory;
    description: string;
    paper: string;
    venue: string;
    repository: string;
    architecture: string;
    pretrainingData: string;
    accuracy: number;
    isActive: boolean;
    capabilities: string[];
}

// SAM-Med2D / SAM-Med3D Types
export interface SegmentationPrompt {
    type: 'point' | 'box' | 'mask';
    points?: { x: number; y: number; label: 0 | 1 }[];
    box?: { x1: number; y1: number; x2: number; y2: number };
    mask?: number[][];
}

export interface SegmentationMask {
    id: string;
    maskData: number[][];
    confidence: number;
    area: number;
    boundingBox: BoundingBox;
    iouPrediction: number;
    stability: number;
    label?: string;
    organ?: string;
    pathology?: string;
}

export interface SegmentationResult {
    id: string;
    modelType: 'sam_med_2d' | 'sam_med_3d';
    masks: SegmentationMask[];
    imageSize: { width: number; height: number; depth?: number };
    processingTime: number;
    timestamp: string;
    metadata: {
        encoderType: string;
        adapterLayers: number;
        patchSize: number;
        promptsUsed: SegmentationPrompt[];
    };
}

export interface VolumetricMask extends SegmentationMask {
    depth: number;
    sliceRange: { start: number; end: number };
    volumeCC: number;
}

export interface VolumetricResult extends Omit<SegmentationResult, 'masks'> {
    masks: VolumetricMask[];
    volumeSize: { width: number; height: number; depth: number };
    sliceCount: number;
}

// RETFound Types
export interface RetinalAnalysis {
    id: string;
    modelType: 'retfound';
    diseases: RetinalDisease[];
    overallRisk: 'low' | 'moderate' | 'high' | 'critical';
    cardiovascularRisk: number;
    qualityScore: number;
    processingTime: number;
    timestamp: string;
    metadata: {
        encoderBlocks: number;
        embeddingDim: number;
        attentionHeads: number;
        pretrainingImages: string;
        patchSize: number;
    };
}

export interface RetinalDisease {
    name: string;
    confidence: number;
    severity: 'none' | 'mild' | 'moderate' | 'severe' | 'proliferative';
    affectedRegion?: string;
    biomarkers: string[];
    recommendation: string;
}

// Endo-FM Types
export interface EndoscopyAnalysis {
    id: string;
    modelType: 'endo_fm';
    frames: EndoscopyFrame[];
    overallFindings: string[];
    surgicalPhase?: string;
    sceneClassification: string;
    processingTime: number;
    timestamp: string;
    metadata: {
        frameCount: number;
        fps: number;
        spatialEncoding: string;
        temporalEncoding: string;
        pretrainingMethod: string;
    };
}

export interface EndoscopyFrame {
    frameIndex: number;
    timestamp: number;
    pathologies: EndoscopyPathology[];
    sceneType: string;
    qualityScore: number;
}

export interface EndoscopyPathology {
    type: 'polyp' | 'ulcer' | 'inflammation' | 'tumor' | 'bleeding' | 'stricture' | 'normal';
    confidence: number;
    location: BoundingBox;
    size: 'diminutive' | 'small' | 'medium' | 'large';
    morphology?: string;
    parisClassification?: string;
}

// PULSE Medical NLP Types
export interface MedicalNLPResult {
    id: string;
    modelType: 'pulse';
    clinicalSummary: string;
    anatomicalSegmentation?: string;
    diseaseClassification: DiseaseClassification[];
    treatmentSuggestions: string[];
    differentialDiagnosis: string[];
    icdCodes: string[];
    processingTime: number;
    timestamp: string;
    metadata: {
        backbone: string;
        decoderType: string;
        pretrainingData: string[];
        taskType: string;
    };
}

export interface DiseaseClassification {
    name: string;
    confidence: number;
    category: string;
    icdCode?: string;
    severity?: string;
}

// ============================================
// MixFormer CVPR 2022 Types
// ============================================

export interface TrackingResult {
    id: string;
    modelType: 'mixformer_cvt' | 'mixformer_vit';
    frameIndex: number;
    boundingBox: BoundingBox;
    confidence: number;
    velocity: { dx: number; dy: number };
    sizeChange: { dw: number; dh: number };
    isOccluded: boolean;
    trackingQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'lost';
    timestamp: string;
}

export interface TrackingTrajectory {
    id: string;
    templateImage?: string;
    results: TrackingResult[];
    totalFrames: number;
    avgConfidence: number;
    avgIoU: number;
    trackingDuration: number;
    evolution: LesionEvolution;
}

export interface LesionEvolution {
    sizeChange: number;
    growthRate: number;
    morphologyChange: 'stable' | 'growing' | 'shrinking' | 'irregular';
    colorChange: 'unchanged' | 'darkening' | 'lightening' | 'heterogeneous';
    borderChange: 'regular' | 'irregular' | 'expanding';
    riskAssessment: 'benign' | 'monitor' | 'suspicious' | 'urgent';
    timelinePoints: EvolutionTimepoint[];
}

export interface EvolutionTimepoint {
    timestamp: string;
    frameIndex: number;
    area: number;
    perimeter: number;
    aspectRatio: number;
    confidence: number;
}

export interface MixedAttentionConfig {
    backboneType: 'mixcvt' | 'mixvit';
    numStages: number;
    embeddingDim: number;
    numHeads: number;
    templateSize: number;
    searchSize: number;
    localizationHead: 'query_based' | 'corner_based';
    pretrainedWeights: string;
}

// ============================================
// Foundation Pipeline Types
// ============================================

export interface FoundationPipelineResult {
    id: string;
    stages: PipelineStage[];
    consensus: ConsensusResult;
    totalProcessingTime: number;
    timestamp: string;
}

export interface PipelineStage {
    name: string;
    model: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    result?: SegmentationResult | RetinalAnalysis | EndoscopyAnalysis | MedicalNLPResult | TrackingTrajectory;
    processingTime: number;
    confidence: number;
}

export interface ConsensusResult {
    primaryDiagnosis: string;
    confidence: number;
    agreementScore: number;
    modelVotes: ModelVote[];
    severity: 'critical' | 'high' | 'medium' | 'low' | 'normal';
    recommendations: string[];
    differentialDiagnoses: string[];
}

export interface ModelVote {
    modelName: string;
    modelType: FoundationModelType;
    diagnosis: string;
    confidence: number;
    weight: number;
}

