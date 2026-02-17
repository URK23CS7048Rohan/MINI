'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Users,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    ArrowLeft,
    Phone,
    Mail,
    Calendar
} from 'lucide-react';

const patients = [
    { id: 1, name: 'John Anderson', age: 45, condition: 'Dermatitis', lastVisit: 'Today', avatar: 'JA', status: 'active' },
    { id: 2, name: 'Maria Garcia', age: 32, condition: 'Skin Lesion', lastVisit: 'Today', avatar: 'MG', status: 'active' },
    { id: 3, name: 'Robert Chen', age: 58, condition: 'Psoriasis', lastVisit: 'Yesterday', avatar: 'RC', status: 'active' },
    { id: 4, name: 'Emma Johnson', age: 28, condition: 'Eczema', lastVisit: 'Jan 27', avatar: 'SJ', status: 'active' },
    { id: 5, name: 'Michael Brown', age: 67, condition: 'Melanoma Screening', lastVisit: 'Jan 25', avatar: 'MB', status: 'followup' },
    { id: 6, name: 'Emily Davis', age: 41, condition: 'Acne Treatment', lastVisit: 'Jan 20', avatar: 'ED', status: 'completed' },
];

export default function PatientsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                            Patients
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--silver)' }}>
                            {patients.length} registered patients
                        </p>
                    </div>
                    <button className="btn btn-primary">
                        <Plus className="w-4 h-4" />
                        Add Patient
                    </button>
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6" style={{ background: 'var(--white)' }}>
                    <Search className="w-5 h-5" style={{ color: 'var(--silver)' }} />
                    <input
                        type="text"
                        placeholder="Search patients by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 outline-none bg-transparent"
                        style={{ color: 'var(--charcoal)' }}
                    />
                </div>

                {/* Patients Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPatients.map((patient, i) => (
                        <motion.div
                            key={patient.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="card card-bordered hover-lift cursor-pointer"
                            style={{ padding: 'var(--space-xl)' }}
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-medium text-lg"
                                    style={{ background: 'var(--sage)' }}
                                >
                                    {patient.avatar}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-lg" style={{ color: 'var(--charcoal)' }}>
                                        {patient.name}
                                    </div>
                                    <div className="text-sm" style={{ color: 'var(--silver)' }}>
                                        {patient.age} years old
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--slate)' }}>
                                    <span className="font-medium">Condition:</span>
                                    <span>{patient.condition}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--slate)' }}>
                                    <Calendar className="w-4 h-4" />
                                    <span>Last visit: {patient.lastVisit}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn btn-secondary flex-1 text-sm py-2">
                                    <Phone className="w-4 h-4" />
                                    Call
                                </button>
                                <button className="btn btn-primary flex-1 text-sm py-2">
                                    View Profile
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

