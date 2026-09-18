# AGENTS.md

## Repository status

This repository currently contains only project scaffolding; no application runtime, package manager, test suite, service, database, container configuration, or deployment configuration exists yet. Do not assume a stack. When implementation is added, identify its language, framework, package manager, test commands, environment variables, and existing CI before proposing or changing checks.

## Change discipline

- Prefer small, scoped changes that preserve public behavior and documented interfaces.
- Reuse the repository's established tooling. Do not add linters, formatters, test frameworks, or CI services without a concrete project need.
- Never commit credentials, private keys, access tokens, API keys, production data, or generated local environment files.
- Keep deterministic validation in GitHub Actions; use code review for reasoning about behavior and risk.

## Code Review Rules

Report real, actionable defects only. Do not report style preferences, speculative risks, or missing tests for trivial changes. Each finding must identify the affected file and line, explain the concrete failure path, its impact, and a safe fix.

### Priority

- **P0 — Critical:** remote code execution, authentication or authorization bypass, exposed secrets, critical data loss, severe security flaw, or production-wide failure.
- **P1 — High:** major regression, significant malfunction, important authorization issue, data corruption, serious race condition, major API error, or important business-logic failure.
- **P2 — Medium:** incorrect meaningful edge case, recoverable failure, missing important validation or error handling, moderate performance issue, or missing test coverage for important changed behavior.
- **P3 — Low:** a genuine correctness, reliability, maintainability, or security concern with limited impact.

### Review method

For every pull request, inspect the changed code and the relevant surrounding code, callers, consumers, and configuration. Trace normal and failure paths. Check edge cases, state transitions, concurrency, resource lifetime, backwards compatibility, API contracts, data handling, external-service behavior, retries, timeouts, caching, and validation.

### Security

Where relevant, look for evidence of authentication or authorization bypasses, IDOR, injection, XSS, CSRF, SSRF, path traversal, unsafe uploads or deserialization, secret/token leakage, sensitive logging, insecure CORS, privilege escalation, weak cryptography, and broken session handling. Do not claim a vulnerability without a repository-supported exploit path.

### Tests

Determine what behavior changes and whether tests cover meaningful success, failure, and boundary behavior. Prefer behavioral tests. Do not require tests for documentation-only or mechanically trivial changes.

### Technology-specific areas

Apply backend, frontend, AI/ML, Docker, database, and deployment checks only when the pull request introduces those components. For newly added components, verify their inputs, failure modes, authorization boundaries, configuration, secret handling, and deterministic validation.

## Review output

For each supported finding, state: priority; file and line; what is wrong; why it fails; impact; and a suggested fix. If no supported issue exists, say: `No significant correctness, security, reliability, or regression issues found.`
