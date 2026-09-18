import time

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
    ConversationSummary,
    EmailAnalysis,
    EmailAnalysisRequest,
    EmailAnalysisResponse,
    FrequencyReport,
    HealthResponse,
    ReadinessResponse,
    RecommendationRequest,
    ResolutionResult,
    SecurityAnalysisSummary,
    SecurityRiskLevel,
    SummarizeRequest,
    UnifiedAnalysisRequest,
    UnifiedAnalysisResponse,
    UrgencyResult,
    URLAnalysis,
    URLAnalysisRequest,
    URLAnalysisResponse,
)
from ml_service.classification.classifier import ComplaintClassifier
from ml_service.clustering.clusterer import ComplaintClusterer
from ml_service.core.model_registry import ModelRegistry
from ml_service.preprocessing.cleaner import build_complaint_text
from ml_service.recommendation.engine import RecommendationEngine
from ml_service.resolution.detector import ResolutionDetector
from ml_service.security.email_analyzer import EmailAnalyzer
from ml_service.security.url_analyzer import URLAnalyzer
from ml_service.summarization.summarizer import ConversationSummarizer
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


def url_analyzer(request: Request) -> URLAnalyzer:
    return request.app.state.url_analyzer  # type: ignore[no-any-return]


def email_analyzer(request: Request) -> EmailAnalyzer:
    return request.app.state.email_analyzer  # type: ignore[no-any-return]


def summarizer(request: Request) -> ConversationSummarizer:
    return request.app.state.summarizer  # type: ignore[no-any-return]


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


@router.post("/api/v1/url/analyze", response_model=URLAnalysisResponse, tags=["security"])
def analyze_urls(
    req: URLAnalysisRequest,
    request: Request,
) -> URLAnalysisResponse:
    analyzer = url_analyzer(request)
    results: list[URLAnalysis] = []
    if req.url:
        results.append(analyzer.analyze_url(req.url))
    if req.text:
        text_results = analyzer.analyze_text(req.text)
        # Avoid duplicate if same url was explicitly passed
        existing_urls = {r.url for r in results}
        for tr in text_results:
            if tr.url not in existing_urls:
                results.append(tr)
                existing_urls.add(tr.url)

    return URLAnalysisResponse(results=results, total_found=len(results))


@router.post("/api/v1/email/analyze", response_model=EmailAnalysisResponse, tags=["security"])
def analyze_emails(
    req: EmailAnalysisRequest,
    request: Request,
) -> EmailAnalysisResponse:
    analyzer = email_analyzer(request)
    results: list[EmailAnalysis] = []
    if req.email:
        results.append(analyzer.analyze_email(req.email))
    if req.text:
        text_results = analyzer.analyze_text(req.text)
        existing_emails = {r.email for r in results}
        for tr in text_results:
            if tr.email not in existing_emails:
                results.append(tr)
                existing_emails.add(tr.email)

    return EmailAnalysisResponse(results=results, total_found=len(results))


@router.post(
    "/api/v1/summarize",
    response_model=ConversationSummary,
    tags=["summarization"],
)
def summarize_conversation(
    req: SummarizeRequest,
    request: Request,
) -> ConversationSummary:
    engine = summarizer(request)
    return engine.summarize(
        message=req.complaint.message,
        subject=req.complaint.subject,
        prefer_llm=req.prefer_llm,
    )


@router.post(
    "/api/v1/analyze",
    response_model=UnifiedAnalysisResponse,
    tags=["unified"],
)
def analyze_complaint(
    req: UnifiedAnalysisRequest,
    request: Request,
) -> UnifiedAnalysisResponse:
    start_time = time.perf_counter()
    warnings: list[str] = []

    msg = req.complaint.message
    subj = req.complaint.subject
    text = build_complaint_text(msg, subj)
    if not text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Complaint must include at least one non-empty 'message' or 'subject' field.",
        )

    # 1. Classification
    cls_engine = classifier(request)
    if not cls_engine.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Classifier model is not loaded.",
        )
    classification_result = cls_engine.classify(msg, subj)

    # 2. Clustering
    cluster_res: ClusterAssignment | None = None
    if req.include_cluster:
        try:
            cl_engine = clusterer(request)
            if cl_engine.is_loaded:
                cluster_res = cl_engine.assign(msg, subj)
            else:
                warnings.append("Clusterer model is not loaded.")
        except Exception as e:
            warnings.append(f"Clustering failed: {e}")

    # 3. Frequency tracking
    try:
        freq_tracker = frequency_tracker(request)
        freq_tracker.record_event(
            category=classification_result.category.value,
            cluster_id=cluster_res.cluster_id if cluster_res else None,
        )
    except Exception as e:
        warnings.append(f"Frequency tracking failed: {e}")

    # 4. Urgency Detection
    urgency_res: UrgencyResult | None = None
    if req.include_urgency:
        try:
            urg_engine = urgency_detector(request)
            urgency_res = urg_engine.detect(msg, subj)
        except Exception as e:
            warnings.append(f"Urgency detection failed: {e}")

    # 5. Resolution Status Detection
    resolution_res: ResolutionResult | None = None
    if req.include_resolution:
        try:
            res_engine = resolution_detector(request)
            resolution_res = res_engine.detect(msg, subj)
        except Exception as e:
            warnings.append(f"Resolution detection failed: {e}")

    # 6. Security Analysis
    security_summary: SecurityAnalysisSummary | None = None
    if req.include_security:
        try:
            u_analyzer = url_analyzer(request)
            e_analyzer = email_analyzer(request)
            urls = u_analyzer.analyze_text(text)
            emails = e_analyzer.analyze_text(text)

            all_risks = [u.risk_level for u in urls] + [em.risk_level for em in emails]
            if SecurityRiskLevel.HIGH in all_risks:
                agg_risk = SecurityRiskLevel.HIGH
            elif SecurityRiskLevel.MEDIUM in all_risks:
                agg_risk = SecurityRiskLevel.MEDIUM
            elif SecurityRiskLevel.LOW in all_risks:
                agg_risk = SecurityRiskLevel.LOW
            elif SecurityRiskLevel.SAFE in all_risks:
                agg_risk = SecurityRiskLevel.SAFE
            else:
                agg_risk = SecurityRiskLevel.SAFE

            reasons: list[str] = []
            for u in urls:
                reasons.extend(u.signals)
            for em in emails:
                reasons.extend(em.reasons)

            security_summary = SecurityAnalysisSummary(
                urls=urls,
                emails=emails,
                aggregate_risk=agg_risk,
                requires_quarantine=agg_risk == SecurityRiskLevel.HIGH,
                risk_reasons=list(dict.fromkeys(reasons)),
            )
        except Exception as e:
            warnings.append(f"Security analysis failed: {e}")

    # 7. Action Recommendation
    recommendation_res: ActionRecommendation | None = None
    if req.include_recommendation:
        try:
            rec_engine = recommendation_engine(request)
            recommendation_res = rec_engine.recommend(
                category=classification_result.category,
                urgency=urgency_res.urgency if urgency_res else None,
                resolution=resolution_res.status if resolution_res else None,
                security_risk=(
                    security_summary.aggregate_risk.value if security_summary else None
                ),
            )
        except Exception as e:
            warnings.append(f"Recommendation failed: {e}")

    # 8. Conversation Summary
    summary_res: ConversationSummary | None = None
    if req.include_summary:
        try:
            sum_engine = summarizer(request)
            summary_res = sum_engine.summarize(
                message=msg,
                subject=subj,
                prefer_llm=req.prefer_llm,
            )
        except Exception as e:
            warnings.append(f"Summarization failed: {e}")

    latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

    return UnifiedAnalysisResponse(
        complaint_id=req.complaint_id,
        classification=classification_result,
        cluster=cluster_res,
        urgency=urgency_res,
        resolution=resolution_res,
        recommendation=recommendation_res,
        security=security_summary,
        summary=summary_res,
        processing_time_ms=latency_ms,
        warnings=warnings,
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
            "url",
            "email",
            "summary",
            "unified_analysis",
        ],
        "planned": [],
    }
