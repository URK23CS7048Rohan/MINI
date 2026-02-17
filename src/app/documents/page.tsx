'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    FileText,
    Plus,
    Search,
    ArrowLeft,
    Download,
    Eye,
    Trash2,
    MoreHorizontal,
    File,
    FilePlus
} from 'lucide-react';

const documents = [
    { id: 1, name: 'SOAP Note - John Anderson', type: 'SOAP Note', date: 'Today, 10:30 AM', size: '12 KB' },
    { id: 2, name: 'Lab Results - Maria Garcia', type: 'Lab Report', date: 'Today, 9:15 AM', size: '45 KB' },
    { id: 3, name: 'Prescription - Robert Chen', type: 'Prescription', date: 'Yesterday', size: '8 KB' },
    { id: 4, name: 'Consultation Summary - Emma', type: 'Summary', date: 'Jan 27, 2026', size: '15 KB' },
    { id: 5, name: 'Referral Letter - Michael Brown', type: 'Referral', date: 'Jan 25, 2026', size: '10 KB' },
    { id: 6, name: 'X-Ray Report - Emily Davis', type: 'Imaging Report', date: 'Jan 20, 2026', size: '2.3 MB' },
];

export default function DocumentsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDocs = documents.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
            <div className="max-w-6xl mx-auto p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="btn btn-icon btn-secondary">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="heading-serif text-2xl lg:text-3xl" style={{ color: 'var(--charcoal)' }}>
                            Documents
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--silver)' }}>
                            Manage clinical documents and reports
                        </p>
                    </div>
                    <button className="btn btn-primary">
                        <FilePlus className="w-4 h-4" />
                        New Document
                    </button>
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6" style={{ background: 'var(--white)' }}>
                    <Search className="w-5 h-5" style={{ color: 'var(--silver)' }} />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 outline-none bg-transparent"
                        style={{ color: 'var(--charcoal)' }}
                    />
                </div>

                {/* Documents List */}
                <div className="card card-bordered" style={{ padding: 0, overflow: 'hidden' }}>
                    <table className="w-full">
                        <thead>
                            <tr style={{ background: 'var(--cloud)' }}>
                                <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: 'var(--slate)' }}>Name</th>
                                <th className="text-left px-6 py-4 text-sm font-medium hidden md:table-cell" style={{ color: 'var(--slate)' }}>Type</th>
                                <th className="text-left px-6 py-4 text-sm font-medium hidden md:table-cell" style={{ color: 'var(--slate)' }}>Date</th>
                                <th className="text-left px-6 py-4 text-sm font-medium hidden lg:table-cell" style={{ color: 'var(--slate)' }}>Size</th>
                                <th className="text-right px-6 py-4 text-sm font-medium" style={{ color: 'var(--slate)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDocs.map((doc, i) => (
                                <motion.tr
                                    key={doc.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-t cursor-pointer hover:bg-cloud transition-colors"
                                    style={{ borderColor: 'var(--mist)' }}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5" style={{ color: 'var(--sage)' }} />
                                            <span className="font-medium" style={{ color: 'var(--charcoal)' }}>{doc.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <span className="pill pill-default text-xs">{doc.type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm hidden md:table-cell" style={{ color: 'var(--silver)' }}>
                                        {doc.date}
                                    </td>
                                    <td className="px-6 py-4 text-sm hidden lg:table-cell font-mono" style={{ color: 'var(--silver)' }}>
                                        {doc.size}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="btn btn-icon btn-secondary" style={{ width: '36px', height: '36px' }}>
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="btn btn-icon btn-secondary" style={{ width: '36px', height: '36px' }}>
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

