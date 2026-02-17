import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'MediVision AI - Intelligent Clinical Collaboration Platform',
    description: 'AI-powered telemedicine platform with real-time diagnostics, multi-agent clinical co-pilot, and global medical education',
    keywords: 'telemedicine, AI diagnostics, medical imaging, YOLO, healthcare, clinical collaboration, live surgery, medical education',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}

