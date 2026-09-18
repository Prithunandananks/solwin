import logging
from dataclasses import dataclass
from pathlib import Path

import pandas as pd
import yaml
from sklearn.model_selection import train_test_split

from ml_service.api.schemas import BusinessCategory
from ml_service.preprocessing.cleaner import build_complaint_text

logger = logging.getLogger(__name__)


@dataclass
class DatasetProfile:
    total_rows: int
    missing_message_count: int
    missing_subject_count: int
    exact_duplicate_rows: int
    duplicate_message_count: int
    distinct_intents: int
    distinct_categories: int
    category_distribution: dict[str, int]
    intent_distribution: dict[str, int]
    avg_text_length: float
    max_text_length: int
    min_text_length: int
    leakage_detected_in_issue: bool
    leakage_issue_match_count: int


def load_category_mapping(mapping_path: Path | str) -> dict[str, str]:
    """Load intent to business category mapping yaml file."""
    path = Path(mapping_path)
    if not path.exists():
        raise FileNotFoundError(f"Mapping configuration not found at {path}")
    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    mappings: dict[str, str] = data.get("mappings", {})
    return mappings


def map_intent_to_category(
    intent: str,
    mapping: dict[str, str],
    default_category: str = BusinessCategory.OTHER.value,
) -> str:
    """Safely map raw intent to the 11 BusinessCategory enum values."""
    cleaned_intent = intent.strip() if intent else ""
    cat = mapping.get(cleaned_intent, default_category)
    # Ensure category is valid BusinessCategory
    try:
        return BusinessCategory(cat).value
    except ValueError:
        return BusinessCategory.OTHER.value


def profile_raw_dataset(
    csv_path: Path | str,
    mapping_path: Path | str,
) -> tuple[pd.DataFrame, DatasetProfile]:
    """Inspect dataset, validate encoding, check leakage and return cleaned DataFrame."""
    csv_file = Path(csv_path)
    if not csv_file.exists():
        raise FileNotFoundError(f"Dataset CSV not found at {csv_file}")

    df = pd.read_csv(csv_file, encoding="utf-8", dtype=str)
    mapping = load_category_mapping(mapping_path)

    # Standardize column values
    df["message"] = df["message"].fillna("").astype(str).str.strip()
    df["subject"] = df["subject"].fillna("").astype(str).str.strip()
    df["intent"] = df["intent"].fillna("").astype(str).str.strip()
    df["issue"] = df["issue"].fillna("").astype(str).str.strip()

    total_rows = len(df)
    missing_msg = int((df["message"] == "").sum())
    missing_subj = int((df["subject"] == "").sum())
    exact_duplicates = int(df.duplicated().sum())

    # Build safe complaint text without 'issue'
    df["complaint_text"] = [
        build_complaint_text(msg, subj)
        for msg, subj in zip(df["message"], df["subject"], strict=False)
    ]

    # Check leakage: Does 'issue' contain '{intent} - {msg}'?
    leakage_matches = 0
    for row in df.itertuples():
        expected = f"{row.intent} - {row.message}"
        if row.issue == expected:
            leakage_matches += 1

    leakage_detected = leakage_matches > 0

    # Map categories
    df["category"] = [map_intent_to_category(intent, mapping) for intent in df["intent"]]

    # Duplicate message count (case-insensitive)
    msg_lower = df["complaint_text"].str.lower()
    dup_msg_count = int(msg_lower.duplicated().sum())

    text_lens = df["complaint_text"].str.len()
    avg_len = float(text_lens.mean()) if not text_lens.empty else 0.0
    max_len = int(text_lens.max()) if not text_lens.empty else 0
    min_len = int(text_lens.min()) if not text_lens.empty else 0

    cat_dist = {str(k): int(v) for k, v in df["category"].value_counts().to_dict().items()}
    intent_dist = {str(k): int(v) for k, v in df["intent"].value_counts().to_dict().items()}

    profile = DatasetProfile(
        total_rows=total_rows,
        missing_message_count=missing_msg,
        missing_subject_count=missing_subj,
        exact_duplicate_rows=exact_duplicates,
        duplicate_message_count=dup_msg_count,
        distinct_intents=len(intent_dist),
        distinct_categories=len(cat_dist),
        category_distribution=cat_dist,
        intent_distribution=intent_dist,
        avg_text_length=avg_len,
        max_text_length=max_len,
        min_text_length=min_len,
        leakage_detected_in_issue=leakage_detected,
        leakage_issue_match_count=leakage_matches,
    )

    return df, profile


def create_reproducible_splits(
    df: pd.DataFrame,
    test_size: float = 0.15,
    val_size: float = 0.15,
    random_state: int = 42,
    stratify_col: str = "category",
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Create reproducible stratified train, val, and test splits.

    Guarantees strict isolation and handles single-item rare classes safely.
    Excludes the leaked 'issue' column from modeling features.
    """
    if stratify_col not in df.columns:
        raise KeyError(f"Column '{stratify_col}' not found in dataframe")

    # Clean out completely empty complaint text rows (e.g. 3 empty rows)
    clean_df = df[df["complaint_text"].str.len() > 0].copy().reset_index(drop=True)

    # Identify classes with < 2 instances that cannot be stratified
    class_counts = clean_df[stratify_col].value_counts()
    rare_classes = class_counts[class_counts < 2].index.tolist()

    stratified_subset = clean_df[~clean_df[stratify_col].isin(rare_classes)]
    rare_subset = clean_df[clean_df[stratify_col].isin(rare_classes)]

    # First split off test set
    train_val_df, test_df = train_test_split(
        stratified_subset,
        test_size=test_size,
        random_state=random_state,
        stratify=stratified_subset[stratify_col],
    )

    # Next split train and val
    relative_val_size = val_size / (1.0 - test_size)
    train_df, val_df = train_test_split(
        train_val_df,
        test_size=relative_val_size,
        random_state=random_state,
        stratify=train_val_df[stratify_col],
    )

    # Put rare classes into training set so model has observed them
    if not rare_subset.empty:
        train_df = pd.concat([train_df, rare_subset], ignore_index=True)  # type: ignore[list-item]

    return (
        train_df.reset_index(drop=True),
        val_df.reset_index(drop=True),
        test_df.reset_index(drop=True),
    )
