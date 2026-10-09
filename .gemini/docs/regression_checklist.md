# Project Malayalam Prime - Unified Regression Test Checklist

## Architecture & Deployment Guardrails
- [x] Zero Recurring Cloud Costs: Local MongoDB and Synology Docker Compose configuration.
- [x] Tablet-First UX: Large touch targets, no complex keyboard shortcuts required.
- [x] Grapheme Splitting Protocol: Detached dependent vowel signs, manual required characters validation.
- [x] DigitalOcean App Platform Spec (`.do/app.yaml`): Canonical `malayalam-primer-v1` spec with edge routing for `/api` with `preserve_path_prefix: true`.
- [x] Express Route Preservation & JSON Guard: Fallback routing without `/api` prefix, strict JSON 404 for `/api/*` and `/auth/*` (never returns HTML), and explicit binding to `0.0.0.0`.
- [x] Local & CDN Parity: Vite proxy target bound to IPv4 literal `http://127.0.0.1:5000` with 10s timeout; frontend standardized to relative `/api/*` contract.
- [x] Automated Deployment Smoke Test (`server/scripts/smoke-test.js`): All 4 gates passing.

## Authentication & Multi-Learner System
- [x] Passwordless OTP parent login via Resend email service (`/api/auth/request-otp` & `/api/auth/verify-otp`).
- [x] Up to 3 learner profiles per parent account.
- [x] Learner profile switching and progress isolation.
- [x] Learner profile progress reset with confirmation modal.
- [x] First-time learner onboarding flow upon OTP verification.
- [x] Lesson & Practice Auth Gate: Unauthenticated users clicking a lesson or review are prompted with `AuthModal`.
- [x] Auto-Resume: Automatically resumes and launches the pending lesson after successful authentication and learner onboarding.

## Test Suite Parity
- [x] Backend Suite (`server`): 11 test suites, 73 tests passing (100% green).
- [x] Frontend Suite (`client`): 14 test suites, 52 tests passing (100% green).
