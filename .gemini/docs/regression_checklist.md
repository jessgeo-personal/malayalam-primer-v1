# Project Malayalam Prime - Unified Regression Test Checklist

## Architecture & Deployment Guardrails
- [x] Zero Recurring Cloud Costs: Local MongoDB and Synology Docker Compose configuration.
- [x] Tablet-First UX: Large touch targets, no complex keyboard shortcuts required.
- [x] Grapheme Splitting Protocol: Detached dependent vowel signs, manual required characters validation.
- [x] DigitalOcean App Platform Spec (`.do/app.yaml`): Canonical `malayalam-primer-v1` spec with edge routing for `/api` with `preserve_path_prefix: true`.
- [x] Express Route Preservation & JSON Guard: Strict mounting order (`/api/auth`, `/api/ai`, `/api`), direct fallbacks (`/auth`, `/ai`), no root `apiRoutes` interception, dev request logging, and strict 404 guard before static serving.
- [x] Local & CDN Parity: Vite proxy target bound to IPv4 literal `http://127.0.0.1:5000` with 10s timeout; frontend standardized to relative `/api/*` contract without path rewriting.
- [x] Resilient API URL Builder (`getApiUrl`): Normalizes endpoints, prevents accidental `/api/api` prefix doubling across all client API consumers (`AuthContext`, `ProgressContext`, `ConceptScreen`, `AdventureMap`, `WordAudit`).
- [x] Audio Engine & TTS Fallback Pipeline (`audioEngine`): Handles asynchronous voice population via `voiceschanged`, selects `ml-IN` voice with pedagogical rate 0.85, and seamlessly falls back from missing/404 static mp3 files to direct browser `SpeechSynthesis`.
- [x] Zero-Latency Audio Toggle & PWA Icon Parity: `HAS_STATIC_AUDIO_ASSETS = false` eliminates 1-2s network roundtrip for instant pronunciation; `pwa-192x192.png` and `pwa-512x512.png` placeholders eliminate console 404 manifest errors.
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
- [x] Frontend Suite (`client`): 15 test suites, 64 tests passing (100% green).
