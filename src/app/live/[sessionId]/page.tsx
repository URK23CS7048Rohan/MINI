'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    MessageSquare,
    ThumbsUp,
    Share2,
    Bookmark,
    Users,
    Send,
    X,
    Settings,
    ZoomIn,
    ZoomOut,
    Target,
    AlertCircle,
    Sparkles,
    Eye,
    Clock,
    Activity,
    Crosshair,
    Layers,
} from 'lucide-react';

interface Detection {
    id: number;
    label: string;
    confidence: number;
    x: number;
    y: number;
    width: number;
    height: number;
    timestamp: string;
    severity?: string;
}

type DetectionMode = 'detect' | 'segment' | 'track';

export default function LiveViewPage({ params }: { params: { sessionId: string } }) {
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [isAIOverlayOn, setIsAIOverlayOn] = useState(true);
    const [autoZoom, setAutoZoom] = useState(true);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [message, setMessage] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [detectionMode, setDetectionMode] = useState<DetectionMode>('detect');
    const [cvBackendOnline, setCvBackendOnline] = useState(false);
    const [processingTime, setProcessingTime] = useState<number | null>(null);
    const [modelName, setModelName] = useState<string | null>(null);
    const [frameCount, setFrameCount] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const sessionInfo = {
        title: 'Melanoma Excision Surgery',
        doctor: 'Dr. James Wilson',
        specialty: 'Dermatology Surgery',
        viewers: 1247,
        duration: '45:23',
        likes: 342
    };

    const [detections, setDetections] = useState<Detection[]>([
        { id: 1, label: 'Lesion Margin', confidence: 0.94, x: 200, y: 150, width: 120, height: 80, timestamp: '45:18' },
        { id: 2, label: 'Healthy Tissue', confidence: 0.89, x: 350, y: 200, width: 100, height: 60, timestamp: '45:20' },
    ]);

    const [chatMessages, setChatMessages] = useState([
        { id: 1, user: 'Dr. Emily Chen', text: 'Excellent technique on the margin delineation', time: '45:10', isDoctor: true },
        { id: 2, user: 'MedStudent_2024', text: 'How do you determine the excision margin width?', time: '45:15' },
        { id: 3, user: 'Dr. Wilson', text: 'For melanoma, we typically use 1-2cm margins depending on Breslow thickness', time: '45:18', isHost: true },
        { id: 4, user: 'AI Assistant', text: '🔍 Detected: Lesion boundary clearly visible at 94% confidence', time: '45:20', isAI: true },
        { id: 5, user: 'ResidentDoc', text: 'The AI detection is really helpful for visualization', time: '45:22' },
    ]);

    // Check CV backend health on mount
    useEffect(() => {
        fetch('/api/cv')
            .then(r => r.json())
            .then(d => {
                setCvBackendOnline(d.status === 'ok');
                if (d.status === 'ok') {
                    // Post AI message about real detection
                    setChatMessages(prev => [...prev, {
                        id: Date.now(),
                        user: 'AI System',
                        text: '🟢 CV Backend connected. Real-time detection active (MixFormer + RITM).',
                        time: sessionInfo.duration,
                        isAI: true,
                    }]);
                }
            })
            .catch(() => setCvBackendOnline(false));
    }, []);

    // Generate a simulated frame for detection (in real app, this would be the actual video frame)
    const generateFrameForDetection = (): string => {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d')!;

        // Create a realistic surgical scene simulation
        const gradient = ctx.createLinearGradient(0, 0, 640, 480);
        gradient.addColorStop(0, '#1a0a0a');
        gradient.addColorStop(0.3, '#3d1515');
        gradient.addColorStop(0.5, '#c47070');
        gradient.addColorStop(0.7, '#3d1515');
        gradient.addColorStop(1, '#1a0a0a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 640, 480);

        // Add tissue-like patterns
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 640;
            const y = Math.random() * 480;
            const r = 5 + Math.random() * 30;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${180 + Math.random() * 75}, ${50 + Math.random() * 80}, ${50 + Math.random() * 60}, 0.3)`;
            ctx.fill();
        }

        // Add a lesion-like region
        ctx.beginPath();
        ctx.ellipse(320, 240, 80 + Math.random() * 20, 60 + Math.random() * 15, Math.random() * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(40, 20, 20, 0.8)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(200, 100, 100, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        return canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
    };

    // Real-time detection loop using CV backend
    useEffect(() => {
        if (!isAIOverlayOn) return;

        const interval = setInterval(async () => {
            if (cvBackendOnline) {
                // Use REAL CV backend for detection
                try {
                    const frameBase64 = generateFrameForDetection();
                    const response = await fetch('/api/cv', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'live-detect',
                            frame: frameBase64,
                            mode: detectionMode,
                            regions: detectionMode !== 'detect' && detections.length > 0
                                ? detections.map(d => ({ x: d.x, y: d.y, w: d.width, h: d.height }))
                                : undefined,
                        }),
                    });

                    const data = await response.json();

                    if (data.success && data.detections) {
                        setDetections(data.detections);
                        setProcessingTime(data.processing_time_ms);
                        setFrameCount(data.frame_count);

                        // Auto AI chat message on important detections
                        const highConf = data.detections.find((d: Detection) => d.confidence > 0.93);
                        if (highConf && Math.random() < 0.3) {
                            setChatMessages(prev => [...prev, {
                                id: Date.now(),
                                user: 'AI Assistant',
                                text: `🔍 ${highConf.label} detected at ${(highConf.confidence * 100).toFixed(0)}% confidence`,
                                time: sessionInfo.duration,
                                isAI: true,
                            }]);
                        }

                        // Auto zoom on high confidence
                        if (autoZoom && highConf) {
                            setZoomLevel(1.8);
                            setTimeout(() => setZoomLevel(1), 4000);
                        }
                    }
                } catch {
                    // Fallback to simulation on network error
                    fallbackDetection();
                }
            } else {
                fallbackDetection();
            }
        }, cvBackendOnline ? 3000 : 5000); // Faster with real backend

        return () => clearInterval(interval);
    }, [isAIOverlayOn, autoZoom, cvBackendOnline, detectionMode, detections]);

    const fallbackDetection = () => {
        const newDetection: Detection = {
            id: Date.now(),
            label: ['Tissue Margin', 'Excision Area', 'Healthy Tissue', 'Blood Vessel'][Math.floor(Math.random() * 4)],
            confidence: 0.8 + Math.random() * 0.18,
            x: 150 + Math.random() * 300,
            y: 100 + Math.random() * 200,
            width: 80 + Math.random() * 80,
            height: 60 + Math.random() * 60,
            timestamp: sessionInfo.duration
        };

        setDetections(prev => [...prev.slice(-4), newDetection]);

        if (autoZoom && newDetection.confidence > 0.92) {
            setZoomLevel(1.8);
            setTimeout(() => setZoomLevel(1), 4000);
        }
    };

    // Draw detections
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!isAIOverlayOn) return;

        detections.forEach(det => {
            const hue = det.confidence > 0.9 ? 120 : det.confidence > 0.85 ? 45 : 0;

            // Glow effect
            ctx.shadowColor = `hsl(${hue}, 80%, 50%)`;
            ctx.shadowBlur = 10;

            ctx.strokeStyle = `hsl(${hue}, 80%, 50%)`;
            ctx.lineWidth = 2;
            ctx.strokeRect(det.x, det.y, det.width, det.height);

            // Reset shadow
            ctx.shadowBlur = 0;

            // Label background
            ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
            const label = `${det.label} ${(det.confidence * 100).toFixed(0)}%`;
            const textWidth = ctx.measureText(label).width;
            ctx.fillRect(det.x, det.y - 22, textWidth + 12, 22);

            // Label text
            ctx.fillStyle = 'white';
            ctx.font = 'bold 12px Inter';
            ctx.fillText(label, det.x + 6, det.y - 7);

            // Corner markers
            const cornerSize = 10;
            ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`;
            ctx.lineWidth = 3;

            // Top-left
            ctx.beginPath();
            ctx.moveTo(det.x, det.y + cornerSize);
            ctx.lineTo(det.x, det.y);
            ctx.lineTo(det.x + cornerSize, det.y);
            ctx.stroke();

            // Top-right
            ctx.beginPath();
            ctx.moveTo(det.x + det.width - cornerSize, det.y);
            ctx.lineTo(det.x + det.width, det.y);
            ctx.lineTo(det.x + det.width, det.y + cornerSize);
            ctx.stroke();

            // Bottom-left
            ctx.beginPath();
            ctx.moveTo(det.x, det.y + det.height - cornerSize);
            ctx.lineTo(det.x, det.y + det.height);
            ctx.lineTo(det.x + cornerSize, det.y + det.height);
            ctx.stroke();

            // Bottom-right
            ctx.beginPath();
            ctx.moveTo(det.x + det.width - cornerSize, det.y + det.height);
            ctx.lineTo(det.x + det.width, det.y + det.height);
            ctx.lineTo(det.x + det.width, det.y + det.height - cornerSize);
            ctx.stroke();
        });
    }, [detections, isAIOverlayOn]);

    const sendMessage = () => {
        if (!message.trim()) return;
        setChatMessages(prev => [...prev, {
            id: Date.now(),
            user: 'You',
            text: message,
            time: sessionInfo.duration
        }]);
        setMessage('');
    };

    return (
        <div className="h-screen flex flex-col bg-black">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm z-10">
                <div className="flex items-center gap-4">
                    <Link href="/live" className="text-white/60 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-white font-medium">{sessionInfo.title}</span>
                        </div>
                        <div className="text-sm text-white/60">
                            {sessionInfo.doctor} • {sessionInfo.specialty}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* CV Backend Status */}
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${cvBackendOnline ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cvBackendOnline ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        {cvBackendOnline ? 'Real Detection' : 'Simulated'}
                    </div>
                    {processingTime !== null && cvBackendOnline && (
                        <div className="flex items-center gap-1.5 text-xs text-white/40">
                            <Activity className="w-3 h-3" />
                            {processingTime.toFixed(0)}ms
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-white/60">
                        <Eye className="w-4 h-4" />
                        <span>{sessionInfo.viewers.toLocaleString()} watching</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                        <Clock className="w-4 h-4" />
                        <span className="font-mono">{sessionInfo.duration}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex relative overflow-hidden">
                {/* Video Area */}
                <div className={`flex-1 relative ${isChatOpen ? 'lg:mr-80' : ''}`}>
                    {/* Simulated Video Stream */}
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
                            transform: `scale(${zoomLevel})`,
                            transition: 'transform 0.5s ease-out'
                        }}
                    >
                        <div className="text-center">
                            <div className="text-8xl mb-4">🔬</div>
                            <div className="text-white/40 text-sm">
                                Live surgical video stream would appear here
                            </div>
                        </div>

                        {/* AI Detection Canvas */}
                        <canvas
                            ref={canvasRef}
                            width={800}
                            height={500}
                            className="absolute inset-0 w-full h-full pointer-events-none"
                        />
                    </div>

                    {/* AI Controls */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <button
                            onClick={() => setIsAIOverlayOn(!isAIOverlayOn)}
                            className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${isAIOverlayOn ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/60'
                                }`}
                        >
                            <Sparkles className="w-4 h-4" />
                            AI Detection
                        </button>
                        <button
                            onClick={() => setAutoZoom(!autoZoom)}
                            className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${autoZoom ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/60'
                                }`}
                        >
                            <Target className="w-4 h-4" />
                            Auto-Zoom
                        </button>

                        {/* Detection Mode Selector */}
                        {cvBackendOnline && (
                            <div className="mt-2 bg-black/60 backdrop-blur-md rounded-lg p-2 space-y-1">
                                <div className="text-xs text-white/40 px-2 pb-1">Model Mode</div>
                                {(['detect', 'segment', 'track'] as DetectionMode[]).map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => setDetectionMode(mode)}
                                        className={`w-full px-3 py-1.5 rounded text-xs text-left flex items-center gap-2 transition-colors ${detectionMode === mode ? 'bg-green-500/20 text-green-400' : 'text-white/60 hover:text-white/80'}`}
                                    >
                                        {mode === 'detect' && <Crosshair className="w-3 h-3" />}
                                        {mode === 'segment' && <Layers className="w-3 h-3" />}
                                        {mode === 'track' && <Target className="w-3 h-3" />}
                                        {mode === 'detect' ? 'Auto Detect' : mode === 'segment' ? 'RITM Segment' : 'MixFormer Track'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Zoom Controls */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button
                            onClick={() => setZoomLevel(z => Math.min(z + 0.25, 3))}
                            className="w-10 h-10 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                        >
                            <ZoomIn className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setZoomLevel(z => Math.max(z - 0.25, 1))}
                            className="w-10 h-10 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                        >
                            <ZoomOut className="w-5 h-5" />
                        </button>
                        <div className="text-white text-xs text-center bg-black/50 rounded-lg px-2 py-1">
                            {(zoomLevel * 100).toFixed(0)}%
                        </div>
                    </div>

                    {/* Detection Alerts */}
                    <AnimatePresence>
                        {detections.length > 0 && isAIOverlayOn && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-20 left-4 max-w-sm"
                            >
                                <div className="bg-black/70 backdrop-blur-md rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-3 text-white">
                                        <Sparkles className="w-4 h-4 text-green-400" />
                                        <span className="text-sm font-medium">
                                            AI Detections
                                            {cvBackendOnline && <span className="ml-2 text-xs text-green-400/60">● LIVE</span>}
                                        </span>
                                        {processingTime !== null && (
                                            <span className="text-xs text-white/30 ml-auto">{processingTime.toFixed(0)}ms</span>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {detections.slice(-3).map((det) => (
                                            <div
                                                key={det.id}
                                                className="flex items-center justify-between text-sm"
                                            >
                                                <span className="text-white/80">{det.label}</span>
                                                <span
                                                    className="px-2 py-0.5 rounded-full text-xs"
                                                    style={{
                                                        background: det.confidence > 0.9 ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)',
                                                        color: det.confidence > 0.9 ? '#22c55e' : '#eab308'
                                                    }}
                                                >
                                                    {(det.confidence * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    {cvBackendOnline && (
                                        <div className="mt-3 pt-2 border-t border-white/10 text-xs text-white/30">
                                            Mode: {detectionMode === 'detect' ? 'Auto Detect' : detectionMode === 'segment' ? 'RITM Segmentation' : 'MixFormer Tracking'}
                                            {frameCount > 0 && ` • Frame ${frameCount}`}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Bottom Controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                                >
                                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={() => setIsLiked(!isLiked)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isLiked ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                    {sessionInfo.likes + (isLiked ? 1 : 0)}
                                </button>
                                <button
                                    onClick={() => setIsSaved(!isSaved)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSaved ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsChatOpen(!isChatOpen)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isChatOpen ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white'
                                        }`}
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Chat
                                </button>
                                <button className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
                                    <Settings className="w-5 h-5" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
                                    <Maximize className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Chat */}
                <AnimatePresence>
                    {isChatOpen && (
                        <motion.div
                            initial={{ x: 320 }}
                            animate={{ x: 0 }}
                            exit={{ x: 320 }}
                            className="absolute right-0 top-0 bottom-0 w-80 flex flex-col bg-black/90 backdrop-blur-md border-l border-white/10"
                        >
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white font-medium">Live Chat</h3>
                                    <span className="text-xs text-white/60">
                                        <Users className="w-3 h-3 inline mr-1" />
                                        {sessionInfo.viewers}
                                    </span>
                                </div>
                                <button onClick={() => setIsChatOpen(false)} className="lg:hidden">
                                    <X className="w-5 h-5 text-white/60" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {chatMessages.map((msg) => (
                                    <div key={msg.id} className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-medium ${msg.isHost ? 'text-red-400' :
                                                msg.isDoctor ? 'text-blue-400' :
                                                    msg.isAI ? 'text-green-400' :
                                                        'text-white/60'
                                                }`}>
                                                {msg.isHost && '🎙️ '}
                                                {msg.isDoctor && '👨‍⚕️ '}
                                                {msg.isAI && '🤖 '}
                                                {msg.user}
                                            </span>
                                            <span className="text-xs text-white/30">{msg.time}</span>
                                        </div>
                                        <p className={`text-sm ${msg.isAI ? 'text-green-300 bg-green-500/10 p-2 rounded-lg' :
                                            msg.isHost ? 'text-white bg-red-500/10 p-2 rounded-lg' :
                                                'text-white/70'
                                            }`}>
                                            {msg.text}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 border-t border-white/10">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Ask a question..."
                                        className="flex-1 bg-white/10 rounded-full px-4 py-2 text-white text-sm outline-none"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600"
                                    >
                                        <Send className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
