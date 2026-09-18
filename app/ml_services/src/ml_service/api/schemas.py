from datetime import datetime
from enum import StrEnum
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


class BusinessCategory(StrEnum):
    PAYMENT_TRANSACTION_ISSUE = "PAYMENT_TRANSACTION_ISSUE"
    ACCOUNT_LOGIN_PROBLEM = "ACCOUNT_LOGIN_PROBLEM"
    PRODUCT_ISSUE = "PRODUCT_ISSUE"
    DELIVERY_SHIPPING_PROBLEM = "DELIVERY_SHIPPING_PROBLEM"
    REFUND_REQUEST = "REFUND_REQUEST"
    SUBSCRIPTION_ISSUE = "SUBSCRIPTION_ISSUE"
    TECHNICAL_PROBLEM = "TECHNICAL_PROBLEM"
    SERVICE_QUALITY = "SERVICE_QUALITY"
    BILLING_PROBLEM = "BILLING_PROBLEM"
    SECURITY_CONCERN = "SECURITY_CONCERN"
    OTHER = "OTHER"


class ComplaintInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    id: UUID | None = None
    customer_id: UUID | None = None
    conversation_id: UUID | None = None
    subject: str | None = Field(default=None, max_length=2_000)
    message: str | None = Field(default=None, max_length=10_000)
    language: str | None = Field(default=None, min_length=2, max_length=16)
    created_at: datetime | None = None
    source: str | None = Field(default=None, max_length=100)
    metadata: dict[str, Any] = Field(default_factory=dict)

    @model_validator(mode="after")
    def require_text(self) -> "ComplaintInput":
        if not (self.subject or self.message):
            raise ValueError("at least one of subject or message must be supplied")
        return self


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


class ReadinessResponse(BaseModel):
    status: str
    models_ready: bool
    detail: str | None = None


class ClassificationResult(BaseModel):
    category: BusinessCategory
    confidence: float = Field(ge=0.0, le=1.0)
    probabilities: dict[str, float]
    needs_review: bool
    model_name: str
    model_version: str
    fine_grained_intent: str | None = None


class ClusterMetadata(BaseModel):
    cluster_id: int
    name: str
    size: int
    percentage: float
    dominant_category: BusinessCategory
    keywords: list[str]
    representative_examples: list[str]
    model_version: str


class ClusterAssignment(BaseModel):
    cluster_id: int
    cluster_name: str
    dominant_category: BusinessCategory
    distance: float
    keywords: list[str]


class BatchClusterRequest(BaseModel):
    complaints: list[ComplaintInput] = Field(min_length=1, max_length=500)


class BatchClusterResponse(BaseModel):
    assignments: list[ClusterAssignment]
    total_processed: int


class FrequencyReport(BaseModel):
    total_live_reports: int
    by_category: dict[str, int]
    by_cluster: dict[str, int]
    timestamp: datetime
    data_source: str = "live_production_telemetry"


class UrgencyLevel(StrEnum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class UrgencyResult(BaseModel):
    urgency: UrgencyLevel
    confidence: float = Field(ge=0.0, le=1.0)
    signals: list[str]
    reasons: list[str]


class ResolutionStatus(StrEnum):
    RESOLVED = "RESOLVED"
    UNRESOLVED = "UNRESOLVED"
    PARTIALLY_RESOLVED = "PARTIALLY_RESOLVED"
    UNKNOWN = "UNKNOWN"


class ResolutionResult(BaseModel):
    status: ResolutionStatus
    confidence: float = Field(ge=0.0, le=1.0)
    signals: list[str]
    pending_items: list[str]


class ActionType(StrEnum):
    REQUEST_MORE_INFORMATION = "REQUEST_MORE_INFORMATION"
    ESCALATE_TO_PAYMENT_TEAM = "ESCALATE_TO_PAYMENT_TEAM"
    ESCALATE_TO_SECURITY_TEAM = "ESCALATE_TO_SECURITY_TEAM"
    ESCALATE_TO_TECHNICAL_TEAM = "ESCALATE_TO_TECHNICAL_TEAM"
    ESCALATE_TO_BILLING_TEAM = "ESCALATE_TO_BILLING_TEAM"
    ESCALATE_TO_DELIVERY_TEAM = "ESCALATE_TO_DELIVERY_TEAM"
    INITIATE_REFUND_REVIEW = "INITIATE_REFUND_REVIEW"
    VERIFY_CUSTOMER_IDENTITY = "VERIFY_CUSTOMER_IDENTITY"
    RESET_ACCOUNT_ACCESS = "RESET_ACCOUNT_ACCESS"
    MONITOR = "MONITOR"
    STANDARD_SUPPORT_RESPONSE = "STANDARD_SUPPORT_RESPONSE"
    HUMAN_REVIEW = "HUMAN_REVIEW"


class ActionRecommendation(BaseModel):
    primary_action: ActionType
    secondary_actions: list[ActionType] = Field(default_factory=list)
    rationale: str
    matched_rule_id: str


class RecommendationRequest(BaseModel):
    complaint: ComplaintInput
    category: BusinessCategory | None = None
    urgency: UrgencyLevel | None = None
    resolution: ResolutionStatus | None = None
    security_risk: str | None = None


class SecurityRiskLevel(StrEnum):
    SAFE = "SAFE"
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    UNKNOWN = "UNKNOWN"


class URLAnalysis(BaseModel):
    url: str
    normalized_url: str
    domain: str
    risk_level: SecurityRiskLevel
    risk_score: float = Field(ge=0.0, le=1.0)
    signals: list[str]
    provider: str
    analyzed_at: datetime


class URLAnalysisRequest(BaseModel):
    url: str | None = None
    text: str | None = None


class URLAnalysisResponse(BaseModel):
    results: list[URLAnalysis]
    total_found: int


class EmailAnalysis(BaseModel):
    email: str
    domain: str
    risk_level: SecurityRiskLevel
    risk_score: float = Field(ge=0.0, le=1.0)
    reasons: list[str]
    is_free_provider: bool
    is_disposable: bool
    analyzed_at: datetime


class EmailAnalysisRequest(BaseModel):
    email: str | None = None
    text: str | None = None


class EmailAnalysisResponse(BaseModel):
    results: list[EmailAnalysis]
    total_found: int

class ConversationSummary(BaseModel):
    customer_issue: str
    actions_taken: list[str]
    pending_actions: list[str]
    resolution_status: ResolutionStatus
    entities_extracted: dict[str, list[str]] = Field(default_factory=dict)
    summary_mode: str  # "extractive" or "llm"
    key_phrases: list[str] = Field(default_factory=list)


class SummarizeRequest(BaseModel):
    complaint: ComplaintInput
    prefer_llm: bool = False


class SecurityAnalysisSummary(BaseModel):
    urls: list[URLAnalysis] = Field(default_factory=list)
    emails: list[EmailAnalysis] = Field(default_factory=list)
    aggregate_risk: SecurityRiskLevel = SecurityRiskLevel.SAFE
    requires_quarantine: bool = False
    risk_reasons: list[str] = Field(default_factory=list)


class UnifiedAnalysisRequest(BaseModel):
    complaint: ComplaintInput
    complaint_id: str | None = None
    include_cluster: bool = True
    include_urgency: bool = True
    include_resolution: bool = True
    include_recommendation: bool = True
    include_security: bool = True
    include_summary: bool = True
    prefer_llm: bool = False


class UnifiedAnalysisResponse(BaseModel):
    complaint_id: str | None = None
    classification: ClassificationResult
    cluster: ClusterAssignment | None = None
    urgency: UrgencyResult | None = None
    resolution: ResolutionResult | None = None
    recommendation: ActionRecommendation | None = None
    security: SecurityAnalysisSummary | None = None
    summary: ConversationSummary | None = None
    processing_time_ms: float
    warnings: list[str] = Field(default_factory=list)
