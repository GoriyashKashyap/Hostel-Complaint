
from __future__ import annotations

import re
from pathlib import Path
from typing import Any

import joblib

MODEL_DIR = Path(__file__).resolve().parents[1] / "ml"
CATEGORY_MODEL_PATH = MODEL_DIR / "category_model.joblib"
URGENCY_MODEL_PATH = MODEL_DIR / "urgency_model.joblib"

_models_cache: dict[str, Any] | None = None


def _load_models() -> dict[str, Any] | None:
    global _models_cache
    if _models_cache is not None:
        return _models_cache

    if not CATEGORY_MODEL_PATH.exists() or not URGENCY_MODEL_PATH.exists():
        return None

    try:
        _models_cache = {
            "category": joblib.load(CATEGORY_MODEL_PATH),
            "urgency": joblib.load(URGENCY_MODEL_PATH),
        }
        return _models_cache
    except Exception:
        return None


def _fallback_category(text_lower: str) -> str:
    if "leak" in text_lower or "water" in text_lower:
        return "Plumbing"
    if "light" in text_lower or "fan" in text_lower or "switch" in text_lower:
        return "Electrical"
    if "door" in text_lower or "lock" in text_lower:
        return "Carpenter"
    if "wifi" in text_lower or "net" in text_lower:
        return "Internet"
    if "wall" in text_lower or "ceiling" in text_lower or "crack" in text_lower:
        return "Civil"
    return "Other"


def _fallback_urgency(text: str) -> int:
    text_lower = text.lower()
    score = 1

    high_risk_keywords = [
        "fire",
        "smoke",
        "gas leak",
        "electric shock",
        "short circuit",
        "blood",
        "unconscious",
        "seizure",
        "medical emergency",
        "severe",
        "urgent",
        "collapse",
    ]
    medium_risk_keywords = [
        "broken",
        "burst",
        "overflow",
        "leak",
        "flood",
        "no power",
        "sparks",
        "burning",
        "stuck",
        "locked",
        "security",
    ]
    low_risk_keywords = [
        "noise",
        "slow",
        "minor",
        "scratched",
        "paint",
        "dust",
        "dirty",
    ]

    if any(keyword in text_lower for keyword in high_risk_keywords):
        score += 6
    if any(keyword in text_lower for keyword in medium_risk_keywords):
        score += 3
    if any(keyword in text_lower for keyword in low_risk_keywords):
        score -= 1

    exclamations = text.count("!")
    score += min(exclamations, 2)

    caps_words = re.findall(r"\b[A-Z]{3,}\b", text)
    if caps_words:
        score += 1

    return max(1, min(10, score))


def predict_category_urgency(text: str):
    """
    Mock ML service to predict category and urgency score based on complaint text.
    In a real scenario, this would load a model and perform inference.
    """
    models = _load_models()
    if models:
        category = str(models["category"].predict([text])[0])
        urgency_raw = models["urgency"].predict([text])[0]
        try:
            urgency_score = int(round(float(urgency_raw)))
        except (TypeError, ValueError):
            urgency_score = _fallback_urgency(text)
        urgency_score = max(1, min(10, urgency_score))
    else:
        text_lower = text.lower()
        category = _fallback_category(text_lower)
        urgency_score = _fallback_urgency(text)
    
    return {
        "category": category,
        "urgency_score": urgency_score
    }
