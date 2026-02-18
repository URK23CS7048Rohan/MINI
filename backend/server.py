"""
MediVision AI — OpenMed Backend Server
Real medical NLP using the openmed package (maziyarpanahi/openmed)
Provides: NER (disease, drug, anatomy, gene), PII detection, de-identification
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import time
import traceback

# ── OpenMed imports ──────────────────────────────────────
from openmed import analyze_text

try:
    from openmed import extract_pii, deidentify
    HAS_PII = True
except ImportError:
    HAS_PII = False

# ── App setup ────────────────────────────────────────────
app = FastAPI(
    title="MediVision OpenMed Backend",
    description="Real medical NLP powered by openmed",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Available NER models ─────────────────────────────────
AVAILABLE_MODELS = {
    "disease": "disease_detection_superclinical",
    "drug": "pharma_detection_superclinical",
    "anatomy": "anatomy_detection_electramed",
    "gene": "gene_detection_genecorpus",
    "pii": "pii_detection_superclinical",
}

# ── Request / Response schemas ───────────────────────────

class AnalyzeRequest(BaseModel):
    text: str
    model: str = "disease"  # disease | drug | anatomy | gene
    confidence_threshold: float = 0.5

class PiiRequest(BaseModel):
    text: str
    method: str = "mask"  # mask | remove | replace | hash

class SoapAnalyzeRequest(BaseModel):
    text: str  # Full transcript text

class EntityOut(BaseModel):
    text: str
    label: str
    confidence: float
    start: Optional[int] = None
    end: Optional[int] = None

# ── Endpoints ────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "ok",
        "models": list(AVAILABLE_MODELS.keys()),
        "has_pii": HAS_PII,
    }


@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    """Run NER on clinical text using a specified openmed model."""
    if req.model not in AVAILABLE_MODELS:
        raise HTTPException(400, f"Unknown model '{req.model}'. Available: {list(AVAILABLE_MODELS.keys())}")

    model_name = AVAILABLE_MODELS[req.model]
    start = time.time()

    try:
        result = analyze_text(
            req.text,
            model_name=model_name,
        )

        entities = []
        for ent in result.entities:
            if ent.confidence >= req.confidence_threshold:
                entities.append({
                    "text": ent.text,
                    "label": ent.label,
                    "confidence": round(ent.confidence, 4),
                    "start": getattr(ent, "start", None),
                    "end": getattr(ent, "end", None),
                })

        return {
            "success": True,
            "model": model_name,
            "model_key": req.model,
            "text": req.text,
            "entities": entities,
            "entity_count": len(entities),
            "processing_time_ms": round((time.time() - start) * 1000, 1),
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, f"OpenMed analysis failed: {str(e)}")


@app.post("/pii")
def pii_detect(req: PiiRequest):
    """Detect and de-identify PII in clinical text."""
    if not HAS_PII:
        raise HTTPException(501, "PII detection not available — install openmed >= 0.5.0")

    start = time.time()

    try:
        # Step 1: Extract PII entities
        pii_result = extract_pii(
            req.text,
            model_name="pii_detection_superclinical",
            use_smart_merging=True,
        )

        pii_entities = []
        for ent in pii_result.entities:
            pii_entities.append({
                "text": ent.text,
                "label": ent.label,
                "confidence": round(ent.confidence, 4),
                "start": getattr(ent, "start", None),
                "end": getattr(ent, "end", None),
            })

        # Step 2: De-identify
        deidentified = deidentify(req.text, method=req.method)

        return {
            "success": True,
            "original_text": req.text,
            "deidentified_text": deidentified,
            "method": req.method,
            "pii_entities": pii_entities,
            "pii_count": len(pii_entities),
            "processing_time_ms": round((time.time() - start) * 1000, 1),
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, f"PII detection failed: {str(e)}")


@app.post("/soap-analyze")
def soap_analyze(req: SoapAnalyzeRequest):
    """Extract medical entities from transcript for SOAP note generation."""
    start = time.time()

    results = {}

    # Run disease detection
    try:
        disease_result = analyze_text(req.text, model_name="disease_detection_superclinical")
        results["diseases"] = [
            {"text": e.text, "label": e.label, "confidence": round(e.confidence, 4)}
            for e in disease_result.entities if e.confidence >= 0.5
        ]
    except Exception:
        results["diseases"] = []

    # Run drug detection
    try:
        drug_result = analyze_text(req.text, model_name="pharma_detection_superclinical")
        results["drugs"] = [
            {"text": e.text, "label": e.label, "confidence": round(e.confidence, 4)}
            for e in drug_result.entities if e.confidence >= 0.5
        ]
    except Exception:
        results["drugs"] = []

    # Run anatomy detection
    try:
        anatomy_result = analyze_text(req.text, model_name="anatomy_detection_electramed")
        results["anatomy"] = [
            {"text": e.text, "label": e.label, "confidence": round(e.confidence, 4)}
            for e in anatomy_result.entities if e.confidence >= 0.5
        ]
    except Exception:
        results["anatomy"] = []

    return {
        "success": True,
        "text": req.text,
        **results,
        "processing_time_ms": round((time.time() - start) * 1000, 1),
    }


# ── Run ──────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("  MediVision OpenMed Backend")
    print(f"  Models: {list(AVAILABLE_MODELS.keys())}")
    print(f"  PII Support: {HAS_PII}")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000)
