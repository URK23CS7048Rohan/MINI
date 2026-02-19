'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Upload,
    Play,
    RotateCcw,
    MousePointer2,
    Sparkles,
    Clock,
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Crosshair,
    MapPin,
    Layers,
} from 'lucide-react';

interface QueryPoint {
    x: number;
    y: number;
    frame_idx: number;
    color: string;
}

interface TrajectoryPoint {
    x: number;
    y: number;
    visible: boolean;
    confidence: number;
}

interface Trajectory {
    query_point: { x: number; y: number; frame_idx: number };
    points: TrajectoryPoint[];
}

const POINT_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#14b8a6', '#f97316'];

export default function PointTrackingPage() {
    const [frames, setFrames] = useState<string[]>([]);
    const [frameSizes, setFrameSizes] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
    const [currentFrame, setCurrentFrame] = useState(0);
    const [queryPoints, setQueryPoints] = useState<QueryPoint[]>([]);
    const [trajectories, setTrajectories] = useState<Trajectory[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showTrails, setShowTrails] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingTime, setProcessingTime] = useState<number | null>(null);
    const [model, setModel] = useState<string | null>(null);
    const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        fetch('/api/cv')
            .then(r => r.json())
            .then(d => setBackendStatus(d.status === 'ok' ? 'online' : 'offline'))
            .catch(() => setBackendStatus('offline'));
    }, []);

    const handleFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files).slice(0, 30);
        const loadedFrames: string[] = [];

        fileArray.forEach((file, idx) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    if (idx === 0) setFrameSizes({ width: img.width, height: img.height });
                    loadedFrames[idx] = ev.target?.result as string;

                    if (loadedFrames.filter(Boolean).length === fileArray.length) {
                        setFrames(loadedFrames);
                        setCurrentFrame(0);
                        setQueryPoints([]);
                        setTrajectories([]);
                        setError(null);
                    }
                };
                img.src = ev.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current || frames.length === 0) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = frameSizes.width / rect.width;
        const scaleY = frameSizes.height / rect.height;

        const x = Math.round((e.clientX - rect.left) * scaleX);
        const y = Math.round((e.clientY - rect.top) * scaleY);

        const color = POINT_COLORS[queryPoints.length % POINT_COLORS.length];

        setQueryPoints(prev => [...prev, { x, y, frame_idx: currentFrame, color }]);
    };

    const runTracking = async () => {
        if (frames.length < 2 || queryPoints.length === 0) return;

        setIsProcessing(true);
        setError(null);

        try {
            const base64Frames = frames.map(f => f.split(',')[1]);
            const response = await fetch('/api/cv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'tapnet',
                    frames: base64Frames,
                    query_points: queryPoints.map(qp => ({
                        x: qp.x,
                        y: qp.y,
                        frame_idx: qp.frame_idx,
                    })),
                }),
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
                return;
            }

            setTrajectories(data.trajectories);
            setProcessingTime(data.processing_time_ms);
            setModel(data.model);
        } catch {
            setError('Failed to connect to CV backend');
        } finally {
            setIsProcessing(false);
        }
    };

    // Draw frame + overlays
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || frames.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Draw trajectory trails
            if (showTrails && trajectories.length > 0) {
                trajectories.forEach((traj, tIdx) => {
                    const color = queryPoints[tIdx]?.color || POINT_COLORS[tIdx % POINT_COLORS.length];

                    // Draw trail lines
                    ctx.beginPath();
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    ctx.globalAlpha = 0.6;

                    let started = false;
                    for (let f = 0; f <= currentFrame && f < traj.points.length; f++) {
                        const pt = traj.points[f];
                        if (pt.visible) {
                            if (!started) {
                                ctx.moveTo(pt.x, pt.y);
                                started = true;
                            } else {
                                ctx.lineTo(pt.x, pt.y);
                            }
                        }
                    }
                    ctx.stroke();
                    ctx.globalAlpha = 1;

                    // Draw current point
                    if (currentFrame < traj.points.length) {
                        const pt = traj.points[currentFrame];
                        if (pt.visible) {
                            ctx.beginPath();
                            ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
                            ctx.fillStyle = color;
                            ctx.fill();
                            ctx.strokeStyle = 'white';
                            ctx.lineWidth = 2;
                            ctx.stroke();

                            // Confidence label
                            ctx.font = 'bold 10px Inter';
                            ctx.fillStyle = 'white';
                            ctx.fillText(`${(pt.confidence * 100).toFixed(0)}%`, pt.x + 12, pt.y + 4);
                        } else {
                            ctx.beginPath();
                            ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
                            ctx.strokeStyle = color;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([3, 3]);
                            ctx.stroke();
                            ctx.setLineDash([]);
                        }
                    }
                });
            }

            // Draw query point markers on their source frame
            queryPoints.forEach((qp) => {
                if (qp.frame_idx === currentFrame && trajectories.length === 0) {
                    ctx.beginPath();
                    ctx.arc(qp.x, qp.y, 10, 0, Math.PI * 2);
                    ctx.fillStyle = qp.color;
                    ctx.globalAlpha = 0.6;
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Crosshair
                    ctx.beginPath();
                    ctx.moveTo(qp.x - 6, qp.y);
                    ctx.lineTo(qp.x + 6, qp.y);
                    ctx.moveTo(qp.x, qp.y - 6);
                    ctx.lineTo(qp.x, qp.y + 6);
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            });
        };
        img.src = frames[currentFrame];
    }, [frames, currentFrame, queryPoints, trajectories, showTrails]);

    return (
        <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
            <header className="px-6 py-4 flex items-center justify-between" style={{ background: 'var(--white)', borderBottom: '1px solid var(--mist)' }}>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="btn btn-icon btn-secondary">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="heading-serif text-2xl" style={{ color: 'var(--charcoal)' }}>Point Tracking</h1>
                        <p className="text-sm" style={{ color: 'var(--silver)' }}>TAPNet — Track anatomical points across video frames</p>
                    </div>
                </div>
                <span className={`pill text-xs ${backendStatus === 'online' ? 'pill-sage' : 'pill-coral'}`}>
                    {backendStatus === 'online' ? '● CV Backend Online' : backendStatus === 'checking' ? '◌ Checking...' : '○ Backend Offline'}
                </span>
            </header>

            <div className="p-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="card card-bordered" style={{ padding: 'var(--space-xl)' }}>
                            {frames.length === 0 ? (
                                <label className="flex flex-col items-center justify-center h-96 rounded-xl cursor-pointer transition-all hover:bg-cloud" style={{ border: '2px dashed var(--mist)' }}>
                                    <Upload className="w-12 h-12 mb-4" style={{ color: 'var(--silver)' }} />
                                    <span className="font-medium" style={{ color: 'var(--charcoal)' }}>Upload Video Frames</span>
                                    <span className="text-sm mt-1" style={{ color: 'var(--silver)' }}>Select 2-30 sequential frames (multi-select)</span>
                                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleFrameUpload} />
                                </label>
                            ) : (
                                <div>
                                    {/* Toolbar */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-mono" style={{ color: 'var(--charcoal)' }}>
                                                Frame {currentFrame + 1} / {frames.length}
                                            </span>
                                            <span className="pill pill-sage text-xs">{queryPoints.length} points</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => { setQueryPoints([]); setTrajectories([]); setError(null); }} className="btn btn-secondary btn-sm">
                                                <RotateCcw className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={runTracking}
                                                disabled={isProcessing || queryPoints.length === 0 || frames.length < 2}
                                                className="btn btn-primary btn-sm"
                                            >
                                                {isProcessing ? (
                                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 rounded-full" style={{ borderColor: 'transparent', borderTopColor: 'white' }} />
                                                ) : (
                                                    <Play className="w-4 h-4" />
                                                )}
                                                {isProcessing ? 'Tracking...' : 'Track Points'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Canvas */}
                                    <canvas
                                        ref={canvasRef}
                                        onClick={handleCanvasClick}
                                        className="w-full rounded-xl cursor-crosshair"
                                        style={{ maxHeight: '500px', objectFit: 'contain' }}
                                    />

                                    {/* Frame navigation */}
                                    <div className="flex items-center justify-center gap-4 mt-4">
                                        <button
                                            onClick={() => setCurrentFrame(f => Math.max(0, f - 1))}
                                            disabled={currentFrame === 0}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>

                                        <input
                                            type="range"
                                            min="0"
                                            max={frames.length - 1}
                                            value={currentFrame}
                                            onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
                                            className="w-48"
                                        />

                                        <button
                                            onClick={() => setCurrentFrame(f => Math.min(frames.length - 1, f + 1))}
                                            disabled={currentFrame === frames.length - 1}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="mt-4 p-4 rounded-xl flex items-start gap-3" style={{ background: 'var(--coral-light)' }}>
                                    <AlertCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--accent-secondary)' }} />
                                    <div>
                                        <div className="font-medium" style={{ color: 'var(--charcoal)' }}>Error</div>
                                        <div className="text-sm" style={{ color: 'var(--slate)' }}>{error}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Controls */}
                        <div className="card card-bordered" style={{ padding: 'var(--space-xl)' }}>
                            <h3 className="heading-serif text-lg mb-4" style={{ color: 'var(--charcoal)' }}>Controls</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm" style={{ color: 'var(--slate)' }}>Show Trails</span>
                                    <button
                                        onClick={() => setShowTrails(!showTrails)}
                                        className={`px-3 py-1 rounded-full text-xs ${showTrails ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        {showTrails ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Query Points List */}
                        <div className="card card-bordered" style={{ padding: 'var(--space-xl)' }}>
                            <h3 className="heading-serif text-lg mb-4" style={{ color: 'var(--charcoal)' }}>
                                Query Points ({queryPoints.length})
                            </h3>
                            {queryPoints.length === 0 ? (
                                <p className="text-sm" style={{ color: 'var(--silver)' }}>Click on a frame to place tracking points.</p>
                            ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {queryPoints.map((qp, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--cloud)' }}>
                                            <div className="w-3 h-3 rounded-full" style={{ background: qp.color }} />
                                            <span className="text-sm font-mono" style={{ color: 'var(--charcoal)' }}>({qp.x}, {qp.y})</span>
                                            <span className="text-xs ml-auto" style={{ color: 'var(--silver)' }}>F{qp.frame_idx + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Results */}
                        {trajectories.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card card-sage" style={{ padding: 'var(--space-xl)' }}>
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                                    <h3 className="heading-serif text-lg" style={{ color: 'var(--charcoal)' }}>Tracking Results</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm" style={{ color: 'var(--slate)' }}>Points Tracked</span>
                                        <span className="text-sm font-mono font-medium" style={{ color: 'var(--charcoal)' }}>{trajectories.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm" style={{ color: 'var(--slate)' }}>Frames</span>
                                        <span className="text-sm font-mono" style={{ color: 'var(--charcoal)' }}>{frames.length}</span>
                                    </div>
                                    {model && (
                                        <div className="flex justify-between">
                                            <span className="text-sm" style={{ color: 'var(--slate)' }}>Model</span>
                                            <span className="text-sm font-mono" style={{ color: 'var(--charcoal)' }}>{model}</span>
                                        </div>
                                    )}
                                    {processingTime && (
                                        <div className="flex justify-between">
                                            <span className="text-sm" style={{ color: 'var(--slate)' }}>Processing</span>
                                            <span className="text-sm font-mono" style={{ color: 'var(--charcoal)' }}>{processingTime.toFixed(0)}ms</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Info */}
                        <div className="card card-bordered" style={{ padding: 'var(--space-xl)' }}>
                            <h3 className="heading-serif text-lg mb-3" style={{ color: 'var(--charcoal)' }}>How It Works</h3>
                            <div className="space-y-2 text-sm" style={{ color: 'var(--slate)' }}>
                                <p>1. Upload sequential video frames</p>
                                <p>2. Click on points you want to track</p>
                                <p>3. Click &quot;Track Points&quot; to run TAPNet</p>
                                <p>4. Scrub through frames to see trajectories</p>
                                <p>Powered by <strong>TAPNet/TAPIR</strong> from the Supervisely ecosystem.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
