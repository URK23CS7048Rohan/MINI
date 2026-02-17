'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
};

export default function Home() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="blob blob-sage shape-organic w-[600px] h-[600px] -top-48 -right-48"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                        rotate: [0, 10, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="blob blob-sky shape-organic w-[500px] h-[500px] top-1/3 -left-48"
                    animate={{
                        x: [0, -20, 0],
                        y: [0, 30, 0],
                        rotate: [0, -15, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="blob blob-lavender shape-organic w-[400px] h-[400px] bottom-1/4 right-1/4"
                    animate={{
                        x: [0, 20, 0],
                        y: [0, -30, 0],
                        rotate: [0, 20, 0]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Navigation */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`nav-main ${isScrolled ? 'scrolled' : ''}`}
            >
                <Link href="/" className="nav-logo">
                    <span className="font-display">Medi</span>
                    <span className="text-highlight-sage">Vision</span>
                </Link>

                <div className="nav-links hidden lg:flex">
                    <Link href="#features" className="nav-link">Features</Link>
                    <Link href="#models" className="nav-link">AI Models</Link>
                    <Link href="#collaboration" className="nav-link">Collaboration</Link>
                    <Link href="#pricing" className="nav-link">Pricing</Link>
                </div>

                <div className="flex items-center gap-md">
                    <Link href="/login" className="btn btn-ghost hidden sm:flex">
                        Sign In
                    </Link>
                    <Link href="/login?register=true" className="btn btn-primary">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                        className="lg:hidden btn btn-icon btn-secondary"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
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

            {/* Hero Section */}
            <section className="hero-section">
                <div className="container max-w-7xl mx-auto">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="text-center max-w-5xl mx-auto"
                    >


                        {/* Main Heading */}
                        <motion.h1 variants={fadeInUp} className="heading-display heading-display-xl mb-8">
                            <span className="text-highlight">Create.</span>{' '}
                            <span className="text-highlight-sage">Diagnose.</span>
                            <br />
                            <span className="text-highlight-coral">Heal.</span>{' '}
                            <span className="text-highlight-outline">Together.</span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p variants={fadeInUp} className="text-body text-body-lg max-w-2xl mx-auto mb-12">
                            The future of clinical collaboration. Real-time AI diagnostics,
                            multi-agent clinical co-pilot, and intelligent documentation
                            that transforms every consultation.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-md mb-16">
                            <Link href="/dashboard" className="btn btn-primary">
                                <Play className="w-4 h-4" />
                                Start Free Trial
                            </Link>
                            <Link href="#demo" className="btn btn-secondary">
                                Watch Demo
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        {/* Stats Row */}
                        <motion.div
                            variants={fadeInUp}
                            className="stats-row"
                        >
                            {[
                                { value: '25+', label: 'AI Models' },
                                { value: '98.5%', label: 'Accuracy' },
                                { value: '50K+', label: 'Consultations' },
                                { value: '30+', label: 'Languages' }
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="stat-number">{stat.value}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
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
            <section className="py-xl border-y border-mist bg-white/50">
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

            {/* Bento Features Section */}
            <section id="features" className="py-4xl px-xl">
                <div className="container max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="mb-16 text-center"
                    >
                        <motion.span variants={fadeInUp} className="text-label block mb-4">
                            Platform Features
                        </motion.span>
                        <motion.h2 variants={fadeInUp} className="heading-display heading-display-md">
                            Everything you need for
                            <br />
                            <span className="font-serif italic">modern healthcare</span>
                        </motion.h2>
                    </motion.div>

                    {/* Bento Grid */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="bento-grid bento-grid-complex"
                    >
                        {/* Large Card - AI Detection */}
                        <motion.div
                            variants={scaleIn}
                            className="card card-sage bento-span-2 bento-row-2 relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <div className="icon-circle icon-circle-sage mb-6">
                                    <Scan className="w-5 h-5" />
                                </div>
                                <h3 className="heading-serif text-2xl mb-4">
                                    Real-Time AI Detection
                                </h3>
                                <p className="text-body mb-8">
                                    25+ specialized YOLO models detect conditions across dermatology,
                                    radiology, ophthalmology, and more with 98.5% accuracy.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {['Skin Lesions', 'X-Ray Analysis', 'Eye Diseases', 'Wound Care'].map((tag, i) => (
                                        <span key={i} className="pill pill-default">{tag}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Floating decorative element */}
                            <motion.div
                                className="absolute -bottom-8 -right-8 w-48 h-48 bg-sage rounded-full opacity-30"
                                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                                transition={{ duration: 8, repeat: Infinity }}
                            />
                        </motion.div>

                        {/* Video Consultations */}
                        <motion.div
                            variants={scaleIn}
                            className="card card-bordered hover-lift"
                        >
                            <Video className="w-8 h-8 mb-4 text-accent-tertiary" />
                            <h3 className="heading-serif text-xl mb-2">
                                HD Video Calls
                            </h3>
                            <p className="text-body text-sm">
                                Crystal-clear telemedicine with smart zoom and screen sharing.
                            </p>
                        </motion.div>

                        {/* Multi-Agent */}
                        <motion.div
                            variants={scaleIn}
                            className="card card-sky hover-lift"
                        >
                            <Brain className="w-8 h-8 mb-4 text-accent-tertiary" />
                            <h3 className="heading-serif text-xl mb-2">
                                Clinical Co-Pilot
                            </h3>
                            <p className="text-body text-sm">
                                Multi-agent AI system for diagnosis, documentation, and recommendations.
                            </p>
                        </motion.div>

                        {/* SOAP Notes */}
                        <motion.div
                            variants={scaleIn}
                            className="card card-lavender bento-span-2 hover-lift"
                        >
                            <div className="flex items-start gap-6">
                                <FileText className="w-10 h-10 text-accent-secondary flex-shrink-0" />
                                <div>
                                    <h3 className="heading-serif text-xl mb-2">
                                        Auto SOAP Notes
                                    </h3>
                                    <p className="text-body text-sm mb-4">
                                        AI-generated clinical documentation from real-time transcription.
                                        Save hours on paperwork.
                                    </p>
                                    <div className="flex gap-2">
                                        <span className="pill pill-outline">S: Subjective</span>
                                        <span className="pill pill-outline">O: Objective</span>
                                        <span className="pill pill-outline">A: Assessment</span>
                                        <span className="pill pill-outline">P: Plan</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Security */}
                        <motion.div
                            variants={scaleIn}
                            className="card card-bordered hover-lift"
                        >
                            <Shield className="w-8 h-8 mb-4 text-accent-primary" />
                            <h3 className="heading-serif text-xl mb-2">
                                HIPAA Secure
                            </h3>
                            <p className="text-body text-sm">
                                End-to-end encryption with full audit logging.
                            </p>
                        </motion.div>

                        {/* Global */}
                        <motion.div
                            variants={scaleIn}
                            className="card card-coral hover-lift"
                        >
                            <Globe className="w-8 h-8 mb-4 text-accent-secondary" />
                            <h3 className="heading-serif text-xl mb-2">
                                30+ Languages
                            </h3>
                            <p className="text-body text-sm">
                                Real-time translation for global healthcare access.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* AI Models Section */}
            <section id="models" className="py-4xl px-xl" style={{ background: '#1A1A1A', color: '#FFFFFF' }}>
                <div className="container max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid lg:grid-cols-2 gap-16 items-center"
                    >
                        <motion.div variants={fadeInUp}>
                            <span className="text-label block mb-4" style={{ color: '#A8C5A8' }}>AI Model Hub</span>
                            <h2 className="heading-display heading-display-md mb-6" style={{ color: '#FFFFFF' }}>
                                Powered by
                                <br />
                                <span className="font-serif italic" style={{ color: '#A8C5A8' }}>25+ YOLO Models</span>
                            </h2>
                            <p className="text-lg mb-8" style={{ color: '#999999' }}>
                                State-of-the-art computer vision trained on millions of medical images.
                                Each model is specialized for its domain and continuously improving.
                            </p>

                            <ul className="feature-list mb-8">
                                {[
                                    'Skin Disease Detection (Melanoma, Psoriasis, Eczema)',
                                    'Chest X-Ray Analysis (COVID-19, Pneumonia, TB)',
                                    'Ophthalmology Screening (Diabetic Retinopathy)',
                                    'Wound Assessment & Burn Classification',
                                    'Bone Fracture Detection',
                                    'Dental & ECG Analysis'
                                ].map((item, i) => (
                                    <li key={i} className="feature-item">
                                        <CheckCircle className="w-5 h-5" style={{ color: '#A8C5A8' }} />
                                        <span style={{ color: '#E5E5E5' }}>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/dashboard" className="btn btn-sage">
                                Explore All Models
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            className="grid grid-cols-2 gap-4"
                        >
                            {[
                                { name: 'Dermatology', count: '8 models', bg: 'rgba(168, 197, 168, 0.2)', icon: Heart },
                                { name: 'Radiology', count: '5 models', bg: 'rgba(184, 212, 232, 0.2)', icon: Scan },
                                { name: 'Ophthalmology', count: '4 models', bg: 'rgba(212, 197, 232, 0.2)', icon: Brain },
                                { name: 'Cardiology', count: '3 models', bg: 'rgba(232, 168, 156, 0.2)', icon: Activity },
                            ].map((category, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.03 }}
                                    className="rounded-2xl p-6 cursor-pointer"
                                    style={{ background: category.bg }}
                                >
                                    <category.icon className="w-8 h-8 mb-4" style={{ color: '#FFFFFF' }} />
                                    <h4 className="font-medium text-lg" style={{ color: '#FFFFFF' }}>{category.name}</h4>
                                    <p className="text-sm" style={{ color: '#999999' }}>{category.count}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Collaboration Section */}
            <section id="collaboration" className="py-4xl px-xl">
                <div className="container max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <motion.span variants={fadeInUp} className="text-label block mb-4">
                            Global Collaboration
                        </motion.span>
                        <motion.h2 variants={fadeInUp} className="heading-display heading-display-md mb-6">
                            Learn from the
                            <br />
                            <span className="font-serif italic">world&apos;s best doctors</span>
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="text-body text-body-lg">
                            Join live surgeries, participate in case discussions, and collaborate
                            with specialists worldwide in real-time.
                        </motion.p>
                    </motion.div>

                    {/* Feature Cards */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: Video,
                                title: 'Live Surgery Streams',
                                description: 'Watch and learn from live procedures by expert surgeons with real-time annotations and Q&A.',
                                color: 'card-sage'
                            },
                            {
                                icon: Users,
                                title: 'Case Discussions',
                                description: 'Collaborate on complex cases with specialists. Share annotations, findings, and treatment plans.',
                                color: 'card-sky'
                            },
                            {
                                icon: Award,
                                title: 'CME Credits',
                                description: 'Earn continuing medical education credits while learning from curated case studies.',
                                color: 'card-lavender'
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                variants={scaleIn}
                                className={`card ${feature.color} hover-lift`}
                            >
                                <feature.icon className="w-10 h-10 mb-6" />
                                <h3 className="heading-serif text-xl mb-3">{feature.title}</h3>
                                <p className="text-body">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonial */}
            <section className="py-4xl px-xl bg-cream-dark">
                <div className="container max-w-4xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="testimonial-card text-center"
                    >
                        <div className="flex justify-center gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <p className="testimonial-quote">
                            &quot;MediVision has transformed how I practice telemedicine. The AI detection
                            is incredibly accurate, and the automatic SOAP notes save me 2 hours daily.&quot;
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-sage flex items-center justify-center text-white font-medium">
                                SM
                            </div>
                            <div className="text-left">
                                <div className="font-medium">Dr. Rohan</div>
                                <div className="text-sm text-slate">Dermatologist, Boston</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-4xl px-xl">
                <div className="container max-w-5xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.h2 variants={fadeInUp} className="heading-display heading-display-lg mb-6">
                            Ready to transform
                            <br />
                            <span className="font-serif italic">your practice?</span>
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="text-body text-body-lg max-w-xl mx-auto mb-10">
                            Join thousands of healthcare providers using MediVision AI
                            to deliver better care, faster.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-md">
                            <Link href="/login?register=true" className="btn btn-primary btn-lg">
                                Start Free Trial
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="#contact" className="btn btn-secondary">
                                Contact Sales
                            </Link>
                        </motion.div>
                        <motion.p variants={fadeInUp} className="text-sm text-silver mt-6">
                            No credit card required • 14-day free trial • Cancel anytime
                        </motion.p>
                    </motion.div>
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

