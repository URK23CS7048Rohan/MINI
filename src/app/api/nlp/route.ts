import { NextRequest, NextResponse } from 'next/server';

// OpenMed NLP API — proxies to the Python FastAPI backend
const OPENMED_BACKEND = process.env.OPENMED_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, text, model, method, confidence_threshold } = body;

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        let endpoint: string;
        let payload: Record<string, unknown>;

        switch (action) {
            case 'analyze':
                endpoint = '/analyze';
                payload = { text, model: model || 'disease', confidence_threshold: confidence_threshold || 0.5 };
                break;
            case 'pii':
                endpoint = '/pii';
                payload = { text, method: method || 'mask' };
                break;
            case 'soap-analyze':
                endpoint = '/soap-analyze';
                payload = { text };
                break;
            default:
                return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
        }

        const response = await fetch(`${OPENMED_BACKEND}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.text();
            return NextResponse.json(
                { error: `OpenMed backend error: ${error}`, backend_status: response.status },
                { status: 502 }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';

        // Check if backend is unreachable
        if (message.includes('ECONNREFUSED') || message.includes('fetch failed')) {
            return NextResponse.json({
                error: 'OpenMed backend not running. Start it with: python backend/server.py',
                help: 'The Python backend must be running on port 8000 for real NLP analysis.',
            }, { status: 503 });
        }

        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const response = await fetch(`${OPENMED_BACKEND}/health`);
        if (!response.ok) throw new Error('Backend not responding');
        const data = await response.json();
        return NextResponse.json({ ...data, backend_url: OPENMED_BACKEND });
    } catch {
        return NextResponse.json({
            status: 'offline',
            message: 'OpenMed backend not running. Start with: python backend/server.py',
        }, { status: 503 });
    }
}
