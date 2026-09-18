#!/usr/bin/env python3
"""Train customer complaint classifier benchmark (TF-IDF + SVM vs Logistic Regression).

Selects best model based on validation macro F1, serializes artifact,
and updates config/model_registry.yaml.
"""

import argparse
from datetime import UTC, datetime
from pathlib import Path

import joblib
import pandas as pd
import yaml
from sklearn.calibration import CalibratedClassifierCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, f1_score
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC


def train_and_select_best(
    train_csv: Path,
    val_csv: Path,
    output_dir: Path,
    registry_path: Path,
) -> None:
    print(f"Loading train split: {train_csv}")
    train_df = pd.read_csv(train_csv).fillna("")
    print(f"Loading val split: {val_csv}")
    val_df = pd.read_csv(val_csv).fillna("")

    X_train = train_df["complaint_text"].tolist()
    y_train = train_df["category"].tolist()
    X_val = val_df["complaint_text"].tolist()
    y_val = val_df["category"].tolist()

    # Candidate 1: TF-IDF + Calibrated LinearSVC
    print("Training Candidate 1: TF-IDF + Calibrated LinearSVC...")
    pipe_svm = Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    ngram_range=(1, 2),
                    max_features=25000,
                    sublinear_tf=True,
                    strip_accents="unicode",
                ),
            ),
            (
                "clf",
                CalibratedClassifierCV(
                    estimator=LinearSVC(class_weight="balanced", random_state=42, max_iter=2000),
                    method="sigmoid",
                    cv=3,
                ),
            ),
        ]
    )
    pipe_svm.fit(X_train, y_train)
    val_preds_svm = pipe_svm.predict(X_val)
    macro_f1_svm = float(f1_score(y_val, val_preds_svm, average="macro"))
    weighted_f1_svm = float(f1_score(y_val, val_preds_svm, average="weighted"))
    print(
        f"Candidate 1 (Calibrated SVM) - Macro F1: {macro_f1_svm:.4f}, "
        f"Weighted F1: {weighted_f1_svm:.4f}"
    )

    # Candidate 2: TF-IDF + Logistic Regression
    print("Training Candidate 2: TF-IDF + Logistic Regression...")
    pipe_lr = Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    ngram_range=(1, 2),
                    max_features=25000,
                    sublinear_tf=True,
                    strip_accents="unicode",
                ),
            ),
            (
                "clf",
                LogisticRegression(
                    class_weight="balanced",
                    max_iter=1000,
                    random_state=42,
                    C=1.0,
                ),
            ),
        ]
    )
    pipe_lr.fit(X_train, y_train)
    val_preds_lr = pipe_lr.predict(X_val)
    macro_f1_lr = float(f1_score(y_val, val_preds_lr, average="macro"))
    weighted_f1_lr = float(f1_score(y_val, val_preds_lr, average="weighted"))
    print(
        f"Candidate 2 (Logistic Regression) - Macro F1: {macro_f1_lr:.4f}, "
        f"Weighted F1: {weighted_f1_lr:.4f}"
    )

    # Select best candidate
    if macro_f1_svm >= macro_f1_lr:
        best_pipeline = pipe_svm
        best_name = "tfidf-calibrated-linearsvc"
        best_framework = "scikit-learn LinearSVC (Calibrated)"
        best_macro_f1 = macro_f1_svm
        best_weighted_f1 = weighted_f1_svm
        best_preds = val_preds_svm
    else:
        best_pipeline = pipe_lr
        best_name = "tfidf-logistic-regression"
        best_framework = "scikit-learn LogisticRegression"
        best_macro_f1 = macro_f1_lr
        best_weighted_f1 = weighted_f1_lr
        best_preds = val_preds_lr

    print(f"\nWinning Model: {best_name} with Macro F1 = {best_macro_f1:.4f}")
    print("\nValidation Classification Report:")
    print(classification_report(y_val, best_preds, digits=4))

    # Also train optional Level 2 fine-grained intent classifier
    print("Training Level 2 fine-grained intent classifier...")
    y_train_intent = train_df["intent"].tolist()
    pipe_fg = Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    ngram_range=(1, 2),
                    max_features=25000,
                    sublinear_tf=True,
                    strip_accents="unicode",
                ),
            ),
            (
                "clf",
                LogisticRegression(
                    class_weight="balanced",
                    max_iter=1000,
                    random_state=42,
                    C=1.0,
                ),
            ),
        ]
    )
    pipe_fg.fit(X_train, y_train_intent)

    # Save artifacts
    output_dir.mkdir(parents=True, exist_ok=True)
    model_artifact_path = output_dir / "complaint_classifier_v1.joblib"
    fg_artifact_path = output_dir / "intent_classifier_v1.joblib"

    joblib.dump(best_pipeline, model_artifact_path)
    joblib.dump(pipe_fg, fg_artifact_path)
    print(f"Saved primary model to: {model_artifact_path}")
    print(f"Saved fine-grained model to: {fg_artifact_path}")

    # Register model in model_registry.yaml
    today = datetime.now(UTC).strftime("%Y-%m-%d")
    registry_entry = {
        "models": [
            {
                "model_name": "complaint-classifier",
                "version": "1.0.0",
                "training_dataset": "unified_customer_phishing_data_subset (1).csv",
                "training_date": today,
                "framework": best_framework,
                "metrics": {
                    "val_macro_f1": round(best_macro_f1, 4),
                    "val_weighted_f1": round(best_weighted_f1, 4),
                },
                "parameters": {
                    "vectorizer": "TfidfVectorizer(1,2)",
                    "algorithm": best_name,
                    "confidence_threshold": "0.60",
                },
                "status": "production",
            }
        ]
    }

    registry_path.parent.mkdir(parents=True, exist_ok=True)
    with registry_path.open("w", encoding="utf-8") as f:
        yaml.safe_dump(registry_entry, f, sort_keys=False)
    print(f"Updated model registry at: {registry_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Train customer complaint classifier.")
    parser.add_argument("--train-csv", type=str, default="data/processed/train.csv")
    parser.add_argument("--val-csv", type=str, default="data/processed/val.csv")
    parser.add_argument("--output-dir", type=str, default="models")
    parser.add_argument("--registry-path", type=str, default="config/model_registry.yaml")
    args = parser.parse_args()

    train_and_select_best(
        Path(args.train_csv),
        Path(args.val_csv),
        Path(args.output_dir),
        Path(args.registry_path),
    )


if __name__ == "__main__":
    main()
