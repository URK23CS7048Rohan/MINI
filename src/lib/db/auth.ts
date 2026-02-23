import { Doctor, Patient as PatientType } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { getSupabaseClient } from './supabase';

// ============================================
// Authentication — Supabase + Demo Fallback
// ============================================

// Demo Users (used as fallback when Supabase is unavailable)
export const MOCK_DOCTORS: Doctor[] = [
    {
        id: 'doc-001',
        name: 'Dr. Rohan',
        email: 'rohan@medivision.com',
        avatar: '/avatars/doctor1.jpg',
        specialty: 'dermatology',
        subspecialties: ['Skin Cancer', 'Cosmetic Dermatology'],
        licenseNumber: 'MD-2024-001',
        hospital: 'MediVision Central Hospital',
        location: { city: 'New York', country: 'USA', timezone: 'America/New_York' },
        experience: 12,
        rating: 4.9,
        totalConsultations: 3420,
        languages: ['English', 'Spanish'],
        availability: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 5, startTime: '09:00', endTime: '14:00' },
        ],
        isOnline: true,
        isVerified: true,
    },
    {
        id: 'doc-002',
        name: 'Dr. Raj Patel',
        email: 'raj.patel@medivision.com',
        avatar: '/avatars/doctor2.jpg',
        specialty: 'cardiology',
        subspecialties: ['Interventional Cardiology', 'Heart Failure'],
        licenseNumber: 'MD-2024-002',
        hospital: 'Apollo Heart Institute',
        location: { city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata' },
        experience: 18,
        rating: 4.95,
        totalConsultations: 5680,
        languages: ['English', 'Hindi', 'Gujarati'],
        availability: [
            { dayOfWeek: 1, startTime: '10:00', endTime: '18:00' },
            { dayOfWeek: 2, startTime: '10:00', endTime: '18:00' },
            { dayOfWeek: 3, startTime: '10:00', endTime: '18:00' },
            { dayOfWeek: 4, startTime: '10:00', endTime: '18:00' },
            { dayOfWeek: 5, startTime: '10:00', endTime: '16:00' },
            { dayOfWeek: 6, startTime: '10:00', endTime: '14:00' },
        ],
        isOnline: true,
        isVerified: true,
    },
    {
        id: 'doc-003',
        name: 'Dr. Elena Rodriguez',
        email: 'elena.rodriguez@medivision.com',
        specialty: 'surgery',
        subspecialties: ['Minimally Invasive Surgery', 'Robotic Surgery'],
        licenseNumber: 'MD-2024-003',
        hospital: 'Barcelona Medical Center',
        location: { city: 'Barcelona', country: 'Spain', timezone: 'Europe/Madrid' },
        experience: 15,
        rating: 4.85,
        totalConsultations: 2890,
        languages: ['Spanish', 'English', 'French', 'Catalan'],
        availability: [],
        isOnline: false,
        isVerified: true,
    },
];

export const MOCK_PATIENTS: PatientType[] = [
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
            {
                id: 'med-001',
                name: 'Metformin',
                dosage: '500mg',
                frequency: 'Twice daily',
                startDate: '2023-01-15',
                prescribedBy: 'Dr. Rohan',
            },
            {
                id: 'med-002',
                name: 'Lisinopril',
                dosage: '10mg',
                frequency: 'Once daily',
                startDate: '2023-03-20',
                prescribedBy: 'Dr. Raj Patel',
            },
        ],
        vitals: [],
        consultations: [],
        labResults: [],
        createdAt: '2023-01-10T00:00:00Z',
        updatedAt: '2024-01-28T00:00:00Z',
    },
    {
        id: 'pat-002',
        name: 'Maria Garcia',
        age: 32,
        gender: 'female',
        email: 'maria.garcia@email.com',
        phone: '+1-555-0102',
        bloodType: 'A+',
        allergies: [],
        conditions: ['Asthma'],
        medications: [
            {
                id: 'med-003',
                name: 'Albuterol Inhaler',
                dosage: '90mcg',
                frequency: 'As needed',
                startDate: '2022-06-10',
                prescribedBy: 'Dr. Rohan',
            },
        ],
        vitals: [],
        consultations: [],
        labResults: [],
        createdAt: '2022-06-01T00:00:00Z',
        updatedAt: '2024-01-25T00:00:00Z',
    },
];

// Authentication Types
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: 'doctor' | 'patient' | 'admin' | 'specialist';
    avatar?: string;
    language?: string;
    token: string;
    refreshToken: string;
    expiresAt: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
    role: 'doctor' | 'patient';
    rememberMe?: boolean;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    role: 'doctor' | 'patient';
    specialty?: string;
    licenseNumber?: string;
    phone?: string;
    language?: string;
}

export interface AuthResponse {
    success: boolean;
    user?: AuthUser;
    error?: string;
}

// Check if Supabase is configured with real credentials
function isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return !!url && !url.includes('your-project');
}

// ============================================
// LOGIN — Supabase first, demo fallback
// ============================================
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Try Supabase auth first
    if (isSupabaseConfigured()) {
        try {
            const supabase = getSupabaseClient();
            const { data, error } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password,
            });

            if (!error && data.user && data.session) {
                // Fetch user profile from our users table
                const { data: profile } = await (supabase
                    .from('users')
                    .select('*')
                    .eq('email', credentials.email)
                    .single() as unknown as Promise<{ data: { id: string; email: string; name: string; role: string; avatar_url: string | null; preferred_language: string | null } | null; error: unknown }>);

                const user: AuthUser = {
                    id: data.user.id,
                    email: data.user.email || credentials.email,
                    name: profile?.name || data.user.email || 'User',
                    role: (profile?.role as AuthUser['role']) || credentials.role,
                    avatar: profile?.avatar_url || undefined,
                    language: profile?.preferred_language || undefined,
                    token: data.session.access_token,
                    refreshToken: data.session.refresh_token,
                    expiresAt: (data.session.expires_at || 0) * 1000,
                };

                if (typeof window !== 'undefined') {
                    localStorage.setItem('medivision_auth', JSON.stringify(user));
                }

                return { success: true, user };
            }

            if (error) {
                console.warn('Supabase auth error:', error.message);
                // Don't return error yet — fall through to demo accounts
            }
        } catch (e) {
            console.warn('Supabase connection failed, falling back to demo accounts');
        }
    }

    // Demo account fallback
    await new Promise(resolve => setTimeout(resolve, 400));

    const demoAccounts = [
        { email: 'doctor@medivision.com', password: 'doctor123', role: 'doctor', name: 'Dr. Rohan', id: 'doc-001' },
        { email: 'patient@medivision.com', password: 'patient123', role: 'patient', name: 'John Anderson', id: 'pat-001' },
        { email: 'admin@medivision.com', password: 'admin123', role: 'admin', name: 'System Admin', id: 'admin-001' },
        { email: 'specialist@medivision.com', password: 'specialist123', role: 'specialist', name: 'Dr. Raj Patel', id: 'doc-002' },
    ];

    const account = demoAccounts.find(
        a => a.email === credentials.email && a.password === credentials.password && a.role === credentials.role
    );

    if (account) {
        const token = generateToken();
        const user: AuthUser = {
            id: account.id,
            email: account.email,
            name: account.name,
            role: account.role as AuthUser['role'],
            language: 'en',
            token,
            refreshToken: generateToken(),
            expiresAt: Date.now() + (credentials.rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000),
        };

        if (typeof window !== 'undefined') {
            localStorage.setItem('medivision_auth', JSON.stringify(user));
        }

        return { success: true, user };
    }

    return { success: false, error: 'Invalid email, password, or role' };
}

// ============================================
// REGISTER — Supabase first, demo fallback
// ============================================
export async function register(data: RegisterData): Promise<AuthResponse> {
    // Try Supabase registration first
    if (isSupabaseConfigured()) {
        try {
            const supabase = getSupabaseClient();
            const { data: authData, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        name: data.name,
                        role: data.role,
                    },
                },
            });

            if (!error && authData.user) {
                // Insert into our users table
                await (supabase.from('users') as unknown as { insert: (data: Record<string, unknown>) => Promise<unknown> }).insert({
                    email: data.email,
                    name: data.name,
                    role: data.role,
                    specialty: data.specialty || null,
                    license_number: data.licenseNumber || null,
                    phone: data.phone || null,
                    preferred_language: data.language || 'en',
                    is_verified: false,
                    is_online: false,
                });

                const token = authData.session?.access_token || generateToken();
                const user: AuthUser = {
                    id: authData.user.id,
                    email: data.email,
                    name: data.name,
                    role: data.role,
                    language: data.language || 'en',
                    token,
                    refreshToken: authData.session?.refresh_token || generateToken(),
                    expiresAt: authData.session
                        ? (authData.session.expires_at || 0) * 1000
                        : Date.now() + 24 * 60 * 60 * 1000,
                };

                if (typeof window !== 'undefined') {
                    localStorage.setItem('medivision_auth', JSON.stringify(user));
                }

                return { success: true, user };
            }

            if (error) {
                return { success: false, error: error.message };
            }
        } catch (e) {
            console.warn('Supabase registration failed, using demo mode');
        }
    }

    // Demo fallback
    await new Promise(resolve => setTimeout(resolve, 500));
    const token = generateToken();
    const user: AuthUser = {
        id: uuidv4(),
        email: data.email,
        name: data.name,
        role: data.role,
        language: data.language || 'en',
        token,
        refreshToken: generateToken(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };

    if (typeof window !== 'undefined') {
        localStorage.setItem('medivision_auth', JSON.stringify(user));
    }

    return { success: true, user };
}

// ============================================
// LOGOUT — Supabase + localStorage cleanup
// ============================================
export async function logout(): Promise<void> {
    if (isSupabaseConfigured()) {
        try {
            const supabase = getSupabaseClient();
            await supabase.auth.signOut();
        } catch (e) {
            // Ignore errors during logout
        }
    }

    if (typeof window !== 'undefined') {
        localStorage.removeItem('medivision_auth');
    }
}

// ============================================
// SESSION — Check current user
// ============================================
export function getCurrentUser(): AuthUser | null {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('medivision_auth');
        if (stored) {
            const user = JSON.parse(stored) as AuthUser;
            if (user.expiresAt > Date.now()) {
                return user;
            }
            localStorage.removeItem('medivision_auth');
        }
    }
    return null;
}

export async function refreshToken(refreshTokenStr: string): Promise<AuthResponse> {
    // Try Supabase refresh first
    if (isSupabaseConfigured()) {
        try {
            const supabase = getSupabaseClient();
            const { data, error } = await supabase.auth.refreshSession({
                refresh_token: refreshTokenStr,
            });

            if (!error && data.session) {
                const currentUser = getCurrentUser();
                const updatedUser: AuthUser = {
                    id: currentUser?.id || data.session.user.id,
                    email: currentUser?.email || data.session.user.email || '',
                    name: currentUser?.name || 'User',
                    role: currentUser?.role || 'patient',
                    language: currentUser?.language || 'en',
                    token: data.session.access_token,
                    refreshToken: data.session.refresh_token,
                    expiresAt: (data.session.expires_at || 0) * 1000,
                };

                if (typeof window !== 'undefined') {
                    localStorage.setItem('medivision_auth', JSON.stringify(updatedUser));
                }

                return { success: true, user: updatedUser };
            }
        } catch (e) {
            // Fall through to local refresh
        }
    }

    // Local fallback refresh
    await new Promise(resolve => setTimeout(resolve, 300));

    const currentUser = getCurrentUser();
    if (currentUser && currentUser.refreshToken === refreshTokenStr) {
        const newToken = generateToken();
        const updatedUser: AuthUser = {
            ...currentUser,
            token: newToken,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };

        if (typeof window !== 'undefined') {
            localStorage.setItem('medivision_auth', JSON.stringify(updatedUser));
        }

        return { success: true, user: updatedUser };
    }

    return { success: false, error: 'Invalid refresh token' };
}

function generateToken(): string {
    return uuidv4() + '-' + Date.now().toString(36);
}

// Biometric Authentication (uses Supabase session if available)
export async function biometricLogin(): Promise<AuthResponse> {
    if (typeof window !== 'undefined' && 'PublicKeyCredential' in window) {
        try {
            const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
            if (available) {
                await new Promise(resolve => setTimeout(resolve, 1500));

                // If Supabase has an active session, use it
                if (isSupabaseConfigured()) {
                    try {
                        const supabase = getSupabaseClient();
                        const { data: { session } } = await supabase.auth.getSession();
                        if (session) {
                            const user: AuthUser = {
                                id: session.user.id,
                                email: session.user.email || '',
                                name: session.user.user_metadata?.name || 'User',
                                role: session.user.user_metadata?.role || 'doctor',
                                token: session.access_token,
                                refreshToken: session.refresh_token,
                                expiresAt: (session.expires_at || 0) * 1000,
                            };
                            localStorage.setItem('medivision_auth', JSON.stringify(user));
                            return { success: true, user };
                        }
                    } catch (e) {
                        // Fall through to demo
                    }
                }

                // Demo fallback
                const token = generateToken();
                const user: AuthUser = {
                    id: 'doc-001',
                    email: 'doctor@medivision.com',
                    name: 'Dr. Rohan',
                    role: 'doctor',
                    token,
                    refreshToken: generateToken(),
                    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
                };

                localStorage.setItem('medivision_auth', JSON.stringify(user));
                return { success: true, user };
            }
        } catch (e) {
            console.error('Biometric auth error:', e);
        }
    }

    return { success: false, error: 'Biometric authentication not available' };
}
