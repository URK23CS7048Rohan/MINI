/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Medical Dark Theme
                medical: {
                    dark: '#0a0e17',
                    darker: '#060912',
                    card: '#111827',
                    border: '#1f2937',
                },
                accent: {
                    blue: '#3b82f6',
                    cyan: '#06b6d4',
                    emerald: '#10b981',
                    purple: '#8b5cf6',
                    pink: '#ec4899',
                    amber: '#f59e0b',
                    red: '#ef4444',
                },
                severity: {
                    critical: '#ef4444',
                    high: '#f97316',
                    medium: '#eab308',
                    low: '#22c55e',
                    normal: '#3b82f6',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'scan': 'scan 2s linear infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
                'slide-left': 'slideLeft 0.5s ease-out',
                'slide-right': 'slideRight 0.5s ease-out',
                'fade-in': 'fadeIn 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'spin-slow': 'spin 8s linear infinite',
                'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'gradient': 'gradient 8s ease infinite',
                'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)' },
                    '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.5)' },
                },
                scan: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideLeft: {
                    '0%': { transform: 'translateX(20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideRight: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                bounceSoft: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                heartbeat: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '14%': { transform: 'scale(1.1)' },
                    '28%': { transform: 'scale(1)' },
                    '42%': { transform: 'scale(1.1)' },
                    '70%': { transform: 'scale(1)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'grid-pattern': 'linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)',
            },
            backgroundSize: {
                'grid': '50px 50px',
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
                'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
                'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.3)',
                'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
                'glow-red': '0 0 20px rgba(239, 68, 68, 0.3)',
                'inner-glow': 'inset 0 0 20px rgba(59, 130, 246, 0.2)',
            },
        },
    },
    plugins: [],
};
