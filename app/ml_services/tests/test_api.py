from fastapi.testclient import TestClient

from ml_service.main import create_app


def test_health_is_available() -> None:
    response = TestClient(create_app()).get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.headers["X-Request-ID"]


def test_readiness_is_controlled_without_a_model() -> None:
    response = TestClient(create_app()).get("/ready")
    assert response.status_code == 503
    assert response.json()["models_ready"] is False


def test_capabilities_do_not_claim_unimplemented_inference() -> None:
    response = TestClient(create_app()).get("/api/v1/capabilities")
    assert response.status_code == 200
    assert "classification" in response.json()["planned"]
