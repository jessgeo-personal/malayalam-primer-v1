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
- [x] SpeechSynthesis GC Shield & Cancel-Safe Queue Resolution: Retains active utterance reference to prevent Chromium V8 garbage collection during speech, automatically unsticks paused queue via `cancel()` + `resume()`, avoids Chromium `interrupted` errors via cancel-safe 50ms deferred dispatch when busy and immediate dispatch when idle, suppresses benign `interrupted`/`canceled` warnings, and extracts text across all component data shapes (`character`, `letter`, `char`, `word`, `text`, `malayalamText`).
- [x] Automated Deployment Smoke Test (`server/scripts/smoke-test.js`): All 4 gates passing.

## Authentication & Multi-Learner System
- [x] Passwordless OTP parent login via Resend email service (`/api/auth/request-otp` & `/api/auth/verify-otp`).
- [x] Up to 3 learner profiles per parent account.
- [x] Learner profile switching and progress isolation.
- [x] Learner profile progress reset with confirmation modal.
- [x] First-time learner onboarding flow upon OTP verification.
- [x] Lesson & Practice Auth Gate: Unauthenticated users clicking a lesson or review are prompted with `AuthModal`.
- [x] Auto-Resume: Automatically resumes and launches the pending lesson after successful authentication and learner onboarding.

## Audio Engine & Static Curation Pipeline (AUDIO-02 & AUDIO-03)
- [x] Engine Deduplication: Redundant `client/src/utils/audioEngine.js` removed, standardized on `client/src/services/audioEngine.js`.
- [x] HTML5 Audio Player: Promise-based HTML5 `Audio()` playback for static files (`/audio/words/{id}.mp3` and `/audio/letters/{safeId}.mp3`), eliminating Web Speech API fragility, GC drops, and queue locks.
- [x] Backend Audio Curation Service (`server/services/audioService.js`): Zero-key Google Translate TTS buffer fetcher and static asset file writer.
- [x] Audio Curation Routes (`server/routes/audio.js`): `GET /api/audio/preview` (streaming MP3 buffer) and `POST /api/audio/commit` (saving MP3 & updating MongoDB Word document).
- [x] Seed Batch Audio Generator (`server/scripts/generate-audio.js`): Batch generator for words and letters across `seed-100.json`, `seed-200.json`, and `seed-300.json` with sequential 150ms throttling.
- [x] Codepoint Normalization (`getLetterAudioFilename`): Letter files named with ASCII Unicode hex codepoints (e.g. `letter_0d24.mp3`), preventing URL encoding/decoding filename mismatches.
- [x] Resilient Dynamic Fallback: Automatic fallback from missing static files to `/api/audio/preview` with silent error handling and immediate audio instance cleanup.
- [x] Lazy-Caching in Backend Preview: `/api/audio/preview` supports `saveAs` parameter and automatic single-letter asset caching on the fly.
- [x] Batch Generation Completed: 418 word MP3s and 79 letter MP3s generated and verified in `client/public/audio/`.
- [x] WordAudit Studio: 🔊 button and "Tweak Sound" curation drawer/modal for previewing and committing custom pronunciations.

## Test Suite Parity
- [x] Backend Suite (`server`): 12 test suites, 85 tests passing (100% green).
- [x] Frontend Suite (`client`): 15 test suites, 76 tests passing (100% green).
