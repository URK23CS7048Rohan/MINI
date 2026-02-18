'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Brain,
    Eye,
    Scan,
    Activity,
    Sparkles,
    Microscope,
    Layers,
    Target,
    FileText,
    Cpu,
    Zap,
    ChevronRight,
    ExternalLink,
    BookOpen,
    TrendingUp,
    Shield,
    Globe,
} from 'lucide-react';

const foundationModels = [
    {
        id: 'sam-med-2d',
        name: 'SAM-Med2D',
        category: 'Segmentation',
        icon: Layers,
        color: '#10B981',
        venue: 'arXiv 2023',
        description: 'Segment Anything Model fine-tuned for 2D medical image segmentation with adapter layers on 4.6M images and 19.7M masks.',
        architecture: 'ViT Encoder (frozen) + Adapter Layers + Prompt Encoder + Mask Decoder',
        pretraining: 'SA-Med2D-20M Dataset',
        accuracy: 94.2,
        capabilities: ['2D Segmentation', 'Point Prompts', 'Box Prompts', 'Mask Prompts', 'Multi-Modality'],
        metrics: { images: '4.6M', masks: '19.7M', modalities: '10+' },
        repo: 'https://github.com/openmedlab/SAM-Med2D',
    },
    {
        id: 'sam-med-3d',
        name: 'SAM-Med3D',
        category: 'Segmentation',
        icon: Scan,
        color: '#3B82F6',
        venue: 'arXiv 2023',
        description: 'Fully native 3D volumetric segmentation model with 3D ViT encoder and volumetric mask decoder for CT/MRI analysis.',
        architecture: '3D Patch Embedding + 3D ViT Encoder + 3D Prompt Encoder + 3D Mask Decoder',
        pretraining: 'Large-scale 3D Medical Imaging',
        accuracy: 91.8,
        capabilities: ['3D Volumetric', 'CT Analysis', 'MRI Analysis', 'Organ Delineation', 'Tumor Segmentation'],
        metrics: { volumes: '21K+', organs: '130+', resolution: '128³' },
        repo: 'https://github.com/openmedlab/SAM-Med3D',
    },
    {
        id: 'retfound',
        name: 'RETFound',
        category: 'Retinal',
        icon: Eye,
        color: '#8B5CF6',
        venue: 'Nature 2023',
        description: 'Foundation model for generalizable disease detection from retinal images, pre-trained on 1.6M images with Masked Autoencoder.',
        architecture: 'ViT-Large (24 blocks, dim=1024, 16 heads) + MAE Pre-training',
        pretraining: '1.6M Unlabeled Retinal Images',
        accuracy: 96.1,
        capabilities: ['Diabetic Retinopathy', 'Glaucoma Screening', 'Macular Degeneration', 'CV Risk Prediction'],
        metrics: { images: '1.6M', blocks: '24', heads: '16' },
        repo: 'https://github.com/rmaphoh/RETFound_MAE',
    },
    {
        id: 'endo-fm',
        name: 'Endo-FM',
        category: 'Endoscopy',
        icon: Microscope,
        color: '#F59E0B',
        venue: 'arXiv 2023',
        description: 'Foundation model for endoscopy video analysis with dynamic spatial-temporal positional encoding and teacher-student pre-training.',
        architecture: 'Video Transformer + Dynamic ST Positional Encoding + Teacher-Student',
        pretraining: 'Large-scale Endoscopy Video Dataset',
        accuracy: 93.4,
        capabilities: ['Polyp Detection', 'Lesion Segmentation', 'Scene Classification', 'Surgical Phase Recognition'],
        metrics: { videos: '33K+', frames: '5M+', fps: '30' },
        repo: 'https://github.com/openmedlab/Endo-FM',
    },
    {
        id: 'pulse',
        name: 'PULSE',
        category: 'Medical NLP',
        icon: FileText,
        color: '#EC4899',
        venue: 'arXiv 2023',
        description: 'Multi-task vision-language medical LLM with anatomical segmentation, disease classification, and clinical text generation.',
        architecture: 'Self-Supervised ViT + Multiscale Pyramid Decoder + Shared Representations',
        pretraining: 'Textbooks + Guidelines + EHR + Web Q&A',
        accuracy: 92.8,
        capabilities: ['Clinical Text Generation', 'Disease Classification', 'Treatment Suggestions', 'ICD Coding', 'Differential Diagnosis'],
        metrics: { tasks: '5+', languages: '10+', parameters: '7B' },
        repo: 'https://github.com/openmedlab/PULSE',
    },
    {
        id: 'mixformer-vit',
        name: 'MixFormer-ViT',
        category: 'Tracking',
        icon: Target,
        color: '#EF4444',
        venue: 'CVPR 2022 (Oral)',
        description: 'SOTA visual object tracking with Mixed Attention Modules — unifies feature extraction and target integration. End-to-end, no post-processing.',
        architecture: 'ViT-Large Backbone + Iterative MAM + Pyramidal Corner Head',
        pretraining: 'MAE + LaSOT + TrackingNet + GOT-10k',
        accuracy: 86.1,
        capabilities: ['Real-Time Tracking', 'End-to-End Inference', 'Scale Invariance', 'No Post-Processing', 'Lesion Tracking'],
        metrics: { LaSOT: '73.3%', TrackingNet: '86.1%', VOT2022: '#1/41' },
        repo: 'https://github.com/MCG-NJU/MixFormer',
    },
    {
        id: 'mixformer-cvt',
        name: 'MixFormer-CvT',
        category: 'Tracking',
        icon: Target,
        color: '#F97316',
        venue: 'CVPR 2022 (Oral)',
        description: 'Hierarchical tracker with Convolutional Vision Transformer backbone, progressive downsampling, and depth-wise convolutional projections.',
        architecture: 'CvT-21/24W Backbone + MAM + Query-Based Localization Head',
        pretraining: 'ImageNet + LaSOT + TrackingNet',
        accuracy: 73.3,
        capabilities: ['Progressive Downsampling', 'Depth-wise Conv', 'Shift Invariance', 'Distortion Invariance', 'Medical Tracking'],
        metrics: { backbone: 'CvT-24W', heads: '8', stages: '3' },
        repo: 'https://github.com/MCG-NJU/MixFormer',
    },
];

const pipelineStages = [
    { name: 'Stage 1: YOLO Quick Detection', desc: 'Existing Roboflow models for rapid bounding box detection', icon: Zap, color: '#3B82F6' },
    { name: 'Stage 2: OpenMed Foundation Analysis', desc: 'SAM-Med segmentation, RETFound retinal, or Endo-FM video analysis', icon: Brain, color: '#10B981' },
    { name: 'Stage 3: MixFormer Tracking', desc: 'Real-time lesion tracking with Mixed Attention Modules', icon: Target, color: '#8B5CF6' },
    { name: 'Stage 4: Consensus Engine', desc: 'Multi-model weighted voting for unified diagnosis', icon: Shield, color: '#F59E0B' },
];

export default function FoundationModelsPage() {
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'models' | 'pipeline' | 'benchmarks'>('models');

    const selected = foundationModels.find(m => m.id === selectedModel);

    return (
        <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
            <div className="max-w-7xl mx-auto p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="btn btn-icon btn-secondary">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="heading-serif text-2xl lg:text-3xl" style={{ color: 'var(--charcoal)' }}>
                                Foundation Models
                            </h1>
                            <span className="pill text-xs" style={{ background: '#10B981', color: 'white' }}>
                                OpenMed + MixFormer
                            </span>
                        </div>
                        <p className="text-sm mt-1" style={{ color: 'var(--silver)' }}>
                            OpenMEDLab foundation models + MixFormer CVPR 2022 SOTA tracking
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {[
                        { label: 'Foundation Models', value: '7', icon: Brain },
                        { label: 'Pre-training Data', value: '8M+', icon: Globe },
                        { label: 'Categories', value: '5', icon: Layers },
                        { label: 'Avg. Accuracy', value: '89.7%', icon: TrendingUp },
                        { label: 'Pipeline Stages', value: '4', icon: Cpu },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="card card-bordered text-center"
                            style={{ padding: 'var(--space-lg)' }}
                        >
                            <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--sage)' }} />
                            <div className="stat-number text-xl">{stat.value}</div>
                            <div className="stat-label text-xs">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    {[
                        { key: 'models' as const, label: 'Foundation Models', icon: Brain },
                        { key: 'pipeline' as const, label: 'Detection Pipeline', icon: Cpu },
                        { key: 'benchmarks' as const, label: 'Benchmarks', icon: TrendingUp },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                            style={{
                                background: activeTab === tab.key ? 'var(--charcoal)' : 'transparent',
                                color: activeTab === tab.key ? 'white' : 'var(--silver)',
                                border: activeTab === tab.key ? 'none' : '1px solid var(--border)',
                            }}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Models Tab */}
                {activeTab === 'models' && (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Model Cards */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence>
                                {foundationModels.map((model, index) => (
                                    <motion.div
                                        key={model.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => setSelectedModel(selectedModel === model.id ? null : model.id)}
                                        className="card card-bordered hover-lift cursor-pointer"
                                        style={{
                                            padding: 'var(--space-lg)',
                                            borderLeft: `4px solid ${model.color}`,
                                        }}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                                    style={{ background: `${model.color}15` }}
                                                >
                                                    <model.icon className="w-5 h-5" style={{ color: model.color }} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold" style={{ color: 'var(--charcoal)' }}>
                                                            {model.name}
                                                        </h3>
                                                        <span className="pill pill-default text-xs">{model.venue}</span>
                                                    </div>
                                                    <p className="text-xs mb-2" style={{ color: 'var(--silver)' }}>
                                                        {model.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {model.capabilities.slice(0, 3).map(cap => (
                                                            <span key={cap} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${model.color}10`, color: model.color }}>
                                                                {cap}
                                                            </span>
                                                        ))}
                                                        {model.capabilities.length > 3 && (
                                                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--cream-dark)', color: 'var(--silver)' }}>
                                                                +{model.capabilities.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0 ml-4">
                                                <div className="text-lg font-bold" style={{ color: model.color }}>
                                                    {model.accuracy}%
                                                </div>
                                                <div className="text-xs" style={{ color: 'var(--silver)' }}>accuracy</div>
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        <AnimatePresence>
                                            {selectedModel === model.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                                                        <div className="grid md:grid-cols-2 gap-4">
                                                            <div>
                                                                <div className="text-xs font-medium mb-1" style={{ color: 'var(--charcoal)' }}>Architecture</div>
                                                                <p className="text-xs" style={{ color: 'var(--silver)' }}>{model.architecture}</p>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-medium mb-1" style={{ color: 'var(--charcoal)' }}>Pre-training</div>
                                                                <p className="text-xs" style={{ color: 'var(--silver)' }}>{model.pretraining}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-3">
                                                            {Object.entries(model.metrics).map(([key, value]) => (
                                                                <div key={key} className="text-center">
                                                                    <div className="text-sm font-bold" style={{ color: 'var(--charcoal)' }}>{value}</div>
                                                                    <div className="text-xs" style={{ color: 'var(--silver)' }}>{key}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <a
                                                            href={model.repo}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 mt-3 text-xs font-medium"
                                                            style={{ color: model.color }}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                            View Repository
                                                        </a>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Sidebar — Categories Summary */}
                        <div className="space-y-4">
                            <div className="card card-bordered" style={{ padding: 'var(--space-lg)' }}>
                                <h3 className="heading-serif text-lg mb-4" style={{ color: 'var(--charcoal)' }}>
                                    Model Categories
                                </h3>
                                {['Segmentation', 'Retinal', 'Endoscopy', 'Medical NLP', 'Tracking'].map(cat => {
                                    const models = foundationModels.filter(m => m.category === cat);
                                    return (
                                        <div key={cat} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                                            <span className="text-sm" style={{ color: 'var(--charcoal)' }}>{cat}</span>
                                            <span className="pill pill-default text-xs">{models.length} models</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="card card-bordered" style={{ padding: 'var(--space-lg)' }}>
                                <h3 className="heading-serif text-lg mb-3" style={{ color: 'var(--charcoal)' }}>
                                    Quick Links
                                </h3>
                                {[
                                    { label: 'OpenMEDLab', url: 'https://github.com/openmedlab', icon: BookOpen },
                                    { label: 'MixFormer Paper', url: 'https://arxiv.org/abs/2203.11082', icon: FileText },
                                    { label: 'YOLO Model Hub', url: '/models', icon: Brain },
                                    { label: 'Run Detection', url: '/detection', icon: Scan },
                                ].map(link => (
                                    <a
                                        key={link.label}
                                        href={link.url}
                                        target={link.url.startsWith('http') ? '_blank' : undefined}
                                        rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="flex items-center gap-2 py-2 text-sm transition-colors"
                                        style={{ color: 'var(--silver)' }}
                                    >
                                        <link.icon className="w-4 h-4" />
                                        {link.label}
                                        <ChevronRight className="w-3 h-3 ml-auto" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Pipeline Tab */}
                {activeTab === 'pipeline' && (
                    <div className="space-y-6">
                        <div className="card card-bordered" style={{ padding: 'var(--space-xl)' }}>
                            <h3 className="heading-serif text-xl mb-6" style={{ color: 'var(--charcoal)' }}>
                                Multi-Stage Foundation Pipeline
                            </h3>
                            <div className="space-y-4">
                                {pipelineStages.map((stage, i) => (
                                    <motion.div
                                        key={stage.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                                style={{ background: `${stage.color}15` }}
                                            >
                                                <stage.icon className="w-6 h-6" style={{ color: stage.color }} />
                                            </div>
                                            {i < pipelineStages.length - 1 && (
                                                <div className="w-0.5 h-8 mt-2" style={{ background: 'var(--border)' }} />
                                            )}
                                        </div>
                                        <div className="pt-1">
                                            <h4 className="font-semibold" style={{ color: 'var(--charcoal)' }}>{stage.name}</h4>
                                            <p className="text-sm" style={{ color: 'var(--silver)' }}>{stage.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="card card-bordered" style={{ padding: 'var(--space-lg)' }}>
                                <h4 className="font-semibold mb-3" style={{ color: 'var(--charcoal)' }}>
                                    <Sparkles className="w-4 h-4 inline mr-2" style={{ color: 'var(--sage)' }} />
                                    Consensus Engine
                                </h4>
                                <p className="text-sm mb-3" style={{ color: 'var(--silver)' }}>
                                    Weighted voting across all models for a unified diagnosis with confidence scoring.
                                </p>
                                <ul className="space-y-2 text-sm" style={{ color: 'var(--silver)' }}>
                                    <li>• Multi-model weighted aggregation</li>
                                    <li>• Agreement score calculation</li>
                                    <li>• Severity assessment from all sources</li>
                                    <li>• Differential diagnosis compilation</li>
                                </ul>
                            </div>
                            <div className="card card-bordered" style={{ padding: 'var(--space-lg)' }}>
                                <h4 className="font-semibold mb-3" style={{ color: 'var(--charcoal)' }}>
                                    <Activity className="w-4 h-4 inline mr-2" style={{ color: 'var(--coral)' }} />
                                    Real-Time Capabilities
                                </h4>
                                <p className="text-sm mb-3" style={{ color: 'var(--silver)' }}>
                                    MixFormer enables real-time lesion tracking during live consultations.
                                </p>
                                <ul className="space-y-2 text-sm" style={{ color: 'var(--silver)' }}>
                                    <li>• End-to-end tracking (no post-processing)</li>
                                    <li>• Temporal evolution analysis</li>
                                    <li>• Size/morphology change monitoring</li>
                                    <li>• Clinical risk assessment</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Benchmarks Tab */}
                {activeTab === 'benchmarks' && (
                    <div className="space-y-6">
                        <div className="card card-bordered" style={{ padding: 'var(--space-xl)' }}>
                            <h3 className="heading-serif text-xl mb-6" style={{ color: 'var(--charcoal)' }}>
                                Model Performance Benchmarks
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid var(--border)' }}>
                                            <th className="text-left py-3 px-4" style={{ color: 'var(--charcoal)' }}>Model</th>
                                            <th className="text-left py-3 px-4" style={{ color: 'var(--charcoal)' }}>Category</th>
                                            <th className="text-left py-3 px-4" style={{ color: 'var(--charcoal)' }}>Venue</th>
                                            <th className="text-right py-3 px-4" style={{ color: 'var(--charcoal)' }}>Accuracy</th>
                                            <th className="text-left py-3 px-4" style={{ color: 'var(--charcoal)' }}>Key Metric</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {foundationModels.map(model => (
                                            <tr key={model.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full" style={{ background: model.color }} />
                                                        <span className="font-medium" style={{ color: 'var(--charcoal)' }}>{model.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4" style={{ color: 'var(--silver)' }}>{model.category}</td>
                                                <td className="py-3 px-4">
                                                    <span className="pill pill-default text-xs">{model.venue}</span>
                                                </td>
                                                <td className="py-3 px-4 text-right font-bold" style={{ color: model.color }}>
                                                    {model.accuracy}%
                                                </td>
                                                <td className="py-3 px-4" style={{ color: 'var(--silver)' }}>
                                                    {Object.entries(model.metrics).slice(0, 1).map(([k, v]) => `${k}: ${v}`).join('')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* MixFormer Specific Benchmarks */}
                        <div className="card card-bordered" style={{ padding: 'var(--space-xl)' }}>
                            <h3 className="heading-serif text-lg mb-4" style={{ color: 'var(--charcoal)' }}>
                                <Target className="w-5 h-5 inline mr-2" style={{ color: '#EF4444' }} />
                                MixFormer CVPR 2022 — Tracking Benchmarks
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { benchmark: 'LaSOT', metric: 'AUC', value: '73.3%', rank: '🥇 SOTA' },
                                    { benchmark: 'TrackingNet', metric: 'AUC', value: '86.1%', rank: '🥇 SOTA' },
                                    { benchmark: 'VOT2020', metric: 'EAO', value: '0.584', rank: '🥇 SOTA' },
                                    { benchmark: 'VOT2022-STb', metric: 'Rank', value: '#1/41', rank: '🥇 #1' },
                                ].map(b => (
                                    <div key={b.benchmark} className="text-center p-4 rounded-xl" style={{ background: 'var(--cream-dark)' }}>
                                        <div className="text-xs font-medium mb-1" style={{ color: 'var(--silver)' }}>{b.benchmark}</div>
                                        <div className="text-2xl font-bold" style={{ color: 'var(--charcoal)' }}>{b.value}</div>
                                        <div className="text-xs mt-1" style={{ color: '#EF4444' }}>{b.rank}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
