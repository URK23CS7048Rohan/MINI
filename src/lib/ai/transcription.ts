// Speech recognition and transcription service

export interface TranscriptionResult {
    text: string;
    confidence: number;
    speaker: 'doctor' | 'patient' | 'unknown';
    timestamp: string;
    isFinal: boolean;
}

// Web Speech API types
interface SpeechRecognitionResult {
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    readonly isFinal: boolean;
}

interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}

interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEventInit extends EventInit {
    resultIndex?: number;
    results: SpeechRecognitionResultList;
}

interface WebSpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}

interface WebSpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
}

interface WebSpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    onresult: ((event: WebSpeechRecognitionEvent) => void) | null;
    onerror: ((event: WebSpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    start(): void;
    stop(): void;
    abort(): void;
}

// Window augmentation
interface WindowWithSpeechRecognition {
    SpeechRecognition?: new () => WebSpeechRecognition;
    webkitSpeechRecognition?: new () => WebSpeechRecognition;
}

export class SpeechRecognitionService {
    private recognition: WebSpeechRecognition | null = null;
    private isListening: boolean = false;
    private onResultCallback: ((result: TranscriptionResult) => void) | null = null;
    private onErrorCallback: ((error: string) => void) | null = null;
    private language: string = 'en-US';
    private continuousMode: boolean = true;

    constructor() {
        if (typeof window !== 'undefined') {
            const windowWithSpeech = window as unknown as WindowWithSpeechRecognition;
            const SpeechRecognitionAPI = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

            if (SpeechRecognitionAPI) {
                this.recognition = new SpeechRecognitionAPI();
                this.setupRecognition();
            }
        }
    }

    private setupRecognition() {
        if (!this.recognition) return;

        this.recognition.continuous = this.continuousMode;
        this.recognition.interimResults = true;
        this.recognition.lang = this.language;
        this.recognition.maxAlternatives = 1;

        this.recognition.onresult = (event: WebSpeechRecognitionEvent) => {
            const result = event.results[event.results.length - 1];
            const transcript = result[0].transcript;
            const confidence = result[0].confidence;
            const isFinal = result.isFinal;

            if (this.onResultCallback) {
                this.onResultCallback({
                    text: transcript,
                    confidence: confidence || 0.8,
                    speaker: this.detectSpeaker(transcript),
                    timestamp: new Date().toISOString(),
                    isFinal,
                });
            }
        };

        this.recognition.onerror = (event: WebSpeechRecognitionErrorEvent) => {
            if (this.onErrorCallback) {
                this.onErrorCallback(event.error);
            }

            // Auto-restart on certain errors
            if (event.error === 'no-speech' || event.error === 'aborted') {
                if (this.isListening) {
                    this.restart();
                }
            }
        };

        this.recognition.onend = () => {
            if (this.isListening && this.continuousMode) {
                this.restart();
            }
        };
    }

    setLanguage(langCode: string) {
        this.language = langCode;
        if (this.recognition) {
            this.recognition.lang = langCode;
        }
    }

    setOnResult(callback: (result: TranscriptionResult) => void) {
        this.onResultCallback = callback;
    }

    setOnError(callback: (error: string) => void) {
        this.onErrorCallback = callback;
    }

    start() {
        if (this.recognition && !this.isListening) {
            this.isListening = true;
            try {
                this.recognition.start();
            } catch (e) {
                console.error('Speech recognition start error:', e);
            }
        }
    }

    stop() {
        if (this.recognition && this.isListening) {
            this.isListening = false;
            this.recognition.stop();
        }
    }

    restart() {
        if (this.recognition) {
            try {
                this.recognition.start();
            } catch {
                // Already started, ignore
            }
        }
    }

    isAvailable(): boolean {
        return this.recognition !== null;
    }

    getIsListening(): boolean {
        return this.isListening;
    }

    // Simple speaker detection based on content patterns
    private detectSpeaker(text: string): 'doctor' | 'patient' | 'unknown' {
        const doctorPhrases = [
            'i recommend', 'let me', 'diagnosis', 'treatment', 'prescribe',
            'we should', 'the test shows', 'looking at', 'i see', 'based on',
            'your results', 'i would suggest', 'take this', 'twice daily',
        ];

        const patientPhrases = [
            'i feel', 'it hurts', 'pain in', 'my symptoms', 'i have been',
            'is it serious', 'what should i', 'how long', 'thank you doctor',
            'i noticed', 'started yesterday', 'bothering me',
        ];

        const lowerText = text.toLowerCase();

        const doctorScore = doctorPhrases.filter(p => lowerText.includes(p)).length;
        const patientScore = patientPhrases.filter(p => lowerText.includes(p)).length;

        if (doctorScore > patientScore) return 'doctor';
        if (patientScore > doctorScore) return 'patient';
        return 'unknown';
    }
}

// SOAP Notes generator from transcription
export interface SOAPNoteData {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
}

export function generateSOAPFromTranscript(
    transcripts: TranscriptionResult[],
    detections: { label: string; confidence: number; analysis?: string; recommendations?: string[] }[]
): SOAPNoteData {
    // Combine transcripts by speaker
    const doctorText = transcripts
        .filter(t => t.speaker === 'doctor' && t.isFinal)
        .map(t => t.text)
        .join(' ');

    const patientText = transcripts
        .filter(t => t.speaker === 'patient' && t.isFinal)
        .map(t => t.text)
        .join(' ');

    // Extract key information
    const symptoms = extractSymptoms(patientText);
    const history = extractMedicalHistory(patientText);
    const findings = extractFindings(doctorText, detections);
    const plans = extractTreatmentPlan(doctorText, detections);

    return {
        subjective: generateSubjective(patientText, symptoms, history),
        objective: generateObjective(findings, detections),
        assessment: generateAssessment(detections, doctorText),
        plan: generatePlan(plans),
    };
}

function extractSymptoms(text: string): string[] {
    const symptomPatterns = [
        /pain in (\w+)/gi,
        /(\w+) hurts/gi,
        /feeling (\w+)/gi,
        /have (\w+ache)/gi,
        /experiencing (\w+)/gi,
    ];

    const symptoms: string[] = [];
    symptomPatterns.forEach(pattern => {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
            symptoms.push(match[1]);
        }
    });

    return [...new Set(symptoms)];
}

function extractMedicalHistory(text: string): string {
    const historyPhrases = [
        'history of', 'previously had', 'diagnosed with', 'taking medication for',
        'allergic to', 'runs in my family',
    ];

    const sentences = text.split(/[.!?]+/);
    const historyMentions = sentences.filter(s =>
        historyPhrases.some(p => s.toLowerCase().includes(p))
    );

    return historyMentions.join('. ') || 'No significant medical history mentioned.';
}

function extractFindings(doctorText: string, detections: { label: string; analysis?: string }[]): string[] {
    const findings: string[] = [];

    // Add AI detections
    detections.forEach(d => {
        findings.push(`AI Detection: ${d.label} - ${d.analysis || 'Detected on examination'}`);
    });

    // Extract doctor observations
    const observationPhrases = ['i see', 'i notice', 'the examination shows', 'appears to be'];
    const sentences = doctorText.split(/[.!?]+/);
    sentences.forEach(s => {
        if (observationPhrases.some(p => s.toLowerCase().includes(p))) {
            findings.push(s.trim());
        }
    });

    return findings;
}

function extractTreatmentPlan(doctorText: string, detections: { recommendations?: string[] }[]): string[] {
    const plans: string[] = [];

    // Add AI recommendations
    detections.forEach(d => {
        if (d.recommendations) {
            plans.push(...d.recommendations);
        }
    });

    // Extract doctor's stated plans
    const planPhrases = ['i recommend', 'you should', 'prescribing', 'let\'s schedule', 'take this'];
    const sentences = doctorText.split(/[.!?]+/);
    sentences.forEach(s => {
        if (planPhrases.some(p => s.toLowerCase().includes(p))) {
            plans.push(s.trim());
        }
    });

    return [...new Set(plans)];
}

function generateSubjective(patientText: string, symptoms: string[], history: string): string {
    let subjective = '';

    if (symptoms.length > 0) {
        subjective += `Chief Complaint: Patient reports ${symptoms.join(', ')}.\n\n`;
    }

    subjective += `History of Present Illness: ${patientText.slice(0, 500) || 'Patient presented for consultation.'}\n\n`;
    subjective += `Past Medical History: ${history}`;

    return subjective || 'Patient presented for consultation. Further history to be documented.';
}

function generateObjective(findings: string[], detections: { label: string; confidence: number }[]): string {
    let objective = 'Physical Examination:\n';

    if (detections.length > 0) {
        objective += '\nAI-Assisted Findings:\n';
        detections.forEach(d => {
            objective += `• ${d.label} (Confidence: ${(d.confidence * 100).toFixed(1)}%)\n`;
        });
    }

    if (findings.length > 0) {
        objective += '\nClinical Observations:\n';
        findings.forEach(f => {
            objective += `• ${f}\n`;
        });
    }

    return objective || 'Examination performed via telemedicine. Findings documented above.';
}

function generateAssessment(detections: { label: string; analysis?: string }[], doctorText: string): string {
    let assessment = 'Clinical Assessment:\n\n';

    if (detections.length > 0) {
        assessment += 'Primary Findings:\n';
        detections.forEach((d, i) => {
            assessment += `${i + 1}. ${d.label}\n`;
            if (d.analysis) {
                assessment += `   Analysis: ${d.analysis}\n`;
            }
        });
    }

    // Extract differential diagnosis mentions
    const diffPhrases = ['could be', 'might be', 'differential', 'rule out'];
    const sentences = doctorText.split(/[.!?]+/);
    const differentials = sentences.filter(s =>
        diffPhrases.some(p => s.toLowerCase().includes(p))
    );

    if (differentials.length > 0) {
        assessment += '\nDifferential Considerations:\n';
        differentials.forEach(d => {
            assessment += `• ${d.trim()}\n`;
        });
    }

    return assessment;
}

function generatePlan(plans: string[]): string {
    let plan = 'Treatment Plan:\n\n';

    if (plans.length > 0) {
        plans.forEach((p, i) => {
            plan += `${i + 1}. ${p}\n`;
        });
    } else {
        plan += '1. Continue monitoring\n';
        plan += '2. Follow-up as scheduled\n';
        plan += '3. Return if symptoms worsen\n';
    }

    plan += '\nFollow-up: To be scheduled based on clinical progress.';

    return plan;
}

