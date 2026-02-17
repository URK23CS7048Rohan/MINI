'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Video,
    Phone,
    Calendar,
    Clock,
    User,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Play,
    CheckCircle,
    XCircle,
    ArrowLeft,
    ChevronRight
} from 'lucide-react';

const consultations = [
    { id: 1, patient: 'John Anderson', type: 'Video Call', date: 'Today, 10:00 AM', status: 'scheduled', avatar: 'JA' },
    { id: 2, patient: 'Maria Garcia', type: 'Follow-up', date: 'Today, 11:30 AM', status: 'in-progress', avatar: 'MG' },
    { id: 3, patient: 'Robert Chen', type: 'Skin Examination', date: 'Today, 2:00 PM', status: 'scheduled', avatar: 'RC' },
    { id: 4, patient: 'Emma Johnson', type: 'Review Results', date: 'Yesterday', status: 'completed', avatar: 'SJ' },
    { id: 5, patient: 'Michael Brown', type: 'New Patient', date: 'Yesterday', status: 'completed', avatar: 'MB' },
    { id: 6, patient: 'Emily Davis', type: 'Follow-up', date: 'Jan 27, 2026', status: 'completed', avatar: 'ED' },
];

export default function ConsultationsPage() {
    const [filter, setFilter] = useState('all');

    const filteredConsultations = filter === 'all'
        ? consultations
        : consultations.filter(c => c.status === filter);

    const generateRoomId = () => {
        return Math.random().toString(36).substring(2, 15);
    };

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
                            Consultations
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--silver)' }}>
                            Manage your patient consultations
                        </p>
                    </div>
                    <Link
                        href={`/consultation/${generateRoomId()}`}
                        className="btn btn-primary"
                    >
                        <Video className="w-4 h-4" />
                        Start New Call
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full flex-1 max-w-md" style={{ background: 'var(--white)' }}>
                        <Search className="w-4 h-4" style={{ color: 'var(--silver)' }} />
                        <input
                            type="text"
                            placeholder="Search consultations..."
                            className="flex-1 outline-none bg-transparent text-sm"
                            style={{ color: 'var(--charcoal)' }}
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'scheduled', 'in-progress', 'completed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className="pill cursor-pointer transition-all capitalize"
                                style={{
                                    background: filter === f ? 'var(--charcoal)' : 'var(--white)',
                                    color: filter === f ? 'var(--white)' : 'var(--slate)'
                                }}
                            >
                                {f === 'all' ? 'All' : f.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Consultations List */}
                <div className="space-y-3">
                    {filteredConsultations.map((consultation, i) => (
                        <motion.div
                            key={consultation.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="card card-bordered hover-lift"
                            style={{ padding: 'var(--space-lg)' }}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
                                    style={{ background: 'var(--sage)' }}
                                >
                                    {consultation.avatar}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium" style={{ color: 'var(--charcoal)' }}>
                                        {consultation.patient}
                                    </div>
                                    <div className="text-sm" style={{ color: 'var(--silver)' }}>
                                        {consultation.type}
                                    </div>
                                </div>
                                <div className="text-right mr-4">
                                    <div className="text-sm font-mono" style={{ color: 'var(--charcoal)' }}>
                                        {consultation.date}
                                    </div>
                                    <span
                                        className="pill text-xs"
                                        style={{
                                            background: consultation.status === 'completed' ? 'var(--sage-light)' :
                                                consultation.status === 'in-progress' ? 'var(--sky-light)' : 'var(--lavender-light)',
                                            color: consultation.status === 'completed' ? 'var(--accent-primary)' :
                                                consultation.status === 'in-progress' ? 'var(--accent-tertiary)' : 'var(--accent-secondary)'
                                        }}
                                    >
                                        {consultation.status.replace('-', ' ')}
                                    </span>
                                </div>
                                {consultation.status === 'in-progress' && (
                                    <Link
                                        href={`/consultation/room-${consultation.id}`}
                                        className="btn btn-primary"
                                    >
                                        <Video className="w-4 h-4" />
                                        Join Call
                                    </Link>
                                )}
                                {consultation.status === 'scheduled' && (
                                    <Link
                                        href={`/consultation/room-${consultation.id}`}
                                        className="btn btn-secondary"
                                    >
                                        <Play className="w-4 h-4" />
                                        Start
                                    </Link>
                                )}
                                {consultation.status === 'completed' && (
                                    <button className="btn btn-secondary">
                                        <CheckCircle className="w-4 h-4" />
                                        View Notes
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

