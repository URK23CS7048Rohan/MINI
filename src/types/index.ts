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

