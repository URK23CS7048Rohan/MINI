'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ArrowRight,
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Fingerprint,
    Stethoscope,
    UserCircle,
    Building,
    Phone,
    Globe,
    CheckCircle,
    AlertCircle,
    Sparkles,
    Heart,
    Brain,
    Shield
} from 'lucide-react';
import Link from 'next/link';
import { login, register, biometricLogin } from '@/lib/db/auth';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isRegister = searchParams?.get('register') === 'true';

    const [mode, setMode] = useState<'login' | 'register'>(isRegister ? 'register' : 'login');
    const [role, setRole] = useState<'doctor' | 'patient'>('doctor');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
        specialty: '',
        licenseNumber: '',
        hospital: '',
        language: 'en',
        rememberMe: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'login') {
                const result = await login({
                    email: formData.email,
                    password: formData.password,
                    role,
                    rememberMe: formData.rememberMe,
                });

                if (result.success) {
                    setSuccess('Login successful! Redirecting...');
                    setTimeout(() => router.push('/dashboard'), 1000);
                } else {
                    setError(result.error || 'Login failed');
                }
            } else {
                const result = await register({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    role,
                    specialty: formData.specialty,
                    licenseNumber: formData.licenseNumber,
                    phone: formData.phone,
                });

                if (result.success) {
                    setSuccess('Registration successful! Redirecting...');
                    setTimeout(() => router.push('/dashboard'), 1000);
                } else {
                    setError(result.error || 'Registration failed');
                }
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleBiometricLogin = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await biometricLogin();
            if (result.success) {
                setSuccess('Biometric authentication successful!');
                setTimeout(() => router.push('/dashboard'), 1000);
            } else {
                setError(result.error || 'Biometric login not available');
            }
        } catch (err) {
            setError('Biometric authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const demoCredentials = {
        doctor: { email: 'doctor@medivision.com', password: 'doctor123' },
        patient: { email: 'patient@medivision.com', password: 'patient123' },
    };

    const fillDemoCredentials = () => {
        const creds = demoCredentials[role];
        setFormData(prev => ({ ...prev, email: creds.email, password: creds.password }));
    };

    return (
        <div className="min-h-screen flex" style={{ background: 'var(--cream)' }}>
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="blob blob-sage shape-organic w-[500px] h-[500px] -top-32 -left-32"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="blob blob-lavender shape-organic w-[400px] h-[400px] bottom-0 right-0"
                    animate={{ rotate: [360, 0] }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10 p-12 flex-col justify-between">
                <div>
                    <Link href="/" className="inline-flex items-center gap-2">
                        <span className="font-display text-2xl" style={{ color: 'var(--charcoal)' }}>
                            Medi<span className="text-highlight-sage">Vision</span>
                        </span>
                    </Link>
                </div>

                <div className="max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="pill pill-sage mb-6 inline-flex">
                            <Sparkles className="w-3.5 h-3.5" />
                            AI-Powered Healthcare
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="heading-display text-4xl lg:text-5xl mb-6"
                        style={{ color: 'var(--charcoal)' }}
                    >
                        The Future of
                        <br />
                        <span className="font-serif italic" style={{ color: 'var(--accent-primary)' }}>
                            Clinical Collaboration
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-body text-body-lg mb-10"
                    >
                        AI-powered telemedicine with real-time diagnostics, multi-agent clinical co-pilot,
                        and intelligent documentation. Transform every consultation.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        {[
                            { icon: Brain, text: '25+ AI detection models for all specialties' },
                            { icon: Heart, text: 'Multi-agent clinical co-pilot system' },
                            { icon: Shield, text: 'HIPAA compliant & secure' },
                            { icon: Globe, text: '30+ languages supported' },
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3" style={{ color: 'var(--slate)' }}>
                                <div className="icon-circle icon-circle-sage" style={{ width: '32px', height: '32px' }}>
                                    <feature.icon className="w-4 h-4" />
                                </div>
                                <span>{feature.text}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="text-label">
                    © 2024 MediVision AI. HIPAA Compliant Platform.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <span className="font-display text-xl" style={{ color: 'var(--charcoal)' }}>
                                Medi<span className="text-highlight-sage">Vision</span>
                            </span>
                        </Link>
                    </div>

                    <div className="card card-bordered" style={{ padding: 'var(--space-2xl)' }}>
                        {/* Mode Toggle */}
                        <div className="flex mb-8 p-1 rounded-full" style={{ background: 'var(--mist)' }}>
                            <button
                                onClick={() => setMode('login')}
                                className={`flex-1 py-3 rounded-full text-sm font-medium transition-all ${mode === 'login'
                                    ? 'bg-white shadow-sm'
                                    : ''
                                    }`}
                                style={{ color: mode === 'login' ? 'var(--charcoal)' : 'var(--silver)' }}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setMode('register')}
                                className={`flex-1 py-3 rounded-full text-sm font-medium transition-all ${mode === 'register'
                                    ? 'bg-white shadow-sm'
                                    : ''
                                    }`}
                                style={{ color: mode === 'register' ? 'var(--charcoal)' : 'var(--silver)' }}
                            >
                                Register
                            </button>
                        </div>

                        {/* Role Selection */}
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => setRole('doctor')}
                                className={`flex-1 p-4 rounded-xl border-2 transition-all ${role === 'doctor'
                                    ? 'border-sage bg-sage-light'
                                    : 'border-mist hover:border-silver'
                                    }`}
                                style={{
                                    borderColor: role === 'doctor' ? 'var(--sage)' : 'var(--mist)',
                                    background: role === 'doctor' ? 'var(--sage-light)' : 'transparent'
                                }}
                            >
                                <Stethoscope
                                    className="w-6 h-6 mx-auto mb-2"
                                    style={{ color: role === 'doctor' ? 'var(--accent-primary)' : 'var(--silver)' }}
                                />
                                <div
                                    className="text-sm font-medium"
                                    style={{ color: role === 'doctor' ? 'var(--charcoal)' : 'var(--slate)' }}
                                >
                                    Healthcare Provider
                                </div>
                            </button>
                            <button
                                onClick={() => setRole('patient')}
                                className={`flex-1 p-4 rounded-xl border-2 transition-all`}
                                style={{
                                    borderColor: role === 'patient' ? 'var(--lavender)' : 'var(--mist)',
                                    background: role === 'patient' ? 'var(--lavender-light)' : 'transparent'
                                }}
                            >
                                <UserCircle
                                    className="w-6 h-6 mx-auto mb-2"
                                    style={{ color: role === 'patient' ? 'var(--accent-secondary)' : 'var(--silver)' }}
                                />
                                <div
                                    className="text-sm font-medium"
                                    style={{ color: role === 'patient' ? 'var(--charcoal)' : 'var(--slate)' }}
                                >
                                    Patient
                                </div>
                            </button>
                        </div>

                        {/* Demo Credentials Button */}
                        {mode === 'login' && (
                            <button
                                onClick={fillDemoCredentials}
                                className="w-full mb-4 py-2 text-sm transition-colors"
                                style={{ color: 'var(--accent-primary)' }}
                            >
                                Use demo credentials →
                            </button>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <AnimatePresence mode="wait">
                                {mode === 'register' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--silver)' }} />
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all"
                                                style={{
                                                    background: 'var(--cloud)',
                                                    borderColor: 'var(--mist)',
                                                    color: 'var(--charcoal)'
                                                }}
                                                required={mode === 'register'}
                                            />
                                        </div>

                                        {role === 'doctor' && (
                                            <>
                                                <div className="relative">
                                                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--silver)' }} />
                                                    <input
                                                        type="text"
                                                        placeholder="Hospital / Institution"
                                                        value={formData.hospital}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, hospital: e.target.value }))}
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all"
                                                        style={{
                                                            background: 'var(--cloud)',
                                                            borderColor: 'var(--mist)',
                                                            color: 'var(--charcoal)'
                                                        }}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <select
                                                        value={formData.specialty}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                                                        className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
                                                        style={{
                                                            background: 'var(--cloud)',
                                                            borderColor: 'var(--mist)',
                                                            color: 'var(--charcoal)'
                                                        }}
                                                    >
                                                        <option value="">Specialty</option>
                                                        <option value="dermatology">Dermatology</option>
                                                        <option value="cardiology">Cardiology</option>
                                                        <option value="neurology">Neurology</option>
                                                        <option value="orthopedics">Orthopedics</option>
                                                        <option value="ophthalmology">Ophthalmology</option>
                                                        <option value="radiology">Radiology</option>
                                                        <option value="surgery">Surgery</option>
                                                        <option value="general">General Practice</option>
                                                    </select>
                                                    <input
                                                        type="text"
                                                        placeholder="License #"
                                                        value={formData.licenseNumber}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                                                        className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
                                                        style={{
                                                            background: 'var(--cloud)',
                                                            borderColor: 'var(--mist)',
                                                            color: 'var(--charcoal)'
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--silver)' }} />
                                            <input
                                                type="tel"
                                                placeholder="Phone Number"
                                                value={formData.phone}
                                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all"
                                                style={{
                                                    background: 'var(--cloud)',
                                                    borderColor: 'var(--mist)',
                                                    color: 'var(--charcoal)'
                                                }}
                                            />
                                        </div>

                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--silver)' }} />
                                            <select
                                                value={formData.language}
                                                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all"
                                                style={{
                                                    background: 'var(--cloud)',
                                                    borderColor: 'var(--mist)',
                                                    color: 'var(--charcoal)'
                                                }}
                                            >
                                                <option value="en">English</option>
                                                <option value="es">Español</option>
                                                <option value="hi">हिन्दी</option>
                                                <option value="zh">中文</option>
                                                <option value="ar">العربية</option>
                                                <option value="fr">Français</option>
                                                <option value="de">Deutsch</option>
                                                <option value="ja">日本語</option>
                                            </select>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--silver)' }} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all"
                                    style={{
                                        background: 'var(--cloud)',
                                        borderColor: 'var(--mist)',
                                        color: 'var(--charcoal)'
                                    }}
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--silver)' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full pl-12 pr-12 py-3 rounded-xl border outline-none transition-all"
                                    style={{
                                        background: 'var(--cloud)',
                                        borderColor: 'var(--mist)',
                                        color: 'var(--charcoal)'
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                    style={{ color: 'var(--silver)' }}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {mode === 'login' && (
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--slate)' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.rememberMe}
                                            onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                                            className="w-4 h-4 rounded"
                                        />
                                        <span>Remember me</span>
                                    </label>
                                    <a href="#" style={{ color: 'var(--accent-primary)' }}>Forgot password?</a>
                                </div>
                            )}

                            {/* Error/Success Messages */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center gap-2 p-3 rounded-lg text-sm"
                                        style={{ background: 'var(--coral-light)', color: 'var(--accent-secondary)' }}
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </motion.div>
                                )}
                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center gap-2 p-3 rounded-lg text-sm"
                                        style={{ background: 'var(--sage-light)', color: 'var(--accent-primary)' }}
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        {success}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.01 }}
                                whileTap={{ scale: loading ? 1 : 0.99 }}
                                className={`btn btn-primary w-full py-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Social & Biometric Login */}
                        {mode === 'login' && (
                            <div className="mt-6">
                                <div className="relative flex items-center justify-center">
                                    <div className="flex-1" style={{ height: '1px', background: 'var(--mist)' }} />
                                    <span className="px-4 text-sm" style={{ color: 'var(--silver)' }}>or continue with</span>
                                    <div className="flex-1" style={{ height: '1px', background: 'var(--mist)' }} />
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    {/* Google Login */}
                                    <button
                                        onClick={() => {
                                            setLoading(true);
                                            // Simulate Google OAuth flow
                                            setTimeout(() => {
                                                setSuccess('Google login successful!');
                                                setTimeout(() => router.push('/dashboard'), 1000);
                                            }, 1500);
                                        }}
                                        disabled={loading}
                                        className="py-3 border rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-gray-50"
                                        style={{ borderColor: 'var(--mist)', color: 'var(--slate)' }}
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Google
                                    </button>

                                    {/* Biometric Login */}
                                    <button
                                        onClick={handleBiometricLogin}
                                        disabled={loading}
                                        className="py-3 border rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-gray-50"
                                        style={{ borderColor: 'var(--mist)', color: 'var(--slate)' }}
                                    >
                                        <Fingerprint className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                                        Biometric
                                    </button>
                                </div>

                                {/* Additional social options */}
                                <button
                                    onClick={() => {
                                        setLoading(true);
                                        setTimeout(() => {
                                            setSuccess('Microsoft login successful!');
                                            setTimeout(() => router.push('/dashboard'), 1000);
                                        }, 1500);
                                    }}
                                    disabled={loading}
                                    className="w-full mt-3 py-3 border rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-gray-50"
                                    style={{ borderColor: 'var(--mist)', color: 'var(--slate)' }}
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#F25022" d="M1 1h10v10H1z" />
                                        <path fill="#00A4EF" d="M1 13h10v10H1z" />
                                        <path fill="#7FBA00" d="M13 1h10v10H13z" />
                                        <path fill="#FFB900" d="M13 13h10v10H13z" />
                                    </svg>
                                    Continue with Microsoft
                                </button>
                            </div>
                        )}

                        {/* Terms */}
                        {mode === 'register' && (
                            <p className="text-xs text-center mt-6" style={{ color: 'var(--silver)' }}>
                                By registering, you agree to our{' '}
                                <a href="#" style={{ color: 'var(--accent-primary)' }}>Terms of Service</a> and{' '}
                                <a href="#" style={{ color: 'var(--accent-primary)' }}>Privacy Policy</a>
                            </p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
                <div className="w-10 h-10 border-4 rounded-full animate-spin"
                    style={{ borderColor: 'var(--sage-light)', borderTopColor: 'var(--sage)' }} />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}

