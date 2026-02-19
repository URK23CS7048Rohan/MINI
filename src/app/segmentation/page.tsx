'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Upload,
    MousePointer2,
    Eraser,
    Download,
    RotateCcw,
    Layers,
    Eye,
    EyeOff,
    Sparkles,
    Clock,
    AlertCircle,
    CheckCircle2,
    ZoomIn,
    ZoomOut,
    Crosshair,
    Activity,
} from 'lucide-react';

interface Click {
    x: number;
    y: number;
    is_positive: boolean;
}

interface SegmentationResult {
    mask: string;
    boundary: string;
    area_pixels: number;
    area_percent: number;
    model: string;
    processing_time_ms: number;
}

export default function SegmentationPage() {
    const [image, setImage] = useState<string | null>(null);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [clicks, setClicks] = useState<Click[]>([]);
    const [clickMode, setClickMode] = useState<'positive' | 'negative'>('positive');
    const [result, setResult] = useState<SegmentationResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showMask, setShowMask] = useState(true);
    const [showBoundary, setShowBoundary] = useState(true);
    const [maskOpacity, setMaskOpacity] = useState(0.5);
    const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Check backend health
    useEffect(() => {
        fetch('/api/cv')
            .then(r => r.json())
            .then(d => setBackendStatus(d.status === 'ok' ? 'online' : 'offline'))
            .catch(() => setBackendStatus('offline'));
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                setImageSize({ width: img.width, height: img.height });
                setImage(ev.target?.result as string);
                setClicks([]);
                setResult(null);
                setError(null);
            };
            img.src = ev.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = imageSize.width / rect.width;
        const scaleY = imageSize.height / rect.height;

        const x = Math.round((e.clientX - rect.left) * scaleX);
        const y = Math.round((e.clientY - rect.top) * scaleY);

        const newClick: Click = { x, y, is_positive: clickMode === 'positive' };
        const newClicks = [...clicks, newClick];
        setClicks(newClicks);

        // Auto-segment on every click
        runSegmentation(newClicks);
    }, [image, imageSize, clickMode, clicks]);

    const runSegmentation = async (clickList: Click[]) => {
        if (!image || clickList.length === 0) return;

        setIsProcessing(true);
        setError(null);

        try {
            const base64 = image.split(',')[1];
            const response = await fetch('/api/cv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'ritm',
                    image: base64,
                    clicks: clickList,
                }),
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
                return;
            }

            setResult(data);
        } catch (err) {
            setError('Failed to connect to CV backend');
        } finally {
            setIsProcessing(false);
        }
    };

    // Draw overlays on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !image) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Draw mask overlay
            if (result && showMask) {
                const maskImg = new Image();
                maskImg.onload = () => {
                    ctx.globalAlpha = maskOpacity;
                    ctx.fillStyle = '#22c55e';

                    // Create a temp canvas to process mask
                    const tmpCanvas = document.createElement('canvas');
                    tmpCanvas.width = img.width;
                    tmpCanvas.height = img.height;
                    const tmpCtx = tmpCanvas.getContext('2d')!;
                    tmpCtx.drawImage(maskImg, 0, 0, img.width, img.height);
                    const maskData = tmpCtx.getImageData(0, 0, img.width, img.height);

                    // Overlay green where mask is white
                    const imageData = ctx.getImageData(0, 0, img.width, img.height);
                    for (let i = 0; i < maskData.data.length; i += 4) {
                        if (maskData.data[i] > 128) {
                            imageData.data[i] = Math.min(255, imageData.data[i] + 60);
                            imageData.data[i + 1] = Math.min(255, imageData.data[i + 1] + 100);
                            imageData.data[i + 2] = Math.min(255, imageData.data[i + 2] + 30);
                        }
                    }
                    ctx.putImageData(imageData, 0, 0);
                    ctx.globalAlpha = 1;

                    drawClickMarkers(ctx);
                };
                maskImg.src = `data:image/png;base64,${result.mask}`;
            } else {
                drawClickMarkers(ctx);
            }

            // Draw boundary
            if (result && showBoundary) {
                const boundImg = new Image();
                boundImg.onload = () => {
                    ctx.globalAlpha = 0.8;
                    ctx.globalCompositeOperation = 'source-over';

                    const tmpCanvas = document.createElement('canvas');
                    tmpCanvas.width = img.width;
                    tmpCanvas.height = img.height;
                    const tmpCtx = tmpCanvas.getContext('2d')!;
                    tmpCtx.drawImage(boundImg, 0, 0, img.width, img.height);
                    const bData = tmpCtx.getImageData(0, 0, img.width, img.height);

                    for (let i = 0; i < bData.data.length; i += 4) {
                        if (bData.data[i] > 128) {
                            const px = (i / 4) % img.width;
                            const py = Math.floor((i / 4) / img.width);
                            ctx.fillStyle = '#f59e0b';
                            ctx.fillRect(px, py, 2, 2);
                        }
                    }
                    ctx.globalAlpha = 1;
                };
                boundImg.src = `data:image/png;base64,${result.boundary}`;
            }
        };
        img.src = image;
    }, [image, result, showMask, showBoundary, maskOpacity, clicks]);

    const drawClickMarkers = (ctx: CanvasRenderingContext2D) => {
        clicks.forEach((click, i) => {
            ctx.beginPath();
            ctx.arc(click.x, click.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = click.is_positive ? '#22c55e' : '#ef4444';
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Cross marker
            ctx.beginPath();
            ctx.moveTo(click.x - 4, click.y);
            ctx.lineTo(click.x + 4, click.y);
            ctx.moveTo(click.x, click.y - 4);
            ctx.lineTo(click.x, click.y + 4);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    };

    const handleReset = () => {
        setClicks([]);
        setResult(null);
        setError(null);
    };

    const handleDownloadMask = () => {
        if (!result) return;
        const link = document.createElement('a');
        link.download = 'segmentation_mask.png';
        link.href = `data:image/png;base64,${result.mask}`;
        link.click();
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between" style={{ background: 'var(--white)', borderBottom: '1px solid var(--mist)' }}>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="btn btn-icon btn-secondary">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="heading-serif text-2xl" style={{ color: 'var(--charcoal)' }}>
                            Interactive Segmentation
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--silver)' }}>
                            RITM — Click to segment regions in medical images
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`pill text-xs ${backendStatus === 'online' ? 'pill-sage' : 'pill-coral'}`}>
                        {backendStatus === 'online' ? '● CV Backend Online' : backendStatus === 'checking' ? '◌ Checking...' : '○ Backend Offline'}
                    </span>
                </div>
            </header>

            <div className="p-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Canvas Area */}
                    <div className="lg:col-span-2">
                        <div className="card card-bordered" style={{ padding: 'var(--space-xl)' }}>
                            {!image ? (
                                <label className="flex flex-col items-center justify-center h-96 rounded-xl cursor-pointer transition-all hover:bg-cloud" style={{ border: '2px dashed var(--mist)' }}>
                                    <Upload className="w-12 h-12 mb-4" style={{ color: 'var(--silver)' }} />
                                    <span className="font-medium" style={{ color: 'var(--charcoal)' }}>Upload Medical Image</span>
                                    <span className="text-sm mt-1" style={{ color: 'var(--silver)' }}>Click or drag an image to begin segmentation</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            ) : (
                                <div ref={containerRef} className="relative">
                                    {/* Toolbar */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setClickMode('positive')}
                                                className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-all ${clickMode === 'positive' ? 'font-medium' : ''}`}
                                                style={{
                                                    background: clickMode === 'positive' ? 'var(--sage-light)' : 'var(--cloud)',
                                                    color: clickMode === 'positive' ? 'var(--accent-primary)' : 'var(--slate)',
                                                }}
                                            >
                                                <MousePointer2 className="w-4 h-4" />
                                                Include
                                            </button>
                                            <button
                                                onClick={() => setClickMode('negative')}
                                                className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-all ${clickMode === 'negative' ? 'font-medium' : ''}`}
                                                style={{
                                                    background: clickMode === 'negative' ? 'var(--coral-light)' : 'var(--cloud)',
                                                    color: clickMode === 'negative' ? 'var(--accent-secondary)' : 'var(--slate)',
                                                }}
                                            >
                                                <Eraser className="w-4 h-4" />
                                                Exclude
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={handleReset} className="btn btn-secondary btn-sm" title="Reset">
                                                <RotateCcw className="w-4 h-4" />
                                            </button>
                                            <button onClick={handleDownloadMask} disabled={!result} className="btn btn-secondary btn-sm" title="Download mask">
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <label className="btn btn-primary btn-sm cursor-pointer">
                                                <Upload className="w-4 h-4" />
                                                New Image
                                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Canvas */}
                                    <canvas
                                        ref={canvasRef}
                                        onClick={handleCanvasClick}
                                        className="w-full rounded-xl cursor-crosshair"
                                        style={{ maxHeight: '600px', objectFit: 'contain' }}
                                    />

                                    {/* Processing indicator */}
                                    <AnimatePresence>
                                        {isProcessing && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 flex items-center justify-center rounded-xl"
                                                style={{ background: 'rgba(0,0,0,0.3)' }}
                                            >
                                                <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                        className="w-6 h-6 border-3 rounded-full"
                                                        style={{ borderColor: 'var(--sage-light)', borderTopColor: 'var(--sage)' }}
                                                    />
                                                    <span className="font-medium" style={{ color: 'var(--charcoal)' }}>Segmenting...</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Click hint */}
                                    {clicks.length === 0 && (
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm" style={{ background: 'rgba(0,0,0,0.7)', color: 'white' }}>
                                            <Crosshair className="w-4 h-4 inline mr-2" />
                                            Click on the image to segment a region
                                        </div>
                                    )}
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
                        {/* Overlay Controls */}
                        <div className="card card-bordered" style={{ padding: 'var(--space-xl)' }}>
                            <h3 className="heading-serif text-lg mb-4" style={{ color: 'var(--charcoal)' }}>Overlay Controls</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm" style={{ color: 'var(--slate)' }}>Show Mask</span>
                                    <button onClick={() => setShowMask(!showMask)}>
                                        {showMask ? <Eye className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} /> : <EyeOff className="w-5 h-5" style={{ color: 'var(--silver)' }} />}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm" style={{ color: 'var(--slate)' }}>Show Boundary</span>
                                    <button onClick={() => setShowBoundary(!showBoundary)}>
                                        {showBoundary ? <Eye className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} /> : <EyeOff className="w-5 h-5" style={{ color: 'var(--silver)' }} />}
                                    </button>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm" style={{ color: 'var(--slate)' }}>Mask Opacity</span>
                                        <span className="text-sm font-mono" style={{ color: 'var(--charcoal)' }}>{Math.round(maskOpacity * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={maskOpacity}
                                        onChange={(e) => setMaskOpacity(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Click History */}
                        <div className="card card-bordered" style={{ padding: 'var(--space-xl)' }}>
                            <h3 className="heading-serif text-lg mb-4" style={{ color: 'var(--charcoal)' }}>
                                Clicks ({clicks.length})
                            </h3>

                            {clicks.length === 0 ? (
                                <p className="text-sm" style={{ color: 'var(--silver)' }}>No clicks yet. Upload an image and click to segment.</p>
                            ) : (
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {clicks.map((click, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--cloud)' }}>
                                            <div className="w-3 h-3 rounded-full" style={{ background: click.is_positive ? '#22c55e' : '#ef4444' }} />
                                            <span className="text-sm font-mono" style={{ color: 'var(--charcoal)' }}>({click.x}, {click.y})</span>
                                            <span className="text-xs ml-auto" style={{ color: 'var(--silver)' }}>{click.is_positive ? 'Include' : 'Exclude'}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Results */}
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card card-sage"
                                style={{ padding: 'var(--space-xl)' }}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                                    <h3 className="heading-serif text-lg" style={{ color: 'var(--charcoal)' }}>Segmentation Result</h3>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm" style={{ color: 'var(--slate)' }}>Area</span>
                                        <span className="text-sm font-mono font-medium" style={{ color: 'var(--charcoal)' }}>{result.area_percent}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm" style={{ color: 'var(--slate)' }}>Pixels</span>
                                        <span className="text-sm font-mono" style={{ color: 'var(--charcoal)' }}>{result.area_pixels.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm" style={{ color: 'var(--slate)' }}>Model</span>
                                        <span className="text-sm font-mono" style={{ color: 'var(--charcoal)' }}>{result.model}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm" style={{ color: 'var(--slate)' }}>Processing</span>
                                        <span className="text-sm font-mono" style={{ color: 'var(--charcoal)' }}>{result.processing_time_ms}ms</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Info */}
                        <div className="card card-bordered" style={{ padding: 'var(--space-xl)' }}>
                            <h3 className="heading-serif text-lg mb-3" style={{ color: 'var(--charcoal)' }}>How It Works</h3>
                            <div className="space-y-2 text-sm" style={{ color: 'var(--slate)' }}>
                                <p>🟢 <strong>Green clicks</strong> — include this region</p>
                                <p>🔴 <strong>Red clicks</strong> — exclude this region</p>
                                <p>Powered by <strong>RITM</strong> (HRNet18) from the Supervisely ecosystem for interactive medical image segmentation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
