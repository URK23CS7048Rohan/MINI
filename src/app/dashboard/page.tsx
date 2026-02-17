'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Activity,
    Video,
    Users,
    FileText,
    Calendar,
    Bell,
    Settings,
    Search,
    Plus,
    ChevronRight,
    Clock,
    TrendingUp,
    Heart,
    Thermometer,
    Droplets,
    Wind,
    Brain,
    Microscope,
    Eye,
    Stethoscope,
    UserPlus,
    MessageSquare,
    PlayCircle,
    BookOpen,
    Shield,
    Zap,
    Globe,
    BarChart3,
    PieChart,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    Sparkles,
    LogOut,
    Home,
    Scan,
    Menu,
    X
} from 'lucide-react';
import { useAppStore } from '@/store';
import { getModelStats } from '@/lib/ai/model-hub';

// Demo data
const upcomingAppointments = [
    { id: 1, patient: 'John Anderson', time: '10:00 AM', type: 'Follow-up', avatar: 'JA', status: 'confirmed' },
    { id: 2, patient: 'Maria Garcia', time: '11:30 AM', type: 'New Consultation', avatar: 'MG', status: 'pending' },
    { id: 3, patient: 'Robert Chen', time: '2:00 PM', type: 'Skin Examination', avatar: 'RC', status: 'confirmed' },
    { id: 4, patient: 'Emma Johnson', time: '3:30 PM', type: 'Review Results', avatar: 'SJ', status: 'confirmed' },
];

const recentDetections = [
    { id: 1, type: 'Skin Lesion', severity: 'high', confidence: 94, patient: 'John A.', time: '2h ago' },
    { id: 2, type: 'Chest X-Ray', severity: 'normal', confidence: 98, patient: 'Maria G.', time: '4h ago' },
    { id: 3, type: 'Eye Scan', severity: 'medium', confidence: 87, patient: 'Robert C.', time: '5h ago' },
];

export default function DashboardPage() {
    const router = useRouter();
    const { setActivePanel } = useAppStore();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const modelStats = getModelStats();

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 800);
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 rounded-full mx-auto mb-4"
                        style={{ borderColor: 'var(--sage-light)', borderTopColor: 'var(--sage)' }}
                    />
                    <p className="font-display text-xl" style={{ color: 'var(--charcoal)' }}>
                        Loading Dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex" style={{ background: 'var(--cream)' }}>
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 p-6 transform transition-transform lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
                style={{ background: 'var(--white)' }}
            >
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/" className="font-display text-xl" style={{ color: 'var(--charcoal)' }}>
                            Medi<span className="text-highlight-sage">Vision</span>
                        </Link>
                        <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Quick Action */}
                    <Link
                        href="/consultations"
                        className="btn btn-primary w-full mb-8 justify-center"
                    >
                        <Plus className="w-4 h-4" />
                        New Consultation
                    </Link>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {[
                            { icon: Home, label: 'Dashboard', href: '/dashboard', active: true },
                            { icon: Video, label: 'Consultations', href: '/consultations' },
                            { icon: Users, label: 'Patients', href: '/patients' },
                            { icon: Scan, label: 'AI Detection', href: '/detection' },
                            { icon: Brain, label: 'Model Hub', href: '/models' },
                            { icon: FileText, label: 'Documents', href: '/documents' },
                            { icon: Calendar, label: 'Schedule', href: '/schedule' },
                            { icon: MessageSquare, label: 'Messages', href: '/messages' },
                            { icon: UserPlus, label: 'Team', href: '/team' },
                            { icon: PlayCircle, label: 'Live Sessions', href: '/live' },
                            { icon: BookOpen, label: 'Learn', href: '/learn' },
                            { icon: BarChart3, label: 'Analytics', href: '/analytics' },
                        ].map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                                    ? 'font-medium'
                                    : 'hover:bg-cloud'
                                    }`}
                                style={{
                                    background: item.active ? 'var(--sage-light)' : 'transparent',
                                    color: item.active ? 'var(--accent-primary)' : 'var(--slate)'
                                }}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Bottom Section */}
                    <div className="pt-6 border-t" style={{ borderColor: 'var(--mist)' }}>
                        <Link
                            href="/settings"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-cloud"
                            style={{ color: 'var(--slate)' }}
                        >
                            <Settings className="w-5 h-5" />
                            Settings
                        </Link>
                        <button
                            onClick={() => {
                                // Clear any stored auth/session data
                                if (typeof window !== 'undefined') {
                                    localStorage.removeItem('medivision_user');
                                    sessionStorage.clear();
                                }
                                router.push('/login');
                            }}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-cloud w-full"
                            style={{ color: 'var(--slate)' }}
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-8 overflow-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden btn btn-icon btn-secondary"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="heading-serif text-2xl lg:text-3xl" style={{ color: 'var(--charcoal)' }}>
                                Good Morning, Dr. Rohan
                            </h1>
                            <p className="text-sm" style={{ color: 'var(--silver)' }}>
                                Wednesday, January 29, 2026
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'var(--white)' }}>
                            <Search className="w-4 h-4" style={{ color: 'var(--silver)' }} />
                            <input
                                type="text"
                                placeholder="Search patients..."
                                className="w-48 outline-none bg-transparent text-sm"
                                style={{ color: 'var(--charcoal)' }}
                            />
                        </div>

                        {/* Notifications */}
                        <Link href="/notifications" className="btn btn-icon btn-secondary relative">
                            <Bell className="w-5 h-5" />
                            <span
                                className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center text-white"
                                style={{ background: 'var(--coral)' }}
                            >
                                3
                            </span>
                        </Link>

                        {/* Profile */}
                        <Link
                            href="/profile"
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity"
                            style={{ background: 'var(--sage)' }}
                        >
                            SM
                        </Link>
                    </div>
                </header>

                {/* Stats Cards */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: 'Today\'s Appointments', value: '8', change: '+2', icon: Calendar, color: 'sage' },
                        { label: 'AI Detections', value: '24', change: '+12%', icon: Scan, color: 'sky' },
                        { label: 'Active Patients', value: '156', change: '+5', icon: Users, color: 'lavender' },
                        { label: 'Documents Generated', value: '12', change: '+8', icon: FileText, color: 'coral' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            variants={fadeInUp}
                            className="card card-bordered hover-lift cursor-pointer"
                            style={{ padding: 'var(--space-xl)' }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className="icon-circle"
                                    style={{
                                        background: `var(--${stat.color}-light)`,
                                        color: stat.color === 'sage' ? 'var(--accent-primary)' :
                                            stat.color === 'lavender' ? 'var(--accent-secondary)' :
                                                'var(--accent-tertiary)'
                                    }}
                                >
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span
                                    className="pill pill-sage text-xs"
                                    style={{
                                        background: 'var(--sage-light)',
                                        color: 'var(--accent-primary)'
                                    }}
                                >
                                    {stat.change}
                                </span>
                            </div>
                            <div className="stat-number text-3xl mb-1">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Upcoming Appointments */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-2 card card-bordered"
                        style={{ padding: 'var(--space-xl)' }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="heading-serif text-xl" style={{ color: 'var(--charcoal)' }}>
                                Today&apos;s Schedule
                            </h2>
                            <Link href="/schedule" className="btn-arrow text-sm">
                                View All <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {upcomingAppointments.map((apt) => (
                                <motion.div
                                    key={apt.id}
                                    whileHover={{ scale: 1.01 }}
                                    className="flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer"
                                    style={{ background: 'var(--cloud)' }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
                                        style={{ background: 'var(--sage)' }}
                                    >
                                        {apt.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium" style={{ color: 'var(--charcoal)' }}>
                                            {apt.patient}
                                        </div>
                                        <div className="text-sm" style={{ color: 'var(--silver)' }}>
                                            {apt.type}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
                                            {apt.time}
                                        </div>
                                        <span
                                            className="pill text-xs"
                                            style={{
                                                background: apt.status === 'confirmed' ? 'var(--sage-light)' : 'var(--coral-light)',
                                                color: apt.status === 'confirmed' ? 'var(--accent-primary)' : 'var(--accent-secondary)'
                                            }}
                                        >
                                            {apt.status}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent AI Detections */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                        className="card card-sage"
                        style={{ padding: 'var(--space-xl)' }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="heading-serif text-xl" style={{ color: 'var(--charcoal)' }}>
                                Recent Detections
                            </h2>
                            <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                        </div>

                        <div className="space-y-4">
                            {recentDetections.map((det) => (
                                <div
                                    key={det.id}
                                    className="p-4 rounded-xl"
                                    style={{ background: 'var(--white)' }}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="font-medium" style={{ color: 'var(--charcoal)' }}>
                                            {det.type}
                                        </div>
                                        <span
                                            className="pill text-xs"
                                            style={{
                                                background: det.severity === 'high' ? 'var(--coral-light)' :
                                                    det.severity === 'medium' ? 'var(--peach)' : 'var(--sage-light)',
                                                color: det.severity === 'high' ? 'var(--accent-secondary)' : 'var(--accent-primary)'
                                            }}
                                        >
                                            {det.severity}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm" style={{ color: 'var(--silver)' }}>
                                        <span>{det.patient} • {det.time}</span>
                                        <span className="font-mono">{det.confidence}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/detection"
                            className="btn btn-primary w-full mt-6 justify-center"
                        >
                            <Scan className="w-4 h-4" />
                            Run AI Detection
                        </Link>
                    </motion.div>
                </div>

                {/* Bottom Grid - Model Hub & Quick Actions */}
                <div className="grid lg:grid-cols-2 gap-6 mt-6">
                    {/* AI Model Hub Preview */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.2 }}
                        className="card card-bordered"
                        style={{ padding: 'var(--space-xl)' }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="heading-serif text-xl mb-1" style={{ color: 'var(--charcoal)' }}>
                                    AI Model Hub
                                </h2>
                                <p className="text-sm" style={{ color: 'var(--silver)' }}>
                                    25+ specialized detection models
                                </p>
                            </div>
                            <Link href="/models" className="btn-arrow text-sm">
                                Explore <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { name: 'Dermatology', icon: Heart, count: 8, color: 'sage' },
                                { name: 'Radiology', icon: Scan, count: 5, color: 'sky' },
                                { name: 'Ophthalmology', icon: Eye, count: 4, color: 'lavender' },
                                { name: 'Cardiology', icon: Activity, count: 3, color: 'coral' },
                            ].map((model, i) => (
                                <Link key={i} href="/models">
                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        className="p-4 rounded-xl cursor-pointer text-center"
                                        style={{ background: `var(--${model.color}-light)` }}
                                    >
                                        <model.icon className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--charcoal)' }} />
                                        <div className="font-medium text-sm" style={{ color: 'var(--charcoal)' }}>
                                            {model.name}
                                        </div>
                                        <div className="text-xs" style={{ color: 'var(--silver)' }}>
                                            {model.count} models
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3 }}
                        className="card card-sky"
                        style={{ padding: 'var(--space-xl)' }}
                    >
                        <h2 className="heading-serif text-xl mb-6" style={{ color: 'var(--charcoal)' }}>
                            Quick Actions
                        </h2>

                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: Video, label: 'Start Call', href: '/consultations' },
                                { icon: UserPlus, label: 'Add Patient', href: '/patients' },
                                { icon: FileText, label: 'SOAP Note', href: '/documents' },
                                { icon: Scan, label: 'AI Detection', href: '/detection' },
                            ].map((action, i) => (
                                <Link
                                    key={i}
                                    href={action.href}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="p-4 rounded-xl flex flex-col items-center gap-2 transition-all cursor-pointer"
                                        style={{ background: 'var(--white)' }}
                                    >
                                        <action.icon className="w-6 h-6" style={{ color: 'var(--accent-tertiary)' }} />
                                        <span className="text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
                                            {action.label}
                                        </span>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

