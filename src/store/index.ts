import { create } from 'zustand';
import {
    Patient,
    Consultation,
    Detection,
    Doctor,
    SOAPNote,
    VitalReading,
    LiveStream,
    CaseStudy,
    Agent,
    AgentOutput,
    Notification
} from '@/types';

// Main Application Store
interface AppState {
    // User State
    currentUser: Doctor | null;
    isAuthenticated: boolean;
    language: string;

    // Active Consultation
    activeConsultation: Consultation | null;
    activePatient: Patient | null;

    // AI Detections
    detections: Detection[];
    activeDetection: Detection | null;
    isScanning: boolean;
    autoZoomEnabled: boolean;

    // Smart Zoom
    zoomTarget: { x: number; y: number; scale: number } | null;

    // Speech & Transcription
    isTranscribing: boolean;
    transcriptBuffer: string;
    fullTranscript: TranscriptEntry[];

    // SOAP Notes
    soapNote: SOAPNote | null;
    isGeneratingSoap: boolean;

    // Multi-Agent System
    agents: Agent[];
    agentOutputs: AgentOutput[];

    // Follow-up Records
    followUpImages: FollowUpImage[];

    // Live Streaming
    liveStreams: LiveStream[];
    activeLiveStream: LiveStream | null;

    // Case Library
    caseStudies: CaseStudy[];

    // Notifications
    notifications: Notification[];

    // UI State
    sidebarOpen: boolean;
    activePanel: 'detection' | 'agents' | 'soap' | 'vitals' | 'history' | 'collaboration';

    // Actions
    setCurrentUser: (user: Doctor | null) => void;
    setLanguage: (lang: string) => void;
    setActiveConsultation: (consultation: Consultation | null) => void;
    setActivePatient: (patient: Patient | null) => void;
    addDetection: (detection: Detection) => void;
    setActiveDetection: (detection: Detection | null) => void;
    setIsScanning: (scanning: boolean) => void;
    setAutoZoomEnabled: (enabled: boolean) => void;
    setZoomTarget: (target: { x: number; y: number; scale: number } | null) => void;
    setIsTranscribing: (transcribing: boolean) => void;
    addTranscriptEntry: (entry: TranscriptEntry) => void;
    setSoapNote: (note: SOAPNote | null) => void;
    setIsGeneratingSoap: (generating: boolean) => void;
    updateAgentStatus: (agentId: string, status: Agent['status'], output?: string) => void;
    addAgentOutput: (output: AgentOutput) => void;
    addFollowUpImage: (image: FollowUpImage) => void;
    setActiveLiveStream: (stream: LiveStream | null) => void;
    addNotification: (notification: Notification) => void;
    markNotificationRead: (id: string) => void;
    setSidebarOpen: (open: boolean) => void;
    setActivePanel: (panel: AppState['activePanel']) => void;
    clearDetections: () => void;
    resetConsultation: () => void;
}

export interface TranscriptEntry {
    id: string;
    speaker: 'doctor' | 'patient' | 'system';
    text: string;
    timestamp: string;
    confidence: number;
}

export interface FollowUpImage {
    id: string;
    imageData: string;
    timestamp: string;
    detection: Detection;
    notes: string;
    doctorNotes?: string;
}

export const useAppStore = create<AppState>((set, get) => ({
    // Initial State
    currentUser: null,
    isAuthenticated: false,
    language: typeof window !== 'undefined' ? (localStorage.getItem('medivision_language') || 'EN') : 'EN',
    activeConsultation: null,
    activePatient: null,
    detections: [],
    activeDetection: null,
    isScanning: false,
    autoZoomEnabled: true,
    zoomTarget: null,
    isTranscribing: false,
    transcriptBuffer: '',
    fullTranscript: [],
    soapNote: null,
    isGeneratingSoap: false,
    agents: [
        { id: 'vision', name: 'Vision Agent', type: 'vision', status: 'idle' },
        { id: 'reasoning', name: 'Medical Reasoning', type: 'reasoning', status: 'idle' },
        { id: 'documentation', name: 'Documentation Agent', type: 'documentation', status: 'idle' },
        { id: 'summary', name: 'Summary Agent', type: 'summary', status: 'idle' },
        { id: 'triage', name: 'Triage Agent', type: 'triage', status: 'idle' },
        { id: 'prescription', name: 'Prescription Agent', type: 'prescription', status: 'idle' },
        { id: 'research', name: 'Research Agent', type: 'research', status: 'idle' },
    ],
    agentOutputs: [],
    followUpImages: [],
    liveStreams: [],
    activeLiveStream: null,
    caseStudies: [],
    notifications: [],
    sidebarOpen: true,
    activePanel: 'detection',

    // Actions
    setCurrentUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),

    setLanguage: (lang) => {
        set({ language: lang });
        if (typeof window !== 'undefined') {
            localStorage.setItem('medivision_language', lang);
        }
    },

    setActiveConsultation: (consultation) => set({ activeConsultation: consultation }),

    setActivePatient: (patient) => set({ activePatient: patient }),

    addDetection: (detection) => {
        const state = get();
        set({ detections: [...state.detections, detection] });

        // Auto-zoom to critical/high severity detections
        if (state.autoZoomEnabled && (detection.severity === 'critical' || detection.severity === 'high')) {
            const zoomX = detection.boundingBox.x + detection.boundingBox.width / 2;
            const zoomY = detection.boundingBox.y + detection.boundingBox.height / 2;
            set({
                zoomTarget: { x: zoomX, y: zoomY, scale: 2.5 },
                activeDetection: detection
            });
        }
    },

    setActiveDetection: (detection) => set({ activeDetection: detection }),

    setIsScanning: (scanning) => set({ isScanning: scanning }),

    setAutoZoomEnabled: (enabled) => set({ autoZoomEnabled: enabled }),

    setZoomTarget: (target) => set({ zoomTarget: target }),

    setIsTranscribing: (transcribing) => set({ isTranscribing: transcribing }),

    addTranscriptEntry: (entry) => set((state) => ({
        fullTranscript: [...state.fullTranscript, entry]
    })),

    setSoapNote: (note) => set({ soapNote: note }),

    setIsGeneratingSoap: (generating) => set({ isGeneratingSoap: generating }),

    updateAgentStatus: (agentId, status, output) => set((state) => ({
        agents: state.agents.map(agent =>
            agent.id === agentId
                ? { ...agent, status, lastOutput: output || agent.lastOutput }
                : agent
        )
    })),

    addAgentOutput: (output) => set((state) => ({
        agentOutputs: [...state.agentOutputs, output]
    })),

    addFollowUpImage: (image) => set((state) => ({
        followUpImages: [...state.followUpImages, image]
    })),

    setActiveLiveStream: (stream) => set({ activeLiveStream: stream }),

    addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications]
    })),

    markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        )
    })),

    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    setActivePanel: (panel) => set({ activePanel: panel }),

    clearDetections: () => set({ detections: [], activeDetection: null, zoomTarget: null }),

    resetConsultation: () => set({
        activeConsultation: null,
        activePatient: null,
        detections: [],
        activeDetection: null,
        zoomTarget: null,
        fullTranscript: [],
        soapNote: null,
        agentOutputs: [],
        followUpImages: [],
    }),
}));

// Vitals Store for real-time monitoring
interface VitalsState {
    currentVitals: VitalReading | null;
    vitalsHistory: VitalReading[];
    isMonitoring: boolean;
    alerts: VitalAlert[];

    setCurrentVitals: (vitals: VitalReading) => void;
    addVitalsReading: (reading: VitalReading) => void;
    setIsMonitoring: (monitoring: boolean) => void;
    addAlert: (alert: VitalAlert) => void;
    dismissAlert: (id: string) => void;
}

export interface VitalAlert {
    id: string;
    type: 'heart_rate' | 'blood_pressure' | 'oxygen' | 'temperature' | 'respiratory';
    severity: 'warning' | 'critical';
    message: string;
    value: number;
    threshold: number;
    timestamp: string;
}

export const useVitalsStore = create<VitalsState>((set) => ({
    currentVitals: null,
    vitalsHistory: [],
    isMonitoring: false,
    alerts: [],

    setCurrentVitals: (vitals) => set({ currentVitals: vitals }),

    addVitalsReading: (reading) => set((state) => ({
        vitalsHistory: [...state.vitalsHistory.slice(-100), reading],
        currentVitals: reading,
    })),

    setIsMonitoring: (monitoring) => set({ isMonitoring: monitoring }),

    addAlert: (alert) => set((state) => ({
        alerts: [alert, ...state.alerts]
    })),

    dismissAlert: (id) => set((state) => ({
        alerts: state.alerts.filter(a => a.id !== id)
    })),
}));

// Collaboration Store
interface CollaborationState {
    participants: Participant[];
    annotations: SharedAnnotation[];
    chatMessages: ChatMessage[];
    isAnnotating: boolean;
    selectedTool: 'pointer' | 'marker' | 'circle' | 'rectangle' | 'arrow' | 'text';

    addParticipant: (participant: Participant) => void;
    removeParticipant: (id: string) => void;
    addAnnotation: (annotation: SharedAnnotation) => void;
    addChatMessage: (message: ChatMessage) => void;
    setIsAnnotating: (annotating: boolean) => void;
    setSelectedTool: (tool: CollaborationState['selectedTool']) => void;
}

export interface Participant {
    id: string;
    name: string;
    role: 'host' | 'doctor' | 'specialist' | 'observer';
    avatar?: string;
    isVideo: boolean;
    isAudio: boolean;
    specialty?: string;
    country?: string;
}

export interface SharedAnnotation {
    id: string;
    authorId: string;
    authorName: string;
    type: 'marker' | 'circle' | 'rectangle' | 'arrow' | 'text';
    x: number;
    y: number;
    width?: number;
    height?: number;
    text?: string;
    color: string;
    timestamp: string;
}

export interface ChatMessage {
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    timestamp: string;
    type: 'text' | 'system' | 'detection' | 'question';
}

export const useCollaborationStore = create<CollaborationState>((set) => ({
    participants: [],
    annotations: [],
    chatMessages: [],
    isAnnotating: false,
    selectedTool: 'pointer',

    addParticipant: (participant) => set((state) => ({
        participants: [...state.participants, participant]
    })),

    removeParticipant: (id) => set((state) => ({
        participants: state.participants.filter(p => p.id !== id)
    })),

    addAnnotation: (annotation) => set((state) => ({
        annotations: [...state.annotations, annotation]
    })),

    addChatMessage: (message) => set((state) => ({
        chatMessages: [...state.chatMessages, message]
    })),

    setIsAnnotating: (annotating) => set({ isAnnotating: annotating }),

    setSelectedTool: (tool) => set({ selectedTool: tool }),
}));

