'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    User,
    ArrowLeft,
    Mail,
    Phone,
    Building,
    MapPin,
    Calendar,
    Award,
    Edit2,
    Camera,
    Save,
    LogOut
} from 'lucide-react';
import { getCurrentUser, logout, AuthUser } from '@/lib/db/auth';

const defaultProfileData = {
    name: 'Loading...',
    email: '...',
    phone: 'Not provided',
    specialty: 'Not provided',
    hospital: 'Not provided',
    location: 'Not provided',
    joinDate: '...',
    license: 'Not provided',
    avatar: '...'
};

export default function ProfilePage() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(defaultProfileData);

    // Use an intersection type to add the missing properties to AuthUser
    type ExtendedUser = AuthUser & {
        created_at: string;
        phone: string | null;
        specialty: string | null;
        hospital: string | null;
        license_number: string | null;
    };

    const [user, setUser] = useState<ExtendedUser | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser() as ExtendedUser | null;
            if (!currentUser) {
                router.push('/login');
                return;
            }
            setUser(currentUser);

            // Format join date
            const joinDate = currentUser.created_at
                ? new Date(currentUser.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                })
                : 'Recent';

            // Get initials for avatar
            const initials = (currentUser.name || 'U')
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);

            setProfile({
                name: currentUser.name || 'Unknown User',
                email: currentUser.email || 'No email',
                phone: currentUser.phone || 'Not provided',
                specialty: currentUser.specialty || 'General Practice',
                hospital: currentUser.hospital || 'Not provided',
                location: 'Not provided', // Not in current schema
                joinDate,
                license: currentUser.license_number || 'Not provided',
                avatar: initials
            });
        };
        fetchUser();
    }, [router]);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
            <div className="max-w-3xl mx-auto p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="btn btn-icon btn-secondary">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="heading-serif text-2xl lg:text-3xl" style={{ color: 'var(--charcoal)' }}>
                            Profile
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--silver)' }}>
                            Manage your account information
                        </p>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="btn btn-secondary"
                    >
                        {isEditing ? (
                            <>
                                <Save className="w-4 h-4" />
                                Save
                            </>
                        ) : (
                            <>
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </>
                        )}
                    </button>
                </div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card card-bordered mb-6"
                    style={{ padding: 'var(--space-xl)' }}
                >
                    {/* Avatar Section */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                        <div className="relative">
                            <div
                                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-medium"
                                style={{ background: 'var(--sage)' }}
                            >
                                {profile.avatar}
                            </div>
                            {isEditing && (
                                <button
                                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ background: 'var(--charcoal)' }}
                                >
                                    <Camera className="w-4 h-4 text-white" />
                                </button>
                            )}
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="heading-serif text-2xl mb-1" style={{ color: 'var(--charcoal)' }}>
                                {profile.name}
                            </h2>
                            <p className="text-sm" style={{ color: 'var(--sage)' }}>
                                {profile.specialty}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--silver)' }}>
                                Member since {profile.joinDate}
                            </p>
                        </div>
                    </div>

                    {/* Profile Fields */}
                    <div className="space-y-4">
                        {[
                            { icon: Mail, label: 'Email', value: profile.email, key: 'email' },
                            { icon: Phone, label: 'Phone', value: profile.phone, key: 'phone' },
                            { icon: Award, label: 'Specialty', value: profile.specialty, key: 'specialty' },
                            { icon: Building, label: 'Hospital', value: profile.hospital, key: 'hospital' },
                            { icon: MapPin, label: 'Location', value: profile.location, key: 'location' },
                            { icon: Calendar, label: 'License #', value: profile.license, key: 'license' },
                        ].map((field) => (
                            <div
                                key={field.key}
                                className="flex items-center gap-4 p-4 rounded-xl"
                                style={{ background: 'var(--cloud)' }}
                            >
                                <field.icon className="w-5 h-5" style={{ color: 'var(--sage)' }} />
                                <div className="flex-1">
                                    <label className="text-xs uppercase tracking-wider" style={{ color: 'var(--silver)' }}>
                                        {field.label}
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={field.value}
                                            onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                                            className="w-full bg-transparent outline-none font-medium mt-1"
                                            style={{ color: 'var(--charcoal)' }}
                                        />
                                    ) : (
                                        <p className="font-medium" style={{ color: 'var(--charcoal)' }}>
                                            {field.value}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Actions */}
                <div className="space-y-3">
                    <Link href="/settings" className="card card-bordered hover-lift block" style={{ padding: 'var(--space-lg)' }}>
                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5" style={{ color: 'var(--slate)' }} />
                            <span style={{ color: 'var(--charcoal)' }}>Account Settings</span>
                        </div>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="card hover-lift w-full text-left"
                        style={{ padding: 'var(--space-lg)', background: 'var(--coral-light)' }}
                    >
                        <div className="flex items-center gap-3">
                            <LogOut className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} />
                            <span style={{ color: 'var(--accent-secondary)' }}>Sign Out</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

