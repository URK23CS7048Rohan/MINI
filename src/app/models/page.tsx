'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Brain,
    Heart,
    Eye,
    Scan,
    Activity,
    ArrowLeft,
    ArrowRight,
    Sparkles,
    CheckCircle,
    TrendingUp,
    Target,
    Microscope,
    Layers,
} from 'lucide-react';

const modelCategories = [
    {
        name: 'Dermatology',
        icon: Heart,
        color: 'sage',
        models: [
            { name: 'Skin Lesion Classifier', accuracy: '98.5%', images: '50K+' },
            { name: 'Melanoma Detector', accuracy: '97.8%', images: '30K+' },
            { name: 'Psoriasis Analyzer', accuracy: '96.2%', images: '20K+' },
            { name: 'Eczema Classifier', accuracy: '95.8%', images: '25K+' },
        ]
    },
    {
        name: 'Radiology',
        icon: Scan,
        color: 'sky',
        models: [
            { name: 'Chest X-Ray Analyzer', accuracy: '97.2%', images: '100K+' },
            { name: 'COVID-19 Detector', accuracy: '96.5%', images: '40K+' },
            { name: 'Pneumonia Classifier', accuracy: '95.9%', images: '35K+' },
        ]
    },
    {
        name: 'Ophthalmology',
        icon: Eye,
        color: 'lavender',
        models: [
            { name: 'Diabetic Retinopathy', accuracy: '96.8%', images: '45K+' },
            { name: 'Glaucoma Detector', accuracy: '95.2%', images: '30K+' },
            { name: 'Macular Degeneration', accuracy: '94.5%', images: '25K+' },
        ]
    },
    {
        name: 'Cardiology',
        icon: Activity,
        color: 'coral',
        models: [
            { name: 'ECG Arrhythmia', accuracy: '95.5%', images: '60K+' },
            { name: 'Heart Failure Predictor', accuracy: '93.2%', images: '40K+' },
        ]
    },
];

const foundationCategories = [
    {
        name: 'OpenMed Segmentation',
        icon: Layers,
        color: '#10B981',
        models: [
            { name: 'SAM-Med2D', accuracy: '94.2%', data: '4.6M images' },
            { name: 'SAM-Med3D', accuracy: '91.8%', data: '21K+ volumes' },
        ],
    },
    {
        name: 'Retinal Foundation',
        icon: Eye,
        color: '#8B5CF6',
        models: [
            { name: 'RETFound (Nature 2023)', accuracy: '96.1%', data: '1.6M images' },
        ],
    },
    {
        name: 'Endoscopy & NLP',
        icon: Microscope,
        color: '#F59E0B',
        models: [
            { name: 'Endo-FM', accuracy: '93.4%', data: '33K+ videos' },
            { name: 'PULSE Medical LLM', accuracy: '92.8%', data: '7B params' },
        ],
    },
    {
        name: 'MixFormer Tracking',
        icon: Target,
        color: '#EF4444',
        models: [
            { name: 'MixFormer-ViT (CVPR 2022)', accuracy: '86.1%', data: 'SOTA #1/41' },
            { name: 'MixFormer-CvT (CVPR 2022)', accuracy: '73.3%', data: 'Hierarchical' },
        ],
    },
];

export default function ModelsPage() {
    const getColorStyles = (color: string) => {
        const colors: Record<string, { bg: string; light: string; accent: string }> = {
            sage: { bg: 'var(--sage)', light: 'var(--sage-light)', accent: 'var(--accent-primary)' },
            sky: { bg: 'var(--sky)', light: 'var(--sky-light)', accent: 'var(--accent-tertiary)' },
            lavender: { bg: 'var(--lavender)', light: 'var(--lavender-light)', accent: 'var(--accent-secondary)' },
            coral: { bg: 'var(--coral)', light: 'var(--coral-light)', accent: 'var(--accent-secondary)' },
        };
        return colors[color] || colors.sage;
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
                            AI Model Hub
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--silver)' }}>
                            25+ YOLO models + 7 Foundation Models (OpenMEDLab + MixFormer)
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {[
                        { label: 'YOLO Models', value: '25+' },
                        { label: 'Foundation Models', value: '7' },
                        { label: 'Avg Accuracy', value: '96.2%' },
                        { label: 'Training Data', value: '8M+' },
                        { label: 'Detections', value: '1M+' },
                    ].map((stat, i) => (
                        <div key={i} className="card card-bordered text-center" style={{ padding: 'var(--space-lg)' }}>
                            <div className="stat-number text-2xl">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Foundation Models Banner */}
                <Link href="/foundation-models">
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="card card-bordered hover-lift mb-8 cursor-pointer"
                        style={{
                            padding: 'var(--space-lg)',
                            background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(139,92,246,0.05), rgba(239,68,68,0.05))',
                            borderLeft: '4px solid #10B981',
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Brain className="w-6 h-6" style={{ color: '#10B981' }} />
                                <div>
                                    <h3 className="font-semibold" style={{ color: 'var(--charcoal)' }}>
                                        OpenMEDLab + MixFormer Foundation Models
                                    </h3>
                                    <p className="text-sm" style={{ color: 'var(--silver)' }}>
                                        SAM-Med2D/3D • RETFound • Endo-FM • PULSE • MixFormer CVPR 2022 — View architecture, benchmarks, and pipeline
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5" style={{ color: 'var(--silver)' }} />
                        </div>
                    </motion.div>
                </Link>

                {/* YOLO Model Categories */}
                <h2 className="heading-serif text-lg mb-4" style={{ color: 'var(--charcoal)' }}>
                    YOLO Detection Models
                </h2>
                <div className="space-y-8 mb-12">
                    {modelCategories.map((category, catIndex) => {
                        const colors = getColorStyles(category.color);
                        return (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: catIndex * 0.1 }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: colors.light }}
                                    >
                                        <category.icon className="w-5 h-5" style={{ color: colors.accent }} />
                                    </div>
                                    <h2 className="heading-serif text-xl" style={{ color: 'var(--charcoal)' }}>
                                        {category.name}
                                    </h2>
                                    <span className="pill pill-default text-xs">
                                        {category.models.length} models
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {category.models.map((model) => (
                                        <motion.div
                                            key={model.name}
                                            whileHover={{ scale: 1.02 }}
                                            className="card card-bordered hover-lift cursor-pointer"
                                            style={{ padding: 'var(--space-lg)' }}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="font-medium" style={{ color: 'var(--charcoal)' }}>
                                                    {model.name}
                                                </h3>
                                                <Sparkles className="w-4 h-4" style={{ color: colors.accent }} />
                                            </div>
                                            <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--silver)' }}>
                                                <span className="flex items-center gap-1">
                                                    <CheckCircle className="w-3.5 h-3.5" style={{ color: 'var(--sage)' }} />
                                                    {model.accuracy}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <TrendingUp className="w-3.5 h-3.5" />
                                                    {model.images}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Foundation Model Categories */}
                <h2 className="heading-serif text-lg mb-4" style={{ color: 'var(--charcoal)' }}>
                    Foundation Models (OpenMEDLab + MixFormer)
                </h2>
                <div className="space-y-6">
                    {foundationCategories.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${cat.color}15` }}
                                >
                                    <cat.icon className="w-5 h-5" style={{ color: cat.color }} />
                                </div>
                                <h3 className="heading-serif text-xl" style={{ color: 'var(--charcoal)' }}>
                                    {cat.name}
                                </h3>
                                <span className="pill pill-default text-xs">
                                    {cat.models.length} models
                                </span>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {cat.models.map(model => (
                                    <motion.div
                                        key={model.name}
                                        whileHover={{ scale: 1.02 }}
                                        className="card card-bordered hover-lift cursor-pointer"
                                        style={{
                                            padding: 'var(--space-lg)',
                                            borderLeft: `3px solid ${cat.color}`,
                                        }}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-medium" style={{ color: 'var(--charcoal)' }}>
                                                {model.name}
                                            </h3>
                                            <Sparkles className="w-4 h-4" style={{ color: cat.color }} />
                                        </div>
                                        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--silver)' }}>
                                            <span className="flex items-center gap-1">
                                                <CheckCircle className="w-3.5 h-3.5" style={{ color: cat.color }} />
                                                {model.accuracy}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <TrendingUp className="w-3.5 h-3.5" />
                                                {model.data}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
