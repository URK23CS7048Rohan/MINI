'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Video,
    VideoOff,
    Mic,
    MicOff,
    Phone,
    MessageSquare,
    Users,
    Settings,
    Maximize,
    Minimize,
    ScreenShare,
    Camera,
    Volume2,
    VolumeX,
    MoreVertical,
    Send,
    Sparkles,
    ZoomIn,
    ZoomOut,
    Target,
    AlertCircle,
    CheckCircle,
    X,
    Radio
} from 'lucide-react';

interface Detection {
    id: number;
    label: string;
    confidence: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export default function ConsultationRoomPage({ params }: { params: { roomId: string } }) {
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isAIEnabled, setIsAIEnabled] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [autoZoom, setAutoZoom] = useState(true);
    const [message, setMessage] = useState('');
    const [callDuration, setCallDuration] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Simulated detections for demo
    const [detections, setDetections] = useState<Detection[]>([]);

    const chatMessages = [
        { id: 1, sender: 'Dr. Wilson', text: 'Patient is showing signs of inflammation in the affected area.', time: '10:32 AM' },
        { id: 2, sender: 'You', text: "I see. Let me zoom in on that region.", time: '10:33 AM' },
        { id: 3, sender: 'AI Assistant', text: 'Detected: Possible Dermatitis (87% confidence). Recommend closer examination.', time: '10:33 AM', isAI: true },
    ];

    // Initialize camera
    useEffect(() => {
        const initCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720, facingMode: 'user' },
                    audio: true
                });

                streamRef.current = stream;

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Simulate connection
                setTimeout(() => {
                    setIsConnecting(false);
                    setIsConnected(true);
                }, 2000);

            } catch (err) {
                console.error('Failed to access camera:', err);
                setIsConnecting(false);
            }
        };

        initCamera();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Call timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isConnected) {
            interval = setInterval(() => {
                setCallDuration(d => d + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isConnected]);

    // Simulated AI detection
    useEffect(() => {
        if (!isAIEnabled || !isConnected) return;

        const detectInterval = setInterval(() => {
            // Simulate random detections
            if (Math.random() > 0.7) {
                const newDetection: Detection = {
                    id: Date.now(),
                    label: ['Inflammation', 'Redness', 'Lesion', 'Rash'][Math.floor(Math.random() * 4)],
                    confidence: 0.75 + Math.random() * 0.2,
                    x: 100 + Math.random() * 400,
                    y: 100 + Math.random() * 200,
                    width: 80 + Math.random() * 60,
                    height: 60 + Math.random() * 40
                };

                setDetections(prev => [...prev.slice(-4), newDetection]);

                // Auto zoom on detection
                if (autoZoom && newDetection.confidence > 0.85) {
                    setZoomLevel(1.5);
                    setTimeout(() => setZoomLevel(1), 3000);
                }
            }
        }, 3000);

        return () => clearInterval(detectInterval);
    }, [isAIEnabled, isConnected, autoZoom]);

    // Draw detections on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        detections.forEach(det => {
            const hue = det.confidence > 0.85 ? 0 : det.confidence > 0.75 ? 45 : 120;
            ctx.strokeStyle = `hsl(${hue}, 80%, 50%)`;
            ctx.lineWidth = 2;
            ctx.strokeRect(det.x, det.y, det.width, det.height);

            ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
            ctx.fillRect(det.x, det.y - 20, ctx.measureText(`${det.label} ${(det.confidence * 100).toFixed(0)}%`).width + 10, 20);

            ctx.fillStyle = 'white';
            ctx.font = '12px Inter';
            ctx.fillText(`${det.label} ${(det.confidence * 100).toFixed(0)}%`, det.x + 5, det.y - 6);
        });
    }, [detections]);

    const toggleVideo = () => {
        if (streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOn(!isVideoOn);
            }
        }
    };

    const toggleAudio = () => {
        if (streamRef.current) {
            const audioTrack = streamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioOn(!isAudioOn);
            }
        }
    };

    const endCall = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        window.location.href = '/consultations';
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div
            className="h-screen flex flex-col overflow-hidden"
            style={{ background: '#0a0a0a' }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3 z-10"
                style={{ background: 'rgba(0,0,0,0.8)' }}
            >
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        {isConnected ? (
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        ) : (
                            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                        )}
                        <span className="text-white font-medium">
                            {isConnecting ? 'Connecting...' : 'Medical Consultation'}
                        </span>
                    </div>
                    {isConnected && (
                        <span className="text-white/60 font-mono">
                            {formatDuration(callDuration)}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsAIEnabled(!isAIEnabled)}
                        className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 transition-colors ${isAIEnabled ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/60'
                            }`}
                    >
                        <Sparkles className="w-4 h-4" />
                        AI Detection {isAIEnabled ? 'ON' : 'OFF'}
                    </button>
                    <button
                        onClick={() => setAutoZoom(!autoZoom)}
                        className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 transition-colors ${autoZoom ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/60'
                            }`}
                    >
                        <Target className="w-4 h-4" />
                        Auto-Zoom
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex relative">
                {/* Video Area */}
                <div className={`flex-1 relative ${isChatOpen ? 'lg:mr-80' : ''}`}>
                    {/* Remote Video (Main) */}
                    <div
                        className="absolute inset-0 flex items-center justify-center overflow-hidden"
                        style={{
                            transform: `scale(${zoomLevel})`,
                            transition: 'transform 0.5s ease-out'
                        }}
                    >
                        {isConnecting ? (
                            <div className="text-center text-white">
                                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                                <p>Connecting to consultation room...</p>
                            </div>
                        ) : (
                            <>
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                />
                                {/* AI Detection Canvas Overlay */}
                                {isAIEnabled && (
                                    <canvas
                                        ref={canvasRef}
                                        width={1280}
                                        height={720}
                                        className="absolute inset-0 w-full h-full pointer-events-none"
                                    />
                                )}
                            </>
                        )}
                    </div>

                    {/* Detection Alerts */}
                    <AnimatePresence>
                        {detections.length > 0 && isAIEnabled && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="absolute top-4 left-4 space-y-2 max-w-xs"
                            >
                                {detections.slice(-3).map((det) => (
                                    <div
                                        key={det.id}
                                        className="p-3 rounded-lg backdrop-blur-md flex items-center gap-3"
                                        style={{
                                            background: det.confidence > 0.85
                                                ? 'rgba(239, 68, 68, 0.8)'
                                                : 'rgba(0,0,0,0.6)'
                                        }}
                                    >
                                        <AlertCircle className="w-5 h-5 text-white" />
                                        <div className="text-white">
                                            <div className="font-medium text-sm">{det.label}</div>
                                            <div className="text-xs opacity-80">
                                                {(det.confidence * 100).toFixed(0)}% confidence
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Zoom Controls */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button
                            onClick={() => setZoomLevel(z => Math.min(z + 0.25, 3))}
                            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70"
                        >
                            <ZoomIn className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setZoomLevel(z => Math.max(z - 0.25, 1))}
                            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70"
                        >
                            <ZoomOut className="w-5 h-5" />
                        </button>
                        <div className="text-white text-xs text-center bg-black/50 rounded-full px-2 py-1">
                            {(zoomLevel * 100).toFixed(0)}%
                        </div>
                    </div>

                    {/* Local Video (PiP) */}
                    <div className="absolute bottom-24 right-4 w-48 aspect-video rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        {!isVideoOn && (
                            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                                <VideoOff className="w-8 h-8 text-white/50" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Sidebar */}
                <AnimatePresence>
                    {isChatOpen && (
                        <motion.div
                            initial={{ x: 320 }}
                            animate={{ x: 0 }}
                            exit={{ x: 320 }}
                            className="absolute right-0 top-0 bottom-0 w-80 flex flex-col"
                            style={{ background: 'rgba(0,0,0,0.9)' }}
                        >
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <h3 className="text-white font-medium">Chat</h3>
                                <button onClick={() => setIsChatOpen(false)}>
                                    <X className="w-5 h-5 text-white/60" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {chatMessages.map((msg) => (
                                    <div key={msg.id} className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-medium ${msg.isAI ? 'text-green-400' : 'text-white/80'}`}>
                                                {msg.sender}
                                            </span>
                                            <span className="text-xs text-white/40">{msg.time}</span>
                                        </div>
                                        <p className={`text-sm ${msg.isAI ? 'text-green-300 bg-green-500/10 p-2 rounded-lg' : 'text-white/70'}`}>
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
                                        placeholder="Type a message..."
                                        className="flex-1 bg-white/10 rounded-full px-4 py-2 text-white text-sm outline-none"
                                    />
                                    <button className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                        <Send className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls Bar */}
            <div
                className="flex items-center justify-center gap-4 py-4 z-10"
                style={{ background: 'rgba(0,0,0,0.8)' }}
            >
                <button
                    onClick={toggleAudio}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isAudioOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500'
                        }`}
                >
                    {isAudioOn ? (
                        <Mic className="w-5 h-5 text-white" />
                    ) : (
                        <MicOff className="w-5 h-5 text-white" />
                    )}
                </button>

                <button
                    onClick={toggleVideo}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isVideoOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500'
                        }`}
                >
                    {isVideoOn ? (
                        <Video className="w-5 h-5 text-white" />
                    ) : (
                        <VideoOff className="w-5 h-5 text-white" />
                    )}
                </button>

                <button
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isScreenSharing ? 'bg-green-500' : 'bg-white/10 hover:bg-white/20'
                        }`}
                >
                    <ScreenShare className="w-5 h-5 text-white" />
                </button>

                <button
                    onClick={endCall}
                    className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
                >
                    <Phone className="w-6 h-6 text-white rotate-[135deg]" />
                </button>

                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isChatOpen ? 'bg-green-500' : 'bg-white/10 hover:bg-white/20'
                        }`}
                >
                    <MessageSquare className="w-5 h-5 text-white" />
                </button>

                <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                </button>

                <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                </button>
            </div>
        </div>
    );
}
