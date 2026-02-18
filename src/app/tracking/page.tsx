'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Target,
    Play,
    Square,
    RotateCcw,
    Upload,
    Camera,
    Activity,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    Crosshair,
    Eye,
    Layers,
    BarChart3,
    Zap,
} from 'lucide-react';

interface TrackingPoint {
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    frame: number;
}

export default function TrackingPage() {
    const [isTracking, setIsTracking] = useState(false);
    const [trackingPoints, setTrackingPoints] = useState<TrackingPoint[]>([]);
    const [selectedBackbone, setSelectedBackbone] = useState<'MixCvT' | 'MixViT'>('MixViT');
    const [currentFrame, setCurrentFrame] = useState(0);
    const [totalFrames] = useState(120);
    const [templateSet, setTemplateSet] = useState(false);
    const [evolution, setEvolution] = useState<{
        sizeChange: number;
        morphology: string;
        risk: string;
        growthRate: number;
    }>({ sizeChange: 0, morphology: 'stable', risk: 'benign', growthRate: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startTracking = useCallback(() => {
        if (!templateSet) return;
        setIsTracking(true);
        setCurrentFrame(0);
        setTrackingPoints([]);

        // Simulate MixFormer tracking frames
        let frame = 0;
        const baseX = 120;
        const baseY = 100;
        const baseW = 60;
        const baseH = 50;

        timerRef.current = setInterval(() => {
            frame++;
            if (frame > totalFrames) {
                setIsTracking(false);
                if (timerRef.current) clearInterval(timerRef.current);
                return;
            }

            const dx = Math.sin(frame * 0.05) * 30 + (Math.random() - 0.5) * 4;
            const dy = Math.cos(frame * 0.07) * 20 + (Math.random() - 0.5) * 3;
            const dw = Math.sin(frame * 0.02) * 8;
            const dh = Math.cos(frame * 0.03) * 6;
            const confidence = Math.max(0.45, 0.96 - frame * 0.002 + (Math.random() - 0.5) * 0.06);

            const point: TrackingPoint = {
                x: baseX + dx,
                y: baseY + dy,
                width: baseW + dw,
                height: baseH + dh,
                confidence,
                frame,
            };

            setTrackingPoints(prev => [...prev, point]);
            setCurrentFrame(frame);

            // Update evolution analysis
            const sizeChange = ((baseW + dw) * (baseH + dh) - baseW * baseH) / (baseW * baseH) * 100;
            const growthRate = sizeChange / Math.max(frame, 1);
            let morphology = 'stable';
            let risk = 'benign';
            if (Math.abs(sizeChange) > 15) morphology = sizeChange > 0 ? 'growing' : 'shrinking';
            if (Math.abs(sizeChange) > 25) { morphology = 'irregular'; risk = 'suspicious'; }
            else if (Math.abs(sizeChange) > 10) risk = 'monitor';

            setEvolution({ sizeChange, morphology, risk, growthRate });
        }, 50);
    }, [templateSet, totalFrames]);

    const stopTracking = useCallback(() => {
        setIsTracking(false);
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    const resetTracking = useCallback(() => {
        stopTracking();
        setTrackingPoints([]);
        setCurrentFrame(0);
        setTemplateSet(false);
        setEvolution({ sizeChange: 0, morphology: 'stable', risk: 'benign', growthRate: 0 });
    }, [stopTracking]);

    const setTemplate = useCallback(() => {
        setTemplateSet(true);
    }, []);

    // Draw tracking visualization
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background grid
        ctx.strokeStyle = 'rgba(0,0,0,0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        if (trackingPoints.length === 0 && !templateSet) {
            ctx.fillStyle = '#999';
            ctx.font = '14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Click "Set Template" to define a target region', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Draw template region
        if (templateSet && trackingPoints.length === 0) {
            ctx.strokeStyle = '#10B981';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(90, 75, 60, 50);
            ctx.setLineDash([]);
            ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
            ctx.fillRect(90, 75, 60, 50);
            ctx.fillStyle = '#10B981';
            ctx.font = '11px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Template', 120, 68);
        }

        // Draw trajectory trail
        if (trackingPoints.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
            ctx.lineWidth = 1.5;
            for (let i = 1; i < trackingPoints.length; i++) {
                const prev = trackingPoints[i - 1];
                const curr = trackingPoints[i];
                ctx.moveTo(prev.x + prev.width / 2, prev.y + prev.height / 2);
                ctx.lineTo(curr.x + curr.width / 2, curr.y + curr.height / 2);
            }
            ctx.stroke();
        }

        // Draw current bounding box
        if (trackingPoints.length > 0) {
            const latest = trackingPoints[trackingPoints.length - 1];
            const alpha = Math.max(0.3, latest.confidence);

            // Bounding box
            ctx.strokeStyle = latest.confidence > 0.7
                ? `rgba(16, 185, 129, ${alpha})`
                : latest.confidence > 0.5
                    ? `rgba(245, 158, 11, ${alpha})`
                    : `rgba(239, 68, 68, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(latest.x, latest.y, latest.width, latest.height);

            // Fill
            ctx.fillStyle = latest.confidence > 0.7
                ? `rgba(16, 185, 129, 0.08)`
                : latest.confidence > 0.5
                    ? `rgba(245, 158, 11, 0.08)`
                    : `rgba(239, 68, 68, 0.08)`;
            ctx.fillRect(latest.x, latest.y, latest.width, latest.height);

            // Label
            ctx.fillStyle = 'var(--charcoal, #1a1a2e)';
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`${(latest.confidence * 100).toFixed(1)}%  F:${latest.frame}`, latest.x, latest.y - 4);

            // Center crosshair
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 1;
            const cx = latest.x + latest.width / 2;
            const cy = latest.y + latest.height / 2;
            ctx.beginPath();
            ctx.moveTo(cx - 6, cy);
            ctx.lineTo(cx + 6, cy);
            ctx.moveTo(cx, cy - 6);
            ctx.lineTo(cx, cy + 6);
            ctx.stroke();
        }
    }, [trackingPoints, templateSet]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const riskColors: Record<string, string> = {
        benign: '#10B981',
        monitor: '#F59E0B',
        suspicious: '#EF4444',
        urgent: '#DC2626',
    };

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
                                Lesion Tracking
                            </h1>
                            <span className="pill text-xs" style={{ background: '#EF4444', color: 'white' }}>
                                MixFormer CVPR 2022
                            </span>
                        </div>
                        <p className="text-sm mt-1" style={{ color: 'var(--silver)' }}>
                            Real-time lesion tracking with Mixed Attention Modules — SOTA end-to-end tracking
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left — Tracking Canvas */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="card card-bordered" style={{ padding: 'var(--space-lg)' }}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold" style={{ color: 'var(--charcoal)' }}>
                                    <Target className="w-4 h-4 inline mr-2" style={{ color: '#EF4444' }} />
                                    Tracking Visualization
                                </h3>
                                <div className="flex items-center gap-2">
                                    {/* Backbone selector */}
                                    {['MixCvT', 'MixViT'].map(bb => (
                                        <button
                                            key={bb}
                                            onClick={() => setSelectedBackbone(bb as 'MixCvT' | 'MixViT')}
                                            className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                                            style={{
                                                background: selectedBackbone === bb ? 'var(--charcoal)' : 'transparent',
                                                color: selectedBackbone === bb ? 'white' : 'var(--silver)',
                                                border: selectedBackbone === bb ? 'none' : '1px solid var(--border)',
                                            }}
                                        >
                                            {bb}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Canvas */}
                            <div className="rounded-xl overflow-hidden" style={{ background: '#f8f9fa', border: '1px solid var(--border)' }}>
                                <canvas
                                    ref={canvasRef}
                                    width={600}
                                    height={350}
                                    className="w-full"
                                    style={{ display: 'block' }}
                                />
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-2">
                                    {!templateSet ? (
                                        <button
                                            onClick={setTemplate}
                                            className="btn btn-primary flex items-center gap-2"
                                        >
                                            <Crosshair className="w-4 h-4" />
                                            Set Template
                                        </button>
                                    ) : !isTracking ? (
                                        <button
                                            onClick={startTracking}
                                            className="btn btn-primary flex items-center gap-2"
                                        >
                                            <Play className="w-4 h-4" />
                                            Start Tracking
                                        </button>
                                    ) : (
                                        <button
                                            onClick={stopTracking}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                                            style={{ background: '#EF4444', color: 'white' }}
                                        >
                                            <Square className="w-4 h-4" />
                                            Stop
                                        </button>
                                    )}
                                    <button
                                        onClick={resetTracking}
                                        className="btn btn-secondary flex items-center gap-2"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reset
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--silver)' }}>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        Frame {currentFrame}/{totalFrames}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <BarChart3 className="w-3.5 h-3.5" />
                                        {trackingPoints.length} tracked
                                    </span>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: isTracking ? '#10B981' : 'var(--sage)', width: `${(currentFrame / totalFrames) * 100}%` }}
                                    transition={{ duration: 0.1 }}
                                />
                            </div>
                        </div>

                        {/* Confidence Timeline */}
                        {trackingPoints.length > 5 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card card-bordered"
                                style={{ padding: 'var(--space-lg)' }}
                            >
                                <h3 className="font-semibold mb-3" style={{ color: 'var(--charcoal)' }}>
                                    <TrendingUp className="w-4 h-4 inline mr-2" style={{ color: 'var(--sage)' }} />
                                    Confidence Timeline
                                </h3>
                                <div className="flex items-end gap-px h-20">
                                    {trackingPoints.slice(-80).map((point, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 rounded-t"
                                            style={{
                                                height: `${point.confidence * 100}%`,
                                                background: point.confidence > 0.7
                                                    ? '#10B981'
                                                    : point.confidence > 0.5
                                                        ? '#F59E0B'
                                                        : '#EF4444',
                                                opacity: 0.7,
                                                minWidth: '2px',
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-1 text-xs" style={{ color: 'var(--silver)' }}>
                                    <span>Frame {Math.max(0, currentFrame - 80)}</span>
                                    <span>Frame {currentFrame}</span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Sidebar — Analysis */}
                    <div className="space-y-4">
                        {/* Backbone Info */}
                        <div className="card card-bordered" style={{ padding: 'var(--space-lg)' }}>
                            <h3 className="font-semibold mb-3" style={{ color: 'var(--charcoal)' }}>
                                <Layers className="w-4 h-4 inline mr-2" style={{ color: '#8B5CF6' }} />
                                {selectedBackbone === 'MixViT' ? 'MixViT-Large' : 'MixCvT-24W'}
                            </h3>
                            <div className="space-y-2 text-sm">
                                {(selectedBackbone === 'MixViT' ? [
                                    { label: 'Architecture', value: 'ViT-Large + MAM' },
                                    { label: 'Stages', value: '24 blocks' },
                                    { label: 'Embedding', value: '1024 dim' },
                                    { label: 'Heads', value: '16' },
                                    { label: 'Head Type', value: 'Pyramidal Corner' },
                                    { label: 'Init', value: 'MAE Pre-trained' },
                                ] : [
                                    { label: 'Architecture', value: 'CvT-24W + MAM' },
                                    { label: 'Stages', value: '3 (hierarchical)' },
                                    { label: 'Embedding', value: '512 dim' },
                                    { label: 'Heads', value: '8' },
                                    { label: 'Head Type', value: 'Query-Based' },
                                    { label: 'Init', value: 'ImageNet-22k' },
                                ]).map(item => (
                                    <div key={item.label} className="flex justify-between">
                                        <span style={{ color: 'var(--silver)' }}>{item.label}</span>
                                        <span className="font-medium" style={{ color: 'var(--charcoal)' }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tracking Stats */}
                        <div className="card card-bordered" style={{ padding: 'var(--space-lg)' }}>
                            <h3 className="font-semibold mb-3" style={{ color: 'var(--charcoal)' }}>
                                <Activity className="w-4 h-4 inline mr-2" style={{ color: '#3B82F6' }} />
                                Live Statistics
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    {
                                        label: 'Avg Confidence',
                                        value: trackingPoints.length > 0
                                            ? `${(trackingPoints.reduce((s, p) => s + p.confidence, 0) / trackingPoints.length * 100).toFixed(1)}%`
                                            : '—',
                                    },
                                    {
                                        label: 'Frames Tracked',
                                        value: trackingPoints.length.toString(),
                                    },
                                    {
                                        label: 'Size Change',
                                        value: `${evolution.sizeChange >= 0 ? '+' : ''}${evolution.sizeChange.toFixed(1)}%`,
                                    },
                                    {
                                        label: 'Growth Rate',
                                        value: `${evolution.growthRate.toFixed(3)}/f`,
                                    },
                                ].map(stat => (
                                    <div key={stat.label} className="text-center p-2 rounded-lg" style={{ background: 'var(--cream-dark)' }}>
                                        <div className="text-sm font-bold" style={{ color: 'var(--charcoal)' }}>{stat.value}</div>
                                        <div className="text-xs" style={{ color: 'var(--silver)' }}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Evolution Assessment */}
                        <AnimatePresence>
                            {trackingPoints.length > 10 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="card card-bordered"
                                    style={{ padding: 'var(--space-lg)' }}
                                >
                                    <h3 className="font-semibold mb-3" style={{ color: 'var(--charcoal)' }}>
                                        <Eye className="w-4 h-4 inline mr-2" style={{ color: riskColors[evolution.risk] }} />
                                        Evolution Assessment
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm" style={{ color: 'var(--silver)' }}>Morphology</span>
                                            <span className="pill text-xs" style={{
                                                background: `${riskColors[evolution.risk]}15`,
                                                color: riskColors[evolution.risk],
                                            }}>
                                                {evolution.morphology}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm" style={{ color: 'var(--silver)' }}>Risk Level</span>
                                            <span className="flex items-center gap-1 text-sm font-medium" style={{ color: riskColors[evolution.risk] }}>
                                                {evolution.risk === 'benign' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                                {evolution.risk.charAt(0).toUpperCase() + evolution.risk.slice(1)}
                                            </span>
                                        </div>
                                        <div className="text-xs p-2 rounded-lg" style={{
                                            background: `${riskColors[evolution.risk]}08`,
                                            color: 'var(--silver)',
                                        }}>
                                            {evolution.risk === 'benign' && '✅ No significant changes detected. Continue standard monitoring.'}
                                            {evolution.risk === 'monitor' && '📋 Mild changes detected. Routine follow-up in 4-6 weeks.'}
                                            {evolution.risk === 'suspicious' && '⚠️ Suspicious changes. Specialist review within 2 weeks.'}
                                            {evolution.risk === 'urgent' && '🚨 Urgent: Immediate clinical review required.'}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* MAM Architecture Info */}
                        <div className="card card-bordered" style={{ padding: 'var(--space-lg)' }}>
                            <h3 className="font-semibold mb-3" style={{ color: 'var(--charcoal)' }}>
                                <Zap className="w-4 h-4 inline mr-2" style={{ color: '#F59E0B' }} />
                                Mixed Attention Module
                            </h3>
                            <p className="text-xs mb-2" style={{ color: 'var(--silver)' }}>
                                Core innovation: Unifies feature extraction and target integration by simultaneously performing:
                            </p>
                            <ul className="space-y-1 text-xs" style={{ color: 'var(--silver)' }}>
                                <li>• Self-attention within template</li>
                                <li>• Self-attention within search region</li>
                                <li>• Cross-attention template → search</li>
                                <li>• Cross-attention search → template</li>
                            </ul>
                            <div className="mt-3 text-xs font-medium" style={{ color: '#EF4444' }}>
                                No post-processing (no NMS, no proposals)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
