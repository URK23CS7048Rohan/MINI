import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In-memory patient storage for demo
const patients = new Map<string, PatientRecord>();

// Initialize with demo data
initializeDemoPatients();

interface PatientRecord {
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
    medications: MedicationRecord[];
    vitals: VitalRecord[];
    consultations: string[];
    labResults: LabResultRecord[];
    preferredLanguage: string;
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface MedicationRecord {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    prescribedBy: string;
}

interface VitalRecord {
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

interface LabResultRecord {
    id: string;
    testName: string;
    testType: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'abnormal' | 'critical';
    orderedAt: string;
    resultAt: string;
}

function initializeDemoPatients() {
    const demoPatients: PatientRecord[] = [
        {
            id: 'pat-001',
            name: 'John Anderson',
            age: 45,
            gender: 'male',
            email: 'john.anderson@email.com',
            phone: '+1-555-0101',
            bloodType: 'O+',
            allergies: ['Penicillin', 'Sulfa drugs'],
            conditions: ['Type 2 Diabetes', 'Hypertension'],
            medications: [
                { id: 'med-001', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2023-01-15', prescribedBy: 'Dr. Rohan' },
                { id: 'med-002', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2023-03-20', prescribedBy: 'Dr. Raj Patel' },
            ],
            vitals: [
                { id: 'v-001', timestamp: new Date().toISOString(), heartRate: 72, bloodPressureSystolic: 130, bloodPressureDiastolic: 85, temperature: 98.4, oxygenSaturation: 98, respiratoryRate: 16, weight: 185, glucoseLevel: 110 },
            ],
            consultations: [],
            labResults: [
                { id: 'lab-001', testName: 'HbA1c', testType: 'Blood', value: '6.8', unit: '%', referenceRange: '< 5.7', status: 'abnormal', orderedAt: '2024-01-10', resultAt: '2024-01-12' },
                { id: 'lab-002', testName: 'Lipid Panel', testType: 'Blood', value: 'LDL: 120', unit: 'mg/dL', referenceRange: '< 100', status: 'abnormal', orderedAt: '2024-01-10', resultAt: '2024-01-12' },
            ],
            preferredLanguage: 'en',
            emergencyContact: { name: 'Mary Anderson', phone: '+1-555-0102', relationship: 'Spouse' },
            createdAt: '2023-01-10T00:00:00Z',
            updatedAt: new Date().toISOString(),
        },
        {
            id: 'pat-002',
            name: 'Maria Garcia',
            age: 32,
            gender: 'female',
            email: 'maria.garcia@email.com',
            phone: '+1-555-0103',
            bloodType: 'A+',
            allergies: [],
            conditions: ['Asthma'],
            medications: [
                { id: 'med-003', name: 'Albuterol Inhaler', dosage: '90mcg', frequency: 'As needed', startDate: '2022-06-10', prescribedBy: 'Dr. Rohan' },
            ],
            vitals: [
                { id: 'v-002', timestamp: new Date().toISOString(), heartRate: 68, bloodPressureSystolic: 118, bloodPressureDiastolic: 75, temperature: 98.6, oxygenSaturation: 99, respiratoryRate: 14 },
            ],
            consultations: [],
            labResults: [],
            preferredLanguage: 'es',
            createdAt: '2022-06-01T00:00:00Z',
            updatedAt: new Date().toISOString(),
        },
        {
            id: 'pat-003',
            name: 'Rajesh Kumar',
            age: 55,
            gender: 'male',
            email: 'rajesh.kumar@email.com',
            phone: '+91-98765-43210',
            bloodType: 'B+',
            allergies: ['Aspirin'],
            conditions: ['Coronary Artery Disease', 'Hyperlipidemia'],
            medications: [
                { id: 'med-004', name: 'Atorvastatin', dosage: '40mg', frequency: 'Once daily', startDate: '2021-05-20', prescribedBy: 'Dr. Raj Patel' },
                { id: 'med-005', name: 'Clopidogrel', dosage: '75mg', frequency: 'Once daily', startDate: '2021-05-20', prescribedBy: 'Dr. Raj Patel' },
            ],
            vitals: [
                { id: 'v-003', timestamp: new Date().toISOString(), heartRate: 78, bloodPressureSystolic: 140, bloodPressureDiastolic: 90, temperature: 98.2, oxygenSaturation: 96, respiratoryRate: 18 },
            ],
            consultations: [],
            labResults: [],
            preferredLanguage: 'hi',
            emergencyContact: { name: 'Priya Kumar', phone: '+91-98765-43211', relationship: 'Wife' },
            createdAt: '2021-05-15T00:00:00Z',
            updatedAt: new Date().toISOString(),
        },
    ];

    demoPatients.forEach(p => patients.set(p.id, p));
}

// GET - Get patient(s)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');

    if (id) {
        const patient = patients.get(id);
        if (!patient) {
            return NextResponse.json(
                { success: false, error: 'Patient not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, patient });
    }

    let results = Array.from(patients.values());

    // Search by name or email
    if (search) {
        const searchLower = search.toLowerCase();
        results = results.filter(p =>
            p.name.toLowerCase().includes(searchLower) ||
            p.email.toLowerCase().includes(searchLower)
        );
    }

    return NextResponse.json({
        success: true,
        patients: results,
        total: results.length,
    });
}

// POST - Create new patient
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const patient: PatientRecord = {
            id: uuidv4(),
            name: body.name,
            age: body.age,
            gender: body.gender,
            email: body.email,
            phone: body.phone,
            bloodType: body.bloodType,
            allergies: body.allergies || [],
            conditions: body.conditions || [],
            medications: [],
            vitals: [],
            consultations: [],
            labResults: [],
            preferredLanguage: body.preferredLanguage || 'en',
            emergencyContact: body.emergencyContact,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        patients.set(patient.id, patient);

        return NextResponse.json({ success: true, patient });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to create patient' },
            { status: 500 }
        );
    }
}

// PUT - Update patient
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        const patient = patients.get(id);
        if (!patient) {
            return NextResponse.json(
                { success: false, error: 'Patient not found' },
                { status: 404 }
            );
        }

        const updated: PatientRecord = {
            ...patient,
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        patients.set(id, updated);

        return NextResponse.json({ success: true, patient: updated });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to update patient' },
            { status: 500 }
        );
    }
}

// Add vitals
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { patientId, action, data } = body;

        const patient = patients.get(patientId);
        if (!patient) {
            return NextResponse.json(
                { success: false, error: 'Patient not found' },
                { status: 404 }
            );
        }

        if (action === 'addVitals') {
            const vital: VitalRecord = {
                id: uuidv4(),
                timestamp: new Date().toISOString(),
                ...data,
            };
            patient.vitals.push(vital);
            patient.updatedAt = new Date().toISOString();
            patients.set(patientId, patient);

            return NextResponse.json({ success: true, vital });
        }

        if (action === 'addMedication') {
            const medication: MedicationRecord = {
                id: uuidv4(),
                ...data,
            };
            patient.medications.push(medication);
            patient.updatedAt = new Date().toISOString();
            patients.set(patientId, patient);

            return NextResponse.json({ success: true, medication });
        }

        if (action === 'addLabResult') {
            const labResult: LabResultRecord = {
                id: uuidv4(),
                ...data,
            };
            patient.labResults.push(labResult);
            patient.updatedAt = new Date().toISOString();
            patients.set(patientId, patient);

            return NextResponse.json({ success: true, labResult });
        }

        return NextResponse.json(
            { success: false, error: 'Unknown action' },
            { status: 400 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Operation failed' },
            { status: 500 }
        );
    }
}

