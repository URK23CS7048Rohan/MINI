'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Scan,
    Upload,
    Camera,
    ArrowLeft,
    Brain,
    Heart,
    Eye,
    Activity,
    Sparkles,
    CheckCircle,
    AlertTriangle,
    X,
    Loader2,
    RefreshCw
} from 'lucide-react';

interface Detection {
    class: string;
    confidence: number;
    x: number;
    y: number;
    width: number;
    height: number;
    description?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
}

interface DetectionResult {
    predictions: Detection[];
    image: {
        width: number;
        height: number;
    };
    usingRealAI?: boolean;
    metadata?: {
        totalDetections: number;
        highConfidenceCount: number;
    };
}

const models = [
    {
        id: 'skin',
        name: 'Skin Disease Detection',
        icon: Heart,
        description: 'Melanoma, Psoriasis, Eczema, etc.',
        accuracy: '98.5%',
        roboflowModel: 'skin-disease-detection-fxdwk',
        roboflowVersion: '1'
    },
    {
        id: 'xray',
        name: 'Chest X-Ray Analysis',
        icon: Scan,
        description: 'COVID-19, Pneumonia, TB detection',
        accuracy: '97.2%',
        roboflowModel: 'chest-xray-classification',
        roboflowVersion: '1'
    },
    {
        id: 'eye',
        name: 'Eye Disease Screening',
        icon: Eye,
        description: 'Diabetic Retinopathy, Glaucoma',
        accuracy: '96.8%',
        roboflowModel: 'eye-disease-detection',
        roboflowVersion: '1'
    },
    {
        id: 'ecg',
        name: 'ECG Analysis',
        icon: Activity,
        description: 'Arrhythmia, Heart conditions',
        accuracy: '95.5%',
        roboflowModel: 'ecg-classification',
        roboflowVersion: '1'
    },
];

export default function DetectionPage() {
    const [selectedModel, setSelectedModel] = useState('skin');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [detectionResults, setDetectionResults] = useState<Detection[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (JPG, PNG)');
            return;
        }

        setError(null);
        setDetectionResults(null);
        setOriginalFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            setUploadedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    const runDetection = async () => {
        if (!uploadedImage || !originalFile) return;

        setIsAnalyzing(true);
        setError(null);
        setDetectionResults(null);

        try {
            // Convert image to base64 for API
            const base64Image = uploadedImage.split(',')[1];

            // Call our API route
            const response = await fetch('/api/detection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Image,
                    model: selectedModel,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Detection failed');
            }

            setDetectionResults(data.predictions || []);

            // Draw bounding boxes on canvas
            if (data.predictions && data.predictions.length > 0) {
                drawDetections(data.predictions);
            }
        } catch (err) {
            console.error('Detection error:', err);
            setError(err instanceof Error ? err.message : 'Detection failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const drawDetections = (predictions: Detection[]) => {
        const canvas = canvasRef.current;
        const image = imageRef.current;
        if (!canvas || !image) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Wait for image to be fully rendered
        const displayWidth = image.clientWidth;
        const displayHeight = image.clientHeight;

        if (displayWidth === 0 || displayHeight === 0) {
            setTimeout(() => drawDetections(predictions), 100);
            return;
        }

        // Set canvas size to exactly match the displayed image
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        // Calculate scale factors from API coordinates (640x480) to displayed size
        const API_WIDTH = 640;
        const API_HEIGHT = 480;
        const scaleX = displayWidth / API_WIDTH;
        const scaleY = displayHeight / API_HEIGHT;

        // Clear previous drawings
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw bounding boxes
        predictions.forEach((pred) => {
            // Convert from center coordinates to top-left
            const x = (pred.x - pred.width / 2) * scaleX;
            const y = (pred.y - pred.height / 2) * scaleY;
            const width = pred.width * scaleX;
            const height = pred.height * scaleY;

            // Clamp to canvas bounds
            const clampedX = Math.max(0, Math.min(x, displayWidth - width));
            const clampedY = Math.max(0, Math.min(y, displayHeight - height));
            const clampedWidth = Math.min(width, displayWidth - clampedX);
            const clampedHeight = Math.min(height, displayHeight - clampedY);

            // Box color based on confidence
            const hue = pred.confidence > 0.8 ? 120 : pred.confidence > 0.5 ? 45 : 0;
            ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
            ctx.lineWidth = 3;
            ctx.strokeRect(clampedX, clampedY, clampedWidth, clampedHeight);

            // Label background
            const label = `${pred.class} ${(pred.confidence * 100).toFixed(1)}%`;
            ctx.font = 'bold 12px Inter, sans-serif';
            const textWidth = ctx.measureText(label).width;
            const labelX = Math.max(0, Math.min(clampedX, displayWidth - textWidth - 10));
            const labelY = Math.max(20, clampedY);

            ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
            ctx.fillRect(labelX, labelY - 18, textWidth + 8, 18);

            // Label text
            ctx.fillStyle = 'white';
            ctx.fillText(label, labelX + 4, labelY - 5);
        });
    };

    const clearImage = () => {
        setUploadedImage(null);
        setOriginalFile(null);
        setDetectionResults(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getSeverityColor = (severity?: string, confidence?: number) => {
        if (severity === 'critical') return { bg: '#FEE2E2', text: '#DC2626', label: 'Critical' };
        if (severity === 'high') return { bg: 'var(--coral-light)', text: 'var(--accent-secondary)', label: 'High' };
        if (severity === 'medium') return { bg: 'var(--peach)', text: 'var(--charcoal)', label: 'Medium' };
        if (severity === 'low') return { bg: 'var(--sage-light)', text: 'var(--accent-primary)', label: 'Low' };
        // Fallback based on confidence
        if (confidence && confidence > 0.8) return { bg: 'var(--coral-light)', text: 'var(--accent-secondary)', label: 'High' };
        if (confidence && confidence > 0.5) return { bg: 'var(--peach)', text: 'var(--charcoal)', label: 'Medium' };
        return { bg: 'var(--sage-light)', text: 'var(--accent-primary)', label: 'Low' };
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
                        <h1 className="heading-serif text-2xl lg:text-3xl" style={{ color: 'var(--charcoal)' }}>
                            AI Detection
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--silver)' }}>
                            Upload medical images for YOLO-powered analysis
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Model Selection */}
                    <div className="lg:col-span-1 space-y-3">
                        <h2 className="text-label mb-4">Select Model</h2>
                        {models.map((model) => (
                            <motion.button
                                key={model.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    setSelectedModel(model.id);
                                    setDetectionResults(null);
                                }}
                                className="w-full text-left card hover-lift"
                                style={{
                                    padding: 'var(--space-lg)',
                                    background: selectedModel === model.id ? 'var(--sage-light)' : 'var(--white)',
                                    border: selectedModel === model.id ? '2px solid var(--sage)' : '1px solid var(--mist)'
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    <model.icon
                                        className="w-6 h-6 mt-1"
                                        style={{ color: selectedModel === model.id ? 'var(--accent-primary)' : 'var(--silver)' }}
                                    />
                                    <div>
                                        <div className="font-medium" style={{ color: 'var(--charcoal)' }}>
                                            {model.name}
                                        </div>
                                        <div className="text-sm" style={{ color: 'var(--silver)' }}>
                                            {model.description}
                                        </div>
                                        <div className="text-xs mt-1 font-mono" style={{ color: 'var(--accent-primary)' }}>
                                            {model.accuracy} accuracy
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Upload & Results Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Upload Zone */}
                        <div
                            className="card card-bordered relative"
                            style={{ padding: 'var(--space-xl)', minHeight: '400px' }}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileSelect(file);
                                }}
                            />

                            <AnimatePresence mode="wait">
                                {!uploadedImage ? (
                                    <motion.div
                                        key="upload"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col items-center justify-center text-center"
                                    >
                                        <motion.div
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                                            style={{ background: 'var(--sage-light)' }}
                                        >
                                            <Upload className="w-10 h-10" style={{ color: 'var(--accent-primary)' }} />
                                        </motion.div>

                                        <h3 className="heading-serif text-xl mb-2" style={{ color: 'var(--charcoal)' }}>
                                            Upload Medical Image
                                        </h3>
                                        <p className="text-body mb-6 max-w-md">
                                            Drag and drop an image here, or click to browse.
                                            Supported formats: JPG, PNG
                                        </p>

                                        <div className="flex gap-3">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Upload className="w-4 h-4" />
                                                Upload Image
                                            </button>
                                            <button className="btn btn-secondary">
                                                <Camera className="w-4 h-4" />
                                                Use Camera
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="preview"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-4"
                                    >
                                        {/* Image Preview with Canvas Overlay */}
                                        <div className="relative flex justify-center">
                                            <div className="relative inline-block">
                                                <img
                                                    ref={imageRef}
                                                    src={uploadedImage}
                                                    alt="Uploaded medical image"
                                                    className="max-w-full max-h-[400px] object-contain rounded-xl"
                                                    onLoad={() => {
                                                        // Clear any previous drawings
                                                        const canvas = canvasRef.current;
                                                        if (canvas) {
                                                            const ctx = canvas.getContext('2d');
                                                            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                                                        }
                                                        if (detectionResults && detectionResults.length > 0) {
                                                            setTimeout(() => drawDetections(detectionResults), 100);
                                                        }
                                                    }}
                                                />
                                                <canvas
                                                    ref={canvasRef}
                                                    className="absolute top-0 left-0 pointer-events-none"
                                                />

                                                {/* Clear button */}
                                                <button
                                                    onClick={clearImage}
                                                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10"
                                                    style={{ background: 'rgba(0,0,0,0.5)' }}
                                                >
                                                    <X className="w-4 h-4 text-white" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 justify-center">
                                            <button
                                                onClick={runDetection}
                                                disabled={isAnalyzing}
                                                className="btn btn-primary"
                                            >
                                                {isAnalyzing ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Analyzing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-4 h-4" />
                                                        Run AI Detection
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="btn btn-secondary"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                                Change Image
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="mt-4 p-4 rounded-xl flex items-center gap-3"
                                        style={{ background: 'var(--coral-light)' }}
                                    >
                                        <AlertTriangle className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} />
                                        <span style={{ color: 'var(--accent-secondary)' }}>{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Detection Results */}
                        <AnimatePresence>
                            {detectionResults && detectionResults.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="card card-sage"
                                    style={{ padding: 'var(--space-xl)' }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <CheckCircle className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                                        <h3 className="heading-serif text-lg" style={{ color: 'var(--charcoal)' }}>
                                            Detection Results
                                        </h3>
                                        <span className="pill pill-default text-xs">
                                            {detectionResults.length} found
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {detectionResults.map((result, i) => {
                                            const colors = getSeverityColor(result.severity, result.confidence);
                                            return (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="p-4 rounded-xl"
                                                    style={{ background: 'var(--white)' }}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium text-lg" style={{ color: 'var(--charcoal)' }}>
                                                                {result.class}
                                                            </div>
                                                            <div className="text-sm" style={{ color: 'var(--silver)' }}>
                                                                Detected at position ({Math.round(result.x)}, {Math.round(result.y)})
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="px-4 py-2 rounded-full font-mono font-medium"
                                                            style={{ background: colors.bg, color: colors.text }}
                                                        >
                                                            {(result.confidence * 100).toFixed(1)}%
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    <p className="text-sm mt-4" style={{ color: 'var(--slate)' }}>
                                        <strong>Note:</strong> This is an AI-assisted analysis. Please consult with a healthcare
                                        professional for accurate diagnosis and treatment recommendations.
                                    </p>
                                </motion.div>
                            )}

                            {detectionResults && detectionResults.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="card card-bordered text-center"
                                    style={{ padding: 'var(--space-xl)' }}
                                >
                                    <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--sage)' }} />
                                    <h3 className="heading-serif text-lg mb-2" style={{ color: 'var(--charcoal)' }}>
                                        No Conditions Detected
                                    </h3>
                                    <p className="text-body">
                                        The AI analysis did not detect any conditions in this image.
                                        This does not rule out the need for professional medical evaluation.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

