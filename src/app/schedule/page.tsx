'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Calendar,
    Clock,
    ArrowLeft,
    Plus,
    ChevronLeft,
    ChevronRight,
    Video,
    User
} from 'lucide-react';

const appointments = [
    { time: '09:00', patient: 'Morning Rounds', type: 'internal', duration: 60 },
    { time: '10:00', patient: 'John Anderson', type: 'video', duration: 30 },
    { time: '11:00', patient: 'Maria Garcia', type: 'in-person', duration: 45 },
    { time: '14:00', patient: 'Robert Chen', type: 'video', duration: 30 },
    { time: '15:00', patient: 'Emma Johnson', type: 'video', duration: 30 },
    { time: '16:00', patient: 'Team Meeting', type: 'internal', duration: 60 },
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dates = [27, 28, 29, 30, 31, 1, 2];

export default function SchedulePage() {
    const [selectedDay, setSelectedDay] = useState(2); // Wednesday (index 2)

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
                            Schedule
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--silver)' }}>
                            Manage your appointments and availability
                        </p>
                    </div>
                    <button className="btn btn-primary">
                        <Plus className="w-4 h-4" />
                        New Appointment
                    </button>
                </div>

                {/* Calendar Header */}
                <div className="card card-bordered mb-6" style={{ padding: 'var(--space-lg)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <button className="btn btn-icon btn-secondary">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h2 className="heading-serif text-xl" style={{ color: 'var(--charcoal)' }}>
                            January 2026
                        </h2>
                        <button className="btn btn-icon btn-secondary">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {weekDays.map((day, i) => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(i)}
                                className="flex flex-col items-center p-3 rounded-xl transition-all"
                                style={{
                                    background: selectedDay === i ? 'var(--charcoal)' : 'transparent',
                                    color: selectedDay === i ? 'var(--white)' : 'var(--slate)'
                                }}
                            >
                                <span className="text-xs font-medium mb-1">{day}</span>
                                <span className="text-lg font-medium">{dates[i]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Day Schedule */}
                <div className="card card-bordered" style={{ padding: 'var(--space-xl)' }}>
                    <h3 className="heading-serif text-lg mb-6" style={{ color: 'var(--charcoal)' }}>
                        {weekDays[selectedDay]}, January {dates[selectedDay]}
                    </h3>

                    <div className="space-y-3">
                        {appointments.map((apt, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-4 p-4 rounded-xl hover-lift cursor-pointer"
                                style={{
                                    background: apt.type === 'internal' ? 'var(--cloud)' :
                                        apt.type === 'video' ? 'var(--sky-light)' : 'var(--sage-light)'
                                }}
                            >
                                <div className="text-center" style={{ minWidth: '60px' }}>
                                    <div className="font-mono font-medium" style={{ color: 'var(--charcoal)' }}>
                                        {apt.time}
                                    </div>
                                    <div className="text-xs" style={{ color: 'var(--silver)' }}>
                                        {apt.duration}min
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium" style={{ color: 'var(--charcoal)' }}>
                                        {apt.patient}
                                    </div>
                                    <div className="text-sm capitalize" style={{ color: 'var(--silver)' }}>
                                        {apt.type.replace('-', ' ')}
                                    </div>
                                </div>
                                {apt.type === 'video' && (
                                    <button className="btn btn-primary text-sm py-2">
                                        <Video className="w-4 h-4" />
                                        Join
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

