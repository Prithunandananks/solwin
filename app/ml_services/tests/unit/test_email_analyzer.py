from ml_service.api.schemas import SecurityRiskLevel
from ml_service.security.email_analyzer import EmailAnalyzer


def test_email_extraction_from_text() -> None:
    analyzer = EmailAnalyzer()
    text = (
        "Please reach out to support@shopzilla.com or "
        "suspicious@amaz0n-security.com for assistance."
    )
    emails = analyzer.extract_emails(text)
    assert len(emails) == 2
    assert "support@shopzilla.com" in emails
    assert "suspicious@amaz0n-security.com" in emails


def test_typosquatting_brand_lookalike() -> None:
    analyzer = EmailAnalyzer()
    res = analyzer.analyze_email("service@amaz0n-security.com")
    assert res.risk_level == SecurityRiskLevel.HIGH
    assert any("typosquatting_lookalike" in r or "brand_impersonation" in r for r in res.reasons)


def test_disposable_email_domain() -> None:
    analyzer = EmailAnalyzer()
    res = analyzer.analyze_email("hacker@mailinator.com")
    assert res.is_disposable is True
    assert "disposable_temporary_email_domain" in res.reasons
    assert res.risk_level == SecurityRiskLevel.HIGH


def test_legitimate_customer_email() -> None:
    analyzer = EmailAnalyzer()
    res = analyzer.analyze_email("regular.user@gmail.com")
    assert res.is_free_provider is True
    assert res.risk_level in {SecurityRiskLevel.SAFE, SecurityRiskLevel.LOW}
