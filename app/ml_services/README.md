# Customer Complaint Intelligence ML service

This service lives at `app/ml_services` and is the ML boundary for the backend. It is a modular FastAPI foundation; it does not claim a trained model yet.

## Phase 1 capabilities

- environment-validated configuration, no committed secrets
- privacy-preserving structured logging
- canonical complaint input schema and the 11 business categories
- process-wide model metadata registry
- `/health`, `/ready`, `/api/v1/models`, and OpenAPI documentation
- non-root Docker image, Compose configuration, tests, lint/type checks, and Docker-build CI

`/ready` intentionally returns 503 until a production model is trained and registered. Liveness remains available at `/health`.

## Run locally

```bash
cd app/ml_services
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install ".[dev]"
uvicorn ml_service.main:app --reload
pytest
```

Copy `.env.example` to `.env`; never commit it.

## Dataset boundary

The source CSV is at `app/data/unified_customer_phishing_data_subset (1).csv`. It is training data, not a production database. The next phase profiles its schema, duplicates, missing values, encoding, label distribution, text lengths, leakage, and intent-to-business-category mapping before training.
