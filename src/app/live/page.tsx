'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Play,
    ArrowLeft,
    Users,
    Eye,
    Clock,
    Calendar,
    Search,
    Filter,
    Star,
    MessageSquare,
    ThumbsUp,
    Share2,
    Bookmark,
    Volume2,
    Maximize,
    Settings,
    Radio
} from 'lucide-react';

const liveSessions = [
    {
        id: 1,
        title: 'Melanoma Excision Surgery',
        doctor: 'Dr. James Wilson',
        specialty: 'Dermatology',
        viewers: 1247,
        duration: 'Live • 45:23',
        isLive: true,
        thumbnail: '🔬',
        tags: ['Surgery', 'Skin Cancer', 'AI-Assisted'],
        rating: 4.9
    },
    {
        id: 2,
        title: 'AI-Assisted Chest X-Ray Analysis',
        doctor: 'Dr. Emily Chen',
        specialty: 'Radiology',
        viewers: 892,
        duration: 'Live • 12:08',
        isLive: true,
        thumbnail: '🫁',
        tags: ['Radiology', 'COVID-19', 'Pneumonia'],
        rating: 4.8
    },
    {
        id: 3,
        title: 'Diabetic Retinopathy Screening',
        doctor: 'Dr. Lisa Park',
        specialty: 'Ophthalmology',
        viewers: 534,
        duration: 'Live • 28:15',
        isLive: true,
        thumbnail: '👁️',
        tags: ['Eye Care', 'Diabetes', 'AI Detection'],
        rating: 4.7
    },
];

const upcomingSessions = [
    {
        id: 4,
        title: 'Cardiac Arrhythmia Detection Workshop',
        doctor: 'Dr. Robert Kim',
        date: 'Today, 4:00 PM',
        registrations: 456,
        thumbnail: '❤️'
    },
    {
        id: 5,
        title: 'Wound Care & AI Classification',
        doctor: 'Dr. Rohan',
        date: 'Tomorrow, 10:00 AM',
        registrations: 328,
        thumbnail: '🩹'
    },
];

const recordedSessions = [
    {
        id: 6,
        title: 'Introduction to YOLO Medical Detection',
        doctor: 'Dr. Michael Brown',
        views: 12450,
        duration: '1h 23m',
        thumbnail: '🤖',
        rating: 4.9
    },
    {
        id: 7,
        title: 'Psoriasis vs Eczema: AI Differential',
        doctor: 'Dr. Emily Chen',
        views: 8920,
        duration: '45m',
        thumbnail: '🔍',
        rating: 4.8
    },
    {
        id: 8,
        title: 'Live Surgery: Skin Lesion Removal',
        doctor: 'Dr. James Wilson',
        views: 15670,
        duration: '2h 10m',
        thumbnail: '🏥',
        rating: 4.9
    },
];

export default function LiveSessionsPage() {
    const [activeTab, setActiveTab] = useState('live');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
            <div className="max-w-7xl mx-auto p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="btn btn-icon btn-secondary">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="heading-serif text-2xl lg:text-3xl" style={{ color: 'var(--charcoal)' }}>
                            Live Learning Sessions
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--silver)' }}>
                            Watch live procedures, surgeries, and AI-assisted diagnoses
                        </p>
                    </div>
                    <Link href="/consultation/live" className="btn btn-primary">
                        <Radio className="w-4 h-4" />
                        Go Live
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {[
                        { id: 'live', label: 'Live Now', count: liveSessions.length },
                        { id: 'upcoming', label: 'Upcoming' },
                        { id: 'recorded', label: 'Recorded' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                            style={{
                                background: activeTab === tab.id ? 'var(--charcoal)' : 'var(--white)',
                                color: activeTab === tab.id ? 'white' : 'var(--slate)'
                            }}
                        >
                            {tab.id === 'live' && (
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            )}
                            {tab.label}
                            {tab.count && (
                                <span
                                    className="px-2 py-0.5 rounded-full text-xs"
                                    style={{
                                        background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--mist)'
                                    }}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: 'var(--white)' }}
                    >
                        <Search className="w-5 h-5" style={{ color: 'var(--silver)' }} />
                        <input
                            type="text"
                            placeholder="Search sessions by topic, doctor, or specialty..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent outline-none"
                            style={{ color: 'var(--charcoal)' }}
                        />
                        <button className="btn btn-secondary" style={{ padding: '8px 12px' }}>
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Live Sessions */}
                {activeTab === 'live' && (
                    <div className="space-y-6">
                        {/* Featured Live Session */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card overflow-hidden"
                            style={{ background: 'var(--charcoal)' }}
                        >
                            <div className="grid lg:grid-cols-2">
                                <div
                                    className="aspect-video lg:aspect-auto flex items-center justify-center text-8xl"
                                    style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
                                >
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">🔬</div>
                                        <div className="flex items-center justify-center gap-2 text-white/80">
                                            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                                            <span className="text-sm font-medium">LIVE</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col justify-center text-white">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-2 py-1 rounded-full text-xs bg-red-500">
                                            🔴 LIVE
                                        </span>
                                        <span className="text-sm text-white/60">45:23 elapsed</span>
                                    </div>
                                    <h2 className="heading-serif text-2xl mb-2">
                                        {liveSessions[0].title}
                                    </h2>
                                    <p className="text-white/70 mb-4">
                                        Watch Dr. Wilson perform an AI-assisted melanoma excision with real-time
                                        YOLO detection overlay showing tissue margins and lesion boundaries.
                                    </p>
                                    <div className="flex items-center gap-4 mb-6 text-sm text-white/60">
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" /> {liveSessions[0].viewers} watching
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-current text-yellow-400" /> {liveSessions[0].rating}
                                        </span>
                                    </div>
                                    <div className="flex gap-3">
                                        <Link href="/live/1" className="btn btn-primary">
                                            <Play className="w-4 h-4" />
                                            Watch Now
                                        </Link>
                                        <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                                            <Bookmark className="w-4 h-4" />
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Other Live Sessions */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {liveSessions.slice(1).map((session, i) => (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="card card-bordered hover-lift overflow-hidden"
                                >
                                    <div
                                        className="aspect-video flex items-center justify-center text-5xl relative"
                                        style={{ background: 'var(--sage-light)' }}
                                    >
                                        {session.thumbnail}
                                        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-red-500 text-white text-xs">
                                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                            LIVE
                                        </div>
                                        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
                                            <Eye className="w-3 h-3" />
                                            {session.viewers}
                                        </div>
                                    </div>
                                    <div style={{ padding: 'var(--space-lg)' }}>
                                        <h3 className="font-medium mb-1" style={{ color: 'var(--charcoal)' }}>
                                            {session.title}
                                        </h3>
                                        <p className="text-sm mb-3" style={{ color: 'var(--slate)' }}>
                                            {session.doctor} • {session.specialty}
                                        </p>
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {session.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 rounded-full text-xs"
                                                    style={{ background: 'var(--mist)', color: 'var(--slate)' }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <Link href={`/live/${session.id}`} className="btn btn-primary w-full justify-center">
                                            <Play className="w-4 h-4" />
                                            Join Session
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upcoming Sessions */}
                {activeTab === 'upcoming' && (
                    <div className="space-y-4">
                        {upcomingSessions.map((session, i) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="card card-bordered hover-lift"
                                style={{ padding: 'var(--space-lg)' }}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                                        style={{ background: 'var(--sky-light)' }}
                                    >
                                        {session.thumbnail}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium" style={{ color: 'var(--charcoal)' }}>
                                            {session.title}
                                        </h3>
                                        <p className="text-sm" style={{ color: 'var(--slate)' }}>
                                            {session.doctor}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'var(--silver)' }}>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {session.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" /> {session.registrations} registered
                                            </span>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary">
                                        <Calendar className="w-4 h-4" />
                                        Register
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Recorded Sessions */}
                {activeTab === 'recorded' && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recordedSessions.map((session, i) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="card card-bordered hover-lift overflow-hidden"
                            >
                                <div
                                    className="aspect-video flex items-center justify-center text-5xl relative"
                                    style={{ background: 'var(--lavender-light)' }}
                                >
                                    {session.thumbnail}
                                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
                                        {session.duration}
                                    </div>
                                </div>
                                <div style={{ padding: 'var(--space-lg)' }}>
                                    <h3 className="font-medium mb-1" style={{ color: 'var(--charcoal)' }}>
                                        {session.title}
                                    </h3>
                                    <p className="text-sm mb-3" style={{ color: 'var(--slate)' }}>
                                        {session.doctor}
                                    </p>
                                    <div className="flex items-center justify-between text-sm" style={{ color: 'var(--silver)' }}>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" /> {session.views.toLocaleString()} views
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-current" style={{ color: 'var(--peach)' }} />
                                            {session.rating}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

