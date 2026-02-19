import { NextResponse } from 'next/server';

const CV_BACKEND_URL = process.env.CV_BACKEND_URL || 'http://localhost:8001';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, ...payload } = body;

        const endpoints: Record<string, string> = {
            'ritm': '/ritm/segment',
            'tapnet': '/tapnet/track',
            'mixformer': '/mixformer/track',
            'live-detect': '/live/detect',
        };

        const endpoint = endpoints[action];
        if (!endpoint) {
            return NextResponse.json(
                { error: `Unknown action: ${action}. Valid: ${Object.keys(endpoints).join(', ')}` },
                { status: 400 }
            );
        }

        const backendResponse = await fetch(`${CV_BACKEND_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!backendResponse.ok) {
            const errorText = await backendResponse.text();
            return NextResponse.json(
                { error: `CV backend error: ${errorText}` },
                { status: backendResponse.status }
            );
        }

        const data = await backendResponse.json();
        return NextResponse.json(data);
    } catch (error) {
        const isConnectionError = error instanceof TypeError && error.message.includes('fetch');
        if (isConnectionError) {
            return NextResponse.json(
                {
                    error: 'CV backend not running. Start it with: python backend/cv_server.py',
                    backend_url: CV_BACKEND_URL,
                },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { error: `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const response = await fetch(`${CV_BACKEND_URL}/cv/health`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { status: 'offline', message: 'CV backend not running' },
            { status: 503 }
        );
    }
}
