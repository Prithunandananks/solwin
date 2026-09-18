from ml_service.api.schemas import UrgencyLevel
from ml_service.urgency.detector import UrgencyDetector


def test_critical_security_unauthorized_transaction() -> None:
    detector = UrgencyDetector()
    result = detector.detect(
        message="Someone made an unauthorized transaction of $500 on my account.",
        subject="Fraud alert",
    )
    assert result.urgency == UrgencyLevel.CRITICAL
    assert "unauthorized_transaction_indicator" in result.signals
    assert result.confidence >= 0.90


def test_critical_account_hacked() -> None:
    detector = UrgencyDetector()
    result = detector.detect(
        message="My account has been hacked and password changed without my permission.",
        subject=None,
    )
    assert result.urgency == UrgencyLevel.CRITICAL
    assert "account_compromise_detected" in result.signals


def test_customer_anger_without_operational_loss_is_not_critical() -> None:
    detector = UrgencyDetector()
    # Angry customer with delay - must NOT be marked CRITICAL
    result = detector.detect(
        message="I am extremely furious and angry with your pathetic service! You guys are clowns!",
        subject="Awful experience",
    )
    # Anger does not equate to critical operational risk
    assert result.urgency != UrgencyLevel.CRITICAL


def test_high_urgency_deadline_and_refund() -> None:
    detector = UrgencyDetector()
    result = detector.detect(
        message="Where is my refund? I have been waiting for urgent response immediately.",
        subject="Refund overdue",
    )
    assert result.urgency == UrgencyLevel.HIGH


def test_low_urgency_routine_inquiry() -> None:
    detector = UrgencyDetector()
    result = detector.detect(
        message="Can you please share information about your return policy?",
        subject="General enquiry",
    )
    assert result.urgency == UrgencyLevel.LOW
