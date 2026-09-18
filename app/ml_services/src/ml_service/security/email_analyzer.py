import re
from datetime import UTC, datetime

from ml_service.api.schemas import EmailAnalysis, SecurityRiskLevel

EMAIL_REGEX = re.compile(
    r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
)

FREE_PROVIDERS = {
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "aol.com",
    "icloud.com",
    "protonmail.com",
    "mail.com",
    "zoho.com",
}

DISPOSABLE_DOMAINS = {
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "throwawaymail.com",
    "yopmail.com",
    "sharklasers.com",
    "mailinator.com",
}

# Major brands commonly targeted by lookalike typosquatting
TARGET_BRANDS = [
    ("amazon", ["amaz0n", "arnazon", "amzon", "amazone"]),
    ("google", ["g00gle", "googel", "g0ogle", "googl"]),
    ("paypal", ["paypa1", "paypai", "pay-pal", "paypall"]),
    ("microsoft", ["micros0ft", "m1crosoft", "micro-soft"]),
    ("shopzilla", ["shopzi11a", "shopzila", "shop-zilla", "sh0pzilla"]),
    ("apple", ["app1e", "app-le", "appl-e"]),
    ("netflix", ["netf1ix", "net-flix", "netfllx"]),
]


class EmailAnalyzer:
    """Extracts and analyzes email addresses for typosquatting, spoofing, and domain risk."""

    def __init__(self) -> None:
        pass

    def extract_emails(self, text: str | None) -> list[str]:
        if not text:
            return []
        found = EMAIL_REGEX.findall(text)
        seen = set()
        clean = []
        for e in found:
            norm = e.lower().strip()
            if norm not in seen:
                seen.add(norm)
                clean.append(norm)
        return clean

    def analyze_email(self, raw_email: str) -> EmailAnalysis:
        email = raw_email.lower().strip()
        parts = email.split("@")
        domain = parts[1] if len(parts) == 2 else ""

        reasons: list[str] = []
        risk_score = 0.0

        is_free = domain in FREE_PROVIDERS
        is_disposable = domain in DISPOSABLE_DOMAINS

        if is_disposable:
            reasons.append("disposable_temporary_email_domain")
            risk_score += 0.60

        if "xn--" in domain:
            reasons.append("punycode_homograph_domain")
            risk_score += 0.50

        # Check lookalike typosquatting against major brands
        domain_without_tld = domain.split(".")[0] if "." in domain else domain
        for brand, lookalikes in TARGET_BRANDS:
            # Check exact lookalike match
            for la in lookalikes:
                if la in domain_without_tld:
                    reasons.append(f"typosquatting_lookalike_of_{brand}")
                    risk_score += 0.70
                    break
            # Check brand followed by suspicious suffix like amazon-security, paypal-support
            if f"{brand}-" in domain or f"{brand}support" in domain or f"{brand}security" in domain:
                if domain not in {f"{brand}.com", f"{brand}.org"}:
                    reasons.append(f"unauthorized_brand_impersonation_{brand}")
                    risk_score += 0.65

        # Check numeric character substitution in domain
        if re.search(r"[0-9]", domain_without_tld) and not is_free:
            reasons.append("numeric_character_in_domain_name")
            risk_score += 0.15

        # Check multiple hyphenation
        if domain.count("-") >= 2:
            reasons.append("excessive_hyphenation_in_domain")
            risk_score += 0.20

        risk_score = min(round(risk_score, 4), 1.0)

        # Categorize risk level
        if risk_score >= 0.60:
            risk_level = SecurityRiskLevel.HIGH
        elif risk_score >= 0.35:
            risk_level = SecurityRiskLevel.MEDIUM
        elif risk_score >= 0.10:
            risk_level = SecurityRiskLevel.LOW
        else:
            risk_level = SecurityRiskLevel.SAFE

        if not reasons:
            reasons.append("valid_syntax_no_anomalies_detected")

        return EmailAnalysis(
            email=email,
            domain=domain,
            risk_level=risk_level,
            risk_score=risk_score,
            reasons=reasons,
            is_free_provider=is_free,
            is_disposable=is_disposable,
            analyzed_at=datetime.now(UTC),
        )

    def analyze_text(self, text: str | None) -> list[EmailAnalysis]:
        emails = self.extract_emails(text)
        return [self.analyze_email(e) for e in emails]
