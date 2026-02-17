'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    BarChart3,
    TrendingUp,
    ArrowLeft,
    Users,
    Calendar,
    Activity,
    Clock,
    ArrowUp,
    ArrowDown
} from 'lucide-react';

const stats = [
    { label: 'Total Patients', value: '1,247', change: '+12%', up: true },
    { label: 'Consultations', value: '342', change: '+8%', up: true },
    { label: 'AI Detections', value: '856', change: '+23%', up: true },
    { label: 'Revenue', value: '$45.2K', change: '+15%', up: true },
];

const weeklyData = [
    { day: 'Mon', patients: 12, consultations: 8 },
    { day: 'Tue', patients: 15, consultations: 10 },
    { day: 'Wed', patients: 18, consultations: 14 },
    { day: 'Thu', patients: 14, consultations: 11 },
    { day: 'Fri', patients: 20, consultations: 16 },
    { day: 'Sat', patients: 8, consultations: 5 },
    { day: 'Sun', patients: 4, consultations: 2 },
];

export default function AnalyticsPage() {
    const maxPatients = Math.max(...weeklyData.map(d => d.patients));

    return (
        <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
            <div className="max-w-6xl mx-auto p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="btn btn-icon btn-secondary">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="heading-serif text-2xl lg:text-3xl" style={{ color: 'var(--charcoal)' }}>
                            Analytics
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--silver)' }}>
                            Track your practice performance
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="card card-bordered"
                            style={{ padding: 'var(--space-xl)' }}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-sm" style={{ color: 'var(--silver)' }}>{stat.label}</span>
                                <span
                                    className="flex items-center gap-1 text-xs font-medium"
                                    style={{ color: stat.up ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}
                                >
                                    {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                    {stat.change}
                                </span>
                            </div>
                            <div className="stat-number text-2xl">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Weekly Patients */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card card-bordered"
                        style={{ padding: 'var(--space-xl)' }}
                    >
                        <h2 className="heading-serif text-lg mb-6" style={{ color: 'var(--charcoal)' }}>
                            Weekly Patients
                        </h2>
                        <div className="flex items-end gap-3 h-48">
                            {weeklyData.map((data, i) => (
                                <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(data.patients / maxPatients) * 100}%` }}
                                        transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                                        className="w-full rounded-t-lg"
                                        style={{ background: 'var(--sage)', minHeight: '20px' }}
                                    />
                                    <span className="text-xs font-medium" style={{ color: 'var(--silver)' }}>
                                        {data.day}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* AI Detection Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card card-sage"
                        style={{ padding: 'var(--space-xl)' }}
                    >
                        <h2 className="heading-serif text-lg mb-6" style={{ color: 'var(--charcoal)' }}>
                            AI Detection Breakdown
                        </h2>
                        <div className="space-y-4">
                            {[
                                { name: 'Skin Analysis', value: 45, color: 'var(--sage)' },
                                { name: 'X-Ray Detection', value: 28, color: 'var(--sky)' },
                                { name: 'Eye Screening', value: 18, color: 'var(--lavender)' },
                                { name: 'Other', value: 9, color: 'var(--coral)' },
                            ].map((item, i) => (
                                <div key={item.name}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span style={{ color: 'var(--charcoal)' }}>{item.name}</span>
                                        <span className="font-mono" style={{ color: 'var(--slate)' }}>{item.value}%</span>
                                    </div>
                                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--white)' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.value}%` }}
                                            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                            className="h-full rounded-full"
                                            style={{ background: item.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

