from ml_service.api.schemas import SecurityRiskLevel
from ml_service.security.url_analyzer import URLAnalyzer


def test_url_extraction_from_text() -> None:
    analyzer = URLAnalyzer()
    text = (
        "Please verify your account here: https://secure-login.xyz/auth "
        "and also see www.example.com/test."
    )
    urls = analyzer.extract_urls(text)
    assert len(urls) == 2
    assert "https://secure-login.xyz/auth" in urls
    assert "www.example.com/test" in urls


def test_ip_address_host_risk() -> None:
    analyzer = URLAnalyzer()
    res = analyzer.analyze_url("http://192.168.1.100/login/password.php")
    assert res.domain == "192.168.1.100"
    assert "ip_address_host" in res.signals
    assert res.risk_level in {SecurityRiskLevel.HIGH, SecurityRiskLevel.MEDIUM}
    assert res.risk_score >= 0.40


def test_punycode_homograph_domain() -> None:
    analyzer = URLAnalyzer()
    res = analyzer.analyze_url("http://xn--amazn-7qa.com/account")
    assert "punycode_homograph_domain" in res.signals
    assert res.risk_score >= 0.40


def test_url_shortener_risk() -> None:
    analyzer = URLAnalyzer()
    res = analyzer.analyze_url("https://bit.ly/3xYqzP")
    assert "url_shortener" in res.signals


def test_legitimate_https_url() -> None:
    analyzer = URLAnalyzer()
    res = analyzer.analyze_url("https://shopzilla.com/help")
    assert res.risk_level == SecurityRiskLevel.SAFE
    assert res.risk_score < 0.20
