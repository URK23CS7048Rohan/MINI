'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Settings,
    User,
    Bell,
    Shield,
    Globe,
    Palette,
    ArrowLeft,
    ChevronRight
} from 'lucide-react';

interface SettingsItem {
    name: string;
    description: string;
    toggle?: boolean;
    hasValue?: boolean;
}

interface SettingsSection {
    title: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    items: SettingsItem[];
}

const settingsSections: SettingsSection[] = [
    {
        title: 'Account',
        icon: User,
        items: [
            { name: 'Profile Information', description: 'Update your name, email, and photo' },
            { name: 'Password & Security', description: 'Manage your password and 2FA' },
            { name: 'License & Credentials', description: 'Medical license verification' },
        ]
    },
    {
        title: 'Notifications',
        icon: Bell,
        items: [
            { name: 'Email Notifications', description: 'Configure email alerts', toggle: true },
            { name: 'Push Notifications', description: 'Mobile and desktop alerts', toggle: true },
            { name: 'SMS Alerts', description: 'Text message notifications', toggle: false },
        ]
    },
    {
        title: 'Privacy & Security',
        icon: Shield,
        items: [
            { name: 'Data Privacy', description: 'Manage your data and exports' },
            { name: 'Audit Log', description: 'View account activity history' },
            { name: 'Connected Devices', description: 'Manage logged-in devices' },
        ]
    },
    {
        title: 'Preferences',
        icon: Palette,
        items: [
            { name: 'Language', description: 'English (US)', hasValue: true },
            { name: 'Timezone', description: 'UTC+5:30 (IST)', hasValue: true },
            { name: 'Theme', description: 'Light mode', hasValue: true },
        ]
    },
];

export default function SettingsPage() {
    const [toggles, setToggles] = useState<Record<string, boolean>>({
        'Email Notifications': true,
        'Push Notifications': true,
        'SMS Alerts': false,
    });

    return (
        <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
            <div className="max-w-4xl mx-auto p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="btn btn-icon btn-secondary">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="heading-serif text-2xl lg:text-3xl" style={{ color: 'var(--charcoal)' }}>
                            Settings
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--silver)' }}>
                            Manage your account preferences
                        </p>
                    </div>
                </div>

                {/* Settings Sections */}
                <div className="space-y-8">
                    {settingsSections.map((section, sectionIndex) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: sectionIndex * 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <section.icon className="w-5 h-5" style={{ color: 'var(--sage)' }} />
                                <h2 className="heading-serif text-lg" style={{ color: 'var(--charcoal)' }}>
                                    {section.title}
                                </h2>
                            </div>

                            <div className="card card-bordered overflow-hidden" style={{ padding: 0 }}>
                                {section.items.map((item, i) => (
                                    <div
                                        key={item.name}
                                        className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-cloud transition-colors"
                                        style={{
                                            borderTop: i > 0 ? '1px solid var(--mist)' : 'none'
                                        }}
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium" style={{ color: 'var(--charcoal)' }}>
                                                {item.name}
                                            </div>
                                            <div className="text-sm" style={{ color: 'var(--silver)' }}>
                                                {item.description}
                                            </div>
                                        </div>
                                        {item.toggle !== undefined ? (
                                            <button
                                                onClick={() => setToggles(prev => ({ ...prev, [item.name]: !prev[item.name] }))}
                                                className="w-12 h-7 rounded-full p-1 transition-colors"
                                                style={{
                                                    background: toggles[item.name] ? 'var(--sage)' : 'var(--mist)'
                                                }}
                                            >
                                                <motion.div
                                                    animate={{ x: toggles[item.name] ? 20 : 0 }}
                                                    className="w-5 h-5 rounded-full bg-white shadow"
                                                />
                                            </button>
                                        ) : (
                                            <ChevronRight className="w-5 h-5" style={{ color: 'var(--silver)' }} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Danger Zone */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                >
                    <h2 className="heading-serif text-lg mb-4" style={{ color: 'var(--accent-secondary)' }}>
                        Danger Zone
                    </h2>
                    <div className="card" style={{ background: 'var(--coral-light)', padding: 'var(--space-lg)' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium" style={{ color: 'var(--charcoal)' }}>Delete Account</div>
                                <div className="text-sm" style={{ color: 'var(--slate)' }}>
                                    Permanently delete your account and all data
                                </div>
                            </div>
                            <button className="btn text-sm py-2 px-4" style={{
                                background: 'var(--accent-secondary)',
                                color: 'var(--white)'
                            }}>
                                Delete
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

