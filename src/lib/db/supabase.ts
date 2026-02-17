import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Types for Supabase database
export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    name: string;
                    role: 'doctor' | 'patient' | 'admin';
                    avatar_url: string | null;
                    specialty: string | null;
                    license_number: string | null;
                    hospital: string | null;
                    phone: string | null;
                    preferred_language: string;
                    is_verified: boolean;
                    is_online: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['users']['Insert']>;
            };
            patients: {
                Row: {
                    id: string;
                    user_id: string;
                    date_of_birth: string;
                    gender: 'male' | 'female' | 'other';
                    blood_type: string | null;
                    allergies: string[];
                    conditions: string[];
                    emergency_contact_name: string | null;
                    emergency_contact_phone: string | null;
                    emergency_contact_relationship: string | null;
                    insurance_provider: string | null;
                    insurance_id: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['patients']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['patients']['Insert']>;
            };
            doctors: {
                Row: {
                    id: string;
                    user_id: string;
                    specialty: string;
                    subspecialties: string[];
                    license_number: string;
                    hospital: string;
                    experience_years: number;
                    rating: number;
                    total_consultations: number;
                    consultation_fee: number;
                    availability: Record<string, unknown>[];
                    bio: string | null;
                    education: string[];
                    certifications: string[];
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['doctors']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['doctors']['Insert']>;
            };
            consultations: {
                Row: {
                    id: string;
                    patient_id: string;
                    doctor_id: string;
                    room_id: string;
                    status: 'scheduled' | 'waiting' | 'in-progress' | 'completed' | 'cancelled';
                    scheduled_at: string | null;
                    started_at: string | null;
                    ended_at: string | null;
                    chief_complaint: string | null;
                    notes: string | null;
                    recording_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['consultations']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['consultations']['Insert']>;
            };
            ai_detections: {
                Row: {
                    id: string;
                    consultation_id: string;
                    model_type: string;
                    label: string;
                    confidence: number;
                    severity: string;
                    bounding_box: Record<string, number>;
                    image_snapshot_url: string | null;
                    analysis: string | null;
                    recommendations: string[];
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['ai_detections']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['ai_detections']['Insert']>;
            };
            soap_notes: {
                Row: {
                    id: string;
                    consultation_id: string;
                    subjective: string;
                    objective: string;
                    assessment: string;
                    plan: string;
                    confidence: number;
                    is_finalized: boolean;
                    finalized_by: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['soap_notes']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['soap_notes']['Insert']>;
            };
            transcripts: {
                Row: {
                    id: string;
                    consultation_id: string;
                    speaker: 'doctor' | 'patient' | 'system';
                    text: string;
                    confidence: number;
                    language: string;
                    timestamp: string;
                };
                Insert: Omit<Database['public']['Tables']['transcripts']['Row'], 'id'>;
                Update: Partial<Database['public']['Tables']['transcripts']['Insert']>;
            };
            vitals: {
                Row: {
                    id: string;
                    patient_id: string;
                    heart_rate: number | null;
                    blood_pressure_systolic: number | null;
                    blood_pressure_diastolic: number | null;
                    temperature: number | null;
                    oxygen_saturation: number | null;
                    respiratory_rate: number | null;
                    weight: number | null;
                    glucose_level: number | null;
                    recorded_at: string;
                    source: 'manual' | 'device' | 'ai';
                };
                Insert: Omit<Database['public']['Tables']['vitals']['Row'], 'id'>;
                Update: Partial<Database['public']['Tables']['vitals']['Insert']>;
            };
            medications: {
                Row: {
                    id: string;
                    patient_id: string;
                    name: string;
                    dosage: string;
                    frequency: string;
                    start_date: string;
                    end_date: string | null;
                    prescribed_by: string;
                    consultation_id: string | null;
                    notes: string | null;
                    is_active: boolean;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['medications']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['medications']['Insert']>;
            };
            lab_results: {
                Row: {
                    id: string;
                    patient_id: string;
                    test_name: string;
                    test_type: string;
                    value: string;
                    unit: string;
                    reference_range: string;
                    status: 'normal' | 'abnormal' | 'critical';
                    ordered_by: string;
                    ordered_at: string;
                    result_at: string | null;
                    notes: string | null;
                };
                Insert: Omit<Database['public']['Tables']['lab_results']['Row'], 'id'>;
                Update: Partial<Database['public']['Tables']['lab_results']['Insert']>;
            };
            appointments: {
                Row: {
                    id: string;
                    patient_id: string;
                    doctor_id: string;
                    scheduled_at: string;
                    duration_minutes: number;
                    type: 'video' | 'in-person' | 'phone';
                    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
                    notes: string | null;
                    reminder_sent: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['appointments']['Insert']>;
            };
            messages: {
                Row: {
                    id: string;
                    sender_id: string;
                    recipient_id: string;
                    consultation_id: string | null;
                    content: string;
                    type: 'text' | 'image' | 'file' | 'voice';
                    is_read: boolean;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['messages']['Insert']>;
            };
            notifications: {
                Row: {
                    id: string;
                    user_id: string;
                    type: string;
                    title: string;
                    message: string;
                    data: Record<string, unknown> | null;
                    is_read: boolean;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
            };
            case_studies: {
                Row: {
                    id: string;
                    title: string;
                    description: string;
                    specialty: string;
                    diagnosis: string;
                    treatment: string;
                    outcome: string;
                    author_id: string;
                    is_published: boolean;
                    views: number;
                    likes: number;
                    images: string[];
                    tags: string[];
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['case_studies']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['case_studies']['Insert']>;
            };
            live_streams: {
                Row: {
                    id: string;
                    title: string;
                    description: string;
                    host_id: string;
                    specialty: string;
                    type: 'surgery' | 'lecture' | 'case-discussion' | 'workshop';
                    status: 'scheduled' | 'live' | 'ended';
                    scheduled_at: string | null;
                    started_at: string | null;
                    ended_at: string | null;
                    viewer_count: number;
                    recording_url: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['live_streams']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['live_streams']['Insert']>;
            };
            health_predictions: {
                Row: {
                    id: string;
                    patient_id: string;
                    condition: string;
                    prediction_data: Record<string, unknown>;
                    confidence: number;
                    generated_at: string;
                    valid_until: string;
                };
                Insert: Omit<Database['public']['Tables']['health_predictions']['Row'], 'id'>;
                Update: Partial<Database['public']['Tables']['health_predictions']['Insert']>;
            };
            clinical_trials: {
                Row: {
                    id: string;
                    external_id: string;
                    title: string;
                    condition: string;
                    phase: string;
                    status: string;
                    sponsor: string;
                    locations: string[];
                    eligibility_criteria: string[];
                    exclusion_criteria: string[];
                    start_date: string;
                    estimated_completion: string;
                    description: string;
                    contact_name: string | null;
                    contact_email: string | null;
                    contact_phone: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['clinical_trials']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['clinical_trials']['Insert']>;
            };
            audit_logs: {
                Row: {
                    id: string;
                    user_id: string;
                    action: string;
                    resource_type: string;
                    resource_id: string;
                    details: Record<string, unknown>;
                    ip_address: string | null;
                    user_agent: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>;
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
};

// Singleton Supabase client
let supabase: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
    if (!supabase) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.warn('Supabase credentials not found, using mock client');
            // Return a mock client for development
            return createMockClient();
        }

        supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
            },
            realtime: {
                params: {
                    eventsPerSecond: 10,
                },
            },
        });
    }

    return supabase;
}

// Server-side client with service role
export function getSupabaseAdmin(): SupabaseClient<Database> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Supabase admin credentials not configured');
    }

    return createClient<Database>(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

// Mock client for development without Supabase
function createMockClient(): SupabaseClient<Database> {
    console.log('Using mock Supabase client for development');

    // This is a simplified mock - in reality you'd mock each method
    return {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
            signUp: async () => ({ data: { user: null, session: null }, error: null }),
            signOut: async () => ({ error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        },
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: async () => ({ data: null, error: null }),
                    order: () => ({ data: [], error: null }),
                }),
                order: () => ({ data: [], error: null }),
                limit: () => ({ data: [], error: null }),
            }),
            insert: async () => ({ data: null, error: null }),
            update: async () => ({ data: null, error: null }),
            delete: async () => ({ data: null, error: null }),
            upsert: async () => ({ data: null, error: null }),
        }),
        channel: () => ({
            on: () => ({ subscribe: () => { } }),
            subscribe: () => { },
            unsubscribe: () => { },
        }),
        removeChannel: () => { },
    } as unknown as SupabaseClient<Database>;
}

// Export singleton
export const supabaseClient = getSupabaseClient();

// Auth helpers
export async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

export async function signUpWithEmail(email: string, password: string, metadata?: Record<string, unknown>) {
    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
            data: metadata,
        },
    });
    return { data, error };
}

export async function signOut() {
    const { error } = await supabaseClient.auth.signOut();
    return { error };
}

export async function getCurrentSession() {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    return { session, error };
}

// Real-time subscriptions
export function subscribeToConsultation(
    consultationId: string,
    onUpdate: (payload: unknown) => void
) {
    return supabaseClient
        .channel(`consultation:${consultationId}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'consultations',
                filter: `id=eq.${consultationId}`,
            },
            onUpdate
        )
        .subscribe();
}

export function subscribeToMessages(
    consultationId: string,
    onMessage: (payload: unknown) => void
) {
    return supabaseClient
        .channel(`messages:${consultationId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `consultation_id=eq.${consultationId}`,
            },
            onMessage
        )
        .subscribe();
}

export function subscribeToNotifications(
    userId: string,
    onNotification: (payload: unknown) => void
) {
    return supabaseClient
        .channel(`notifications:${userId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}`,
            },
            onNotification
        )
        .subscribe();
}

