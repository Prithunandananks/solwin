from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import JSONResponse

from ml_service.analytics.frequency import FrequencyTracker
from ml_service.api.schemas import (
    ActionRecommendation,
    BatchClusterRequest,
    BatchClusterResponse,
    ClassificationResult,
    ClusterAssignment,
    ClusterMetadata,
    ComplaintInput,
    FrequencyReport,
    HealthResponse,
    ReadinessResponse,
    RecommendationRequest,
    ResolutionResult,
    UrgencyResult,
)
from ml_service.classification.classifier import ComplaintClassifier
from ml_service.clustering.clusterer import ComplaintClusterer
from ml_service.core.model_registry import ModelRegistry
from ml_service.recommendation.engine import RecommendationEngine
from ml_service.resolution.detector import ResolutionDetector
from ml_service.urgency.detector import UrgencyDetector

router = APIRouter()


def registry(request: Request) -> ModelRegistry:
    return request.app.state.model_registry  # type: ignore[no-any-return]


def classifier(request: Request) -> ComplaintClassifier:
    return request.app.state.classifier  # type: ignore[no-any-return]


def clusterer(request: Request) -> ComplaintClusterer:
    return request.app.state.clusterer  # type: ignore[no-any-return]


def frequency_tracker(request: Request) -> FrequencyTracker:
    return request.app.state.frequency_tracker  # type: ignore[no-any-return]


def urgency_detector(request: Request) -> UrgencyDetector:
    return request.app.state.urgency_detector  # type: ignore[no-any-return]


def resolution_detector(request: Request) -> ResolutionDetector:
    return request.app.state.resolution_detector  # type: ignore[no-any-return]


def recommendation_engine(request: Request) -> RecommendationEngine:
    return request.app.state.recommendation_engine  # type: ignore[no-any-return]


@router.get("/health", response_model=HealthResponse, tags=["operations"])
def health() -> HealthResponse:
    return HealthResponse(status="ok", service="customer-complaint-intelligence", version="0.1.0")


@router.get("/ready", response_model=ReadinessResponse, tags=["operations"])
def ready(request: Request) -> ReadinessResponse | JSONResponse:
    if registry(request).is_ready() and classifier(request).is_loaded:
        return ReadinessResponse(status="ready", models_ready=True)
    result = ReadinessResponse(
        status="not_ready",
        models_ready=False,
        detail="No production model is registered and loaded. "
        "Train and register a model before serving.",
    )
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content=result.model_dump(),
    )


@router.get("/api/v1/models", tags=["models"])
def list_models(request: Request) -> dict[str, object]:
    return {"models": registry(request).list()}


@router.post("/api/v1/classify", response_model=ClassificationResult, tags=["classification"])
def classify_complaint(
    complaint: ComplaintInput,
    request: Request,
    threshold: float | None = None,
) -> ClassificationResult:
    clf = classifier(request)
    if not clf.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Classifier model is not ready.",
        )
    result = clf.classify(message=complaint.message, subject=complaint.subject, threshold=threshold)

    # Accumulate live production telemetry
    tracker = frequency_tracker(request)
    tracker.record_event(category=result.category.value)

    return result


@router.post("/api/v1/cluster", response_model=ClusterAssignment, tags=["clustering"])
def cluster_single(
    complaint: ComplaintInput,
    request: Request,
) -> ClusterAssignment:
    cl = clusterer(request)
    if not cl.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Clusterer model is not ready.",
        )
    assignment = cl.assign(message=complaint.message, subject=complaint.subject)
    # Record cluster in live telemetry
    tracker = frequency_tracker(request)
    tracker.record_event(
        category=assignment.dominant_category.value,
        cluster_id=assignment.cluster_id,
    )
    return assignment


@router.post("/api/v1/cluster/batch", response_model=BatchClusterResponse, tags=["clustering"])
def cluster_batch(
    batch: BatchClusterRequest,
    request: Request,
) -> BatchClusterResponse:
    cl = clusterer(request)
    if not cl.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Clusterer model is not ready.",
        )
    pairs = [(c.message, c.subject) for c in batch.complaints]
    assignments = cl.assign_batch(pairs)
    tracker = frequency_tracker(request)
    for a in assignments:
        tracker.record_event(category=a.dominant_category.value, cluster_id=a.cluster_id)
    return BatchClusterResponse(assignments=assignments, total_processed=len(assignments))


@router.get("/api/v1/clusters", response_model=list[ClusterMetadata], tags=["clustering"])
def get_clusters(request: Request) -> list[ClusterMetadata]:
    cl = clusterer(request)
    if not cl.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Clusterer model is not ready.",
        )
    return cl.list_clusters()


@router.get("/api/v1/analytics/frequency", response_model=FrequencyReport, tags=["analytics"])
def get_frequency_analytics(request: Request) -> FrequencyReport:
    tracker = frequency_tracker(request)
    return tracker.get_report()


@router.post("/api/v1/urgency", response_model=UrgencyResult, tags=["urgency"])
def detect_urgency(
    complaint: ComplaintInput,
    request: Request,
) -> UrgencyResult:
    detector = urgency_detector(request)
    return detector.detect(message=complaint.message, subject=complaint.subject)


@router.post("/api/v1/resolution", response_model=ResolutionResult, tags=["resolution"])
def detect_resolution(
    complaint: ComplaintInput,
    request: Request,
) -> ResolutionResult:
    detector = resolution_detector(request)
    return detector.detect(message=complaint.message, subject=complaint.subject)


@router.post("/api/v1/recommend", response_model=ActionRecommendation, tags=["recommendation"])
def recommend_action(
    req: RecommendationRequest,
    request: Request,
) -> ActionRecommendation:
    engine = recommendation_engine(request)

    # Derive category and urgency if not explicitly provided
    category = req.category
    if category is None:
        clf = classifier(request)
        if clf.is_loaded:
            cat_res = clf.classify(message=req.complaint.message, subject=req.complaint.subject)
            category = cat_res.category

    urgency = req.urgency
    if urgency is None:
        urg_detector = urgency_detector(request)
        urg_res = urg_detector.detect(message=req.complaint.message, subject=req.complaint.subject)
        urgency = urg_res.urgency

    resolution = req.resolution
    if resolution is None:
        res_detector = resolution_detector(request)
        res_res = res_detector.detect(message=req.complaint.message, subject=req.complaint.subject)
        resolution = res_res.status

    return engine.recommend(
        category=category,
        urgency=urgency,
        resolution=resolution,
        security_risk=req.security_risk,
    )


@router.get("/api/v1/capabilities", tags=["operations"])
def capabilities() -> dict[str, object]:
    return {
        "status": "active",
        "available": [
            "health",
            "readiness",
            "model_registry",
            "classification",
            "clustering",
            "frequency_analytics",
            "urgency",
            "resolution",
            "recommendation",
        ],
        "planned": [
            "url",
            "email",
            "summary",
        ],
    }
