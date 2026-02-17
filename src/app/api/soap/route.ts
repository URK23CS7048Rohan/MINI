import { NextRequest, NextResponse } from 'next/server';

// SOAP Note Generation API
// Generates structured SOAP notes from consultation data

interface SOAPRequest {
    transcripts: {
        speaker: 'doctor' | 'patient';
        text: string;
        timestamp: string;
    }[];
    detections: {
        label: string;
        confidence: number;
        severity: string;
        analysis?: string;
        recommendations?: string[];
    }[];
    patientInfo?: {
        name: string;
        age: number;
        gender: string;
        conditions: string[];
        medications: string[];
        allergies: string[];
    };
}

interface SOAPNote {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    generatedAt: string;
    confidence: number;
    metadata: {
        wordCount: number;
        detectionCount: number;
        transcriptLength: number;
    };
}

export async function POST(request: NextRequest) {
    try {
        const body: SOAPRequest = await request.json();
        const { transcripts, detections, patientInfo } = body;

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate SOAP note
        const soapNote = generateSOAPNote(transcripts, detections, patientInfo);

        return NextResponse.json({
            success: true,
            soapNote,
        });

    } catch (error) {
        console.error('SOAP generation error:', error);
        return NextResponse.json(
            { success: false, error: 'SOAP note generation failed' },
            { status: 500 }
        );
    }
}

function generateSOAPNote(
    transcripts: SOAPRequest['transcripts'],
    detections: SOAPRequest['detections'],
    patientInfo?: SOAPRequest['patientInfo']
): SOAPNote {
    // Extract patient statements
    const patientStatements = transcripts
        .filter(t => t.speaker === 'patient')
        .map(t => t.text)
        .join(' ');

    // Extract doctor observations
    const doctorStatements = transcripts
        .filter(t => t.speaker === 'doctor')
        .map(t => t.text)
        .join(' ');

    // Generate Subjective section
    const subjective = generateSubjective(patientStatements, patientInfo);

    // Generate Objective section
    const objective = generateObjective(detections, doctorStatements, patientInfo);

    // Generate Assessment section
    const assessment = generateAssessment(detections, doctorStatements);

    // Generate Plan section
    const plan = generatePlan(detections);

    return {
        subjective,
        objective,
        assessment,
        plan,
        generatedAt: new Date().toISOString(),
        confidence: 0.85 + Math.random() * 0.1,
        metadata: {
            wordCount: (subjective + objective + assessment + plan).split(' ').length,
            detectionCount: detections.length,
            transcriptLength: transcripts.length,
        },
    };
}

function generateSubjective(patientText: string, patientInfo?: SOAPRequest['patientInfo']): string {
    const symptoms = extractSymptoms(patientText);

    let subjective = '## SUBJECTIVE\n\n';

    // Chief Complaint
    subjective += '### Chief Complaint\n';
    if (symptoms.length > 0) {
        subjective += `Patient presents with ${symptoms.slice(0, 3).join(', ')}.\n\n`;
    } else {
        subjective += 'Patient presents for telemedicine consultation.\n\n';
    }

    // History of Present Illness
    subjective += '### History of Present Illness\n';
    if (patientText) {
        const summary = patientText.slice(0, 500);
        subjective += `${summary}${patientText.length > 500 ? '...' : ''}\n\n`;
    } else {
        subjective += 'History obtained during video consultation.\n\n';
    }

    // Past Medical History
    if (patientInfo) {
        subjective += '### Past Medical History\n';
        if (patientInfo.conditions.length > 0) {
            subjective += `Known conditions: ${patientInfo.conditions.join(', ')}\n`;
        }
        if (patientInfo.medications.length > 0) {
            subjective += `Current medications: ${patientInfo.medications.join(', ')}\n`;
        }
        if (patientInfo.allergies.length > 0) {
            subjective += `Allergies: ${patientInfo.allergies.join(', ')}\n`;
        }
        subjective += '\n';
    }

    return subjective;
}

function generateObjective(
    detections: SOAPRequest['detections'],
    doctorText: string,
    patientInfo?: SOAPRequest['patientInfo']
): string {
    let objective = '## OBJECTIVE\n\n';

    // Vital Signs (placeholder)
    objective += '### Vital Signs\n';
    objective += '- Blood Pressure: Pending\n';
    objective += '- Heart Rate: Pending\n';
    objective += '- Temperature: Pending\n';
    objective += '- Respiratory Rate: Pending\n';
    objective += '- O2 Saturation: Pending\n\n';

    // Physical Examination (AI-Assisted)
    objective += '### Physical Examination (AI-Assisted via Telemedicine)\n\n';

    if (detections.length > 0) {
        objective += '#### AI Detection Findings:\n';
        detections.forEach((d, i) => {
            objective += `${i + 1}. **${d.label}**\n`;
            objective += `   - Confidence: ${(d.confidence * 100).toFixed(1)}%\n`;
            objective += `   - Severity: ${d.severity}\n`;
            if (d.analysis) {
                objective += `   - Analysis: ${d.analysis}\n`;
            }
            objective += '\n';
        });
    } else {
        objective += 'No significant findings detected by AI analysis.\n\n';
    }

    // Clinical Observations
    if (doctorText) {
        objective += '#### Clinical Observations:\n';
        const observations = extractObservations(doctorText);
        observations.forEach(obs => {
            objective += `- ${obs}\n`;
        });
        objective += '\n';
    }

    return objective;
}

function generateAssessment(
    detections: SOAPRequest['detections'],
    doctorText: string
): string {
    let assessment = '## ASSESSMENT\n\n';

    if (detections.length > 0) {
        assessment += '### Primary Diagnoses:\n';
        detections
            .filter(d => d.severity !== 'normal')
            .forEach((d, i) => {
                assessment += `${i + 1}. ${d.label}`;
                if (d.severity === 'critical' || d.severity === 'high') {
                    assessment += ` ⚠️ (${d.severity.toUpperCase()})`;
                }
                assessment += '\n';
            });
        assessment += '\n';
    }

    // Differential Diagnosis
    assessment += '### Differential Diagnosis:\n';
    if (detections.length > 0) {
        const differentials = new Set<string>();
        detections.forEach(d => {
            // Add related conditions as differentials
            differentials.add(`Rule out: complications of ${d.label}`);
        });
        differentials.forEach(diff => {
            assessment += `- ${diff}\n`;
        });
    } else {
        assessment += '- Pending further evaluation\n';
    }
    assessment += '\n';

    // Clinical Impression
    assessment += '### Clinical Impression:\n';
    assessment += 'Based on AI-assisted analysis and clinical findings, ';
    if (detections.some(d => d.severity === 'critical' || d.severity === 'high')) {
        assessment += 'urgent intervention may be required. ';
    } else if (detections.length > 0) {
        assessment += 'findings warrant follow-up care. ';
    } else {
        assessment += 'no significant abnormalities detected at this time. ';
    }
    assessment += 'Clinical correlation is recommended.\n\n';

    return assessment;
}

function generatePlan(detections: SOAPRequest['detections']): string {
    let plan = '## PLAN\n\n';

    // Diagnostic Plan
    plan += '### Diagnostic:\n';
    if (detections.some(d => d.severity === 'critical' || d.severity === 'high')) {
        plan += '- Urgent diagnostic workup recommended\n';
        plan += '- Consider specialist referral\n';
    }
    plan += '- Document current findings\n';
    plan += '- Compare with prior imaging if available\n\n';

    // Therapeutic Plan
    plan += '### Therapeutic:\n';
    const allRecs = detections.flatMap(d => d.recommendations || []);
    const uniqueRecs = [...new Set(allRecs)];
    if (uniqueRecs.length > 0) {
        uniqueRecs.slice(0, 5).forEach(rec => {
            plan += `- ${rec}\n`;
        });
    } else {
        plan += '- Supportive care as needed\n';
        plan += '- Symptomatic treatment\n';
    }
    plan += '\n';

    // Patient Education
    plan += '### Patient Education:\n';
    plan += '- Discussed findings and plan with patient\n';
    plan += '- Provided condition-specific education\n';
    plan += '- Reviewed warning signs requiring immediate care\n\n';

    // Follow-up
    plan += '### Follow-up:\n';
    if (detections.some(d => d.severity === 'critical')) {
        plan += '- **URGENT**: Follow-up within 24-48 hours\n';
    } else if (detections.some(d => d.severity === 'high')) {
        plan += '- Follow-up within 1 week\n';
    } else {
        plan += '- Follow-up as clinically indicated\n';
    }
    plan += '- Patient to contact if symptoms worsen\n';
    plan += '- Return precautions discussed\n\n';

    return plan;
}

function extractSymptoms(text: string): string[] {
    const symptomPatterns = [
        /pain in (\w+)/gi,
        /(\w+) pain/gi,
        /feeling (\w+)/gi,
        /have (\w+)/gi,
        /experiencing (\w+)/gi,
        /suffering from (\w+)/gi,
    ];

    const symptoms: string[] = [];
    symptomPatterns.forEach(pattern => {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
            if (match[1] && match[1].length > 2) {
                symptoms.push(match[1]);
            }
        }
    });

    return [...new Set(symptoms)].slice(0, 10);
}

function extractObservations(text: string): string[] {
    const observations: string[] = [];
    const sentences = text.split(/[.!?]+/);

    const observationPhrases = ['i see', 'i notice', 'appears', 'looks like', 'showing', 'visible'];

    sentences.forEach(s => {
        if (observationPhrases.some(p => s.toLowerCase().includes(p))) {
            const trimmed = s.trim();
            if (trimmed.length > 10) {
                observations.push(trimmed);
            }
        }
    });

    return observations.slice(0, 5);
}

