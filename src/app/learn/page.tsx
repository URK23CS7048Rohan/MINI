'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    BookOpen,
    ArrowLeft,
    Play,
    Clock,
    Award,
    CheckCircle,
    Lock,
    ChevronRight,
    Search,
    Filter,
    Star,
    Users,
    Brain,
    Heart,
    Eye,
    Scan
} from 'lucide-react';

const courses = [
    {
        id: 1,
        title: 'AI in Medical Imaging: Fundamentals',
        description: 'Learn the basics of AI-powered medical image analysis and how YOLO models work.',
        duration: '2h 30m',
        lessons: 12,
        level: 'Beginner',
        rating: 4.9,
        students: 2340,
        progress: 65,
        icon: Brain,
        color: 'sage'
    },
    {
        id: 2,
        title: 'Skin Disease Detection with Deep Learning',
        description: 'Master dermatological AI detection including melanoma, psoriasis, and eczema identification.',
        duration: '4h 15m',
        lessons: 18,
        level: 'Intermediate',
        rating: 4.8,
        students: 1890,
        progress: 30,
        icon: Heart,
        color: 'coral'
    },
    {
        id: 3,
        title: 'Chest X-Ray Analysis: COVID-19 & Pneumonia',
        description: 'Learn to use AI for detecting respiratory conditions in chest radiographs.',
        duration: '3h 45m',
        lessons: 15,
        level: 'Intermediate',
        rating: 4.7,
        students: 3120,
        progress: 0,
        icon: Scan,
        color: 'sky'
    },
    {
        id: 4,
        title: 'Ophthalmology AI: Retinal Disease Detection',
        description: 'Detect diabetic retinopathy, glaucoma, and macular degeneration using AI.',
        duration: '3h 20m',
        lessons: 14,
        level: 'Advanced',
        rating: 4.9,
        students: 980,
        progress: 0,
        icon: Eye,
        color: 'lavender'
    },
];

const resources = [
    { title: 'YOLO Model Documentation', type: 'PDF', size: '2.4 MB' },
    { title: 'Clinical AI Guidelines', type: 'PDF', size: '1.8 MB' },
    { title: 'Best Practices Handbook', type: 'PDF', size: '3.1 MB' },
    { title: 'Case Study: Melanoma Detection', type: 'Video', duration: '15 min' },
];

const certifications = [
    { id: 1, name: 'AI Medical Imaging Specialist', earned: true, date: 'Jan 2026' },
    { id: 2, name: 'Dermatology AI Expert', earned: false, progress: 30 },
    { id: 3, name: 'Radiology AI Practitioner', earned: false, progress: 0 },
];

export default function LearnPage() {
    const [activeTab, setActiveTab] = useState('courses');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            Learning Center
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--silver)' }}>
                            Expand your AI diagnostic skills with courses and certifications
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {['courses', 'resources', 'certifications'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize"
                            style={{
                                background: activeTab === tab ? 'var(--charcoal)' : 'var(--white)',
                                color: activeTab === tab ? 'white' : 'var(--slate)'
                            }}
                        >
                            {tab}
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
                            placeholder="Search courses and resources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent outline-none"
                            style={{ color: 'var(--charcoal)' }}
                        />
                    </div>
                </div>

                {/* Courses Tab */}
                {activeTab === 'courses' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredCourses.map((course, i) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="card card-bordered hover-lift overflow-hidden"
                            >
                                {/* Course Header */}
                                <div
                                    className="p-6 flex items-start gap-4"
                                    style={{ background: `var(--${course.color}-light)` }}
                                >
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                        style={{ background: 'var(--white)' }}
                                    >
                                        <course.icon className="w-7 h-7" style={{ color: `var(--${course.color})` }} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="heading-serif text-lg" style={{ color: 'var(--charcoal)' }}>
                                            {course.title}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-2 text-xs">
                                            <span className="flex items-center gap-1" style={{ color: 'var(--slate)' }}>
                                                <Clock className="w-3 h-3" /> {course.duration}
                                            </span>
                                            <span className="flex items-center gap-1" style={{ color: 'var(--slate)' }}>
                                                <BookOpen className="w-3 h-3" /> {course.lessons} lessons
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Course Body */}
                                <div className="p-6">
                                    <p className="text-sm mb-4" style={{ color: 'var(--slate)' }}>
                                        {course.description}
                                    </p>

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1" style={{ color: 'var(--charcoal)' }}>
                                                <Star className="w-4 h-4 fill-current" style={{ color: 'var(--peach)' }} />
                                                {course.rating}
                                            </span>
                                            <span style={{ color: 'var(--silver)' }}>
                                                <Users className="w-4 h-4 inline mr-1" />
                                                {course.students.toLocaleString()}
                                            </span>
                                        </div>
                                        <span
                                            className="pill text-xs"
                                            style={{
                                                background: course.level === 'Beginner' ? 'var(--sage-light)' :
                                                    course.level === 'Intermediate' ? 'var(--sky-light)' : 'var(--lavender-light)',
                                                color: 'var(--charcoal)'
                                            }}
                                        >
                                            {course.level}
                                        </span>
                                    </div>

                                    {/* Progress */}
                                    {course.progress > 0 && (
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span style={{ color: 'var(--slate)' }}>Progress</span>
                                                <span style={{ color: 'var(--sage)' }}>{course.progress}%</span>
                                            </div>
                                            <div className="h-2 rounded-full" style={{ background: 'var(--mist)' }}>
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${course.progress}%`,
                                                        background: 'var(--sage)'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <button className="btn btn-primary w-full justify-center">
                                        {course.progress > 0 ? (
                                            <>
                                                <Play className="w-4 h-4" />
                                                Continue Learning
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-4 h-4" />
                                                Start Course
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Resources Tab */}
                {activeTab === 'resources' && (
                    <div className="space-y-3">
                        {resources.map((resource, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="card card-bordered hover-lift flex items-center justify-between"
                                style={{ padding: 'var(--space-lg)' }}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{ background: resource.type === 'PDF' ? 'var(--coral-light)' : 'var(--sky-light)' }}
                                    >
                                        {resource.type === 'PDF' ? (
                                            <BookOpen className="w-5 h-5" style={{ color: 'var(--coral)' }} />
                                        ) : (
                                            <Play className="w-5 h-5" style={{ color: 'var(--sky)' }} />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium" style={{ color: 'var(--charcoal)' }}>
                                            {resource.title}
                                        </div>
                                        <div className="text-sm" style={{ color: 'var(--silver)' }}>
                                            {resource.type} • {resource.size || resource.duration}
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-secondary">
                                    {resource.type === 'PDF' ? 'Download' : 'Watch'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Certifications Tab */}
                {activeTab === 'certifications' && (
                    <div className="space-y-4">
                        {certifications.map((cert, i) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="card card-bordered"
                                style={{ padding: 'var(--space-xl)' }}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                        style={{
                                            background: cert.earned ? 'var(--sage-light)' : 'var(--mist)'
                                        }}
                                    >
                                        {cert.earned ? (
                                            <Award className="w-8 h-8" style={{ color: 'var(--sage)' }} />
                                        ) : (
                                            <Lock className="w-6 h-6" style={{ color: 'var(--silver)' }} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-lg" style={{ color: 'var(--charcoal)' }}>
                                            {cert.name}
                                        </div>
                                        {cert.earned ? (
                                            <div className="flex items-center gap-2 text-sm mt-1" style={{ color: 'var(--sage)' }}>
                                                <CheckCircle className="w-4 h-4" />
                                                Earned {cert.date}
                                            </div>
                                        ) : (
                                            <div className="mt-2">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span style={{ color: 'var(--slate)' }}>Progress</span>
                                                    <span style={{ color: 'var(--sage)' }}>{cert.progress}%</span>
                                                </div>
                                                <div className="h-2 rounded-full" style={{ background: 'var(--mist)' }}>
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${cert.progress}%`,
                                                            background: 'var(--sage)'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {cert.earned && (
                                        <button className="btn btn-secondary">
                                            View Certificate
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

