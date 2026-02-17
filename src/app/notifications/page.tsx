'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Bell,
    ArrowLeft,
    Check,
    X,
    AlertTriangle,
    CheckCircle,
    Info,
    Calendar,
    User,
    Scan
} from 'lucide-react';

const notifications = [
    {
        id: 1,
        type: 'alert',
        title: 'New AI Detection Result',
        message: 'High confidence melanoma detection for patient John A. requires review.',
        time: '5 min ago',
        read: false,
        icon: Scan
    },
    {
        id: 2,
        type: 'success',
        title: 'Consultation Completed',
        message: 'Your session with Maria Garcia has been recorded and documented.',
        time: '1 hour ago',
        read: false,
        icon: CheckCircle
    },
    {
        id: 3,
        type: 'info',
        title: 'Upcoming Appointment',
        message: 'Reminder: You have a consultation with Robert Chen at 2:00 PM.',
        time: '2 hours ago',
        read: false,
        icon: Calendar
    },
    {
        id: 4,
        type: 'info',
        title: 'New Patient Registered',
        message: 'Emma Johnson has registered and scheduled an appointment.',
        time: 'Yesterday',
        read: true,
        icon: User
    },
    {
        id: 5,
        type: 'success',
        title: 'SOAP Note Generated',
        message: 'AI has generated SOAP notes for your last 3 consultations.',
        time: 'Yesterday',
        read: true,
        icon: CheckCircle
    },
];

export default function NotificationsPage() {
    const [notificationList, setNotificationList] = useState(notifications);

    const markAsRead = (id: number) => {
        setNotificationList(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotificationList(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: number) => {
        setNotificationList(prev => prev.filter(n => n.id !== id));
    };

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'alert':
                return { bg: 'var(--coral-light)', color: 'var(--accent-secondary)' };
            case 'success':
                return { bg: 'var(--sage-light)', color: 'var(--accent-primary)' };
            default:
                return { bg: 'var(--sky-light)', color: 'var(--accent-tertiary)' };
        }
    };

    const unreadCount = notificationList.filter(n => !n.read).length;

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
                            Notifications
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--silver)' }}>
                            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="btn btn-secondary text-sm"
                        >
                            <Check className="w-4 h-4" />
                            Mark All Read
                        </button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    <AnimatePresence>
                        {notificationList.map((notification, i) => {
                            const styles = getTypeStyles(notification.type);
                            return (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="card card-bordered"
                                    style={{
                                        padding: 'var(--space-lg)',
                                        opacity: notification.read ? 0.7 : 1
                                    }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{ background: styles.bg }}
                                        >
                                            <notification.icon className="w-5 h-5" style={{ color: styles.color }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3
                                                        className="font-medium"
                                                        style={{ color: 'var(--charcoal)' }}
                                                    >
                                                        {notification.title}
                                                        {!notification.read && (
                                                            <span
                                                                className="inline-block w-2 h-2 rounded-full ml-2"
                                                                style={{ background: 'var(--coral)' }}
                                                            />
                                                        )}
                                                    </h3>
                                                    <p className="text-sm mt-1" style={{ color: 'var(--slate)' }}>
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs mt-2 font-mono" style={{ color: 'var(--silver)' }}>
                                                        {notification.time}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="btn btn-icon btn-secondary"
                                                            style={{ width: '32px', height: '32px' }}
                                                            title="Mark as read"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="btn btn-icon btn-secondary"
                                                        style={{ width: '32px', height: '32px' }}
                                                        title="Delete"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {notificationList.length === 0 && (
                        <div className="text-center py-12">
                            <Bell className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--mist)' }} />
                            <p style={{ color: 'var(--silver)' }}>No notifications</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

