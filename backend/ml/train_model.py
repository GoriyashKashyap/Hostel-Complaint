from __future__ import annotations

import csv
from pathlib import Path
from typing import List, Tuple

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score


DATA_PATH = Path(__file__).with_name("seed_data.csv")
MODEL_DIR = Path(__file__).resolve().parent
CATEGORY_MODEL_PATH = MODEL_DIR / "category_model.joblib"
URGENCY_MODEL_PATH = MODEL_DIR / "urgency_model.joblib"


def _load_data(csv_path: Path) -> Tuple[List[str], List[str], List[int]]:
    texts: List[str] = []
    categories: List[str] = []
    urgencies: List[int] = []

    with csv_path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            text = (row.get("text") or "").strip()
            category = (row.get("category") or "Other").strip()
            urgency_raw = (row.get("urgency_score") or "1").strip()
            if not text:
                continue
            try:
                urgency = int(urgency_raw)
            except ValueError:
                urgency = 1
            urgency = max(1, min(10, urgency))
            texts.append(text)
            categories.append(category)
            urgencies.append(urgency)

    return texts, categories, urgencies


def _build_pipeline() -> Pipeline:
    return Pipeline(
        steps=[
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
            ("clf", LogisticRegression(max_iter=1000)),
        ]
    )


def train(csv_path: Path = DATA_PATH) -> None:
    if not csv_path.exists():
        raise FileNotFoundError(f"Training data not found: {csv_path}")

    texts, categories, urgencies = _load_data(csv_path)
    if len(texts) < 5:
        raise ValueError("Need at least 5 labeled rows to train.")

    X_train, X_test, y_cat_train, y_cat_test, y_urg_train, y_urg_test = train_test_split(
        texts,
        categories,
        urgencies,
        test_size=0.2,
        random_state=42,
        stratify=categories,
    )

    category_model = _build_pipeline()
    urgency_model = _build_pipeline()

    category_model.fit(X_train, y_cat_train)
    urgency_model.fit(X_train, y_urg_train)

    cat_pred = category_model.predict(X_test)
    urg_pred = urgency_model.predict(X_test)

    print(f"Category accuracy: {accuracy_score(y_cat_test, cat_pred):.2f}")
    print(f"Urgency accuracy:  {accuracy_score(y_urg_test, urg_pred):.2f}")

    joblib.dump(category_model, CATEGORY_MODEL_PATH)
    joblib.dump(urgency_model, URGENCY_MODEL_PATH)
    print(f"Saved: {CATEGORY_MODEL_PATH}")
    print(f"Saved: {URGENCY_MODEL_PATH}")


if __name__ == "__main__":
    train()
