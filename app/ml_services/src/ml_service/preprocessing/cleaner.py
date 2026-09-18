import re
import unicodedata


def normalize_text(text: str | None) -> str:
    """Normalize whitespace, unicode characters, and strip leading/trailing spaces.

    Never uses the 'issue' column to prevent target leakage.
    """
    if not text:
        return ""
    # Normalize unicode (NFKC)
    normalized = unicodedata.normalize("NFKC", text)
    # Replace carriage returns / tabs with space
    normalized = re.sub(r"[\r\n\t]+", " ", normalized)
    # Collapse multiple consecutive whitespace characters
    normalized = re.sub(r"\s+", " ", normalized)
    return normalized.strip()


def build_complaint_text(
    message: str | None,
    subject: str | None = None,
    max_length: int = 10_000,
) -> str:
    """Safely combine subject and message without incorporating 'issue'."""
    clean_subj = normalize_text(subject)
    clean_msg = normalize_text(message)

    if clean_subj and clean_msg:
        combined = f"{clean_subj} {clean_msg}"
    elif clean_subj:
        combined = clean_subj
    else:
        combined = clean_msg

    if len(combined) > max_length:
        combined = combined[:max_length].rstrip()

    return combined
