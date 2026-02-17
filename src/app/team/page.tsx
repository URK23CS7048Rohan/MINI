'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Users,
    ArrowLeft,
    UserPlus,
    Mail,
    Phone,
    Video,
    MessageSquare,
    MoreHorizontal,
    Search,
    Check,
    X,
    Copy,
    Share2,
    Clock
} from 'lucide-react';

const teamMembers = [
    { id: 1, name: 'Dr. James Wilson', specialty: 'Cardiology', status: 'online', avatar: 'JW', email: 'j.wilson@hospital.com', cases: 12 },
    { id: 2, name: 'Dr. Emily Chen', specialty: 'Dermatology', status: 'online', avatar: 'EC', email: 'e.chen@hospital.com', cases: 8 },
    { id: 3, name: 'Dr. Michael Brown', specialty: 'Radiology', status: 'away', avatar: 'MB', email: 'm.brown@hospital.com', cases: 15 },
    { id: 4, name: 'Dr. Lisa Park', specialty: 'Ophthalmology', status: 'offline', avatar: 'LP', email: 'l.park@hospital.com', cases: 6 },
    { id: 5, name: 'Dr. Robert Kim', specialty: 'Neurology', status: 'online', avatar: 'RK', email: 'r.kim@hospital.com', cases: 9 },
];

const pendingInvites = [
    { id: 1, email: 'dr.rohan@example.com', sentAt: '2 hours ago' },
    { id: 2, email: 'specialist@clinic.com', sentAt: '1 day ago' },
];

export default function TeamPage() {
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteSent, setInviteSent] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedLink, setCopiedLink] = useState(false);

    const inviteLink = 'https://medivision.ai/invite/abc123xyz';

    const handleInvite = () => {
        if (inviteEmail) {
            setInviteSent(true);
            setTimeout(() => {
                setInviteSent(false);
                setInviteEmail('');
                setShowInviteModal(false);
            }, 2000);
        }
    };

    const copyInviteLink = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'var(--sage)';
            case 'away': return 'var(--peach)';
            default: return 'var(--silver)';
        }
    };

    const filteredMembers = teamMembers.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.specialty.toLowerCase().includes(searchQuery.toLowerCase())
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
                            Team & Collaboration
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--silver)' }}>
                            Connect with colleagues and collaborate on cases
                        </p>
                    </div>
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="btn btn-primary"
                    >
                        <UserPlus className="w-4 h-4" />
                        Invite Doctor
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: 'var(--white)' }}
                    >
                        <Search className="w-5 h-5" style={{ color: 'var(--silver)' }} />
                        <input
                            type="text"
                            placeholder="Search team members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent outline-none"
                            style={{ color: 'var(--charcoal)' }}
                        />
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Team Members */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-label">Team Members ({filteredMembers.length})</h2>

                        <div className="space-y-3">
                            {filteredMembers.map((member, i) => (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="card card-bordered hover-lift"
                                    style={{ padding: 'var(--space-lg)' }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div
                                                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-medium"
                                                style={{ background: 'var(--sage)' }}
                                            >
                                                {member.avatar}
                                            </div>
                                            <div
                                                className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white"
                                                style={{ background: getStatusColor(member.status) }}
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <div className="font-medium" style={{ color: 'var(--charcoal)' }}>
                                                {member.name}
                                            </div>
                                            <div className="text-sm" style={{ color: 'var(--sage)' }}>
                                                {member.specialty}
                                            </div>
                                            <div className="text-xs mt-1" style={{ color: 'var(--silver)' }}>
                                                {member.cases} shared cases
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                href="/messages"
                                                className="btn btn-icon btn-secondary"
                                                style={{ width: '40px', height: '40px' }}
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href="/consultations"
                                                className="btn btn-icon btn-secondary"
                                                style={{ width: '40px', height: '40px' }}
                                            >
                                                <Video className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Pending Invites & Quick Actions */}
                    <div className="space-y-6">
                        {/* Pending Invites */}
                        <div className="card card-sage" style={{ padding: 'var(--space-xl)' }}>
                            <h3 className="heading-serif text-lg mb-4" style={{ color: 'var(--charcoal)' }}>
                                Pending Invites
                            </h3>

                            {pendingInvites.length > 0 ? (
                                <div className="space-y-3">
                                    {pendingInvites.map((invite) => (
                                        <div
                                            key={invite.id}
                                            className="p-3 rounded-lg flex items-center justify-between"
                                            style={{ background: 'var(--white)' }}
                                        >
                                            <div>
                                                <div className="text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
                                                    {invite.email}
                                                </div>
                                                <div className="text-xs flex items-center gap-1" style={{ color: 'var(--silver)' }}>
                                                    <Clock className="w-3 h-3" />
                                                    {invite.sentAt}
                                                </div>
                                            </div>
                                            <button className="text-sm" style={{ color: 'var(--coral)' }}>
                                                Resend
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm" style={{ color: 'var(--silver)' }}>
                                    No pending invites
                                </p>
                            )}
                        </div>

                        {/* Share Link */}
                        <div className="card card-bordered" style={{ padding: 'var(--space-xl)' }}>
                            <h3 className="heading-serif text-lg mb-4" style={{ color: 'var(--charcoal)' }}>
                                Share Invite Link
                            </h3>
                            <p className="text-sm mb-4" style={{ color: 'var(--slate)' }}>
                                Share this link with colleagues to join your team
                            </p>
                            <div
                                className="flex items-center gap-2 p-3 rounded-lg"
                                style={{ background: 'var(--cloud)' }}
                            >
                                <input
                                    type="text"
                                    value={inviteLink}
                                    readOnly
                                    className="flex-1 bg-transparent text-sm outline-none font-mono"
                                    style={{ color: 'var(--slate)' }}
                                />
                                <button
                                    onClick={copyInviteLink}
                                    className="btn btn-secondary"
                                    style={{ padding: '8px 12px' }}
                                >
                                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            <AnimatePresence>
                {showInviteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.5)' }}
                        onClick={() => setShowInviteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card w-full max-w-md"
                            style={{ padding: 'var(--space-xl)', background: 'var(--white)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="heading-serif text-xl" style={{ color: 'var(--charcoal)' }}>
                                    Invite a Doctor
                                </h2>
                                <button onClick={() => setShowInviteModal(false)}>
                                    <X className="w-5 h-5" style={{ color: 'var(--silver)' }} />
                                </button>
                            </div>

                            {inviteSent ? (
                                <div className="text-center py-6">
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                        style={{ background: 'var(--sage-light)' }}
                                    >
                                        <Check className="w-8 h-8" style={{ color: 'var(--sage)' }} />
                                    </div>
                                    <p className="font-medium" style={{ color: 'var(--charcoal)' }}>
                                        Invitation Sent!
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <label className="text-label mb-2 block">Email Address</label>
                                        <input
                                            type="email"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            placeholder="colleague@hospital.com"
                                            className="w-full p-3 rounded-xl outline-none"
                                            style={{
                                                background: 'var(--cloud)',
                                                color: 'var(--charcoal)',
                                                border: '1px solid var(--mist)'
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={handleInvite}
                                        className="btn btn-primary w-full justify-center"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Send Invitation
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

