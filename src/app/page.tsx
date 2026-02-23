'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowRight,
    Star,
    Check,
    Play,
    Heart,
    Brain,
    Scan,
    Video,
    FileText,
    Shield,
    Globe,
    Sparkles,
    ChevronRight,
    Clock,
    Users,
    Activity,
    Zap,
    Award,
    CheckCircle,
    ArrowUpRight,
    Menu,
    X
} from 'lucide-react';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
};

const blurInUp = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
};

const skewUp = {
    hidden: { opacity: 0, y: 50, skewY: 3 },
    visible: {
        opacity: 1,
        y: 0,
        skewY: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
};

const textRevealStagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

export default function Home() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    // Parallax scroll effects for the hero content
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
    const heroOpacity = useTransform(scrollY, [200, 800], [1, 0]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen overflow-x-hidden relative" style={{ background: 'var(--cream)' }}>
            {/* Clean Neo-Brutalist Dotted Grid Background */}
            <div
                className="fixed inset-0 pointer-events-none z-[-1]"
                style={{
                    backgroundImage: 'radial-gradient(var(--mist) 1.5px, transparent 1.5px)',
                    backgroundSize: '24px 24px',
                }}
            />

            {/* Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 w-full z-50 flex items-center justify-between px-4 lg:px-8 py-4 transition-all duration-200 ${isScrolled ? 'bg-cream border-b-4 border-charcoal' : 'bg-transparent'}`}
            >
                <Link href="/" className="font-bold text-2xl uppercase tracking-tighter flex items-center gap-1">
                    <span className="bg-charcoal text-white px-2 py-0.5 border-2 border-charcoal">MEDI</span>
                    <span className="text-charcoal bg-sage px-2 py-0.5 border-2 border-charcoal">VISION</span>
                </Link>

                <div className="hidden lg:flex items-center gap-8 font-bold uppercase tracking-wider text-sm">
                    <Link href="#features" className="hover:text-sage transition-colors">Features</Link>
                    <Link href="#models" className="hover:text-sage transition-colors">AI Models</Link>
                    <Link href="#collaboration" className="hover:text-sage transition-colors">Collaboration</Link>
                    <Link href="#pricing" className="hover:text-sage transition-colors">Pricing</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden sm:flex font-bold uppercase tracking-wider text-sm hover:underline decoration-2 underline-offset-4">
                        Sign In
                    </Link>
                    <Link href="/login?register=true" className="brutalist-button py-2 px-4 text-sm flex items-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </Link>
                    <button
                        className="lg:hidden brutalist-border bg-white p-2"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu className="w-5 h-5 stroke-[3]" />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-cream z-50 p-8 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span className="nav-logo font-display text-2xl">MediVision</span>
                            <button onClick={() => setMobileMenuOpen(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-6 text-2xl font-medium">
                            <Link href="#features" onClick={() => setMobileMenuOpen(false)}>Features</Link>
                            <Link href="#models" onClick={() => setMobileMenuOpen(false)}>AI Models</Link>
                            <Link href="#collaboration" onClick={() => setMobileMenuOpen(false)}>Collaboration</Link>
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section - Neo-Brutalist Redesign */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 z-10">

                {/* Infinite Marquee Top */}
                <div className="w-full relative overflow-hidden bg-charcoal text-white py-3 border-y-4 border-charcoal transform -rotate-2 scale-105 z-20 shadow-2xl">
                    <div className="flex whitespace-nowrap animate-marquee">
                        <span className="text-xl font-bold uppercase tracking-widest mx-4">✦ REAL-TIME DIAGNOSTICS ✦ AI CO-PILOT ✦ SURGERY STREAMING ✦ MULTI-AGENT ANALYSIS ✦ 98.5% ACCURACY</span>
                        <span className="text-xl font-bold uppercase tracking-widest mx-4">✦ REAL-TIME DIAGNOSTICS ✦ AI CO-PILOT ✦ SURGERY STREAMING ✦ MULTI-AGENT ANALYSIS ✦ 98.5% ACCURACY</span>
                    </div>
                </div>

                <div className="container max-w-7xl mx-auto px-4 mt-16 relative z-10">
                    <motion.div style={{ y: heroY, opacity: heroOpacity }} className="w-full">
                        <motion.div
                            variants={textRevealStagger}
                            initial="hidden"
                            animate="visible"
                            className="max-w-6xl mx-auto"
                        >
                            <h1 className="text-[11vw] lg:text-[120px] xl:text-[140px] leading-[0.85] font-bold uppercase tracking-tighter mb-6 lg:mb-10 flex flex-wrap gap-x-4 lg:gap-x-8 gap-y-1 items-end justify-start">
                                <span className="text-reveal-mask inline-block overflow-hidden"><motion.span variants={skewUp} className="inline-block text-charcoal">CREATE.</motion.span></span>
                                <span className="text-reveal-mask inline-block overflow-hidden"><motion.span variants={skewUp} className="inline-block text-transparent" style={{ WebkitTextStroke: 'max(2px, 0.2vw) var(--charcoal)' }}>DIAGNOSE.</motion.span></span>
                                <div className="w-full h-0 hidden md:block lg:hidden"></div>
                                <span className="text-reveal-mask inline-flex overflow-hidden items-center"><motion.span variants={skewUp} className="inline-block text-sage bg-charcoal px-3 py-1 lg:px-4 lg:py-2 leading-none mt-1 lg:mt-2">HEAL.</motion.span></span>
                                <span className="text-reveal-mask inline-block overflow-hidden"><motion.span variants={skewUp} className="inline-block text-charcoal">TOGETHER.</motion.span></span>
                            </h1>

                            {/* Subtitle Bar */}
                            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between border-t-4 border-charcoal pt-8 mb-16">
                                <motion.p variants={blurInUp} className="text-xl md:text-2xl font-medium max-w-2xl text-charcoal uppercase tracking-wide">
                                    The future of clinical collaboration. Real-time AI diagnostics & intelligent documentation that transforms every consultation.
                                </motion.p>

                                {/* CTA Buttons */}
                                <motion.div variants={blurInUp} className="flex gap-4 shrink-0">
                                    <Link href="/dashboard" className="brutalist-button flex items-center gap-2">
                                        <Play className="w-5 h-5 fill-current" />
                                        Start Trial
                                    </Link>
                                    <Link href="#demo" className="brutalist-button-outline hidden sm:flex items-center gap-2">
                                        Demo
                                        <ArrowUpRight className="w-5 h-5" />
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Stats Row - Brutalist Cards */}
                            <motion.div
                                variants={fadeInUp}
                                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                            >
                                {[
                                    { value: '25+', label: 'AI Models', color: 'bg-sage' },
                                    { value: '98.5%', label: 'Accuracy', color: 'bg-lavender' },
                                    { value: '50K+', label: 'Consults', color: 'bg-sky' },
                                    { value: '30+', label: 'Languages', color: 'bg-coral-light' }
                                ].map((stat, i) => (
                                    <div key={i} className={`brutalist-border ${stat.color} p-6 flex flex-col justify-between hover:bg-charcoal hover:text-white transition-colors cursor-pointer min-h-[160px]`}>
                                        <div className="text-5xl md:text-6xl font-bold tracking-tighter">{stat.value}</div>
                                        <div className="text-sm font-bold uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Infinite Marquee Bottom */}
                <div className="w-full absolute bottom-[-50px] overflow-hidden bg-charcoal text-white py-3 border-y-4 border-charcoal transform rotate-2 scale-105 z-0">
                    <div className="flex whitespace-nowrap animate-marquee" style={{ animationDirection: 'reverse' }}>
                        <span className="text-xl font-bold uppercase tracking-widest mx-4">✦ NEXT-GEN HEALTHCARE ✦ SEAMLESS INTEGRATION ✦ SECURE DATA ✦ NEXT-GEN HEALTHCARE ✦ SEAMLESS INTEGRATION ✦ </span>
                        <span className="text-xl font-bold uppercase tracking-widest mx-4">✦ NEXT-GEN HEALTHCARE ✦ SEAMLESS INTEGRATION ✦ SECURE DATA ✦ NEXT-GEN HEALTHCARE ✦ SEAMLESS INTEGRATION ✦ </span>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="scroll-indicator"
                >
                    <span className="text-label">Scroll</span>
                    <div className="scroll-line" />
                </motion.div>
            </section>

            {/* Marquee Ticker */}
            <section className="py-xl border-y border-mist bg-white/50 mt-24 lg:mt-32 relative z-20">
                <div className="marquee-container">
                    <div className="marquee-content">
                        {[
                            { icon: Heart, text: 'Dermatology' },
                            { icon: Brain, text: 'Neurology' },
                            { icon: Scan, text: 'Radiology' },
                            { icon: Activity, text: 'Cardiology' },
                            { icon: Shield, text: 'HIPAA Compliant' },
                            { icon: Globe, text: '30+ Languages' },
                            { icon: Zap, text: 'Real-time AI' },
                            { icon: Award, text: 'FDA Cleared' },
                            { icon: Heart, text: 'Dermatology' },
                            { icon: Brain, text: 'Neurology' },
                            { icon: Scan, text: 'Radiology' },
                            { icon: Activity, text: 'Cardiology' },
                            { icon: Shield, text: 'HIPAA Compliant' },
                            { icon: Globe, text: '30+ Languages' },
                        ].map((item, i) => (
                            <span key={i} className="marquee-item">
                                <item.icon className="w-4 h-4" />
                                {item.text}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Liquid Canvas Features Section */}
            <section id="features" className="py-32 px-4 lg:px-8 bg-cream">
                <div className="w-full max-w-[1400px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="mb-24 flex flex-col md:flex-row justify-between items-end border-b-4 border-charcoal pb-8"
                    >
                        <div>
                            <motion.span variants={fadeInUp} className="text-sm font-mono tracking-widest uppercase mb-4 block text-charcoal/70">
                                [SYS.01] Platform Features
                            </motion.span>
                            <motion.h2 variants={fadeInUp} className="text-[8vw] lg:text-[6rem] leading-none font-bold uppercase tracking-tighter max-w-4xl">
                                Fluid
                                <br />
                                <span className="text-transparent" style={{ WebkitTextStroke: 'max(2px, 0.2vw) var(--charcoal)' }}>Intelligence</span>
                            </motion.h2>
                        </div>
                        <motion.p variants={fadeInUp} className="font-mono text-charcoal/50 text-right mt-8 md:mt-0 uppercase text-xs tracking-widest max-w-[200px]">
                            Hover to explore our adaptive ecosystem.
                        </motion.p>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative items-start">
                        {/* Left: Minimalist List (40%) */}
                        <div className="w-full lg:w-2/5 flex flex-col gap-0 lg:border-t-4 border-charcoal relative z-10">
                            {[
                                { title: "Real-Time AI Detection", subtitle: "25+ specialized YOLO models." },
                                { title: "Auto SOAP Notes", subtitle: "Real-time transcription & integration." },
                                { title: "Clinical Co-Pilot", subtitle: "Dynamic multi-agent diagnosis." },
                                { title: "HD Video Consults", subtitle: "Crystal-clear telemedicine." },
                                { title: "HIPAA Secure", subtitle: "End-to-end encryption & logging." },
                                { title: "30+ Languages", subtitle: "Real-time translation for global access." }
                            ].map((feat, i) => (
                                <div
                                    key={i}
                                    onMouseEnter={() => setActiveFeature(i)}
                                    className={`py-8 cursor-pointer border-b-2 border-charcoal/10 transition-all duration-300 flex flex-col justify-center ${activeFeature === i ? 'opacity-100 pl-4 border-b-charcoal' : 'opacity-40 hover:opacity-70'}`}
                                >
                                    <div className="font-mono text-xs font-bold tracking-widest mb-2 transition-colors">
                                        [0{i + 1}]
                                    </div>
                                    <h3 className="text-4xl lg:text-5xl font-bold uppercase tracking-tighter leading-none mb-3">
                                        {feat.title}
                                    </h3>
                                    <div className={`overflow-hidden transition-all duration-500 ${activeFeature === i ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <p className="font-mono text-sm uppercase tracking-wider text-charcoal/70">{feat.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right: Liquid Canvas (60%) */}
                        <div className="w-full lg:w-3/5 h-[400px] lg:h-[600px] sticky top-32 brutalist-border overflow-hidden bg-charcoal transition-colors duration-700">
                            <AnimatePresence mode="wait">
                                {[
                                    { icon: Scan, color: "var(--sage)", light: "white", title: "VISION", image: "https://images.unsplash.com/photo-1576091160550-2173ff9e5fab?auto=format&fit=crop&q=80&w=1200" },
                                    { icon: FileText, color: "var(--sky)", light: "white", title: "NOTES", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" },
                                    { icon: Brain, color: "var(--lavender)", light: "white", title: "BRAIN", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200" },
                                    { icon: Video, color: "var(--coral-light)", light: "white", title: "VIDEO", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200" },
                                    { icon: Shield, color: "#444444", light: "white", title: "SECURE", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200" },
                                    { icon: Globe, color: "var(--sage)", light: "white", title: "GLOBAL", image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&q=80&w=1200" }
                                ].map((canvas, i) => activeFeature === i && (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0 z-0 overflow-hidden bg-charcoal group/canvas"
                                    >
                                        {/* Real Image Background */}
                                        <motion.img
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            src={canvas.image}
                                            alt={canvas.title}
                                            className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-40 group-hover/canvas:grayscale-0 group-hover/canvas:opacity-80 transition-all duration-1000"
                                        />

                                        {/* Fluid Mesh Gradient BG Overlay */}
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                rotate: [0, 90, 180, 270, 360],
                                                borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "60% 40% 30% 70% / 60% 30% 70% 40%", "30% 70% 70% 30% / 30% 30% 70% 70%"]
                                            }}
                                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                            className="absolute w-[150%] h-[150%] opacity-60 blur-[60px] mix-blend-overlay pointer-events-none"
                                            style={{
                                                background: `radial-gradient(circle, ${canvas.color} 0%, ${canvas.light} 40%, transparent 70%)`
                                            }}
                                        />

                                        {/* HUD Technical Overlay */}
                                        <div className="absolute inset-0 flex border-t-[40px] border-b-[40px] border-transparent flex-col justify-between p-8 pointer-events-none">

                                            {/* Data Readout Top */}
                                            <div className="flex justify-between items-start opacity-70">
                                                <div className="font-mono text-xs text-white uppercase tracking-widest border border-white/20 px-2 py-1 backdrop-blur-sm bg-black/20">
                                                    [SYS.{String(i + 1).padStart(2, '0')}]
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                            </div>

                                            {/* Foreground Focus Icon & Label Row */}
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0, x: -20 }}
                                                animate={{ scale: 1, opacity: 1, x: 0 }}
                                                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                                                className="flex justify-between items-end"
                                            >
                                                <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md border border-white/20 p-4 brutalist-border">
                                                    <canvas.icon className="w-8 h-8 lg:w-10 lg:h-10 text-white stroke-[2]" />
                                                    <div>
                                                        <div className="text-xs text-white/50 font-mono tracking-widest uppercase mb-1">MODULE</div>
                                                        <div className="font-bold text-lg lg:text-2xl text-white uppercase tracking-tighter leading-none">{canvas.title}</div>
                                                    </div>
                                                </div>

                                                {/* Crosshairs Bottom Right */}
                                                <div className="w-16 h-16 border-b-2 border-r-2 border-white/40 group-hover/canvas:border-white transition-colors"></div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Models Section */}
            <section id="models" className="py-32 px-4 border-y-4 border-charcoal bg-charcoal text-white relative z-10 w-full overflow-hidden">
                <div className="container max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid lg:grid-cols-2 gap-16 items-start"
                    >
                        {/* Left Content - Technical Specs */}
                        <motion.div variants={fadeInUp} className="relative">
                            <div className="absolute -left-4 md:-left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-sage to-transparent"></div>
                            <span className="font-mono text-sm tracking-widest uppercase mb-6 block text-sage flex items-center gap-4">
                                <Activity className="w-4 h-4 animate-pulse" />
                                [SYS.02] Neural Vision Hub // ACTIVE
                            </span>
                            <h2 className="text-[9vw] lg:text-7xl leading-none font-bold uppercase tracking-tighter mb-8">
                                Powered by
                                <br />
                                25+ YOLO <span className="text-sage">Models</span>
                            </h2>
                            <p className="text-lg font-mono mb-12 text-white/70 max-w-lg border-l-2 border-white/20 pl-4">
                                &gt; INITIALIZING COMPUTER VISION PROTOCOLS...<br />
                                &gt; TRAINING_SET: 5.2M CLINICAL IMAGES<br />
                                &gt; AVG_LATENCY: 12ms<br />
                                &gt; STATUS: CONTINUOUS LEARNING ACTIVE
                            </p>

                            <ul className="space-y-6 mb-12 font-mono text-sm">
                                {[
                                    { label: 'Skin Disease Detection', specs: 'Melanoma, Psoriasis // ACC: 98.2%' },
                                    { label: 'Chest X-Ray Analysis', specs: 'COVID-19, TB // ACC: 99.1%' },
                                    { label: 'Ophthalmology Screening', specs: 'Diabetic Retinopathy // ACC: 97.5%' },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 border-b border-white/10 pb-4">
                                        <div className="mt-1">
                                            <div className="w-3 h-3 bg-sage"></div>
                                        </div>
                                        <div>
                                            <div className="text-white font-bold uppercase tracking-wider mb-1">{item.label}</div>
                                            <div className="text-white/50">{item.specs}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/dashboard" className="group flex items-center gap-4 font-mono text-sm uppercase tracking-widest text-sage hover:text-white transition-colors">
                                <span className="border-b border-sage group-hover:border-white transition-colors pb-1">Deploy Inference Engine</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        {/* Right Content - Severe Grid Terminals */}
                        <motion.div
                            variants={fadeInUp}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {[
                                { name: 'Dermatology', count: '8 ACTIVE MODELS', hover: 'group-hover:bg-sage group-hover:text-charcoal group-hover:border-sage', icon: Heart },
                                { name: 'Radiology', count: '5 ACTIVE MODELS', hover: 'group-hover:bg-sky group-hover:text-charcoal group-hover:border-sky', icon: Scan },
                                { name: 'Ophthalmology', count: '4 ACTIVE MODELS', hover: 'group-hover:bg-lavender group-hover:text-charcoal group-hover:border-lavender', icon: Brain },
                                { name: 'Cardiology', count: '3 ACTIVE MODELS', hover: 'group-hover:bg-coral-light group-hover:text-charcoal group-hover:border-coral-light', icon: Activity },
                            ].map((category, i) => (
                                <motion.div
                                    key={i}
                                    className={`group relative border-2 border-white/20 p-8 min-h-[280px] flex flex-col justify-between transition-all duration-300 ${category.hover}`}
                                >
                                    {/* Crosshair corners */}
                                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/40 group-hover:border-transparent transition-colors"></div>
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/40 group-hover:border-transparent transition-colors"></div>
                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/40 group-hover:border-transparent transition-colors"></div>
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/40 group-hover:border-transparent transition-colors"></div>

                                    <div className="flex justify-between items-start">
                                        <category.icon className="w-8 h-8 text-white/50 group-hover:text-charcoal transition-colors stroke-[1.5]" />
                                        <span className="font-mono text-[10px] tracking-widest text-white/30 group-hover:text-charcoal/50">NODE_0{i + 1}</span>
                                    </div>

                                    <div>
                                        <div className="font-mono text-xs mb-3 text-white/50 group-hover:text-charcoal/70 tracking-widest">{category.count}</div>
                                        <h4 className="font-bold text-2xl uppercase tracking-wider text-white group-hover:text-charcoal transition-colors">{category.name}</h4>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Collaboration Section - Stark Table Architecture */}
            <section id="collaboration" className="py-32 px-4 lg:px-8 border-t-4 border-charcoal bg-cream">
                <div className="w-full max-w-[1400px] mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b-4 border-charcoal pb-8"
                    >
                        <div>
                            <motion.span variants={fadeInUp} className="font-mono text-sm tracking-widest uppercase mb-4 block text-charcoal/70">
                                [SYS.03] Connect & Collaborate
                            </motion.span>
                            <motion.h2 variants={fadeInUp} className="text-[8vw] lg:text-7xl leading-none font-bold uppercase tracking-tighter max-w-4xl">
                                Global
                                <br />
                                <span className="text-transparent" style={{ WebkitTextStroke: 'max(2px, 0.2vw) var(--charcoal)' }}>Expertise</span>
                            </motion.h2>
                        </div>
                        <motion.p variants={fadeInUp} className="font-mono text-charcoal/50 text-right mt-8 md:mt-0 uppercase text-xs tracking-widest max-w-[250px]">
                            Join live surgeries and participate in real-time complex case discussions worldwide.
                        </motion.p>
                    </motion.div>

                    {/* Massive Kinetic Table */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="w-full flex flex-col"
                    >
                        {[
                            {
                                num: '01',
                                title: 'Live Surgery Streams',
                                desc: 'Watch procedures by expert surgeons with real-time AI annotations and multi-lingual Q&A.',
                                action: 'TUNE IN',
                                hoverBg: 'hover:bg-sage text-charcoal'
                            },
                            {
                                num: '02',
                                title: 'Case Discussions',
                                desc: 'Collaborate on complex cases. Share findings, AI-generated SOAP notes, and treatment plans.',
                                action: 'JOIN ROOM',
                                hoverBg: 'hover:bg-sky text-charcoal'
                            },
                            {
                                num: '03',
                                title: 'CME Credits',
                                desc: 'Earn continuing medical education credits by learning from verified, curated case studies.',
                                action: 'EARN CME',
                                hoverBg: 'hover:bg-lavender text-charcoal'
                            }
                        ].map((row, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className={`group flex flex-col lg:flex-row lg:items-center justify-between py-12 border-b-2 border-charcoal/20 hover:border-charcoal transition-all duration-300 ${row.hoverBg} px-4 lg:px-8 cursor-pointer relative overflow-hidden`}
                            >
                                <div className="absolute inset-0 bg-charcoal transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0"></div>

                                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-24 w-full group-hover:text-white transition-colors duration-300">
                                    <div className="font-mono text-xl md:text-2xl opacity-50 font-bold group-hover:opacity-100 italic">/{row.num}</div>
                                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter whitespace-nowrap">
                                        {row.title}
                                    </h3>
                                    <p className="font-medium max-w-lg opacity-80 group-hover:opacity-100 hidden md:block">
                                        {row.desc}
                                    </p>
                                    <div className="lg:ml-auto flex items-center gap-4">
                                        <span className="font-mono text-sm font-bold tracking-widest hidden sm:block lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                            [{row.action}]
                                        </span>
                                        <div className="w-12 h-12 border-2 border-charcoal group-hover:border-white rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-charcoal transition-colors">
                                            <ArrowUpRight className="w-5 h-5 stroke-[3]" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Architectural Testimonial */}
            <section className="py-32 px-4 border-y-4 border-charcoal bg-charcoal text-white relative z-10 w-full overflow-hidden">
                <div className="container max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="flex-1 w-full"
                    >
                        <div className="font-mono text-sage mb-8 tracking-widest uppercase text-sm flex items-center gap-4 border-b border-white/20 pb-4">
                            <Star className="w-5 h-5 fill-sage text-sage" />
                            [SYS.04] Verified Output
                        </div>
                        <h3 className="text-[9vw] lg:text-[6rem] leading-[0.9] font-bold uppercase tracking-tighter mb-10 text-white relative z-10">
                            "The <span className="text-transparent" style={{ WebkitTextStroke: '2px var(--sage)' }}>accuracy</span> is incredible. Auto SOAP notes save me 2 hours daily."
                        </h3>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 border-2 border-sage bg-charcoal flex items-center justify-center text-sage font-bold text-xl uppercase relative">
                                <span className="absolute -top-1 -left-1 w-2 h-2 bg-sage"></span>
                                <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-sage"></span>
                                SM
                            </div>
                            <div className="text-left font-mono">
                                <div className="font-bold text-lg text-white uppercase tracking-wider">Dr. Rohan</div>
                                <div className="text-xs text-white/50 uppercase tracking-widest">Dermatologist // Boston, MA</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={scaleIn}
                        className="hidden lg:flex w-1/3 justify-center items-center"
                    >
                        {/* Abstract technical visualization */}
                        <div className="w-full max-w-[300px] aspect-square relative flex items-center justify-center border border-white/10 group overflow-hidden">
                            <div className="absolute inset-x-0 h-px bg-white/20 top-1/2 -translate-y-1/2 group-hover:bg-sage/50 transition-colors"></div>
                            <div className="absolute inset-y-0 w-px bg-white/20 left-1/2 -translate-x-1/2 group-hover:bg-sage/50 transition-colors"></div>
                            <div className="w-3/4 h-3/4 border border-white/20 rounded-full animate-[spin_10s_linear_infinite] group-hover:border-sage/50 transition-colors"></div>
                            <div className="w-1/2 h-1/2 border border-white/30 rounded-full animate-[spin_7s_linear_infinite_reverse] group-hover:border-sage/50 transition-colors"></div>
                            <div className="w-4 h-4 bg-sage rounded-full animate-pulse shadow-[0_0_30px_var(--sage)]"></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section - Kinetic Monolith */}
            <section className="py-0 px-0 lg:p-8 bg-cream w-full relative z-10">
                <div className="w-full bg-sage border-y-4 lg:border-4 border-charcoal overflow-hidden relative">
                    {/* Animated kinetic background stripes */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--charcoal) 0, var(--charcoal) 2px, transparent 2px, transparent 10px)' }}></div>

                    <div className="container py-32 px-4 max-w-5xl mx-auto text-center relative z-10">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <motion.span variants={fadeInUp} className="font-mono text-sm tracking-widest uppercase mb-8 inline-block text-charcoal/80 border-b border-charcoal/30 pb-2">
                                [SYS.05] Finalize Session
                            </motion.span>
                            <motion.h2 variants={fadeInUp} className="text-[12vw] lg:text-[7rem] leading-[0.85] font-bold uppercase tracking-tighter mb-12 text-charcoal">
                                Transform
                                <br />
                                <span className="text-transparent" style={{ WebkitTextStroke: 'min(3px, 0.4vw) var(--charcoal)' }}>Your Practice</span>
                            </motion.h2>
                            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-6">
                                <Link href="/login?register=true" className="brutalist-button bg-charcoal text-white hover:bg-cream hover:text-charcoal flex items-center gap-4 text-xl py-6 px-10">
                                    INITIALIZE TRIAL
                                    <ArrowRight className="w-6 h-6 stroke-[3]" />
                                </Link>
                            </motion.div>
                            <motion.p variants={fadeInUp} className="text-sm font-mono text-charcoal/70 mt-8 tracking-widest uppercase">
                                // NO CREDIT CARD REQ. // 14-DAY TRIAL // ZERO LOCK-IN
                            </motion.p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <span className="font-display text-2xl text-white mb-4 block">
                                MediVision
                            </span>
                            <p className="text-silver text-sm">
                                AI-powered clinical collaboration platform for the future of healthcare.
                            </p>
                        </div>
                        {[
                            {
                                title: 'Product',
                                links: ['Features', 'AI Models', 'Pricing', 'Enterprise']
                            },
                            {
                                title: 'Resources',
                                links: ['Documentation', 'API Reference', 'Case Studies', 'Blog']
                            },
                            {
                                title: 'Company',
                                links: ['About', 'Careers', 'Contact', 'Privacy']
                            }
                        ].map((col, i) => (
                            <div key={i}>
                                <h4 className="font-medium text-white mb-4">{col.title}</h4>
                                <ul className="space-y-2">
                                    {col.links.map((link, j) => (
                                        <li key={j}>
                                            <a href="#" className="footer-link text-sm">{link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-white/10 pt-8 flex flex-wrap justify-between items-center gap-4">
                        <p className="text-silver text-sm">
                            © 2024 MediVision AI. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="footer-link text-sm">HIPAA Compliant</a>
                            <a href="#" className="footer-link text-sm">SOC 2 Type II</a>
                            <a href="#" className="footer-link text-sm">GDPR Ready</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

