'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Brain,
    FileText,
    Shield,
    Pill,
    Heart,
    Dna,
    Scan,
    Loader2,
    CheckCircle,
    AlertTriangle,
    Copy,
    RotateCcw,
    Zap,
    Eye,
    EyeOff,
    Activity,
} from 'lucide-react';

interface Entity {
    text: string;
    label: string;
    confidence: number;
    start?: number;
    end?: number;
}

interface AnalysisResult {
    success: boolean;
    model: string;
    model_key: string;
    text: string;
    entities: Entity[];
    entity_count: number;
    processing_time_ms: number;
}

interface PiiResult {
    success: boolean;
    original_text: string;
    deidentified_text: string;
    method: string;
    pii_entities: Entity[];
    pii_count: number;
    processing_time_ms: number;
}

const NER_MODELS = [
    {
        key: 'disease',
        name: 'Disease Detection',
        icon: Heart,
        color: '#EF4444',
        description: 'Identifies diseases, conditions, syndromes',
        model: 'disease_detection_superclinical',
    },
    {
        key: 'drug',
        name: 'Drug Detection',
        icon: Pill,
        color: '#3B82F6',
        description: 'Identifies medications, dosages, treatments',
        model: 'pharma_detection_superclinical',
    },
    {
        key: 'anatomy',
        name: 'Anatomy Detection',
        icon: Scan,
        color: '#10B981',
        description: 'Identifies anatomical structures, body parts',
        model: 'anatomy_detection_electramed',
    },
    {
        key: 'gene',
        name: 'Gene Detection',
        icon: Dna,
        color: '#8B5CF6',
        description: 'Identifies genes, proteins, biomarkers',
        model: 'gene_detection_genecorpus',
    },
];

const SAMPLE_TEXTS = [
    {
        label: 'Oncology Note',
        text: 'Patient diagnosed with chronic myeloid leukemia. Started on imatinib 400mg daily. FISH analysis shows BCR-ABL fusion gene positive. Complete blood count reveals elevated white blood cells at 45,000.',
    },
    {
        label: 'Cardiology Note',
        text: 'Patient presents with acute myocardial infarction. ECG shows ST-elevation in leads V1-V4. Started on aspirin 325mg, clopidogrel 75mg, and heparin drip. Troponin I elevated at 12.5 ng/mL. Scheduled for cardiac catheterization.',
    },
    {
        label: 'Neurology Note',
        text: 'MRI brain reveals multiple sclerosis with periventricular white matter lesions. Patient reports numbness in bilateral lower extremities. Initiated treatment with interferon beta-1a. Lumbar puncture shows oligoclonal bands.',
    },
    {
        label: 'PII Sample',
        text: 'Patient: John Doe, DOB: 01/15/1970, SSN: 123-45-6789. Address: 123 Main St, Boston, MA 02101. Phone: (617) 555-0123. Dr. Smith prescribed metformin for type 2 diabetes.',
    },
];

export default function NlpAnalysisPage() {
    const [inputText, setInputText] = useState('');
    const [selectedModel, setSelectedModel] = useState('disease');
    const [activeTab, setActiveTab] = useState<'ner' | 'pii'>('ner');
    const [piiMethod, setPiiMethod] = useState('mask');
    const [isLoading, setIsLoading] = useState(false);
    const [nerResult, setNerResult] = useState<AnalysisResult | null>(null);
    const [piiResult, setPiiResult] = useState<PiiResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [backendStatus, setBackendStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');

    const checkBackend = useCallback(async () => {
        try {
            const res = await fetch('/api/nlp');
            if (res.ok) {
                setBackendStatus('online');
                return true;
            }
            setBackendStatus('offline');
            return false;
        } catch {
            setBackendStatus('offline');
            return false;
        }
    }, []);

    const runAnalysis = useCallback(async () => {
        if (!inputText.trim()) return;
        setIsLoading(true);
        setError(null);
        setNerResult(null);
        setPiiResult(null);

        try {
            if (activeTab === 'ner') {
                const res = await fetch('/api/nlp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'analyze',
                        text: inputText,
                        model: selectedModel,
                    }),
                });

                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || 'Analysis failed');
                    if (data.help) setError(prev => `${prev}\n${data.help}`);
                    setBackendStatus('offline');
                    return;
                }

                setBackendStatus('online');
                setNerResult(data);
            } else {
                const res = await fetch('/api/nlp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'pii',
                        text: inputText,
                        method: piiMethod,
                    }),
                });

                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || 'PII detection failed');
                    if (data.help) setError(prev => `${prev}\n${data.help}`);
                    setBackendStatus('offline');
                    return;
                }

                setBackendStatus('online');
                setPiiResult(data);
            }
        } catch (err) {
            setError('Failed to connect to analysis backend');
            setBackendStatus('offline');
        } finally {
            setIsLoading(false);
        }
    }, [inputText, selectedModel, activeTab, piiMethod]);

    const highlightEntities = (text: string, entities: Entity[]) => {
        if (!entities.length) return <span>{text}</span>;

        // Sort by position (start) descending so we can replace safely
        const sorted = [...entities]
            .filter(e => e.start !== undefined && e.end !== undefined)
            .sort((a, b) => (a.start || 0) - (b.start || 0));

        if (!sorted.length) {
            // Fallback: highlight by text match
            let result = text;
            const parts: { text: string; isEntity: boolean; label: string; confidence: number }[] = [];
            let remaining = text;

            for (const ent of entities) {
                const idx = remaining.toLowerCase().indexOf(ent.text.toLowerCase());
                if (idx >= 0) {
                    if (idx > 0) parts.push({ text: remaining.slice(0, idx), isEntity: false, label: '', confidence: 0 });
                    parts.push({ text: remaining.slice(idx, idx + ent.text.length), isEntity: true, label: ent.label, confidence: ent.confidence });
                    remaining = remaining.slice(idx + ent.text.length);
                }
            }
            if (remaining) parts.push({ text: remaining, isEntity: false, label: '', confidence: 0 });

            if (parts.length === 0) return <span>{text}</span>;

            return (
                <span>
                    {parts.map((p, i) =>
                        p.isEntity ? (
                            <span
                                key={i}
                                className="inline-block px-1 py-0.5 mx-0.5 rounded text-xs font-medium"
                                style={{
                                    background: `${getModelColor(selectedModel)}20`,
                                    color: getModelColor(selectedModel),
                                    borderBottom: `2px solid ${getModelColor(selectedModel)}`,
                                }}
                                title={`${p.label} (${(p.confidence * 100).toFixed(1)}%)`}
                            >
                                {p.text}
                            </span>
                        ) : (
                            <span key={i}>{p.text}</span>
                        )
                    )}
                </span>
            );
        }

        // Use start/end positions
        const parts: React.ReactNode[] = [];
        let lastEnd = 0;

        for (const ent of sorted) {
            const s = ent.start || 0;
            const e = ent.end || s + ent.text.length;

            if (s > lastEnd) {
                parts.push(<span key={`t-${lastEnd}`}>{text.slice(lastEnd, s)}</span>);
            }

            parts.push(
                <span
                    key={`e-${s}`}
                    className="inline-block px-1 py-0.5 mx-0.5 rounded text-xs font-medium"
                    style={{
                        background: `${getModelColor(selectedModel)}20`,
                        color: getModelColor(selectedModel),
                        borderBottom: `2px solid ${getModelColor(selectedModel)}`,
                    }}
                    title={`${ent.label} (${(ent.confidence * 100).toFixed(1)}%)`}
                >
                    {text.slice(s, e)}
                </span>
            );
            lastEnd = e;
        }

        if (lastEnd < text.length) {
            parts.push(<span key={`t-${lastEnd}`}>{text.slice(lastEnd)}</span>);
        }

        return <span>{parts}</span>;
    };

    const getModelColor = (key: string) => {
        return NER_MODELS.find(m => m.key === key)?.color || '#6B7280';
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
            <div className="max-w-7xl mx-auto p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/dashboard" className="btn btn-icon btn-secondary">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="heading-serif text-2xl lg:text-3xl" style={{ color: 'var(--charcoal)' }}>
                                Medical NLP Analysis
                            </h1>
                            <span className="pill text-xs" style={{
                                background: backendStatus === 'online' ? '#10B981' : backendStatus === 'offline' ? '#EF4444' : '#F59E0B',
                                color: 'white',
                            }}>
                                {backendStatus === 'online' ? '● Live' : backendStatus === 'offline' ? '● Offline' : '● Unknown'}
                            </span>
                        </div>
                        <p className="text-sm mt-1" style={{ color: 'var(--silver)' }}>
                            Real medical entity extraction powered by{' '}
                            <a href="https://github.com/maziyarpanahi/openmed" target="_blank" rel="noopener noreferrer"
                                className="underline" style={{ color: 'var(--sage)' }}>
                                openmed
                            </a>
                        </p>
                    </div>
                    <button
                        onClick={checkBackend}
                        className="btn btn-secondary flex items-center gap-2 text-sm"
                    >
                        <Activity className="w-4 h-4" />
                        Check Status
                    </button>
                </div>

                {/* Backend offline banner */}
                {backendStatus === 'offline' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card mb-6"
                        style={{
                            padding: 'var(--space-md) var(--space-lg)',
                            background: '#FEF2F2',
                            border: '1px solid #FECACA',
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
                            <div>
                                <p className="text-sm font-medium" style={{ color: '#991B1B' }}>
                                    OpenMed backend is not running
                                </p>
                                <p className="text-xs mt-1" style={{ color: '#DC2626' }}>
                                    Start it in a new terminal:{' '}
                                    <code className="px-1.5 py-0.5 rounded" style={{ background: '#FEE2E2' }}>
                                        python backend/server.py
                                    </code>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left — Input */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Tab Toggle */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('ner')}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                style={{
                                    background: activeTab === 'ner' ? 'var(--charcoal)' : 'transparent',
                                    color: activeTab === 'ner' ? 'white' : 'var(--silver)',
                                    border: activeTab === 'ner' ? 'none' : '1px solid var(--border)',
                                }}
                            >
                                <Brain className="w-4 h-4" />
                                Entity Extraction (NER)
                            </button>
                            <button
                                onClick={() => setActiveTab('pii')}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                style={{
                                    background: activeTab === 'pii' ? 'var(--charcoal)' : 'transparent',
                                    color: activeTab === 'pii' ? 'white' : 'var(--silver)',
                                    border: activeTab === 'pii' ? 'none' : '1px solid var(--border)',
                                }}
                            >
                                <Shield className="w-4 h-4" />
                                PII Detection
                            </button>
                        </div>

                        {/* Text Input */}
                        <div className="card card-bordered" style={{ padding: 'var(--space-lg)' }}>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold" style={{ color: 'var(--charcoal)' }}>
                                    <FileText className="w-4 h-4 inline mr-2" />
                                    Clinical Text Input
                                </h3>
                                <button
                                    onClick={() => { setInputText(''); setNerResult(null); setPiiResult(null); setError(null); }}
                                    className="text-xs flex items-center gap-1"
                                    style={{ color: 'var(--silver)' }}
                                >
                                    <RotateCcw className="w-3 h-3" /> Clear
                                </button>
                            </div>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Paste clinical notes, discharge summaries, or medical reports here..."
                                className="w-full rounded-xl p-4 text-sm resize-none focus:outline-none"
                                style={{
                                    background: 'var(--cream-dark)',
                                    color: 'var(--charcoal)',
                                    border: '1px solid var(--border)',
                                    minHeight: '160px',
                                    fontFamily: 'Inter, sans-serif',
                                }}
                                rows={6}
                            />

                            {/* Sample texts */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="text-xs" style={{ color: 'var(--silver)' }}>Samples:</span>
                                {SAMPLE_TEXTS.map(sample => (
                                    <button
                                        key={sample.label}
                                        onClick={() => setInputText(sample.text)}
                                        className="text-xs px-2.5 py-1 rounded-lg transition-all hover:scale-105"
                                        style={{ background: 'var(--cream-dark)', color: 'var(--charcoal)', border: '1px solid var(--border)' }}
                                    >
                                        {sample.label}
                                    </button>
                                ))}
                            </div>

                            {/* Model / Method selector */}
                            {activeTab === 'ner' ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                                    {NER_MODELS.map(model => (
                                        <button
                                            key={model.key}
                                            onClick={() => setSelectedModel(model.key)}
                                            className="flex items-center gap-2 p-2.5 rounded-xl text-xs transition-all"
                                            style={{
                                                background: selectedModel === model.key ? `${model.color}15` : 'transparent',
                                                color: selectedModel === model.key ? model.color : 'var(--silver)',
                                                border: `1px solid ${selectedModel === model.key ? model.color : 'var(--border)'}`,
                                            }}
                                        >
                                            <model.icon className="w-3.5 h-3.5" />
                                            {model.name}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex gap-2 mt-4">
                                    <span className="text-xs self-center" style={{ color: 'var(--silver)' }}>Method:</span>
                                    {['mask', 'remove', 'replace', 'hash'].map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setPiiMethod(m)}
                                            className="text-xs px-3 py-1.5 rounded-lg transition-all"
                                            style={{
                                                background: piiMethod === m ? 'var(--charcoal)' : 'transparent',
                                                color: piiMethod === m ? 'white' : 'var(--silver)',
                                                border: piiMethod === m ? 'none' : '1px solid var(--border)',
                                            }}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Run button */}
                            <button
                                onClick={runAnalysis}
                                disabled={isLoading || !inputText.trim()}
                                className="btn btn-primary w-full mt-4 flex items-center justify-center gap-2"
                                style={{ opacity: isLoading || !inputText.trim() ? 0.5 : 1 }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Analyzing with OpenMed...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-4 h-4" />
                                        {activeTab === 'ner' ? 'Extract Entities' : 'Detect PII'}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="card"
                                style={{ padding: 'var(--space-md) var(--space-lg)', background: '#FEF2F2', border: '1px solid #FECACA' }}
                            >
                                <p className="text-sm whitespace-pre-line" style={{ color: '#DC2626' }}>{error}</p>
                            </motion.div>
                        )}

                        {/* NER Results */}
                        {nerResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                {/* Highlighted text */}
                                <div className="card card-bordered" style={{ padding: 'var(--space-lg)' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold" style={{ color: 'var(--charcoal)' }}>
                                            <Eye className="w-4 h-4 inline mr-2" />
                                            Annotated Text
                                        </h3>
                                        <span className="text-xs" style={{ color: 'var(--silver)' }}>
                                            {nerResult.processing_time_ms}ms • {nerResult.entity_count} entities
                                        </span>
                                    </div>
                                    <div className="p-4 rounded-xl text-sm leading-relaxed" style={{ background: 'var(--cream-dark)' }}>
                                        {highlightEntities(nerResult.text, nerResult.entities)}
                                    </div>
                                </div>

                                {/* Entity table */}
                                <div className="card card-bordered" style={{ padding: 'var(--space-lg)' }}>
                                    <h3 className="font-semibold mb-3" style={{ color: 'var(--charcoal)' }}>
                                        Extracted Entities ({nerResult.entity_count})
                                    </h3>
                                    {nerResult.entities.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                                                        <th className="text-left py-2 px-3" style={{ color: 'var(--charcoal)' }}>Entity</th>
                                                        <th className="text-left py-2 px-3" style={{ color: 'var(--charcoal)' }}>Label</th>
                                                        <th className="text-right py-2 px-3" style={{ color: 'var(--charcoal)' }}>Confidence</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {nerResult.entities.map((ent, i) => (
                                                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                                            <td className="py-2 px-3 font-medium" style={{ color: getModelColor(nerResult.model_key) }}>
                                                                {ent.text}
                                                            </td>
                                                            <td className="py-2 px-3">
                                                                <span className="pill pill-default text-xs">{ent.label}</span>
                                                            </td>
                                                            <td className="py-2 px-3 text-right font-mono text-xs" style={{ color: 'var(--charcoal)' }}>
                                                                {(ent.confidence * 100).toFixed(1)}%
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-sm" style={{ color: 'var(--silver)' }}>
                                            No entities detected above confidence threshold.
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* PII Results */}
                        {piiResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="card card-bordered" style={{ padding: 'var(--space-lg)' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold" style={{ color: 'var(--charcoal)' }}>
                                            <EyeOff className="w-4 h-4 inline mr-2" />
                                            De-identified Text
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className="pill text-xs" style={{ background: '#10B98115', color: '#10B981' }}>
                                                {piiResult.pii_count} PII found
                                            </span>
                                            <span className="text-xs" style={{ color: 'var(--silver)' }}>
                                                {piiResult.processing_time_ms}ms
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs font-medium mb-1" style={{ color: '#EF4444' }}>Original</div>
                                            <div className="p-3 rounded-xl text-sm" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                                                {piiResult.original_text}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium mb-1" style={{ color: '#10B981' }}>De-identified ({piiResult.method})</div>
                                            <div className="p-3 rounded-xl text-sm" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                                                {piiResult.deidentified_text}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {piiResult.pii_entities.length > 0 && (
                                    <div className="card card-bordered" style={{ padding: 'var(--space-lg)' }}>
                                        <h3 className="font-semibold mb-3" style={{ color: 'var(--charcoal)' }}>
                                            PII Entities Detected
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {piiResult.pii_entities.map((ent, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                                                    style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA' }}
                                                >
                                                    <Shield className="w-3 h-3" />
                                                    <strong>{ent.text}</strong>
                                                    <span className="opacity-70">({ent.label})</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-4">
                        {/* About */}
                        <div className="card card-bordered" style={{ padding: 'var(--space-lg)' }}>
                            <h3 className="font-semibold mb-3" style={{ color: 'var(--charcoal)' }}>
                                <Brain className="w-4 h-4 inline mr-2" style={{ color: 'var(--sage)' }} />
                                About OpenMed
                            </h3>
                            <p className="text-xs mb-3" style={{ color: 'var(--silver)' }}>
                                Production-ready medical NLP toolkit with 12+ specialized transformer models. Apache 2.0 licensed.
                            </p>
                            <div className="space-y-2 text-xs" style={{ color: 'var(--silver)' }}>
                                <div className="flex justify-between">
                                    <span>Models</span>
                                    <span className="font-medium" style={{ color: 'var(--charcoal)' }}>12+</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Backend</span>
                                    <span className="font-medium" style={{ color: 'var(--charcoal)' }}>HuggingFace</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>PII Support</span>
                                    <span className="font-medium" style={{ color: 'var(--charcoal)' }}>HIPAA 18 IDs</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>License</span>
                                    <span className="font-medium" style={{ color: 'var(--charcoal)' }}>Apache 2.0</span>
                                </div>
                            </div>
                        </div>

                        {/* Available Models */}
                        <div className="card card-bordered" style={{ padding: 'var(--space-lg)' }}>
                            <h3 className="font-semibold mb-3" style={{ color: 'var(--charcoal)' }}>
                                NER Models
                            </h3>
                            <div className="space-y-2">
                                {NER_MODELS.map(model => (
                                    <div
                                        key={model.key}
                                        className="flex items-center gap-2 p-2 rounded-lg"
                                        style={{
                                            background: selectedModel === model.key ? `${model.color}08` : 'transparent',
                                        }}
                                    >
                                        <div className="w-2 h-2 rounded-full" style={{ background: model.color }} />
                                        <div className="flex-1">
                                            <div className="text-xs font-medium" style={{ color: 'var(--charcoal)' }}>{model.name}</div>
                                            <div className="text-xs" style={{ color: 'var(--silver)' }}>{model.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* How to start */}
                        <div className="card card-bordered" style={{ padding: 'var(--space-lg)' }}>
                            <h3 className="font-semibold mb-3" style={{ color: 'var(--charcoal)' }}>
                                <Zap className="w-4 h-4 inline mr-2" style={{ color: '#F59E0B' }} />
                                Setup
                            </h3>
                            <div className="space-y-2 text-xs" style={{ color: 'var(--silver)' }}>
                                <p>1. Install dependencies:</p>
                                <code className="block p-2 rounded-lg text-xs" style={{ background: 'var(--cream-dark)' }}>
                                    pip install openmed[hf] fastapi uvicorn
                                </code>
                                <p className="mt-2">2. Start the backend:</p>
                                <code className="block p-2 rounded-lg text-xs" style={{ background: 'var(--cream-dark)' }}>
                                    python backend/server.py
                                </code>
                                <p className="mt-2">3. Open this page and analyze!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
