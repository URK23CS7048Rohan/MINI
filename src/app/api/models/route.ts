import { NextRequest, NextResponse } from 'next/server';
import { roboflowClient, MEDICAL_MODELS, getModelStats } from '@/lib/ai/model-hub';

// GET - List all available models
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const action = searchParams.get('action');

    // Get model statistics
    if (action === 'stats') {
        return NextResponse.json({
            success: true,
            stats: getModelStats(),
        });
    }

    // Get models by category
    if (category) {
        const models = roboflowClient.getModelsByCategory(category);
        return NextResponse.json({
            success: true,
            category,
            models,
            count: models.length,
        });
    }

    // Get all models grouped by category
    const categories = roboflowClient.getCategories();
    const modelsByCategory = categories.map(cat => ({
        category: cat,
        models: roboflowClient.getModelsByCategory(cat),
    }));

    return NextResponse.json({
        success: true,
        categories,
        modelsByCategory,
        totalModels: MEDICAL_MODELS.filter(m => m.isActive).length,
    });
}

// POST - Run inference
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            image,  // base64 image data
            modelId,  // specific model to use
            models,  // array of model IDs for multi-model detection
            imageType,  // for auto-detection
            confidence = 0.4,
            mode = 'single'  // 'single', 'multi', or 'auto'
        } = body;

        if (!image) {
            return NextResponse.json(
                { success: false, error: 'Image data is required' },
                { status: 400 }
            );
        }

        let results;

        switch (mode) {
            case 'multi':
                if (!models || !Array.isArray(models) || models.length === 0) {
                    return NextResponse.json(
                        { success: false, error: 'Models array is required for multi-model detection' },
                        { status: 400 }
                    );
                }
                results = await roboflowClient.detectWithMultipleModels(image, models, confidence);
                break;

            case 'auto':
                if (!imageType) {
                    return NextResponse.json(
                        { success: false, error: 'Image type is required for auto-detection' },
                        { status: 400 }
                    );
                }
                results = await roboflowClient.autoDetect(image, imageType);
                break;

            case 'single':
            default:
                if (!modelId) {
                    return NextResponse.json(
                        { success: false, error: 'Model ID is required for single model detection' },
                        { status: 400 }
                    );
                }
                const result = await roboflowClient.detectWithModel(image, modelId, confidence);
                results = [result];
                break;
        }

        // Aggregate all predictions across models
        const allPredictions = results.flatMap(r =>
            r.predictions.map(p => ({
                ...p,
                modelId: r.model.id,
                modelName: r.model.name,
            }))
        );

        // Sort by severity (critical first)
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, normal: 4 };
        allPredictions.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

        return NextResponse.json({
            success: true,
            mode,
            results,
            summary: {
                modelsUsed: results.length,
                totalPredictions: allPredictions.length,
                criticalFindings: allPredictions.filter(p => p.severity === 'critical').length,
                highSeverityFindings: allPredictions.filter(p => p.severity === 'high').length,
                processingTime: results.reduce((acc, r) => acc + r.processingTime, 0),
            },
            allPredictions,
        });

    } catch (error) {
        console.error('Model inference error:', error);
        return NextResponse.json(
            { success: false, error: 'Model inference failed' },
            { status: 500 }
        );
    }
}

