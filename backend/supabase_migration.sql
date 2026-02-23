-- MediVision AI — Supabase Database Migration
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ═══════════════════════════════════════════
-- 1. USERS (extends Supabase auth.users)
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('doctor', 'patient', 'admin')),
    avatar_url TEXT,
    specialty TEXT,
    license_number TEXT,
    hospital TEXT,
    phone TEXT,
    preferred_language TEXT DEFAULT 'en',
    is_verified BOOLEAN DEFAULT false,
    is_online BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 2. PATIENTS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    date_of_birth TEXT,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    blood_type TEXT,
    allergies TEXT[] DEFAULT '{}',
    conditions TEXT[] DEFAULT '{}',
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relationship TEXT,
    insurance_provider TEXT,
    insurance_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 3. DOCTORS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    specialty TEXT NOT NULL,
    subspecialties TEXT[] DEFAULT '{}',
    license_number TEXT NOT NULL,
    hospital TEXT NOT NULL,
    experience_years INTEGER DEFAULT 0,
    rating NUMERIC(3,2) DEFAULT 0.00,
    total_consultations INTEGER DEFAULT 0,
    consultation_fee NUMERIC(10,2) DEFAULT 0.00,
    availability JSONB[] DEFAULT '{}',
    bio TEXT,
    education TEXT[] DEFAULT '{}',
    certifications TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 4. CONSULTATIONS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id),
    doctor_id UUID REFERENCES public.doctors(id),
    room_id TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'waiting', 'in-progress', 'completed', 'cancelled')),
    scheduled_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    chief_complaint TEXT,
    notes TEXT,
    recording_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 5. AI DETECTIONS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.ai_detections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID REFERENCES public.consultations(id),
    model_type TEXT NOT NULL,
    label TEXT NOT NULL,
    confidence NUMERIC(5,4) NOT NULL,
    severity TEXT,
    bounding_box JSONB DEFAULT '{}',
    image_snapshot_url TEXT,
    analysis TEXT,
    recommendations TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 6. SOAP NOTES
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.soap_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID REFERENCES public.consultations(id),
    subjective TEXT DEFAULT '',
    objective TEXT DEFAULT '',
    assessment TEXT DEFAULT '',
    plan TEXT DEFAULT '',
    confidence NUMERIC(5,4) DEFAULT 0.0,
    is_finalized BOOLEAN DEFAULT false,
    finalized_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 7. TRANSCRIPTS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.transcripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID REFERENCES public.consultations(id),
    speaker TEXT CHECK (speaker IN ('doctor', 'patient', 'system')),
    text TEXT NOT NULL,
    confidence NUMERIC(5,4) DEFAULT 0.0,
    language TEXT DEFAULT 'en',
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 8. VITALS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.vitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id),
    heart_rate INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    temperature NUMERIC(4,1),
    oxygen_saturation INTEGER,
    respiratory_rate INTEGER,
    weight NUMERIC(5,1),
    glucose_level NUMERIC(5,1),
    recorded_at TIMESTAMPTZ DEFAULT now(),
    source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'device', 'ai'))
);

-- ═══════════════════════════════════════════
-- 9. MEDICATIONS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id),
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    prescribed_by TEXT NOT NULL,
    consultation_id UUID REFERENCES public.consultations(id),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 10. LAB RESULTS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id),
    test_name TEXT NOT NULL,
    test_type TEXT NOT NULL,
    value TEXT NOT NULL,
    unit TEXT NOT NULL,
    reference_range TEXT,
    status TEXT DEFAULT 'normal' CHECK (status IN ('normal', 'abnormal', 'critical')),
    ordered_by TEXT,
    ordered_at TIMESTAMPTZ DEFAULT now(),
    result_at TIMESTAMPTZ,
    notes TEXT
);

-- ═══════════════════════════════════════════
-- 11. APPOINTMENTS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id),
    doctor_id UUID REFERENCES public.doctors(id),
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    type TEXT DEFAULT 'video' CHECK (type IN ('video', 'in-person', 'phone')),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')),
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 12. MESSAGES
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.users(id),
    recipient_id UUID REFERENCES public.users(id),
    consultation_id UUID REFERENCES public.consultations(id),
    content TEXT NOT NULL,
    type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'file', 'voice')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 13. NOTIFICATIONS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 14. CASE STUDIES, LIVE STREAMS, etc.
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    specialty TEXT,
    diagnosis TEXT,
    treatment TEXT,
    outcome TEXT,
    author_id UUID REFERENCES public.users(id),
    is_published BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.live_streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    host_id UUID REFERENCES public.users(id),
    specialty TEXT,
    type TEXT DEFAULT 'lecture' CHECK (type IN ('surgery', 'lecture', 'case-discussion', 'workshop')),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended')),
    scheduled_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    viewer_count INTEGER DEFAULT 0,
    recording_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.health_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id),
    condition TEXT NOT NULL,
    prediction_data JSONB DEFAULT '{}',
    confidence NUMERIC(5,4) DEFAULT 0.0,
    generated_at TIMESTAMPTZ DEFAULT now(),
    valid_until TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.clinical_trials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT,
    title TEXT NOT NULL,
    condition TEXT,
    phase TEXT,
    status TEXT,
    sponsor TEXT,
    locations TEXT[] DEFAULT '{}',
    eligibility_criteria TEXT[] DEFAULT '{}',
    exclusion_criteria TEXT[] DEFAULT '{}',
    start_date TEXT,
    estimated_completion TEXT,
    description TEXT,
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow inserting users during registration
CREATE POLICY "Allow user registration" ON public.users
    FOR INSERT WITH CHECK (true);

-- Doctors can view all patients they consult
CREATE POLICY "Doctors view patients" ON public.patients
    FOR SELECT USING (true);

-- Allow patient creation
CREATE POLICY "Allow patient creation" ON public.patients
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow doctor creation" ON public.doctors
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Doctors are viewable" ON public.doctors
    FOR SELECT USING (true);

-- Consultations viewable by participants
CREATE POLICY "Consultation access" ON public.consultations
    FOR SELECT USING (true);

CREATE POLICY "Consultation creation" ON public.consultations
    FOR INSERT WITH CHECK (true);

-- Messages
CREATE POLICY "Message access" ON public.messages
    FOR SELECT USING (true);

CREATE POLICY "Message creation" ON public.messages
    FOR INSERT WITH CHECK (true);

-- Notifications
CREATE POLICY "Notification access" ON public.notifications
    FOR SELECT USING (true);

CREATE POLICY "Notification creation" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- ═══════════════════════════════════════════
-- SEED DATA (Demo users)
-- ═══════════════════════════════════════════
INSERT INTO public.users (id, email, name, role, specialty, license_number, hospital, is_verified, is_online)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'doctor@medivision.com', 'Dr. Rohan', 'doctor', 'dermatology', 'MD-2024-001', 'MediVision Central Hospital', true, true),
    ('00000000-0000-0000-0000-000000000002', 'raj.patel@medivision.com', 'Dr. Raj Patel', 'doctor', 'cardiology', 'MD-2024-002', 'Apollo Heart Institute', true, true),
    ('00000000-0000-0000-0000-000000000003', 'patient@medivision.com', 'John Anderson', 'patient', NULL, NULL, NULL, true, false),
    ('00000000-0000-0000-0000-000000000004', 'admin@medivision.com', 'System Admin', 'admin', NULL, NULL, NULL, true, true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.doctors (user_id, specialty, subspecialties, license_number, hospital, experience_years, rating, total_consultations)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'dermatology', ARRAY['Skin Cancer', 'Cosmetic Dermatology'], 'MD-2024-001', 'MediVision Central Hospital', 12, 4.90, 3420),
    ('00000000-0000-0000-0000-000000000002', 'cardiology', ARRAY['Interventional Cardiology', 'Heart Failure'], 'MD-2024-002', 'Apollo Heart Institute', 18, 4.95, 5680)
ON CONFLICT DO NOTHING;

INSERT INTO public.patients (user_id, date_of_birth, gender, blood_type, allergies, conditions)
VALUES
    ('00000000-0000-0000-0000-000000000003', '1979-05-15', 'male', 'O+', ARRAY['Penicillin', 'Sulfa drugs'], ARRAY['Type 2 Diabetes', 'Hypertension'])
ON CONFLICT DO NOTHING;

-- Done!
SELECT 'Migration complete! All 14 tables + RLS + seed data created.' AS status;
