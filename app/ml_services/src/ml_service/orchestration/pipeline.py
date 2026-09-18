"""Unified Gemini pipeline — single API call that covers classification,
sentiment, social-engineering analysis, and summarization.

This module is the only place in the ML service that decides whether to call
Gemini or fall back to local models.  All callers receive a
``GeminiPipelineResult`` regardless of which path was taken.

Fallback matrix
---------------
Classification:  Gemini → local TF-IDF → needs_review=True + warning
Sentiment:       Gemini → SentimentResult(available=False) + warning
Social-eng:      Gemini → SocialEngineeringResult(provider="fallback") + warning
Summary:         Gemini → ConversationSummarizer.summarize() (extractive)
"""

import logging
from dataclasses import dataclass, field

from ml_service.ai.exceptions import (
    ProviderConfigError,
    ProviderError,
    ProviderRateLimitError,
    ProviderTimeoutError,
    ProviderValidationError,
)
from ml_service.ai.gemini_provider import GeminiProvider
from ml_service.api.schemas import (
    BusinessCategory,
    ClassificationResult,
    GeminiAnalysisOutput,
    SentimentLabel,
    SentimentResult,
    SocialEngineeringResult,
    SocialEngineeringTechnique,
)
from ml_service.classification.classifier import ComplaintClassifier
from ml_service.core.config import Settings
from ml_service.sentiment.analyzer import SentimentAnalyzer

logger = logging.getLogger(__name__)


@dataclass
class GeminiPipelineResult:
    """Output of a single Gemini pipeline run.

    All fields are populated regardless of whether Gemini or a local
    fallback was used.  Inspect ``provider`` and ``warnings`` to understand
    which path was taken.
    """

    # Classification
    classification: ClassificationResult

    # Sentiment
    sentiment: SentimentResult

    # Social engineering
    social_engineering: SocialEngineeringResult

    # Summary text (empty string means caller should use extractive summarizer)
    summary_text: str

    # Provenance
    provider: str  # "gemini" | "local" | "fallback"
    model_name: str  # e.g. "gemini-2.5-flash" or "tfidf-v1"

    warnings: list[str] = field(default_factory=list)


class GeminiPipeline:
    """Runs the single structured Gemini call and handles all fallback paths.

    One instance is created on startup and shared across requests.
    """

    def __init__(
        self,
        ai_provider: GeminiProvider | None,
        local_classifier: ComplaintClassifier,
        settings: Settings,
    ) -> None:
        self._provider = ai_provider
        self._local_classifier = local_classifier
        self._settings = settings

    def run(
        self,
        subject: str | None,
        message: str | None,
    ) -> GeminiPipelineResult:
        """Execute the pipeline and return a fully populated result.

        Never raises — all exceptions are caught and converted to fallback
        results + warning messages.
        """
        warnings: list[str] = []

        # --- Attempt Gemini ---
        if self._provider and self._provider.is_available and self._settings.gemini_enabled:
            try:
                gemini_out: GeminiAnalysisOutput = self._provider.analyze(subject, message)
                return self._build_from_gemini(gemini_out, warnings)
            except ProviderRateLimitError as exc:
                logger.warning("GeminiPipeline: rate limited, using local fallback: %s", exc)
                warnings.append("gemini_rate_limited")
            except ProviderTimeoutError as exc:
                logger.warning("GeminiPipeline: timeout, using local fallback: %s", exc)
                warnings.append("gemini_timeout")
            except ProviderValidationError as exc:
                logger.warning("GeminiPipeline: validation error, using local fallback: %s", exc)
                warnings.append("gemini_validation_error")
            except ProviderConfigError as exc:
                logger.warning("GeminiPipeline: config error, using local fallback: %s", exc)
                warnings.append("gemini_config_error")
            except ProviderError as exc:
                logger.warning("GeminiPipeline: provider error, using local fallback: %s", exc)
                warnings.append("gemini_provider_error")
            except Exception as exc:  # safety net
                logger.error("GeminiPipeline: unexpected error: %s", type(exc).__name__)
                warnings.append("gemini_unexpected_error")

        # --- Local fallback ---
        return self._build_from_local(subject, message, warnings)

    # ------------------------------------------------------------------
    # Builders
    # ------------------------------------------------------------------

    def _build_from_gemini(
        self,
        out: GeminiAnalysisOutput,
        warnings: list[str],
    ) -> GeminiPipelineResult:
        """Convert a valid GeminiAnalysisOutput into a GeminiPipelineResult."""
        # Classification
        try:
            category = BusinessCategory(out.category)
        except ValueError:
            logger.warning("GeminiPipeline: invalid category %r, falling back", out.category)
            warnings.append("classifier_fallback_used")
            return self._build_from_local(None, None, warnings)

        classification = ClassificationResult(
            category=category,
            confidence=max(0.0, min(1.0, float(out.confidence))),
            probabilities={c.value: 0.0 for c in BusinessCategory},
            needs_review=out.needs_review,
            model_name=self._provider.model_name if self._provider else "gemini",  # type: ignore[union-attr]
            model_version="1.0",
            fine_grained_intent=None,
        )
        # Set the predicted category probability to the reported confidence
        classification.probabilities[category.value] = classification.confidence

        # Sentiment
        sentiment = SentimentAnalyzer.from_gemini_output(out)

        # Social engineering
        techniques: list[SocialEngineeringTechnique] = []
        for t in out.social_engineering_techniques:
            try:
                techniques.append(SocialEngineeringTechnique(t))
            except ValueError:
                logger.warning("GeminiPipeline: unknown SE technique %r, skipping", t)

        social_engineering = SocialEngineeringResult(
            detected=out.social_engineering_detected,
            techniques=techniques,
            reason=out.social_engineering_reason,
            provider="gemini",
        )

        model_name = self._provider.model_name if self._provider else "gemini"  # type: ignore[union-attr]
        return GeminiPipelineResult(
            classification=classification,
            sentiment=sentiment,
            social_engineering=social_engineering,
            summary_text=out.summary_text,
            provider="gemini",
            model_name=model_name,
            warnings=warnings,
        )

    def _build_from_local(
        self,
        subject: str | None,
        message: str | None,
        warnings: list[str],
    ) -> GeminiPipelineResult:
        """Build a fallback result using local classifiers."""
        # Classification — local TF-IDF
        if self._local_classifier.is_loaded:
            try:
                classification = self._local_classifier.classify(message, subject)
                classification = ClassificationResult(
                    category=classification.category,
                    confidence=classification.confidence,
                    probabilities=classification.probabilities,
                    needs_review=classification.needs_review,
                    model_name=classification.model_name,
                    model_version=classification.model_version,
                    fine_grained_intent=classification.fine_grained_intent,
                )
                if "classifier_fallback_used" not in warnings:
                    warnings.append("classifier_fallback_used")
            except Exception as exc:
                logger.error("GeminiPipeline: local classifier failed: %s", exc)
                classification = ClassificationResult(
                    category=BusinessCategory.OTHER,
                    confidence=0.0,
                    probabilities={c.value: 0.0 for c in BusinessCategory},
                    needs_review=True,
                    model_name="local-fallback",
                    model_version="0.0",
                )
                warnings.append("classifier_failure")
        else:
            classification = ClassificationResult(
                category=BusinessCategory.OTHER,
                confidence=0.0,
                probabilities={c.value: 0.0 for c in BusinessCategory},
                needs_review=True,
                model_name="local-fallback",
                model_version="0.0",
            )
            warnings.append("classifier_not_loaded")

        sentiment = SentimentAnalyzer.unavailable("Gemini unavailable; local sentiment not implemented.")
        warnings.append("sentiment_unavailable")

        social_engineering = SocialEngineeringResult(
            detected=False,
            techniques=[],
            reason="Gemini unavailable; local rule-based SE detection in security module.",
            provider="fallback",
        )

        return GeminiPipelineResult(
            classification=classification,
            sentiment=sentiment,
            social_engineering=social_engineering,
            summary_text="",  # caller will use extractive summarizer
            provider="local",
            model_name=classification.model_name,
            warnings=warnings,
        )
