import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for demo (in production, use a real database)
const consultations: Map<string, ConsultationRecord> = new Map();
const detections: Map<string, DetectionRecord[]> = new Map();

interface ConsultationRecord {
    id: string;
    patientId: string;
    doctorId: string;
    roomId: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    startedAt?: string;
    endedAt?: string;
    transcript: TranscriptEntry[];
    detections: DetectionRecord[];
    soapNote?: SOAPNoteRecord;
    followUpImages: FollowUpImageRecord[];
    createdAt: string;
    updatedAt: string;
}

interface TranscriptEntry {
    id: string;
    speaker: 'doctor' | 'patient' | 'system';
    text: string;
    timestamp: string;
    confidence: number;
}

interface DetectionRecord {
    id: string;
    consultationId: string;
    type: string;
    label: string;
    confidence: number;
    severity: string;
    boundingBox: { x: number; y: number; width: number; height: number };
    imageSnapshot?: string;
    analysis?: string;
    recommendations?: string[];
    timestamp: string;
}

interface SOAPNoteRecord {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    generatedAt: string;
    editedAt?: string;
    confidence: number;
}

interface FollowUpImageRecord {
    id: string;
    imageData: string;
    detection: DetectionRecord;
    notes: string;
    doctorNotes?: string;
    timestamp: string;
}

// POST - Create new consultation
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { patientId, doctorId, scheduledAt, chiefComplaint } = body;

        const consultation: ConsultationRecord = {
            id: uuidv4(),
            patientId,
            doctorId,
            roomId: uuidv4(),
            status: 'scheduled',
            transcript: [],
            detections: [],
            followUpImages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        consultations.set(consultation.id, consultation);

        return NextResponse.json({
            success: true,
            consultation,
            roomUrl: `/consultation/${consultation.roomId}`,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to create consultation' },
            { status: 500 }
        );
    }
}

// GET - Get consultation(s)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');

    if (id) {
        const consultation = consultations.get(id);
        if (!consultation) {
            return NextResponse.json(
                { success: false, error: 'Consultation not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, consultation });
    }

    // Filter by patient or doctor
    let results = Array.from(consultations.values());

    if (patientId) {
        results = results.filter(c => c.patientId === patientId);
    }
    if (doctorId) {
        results = results.filter(c => c.doctorId === doctorId);
    }

    return NextResponse.json({ success: true, consultations: results });
}

// PUT - Update consultation
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        const consultation = consultations.get(id);
        if (!consultation) {
            return NextResponse.json(
                { success: false, error: 'Consultation not found' },
                { status: 404 }
            );
        }

        const updated = {
            ...consultation,
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        consultations.set(id, updated);

        return NextResponse.json({ success: true, consultation: updated });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to update consultation' },
            { status: 500 }
        );
    }
}

