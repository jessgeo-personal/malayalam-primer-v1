# Malayalam Prime - Project Changelog

All notable changes to this project will be documented in this file.

## [2026.10.09.011] - 2026-10-09
### Fixed & Optimized
- **Audio Latency Elimination & PWA Icon Placeholders**:
  - **Instant Speech Fallback (`HAS_STATIC_AUDIO_ASSETS`)**:
    * Added `export const HAS_STATIC_AUDIO_ASSETS = false;` in `client/src/services/audioEngine.js` (re-exported in `utils/audioEngine.js`).
    * Bypasses the 1-2s network roundtrip for non-existent `/audio/words/*.mp3` assets, dispatching directly to SpeechSynthesis for instant pronunciation playback upon speaker tap.
    * Can be toggled to `true` whenever Track C pre-recorded audio assets are populated.
  - **Valid PWA Icon Placeholders**:
    * Created valid PNG assets `client/public/pwa-192x192.png` and `client/public/pwa-512x512.png` generated with theme color `#863BFF`.
    * Updated `client/vite.config.js` `includeAssets` and `manifest.icons` to include `favicon.svg`, eliminating 404 download errors in the browser console.
  - **Test Suite & Verification**:
    * Updated `client/src/tests/audioEngine.test.js` verifying that `Audio` instantiation is bypassed when static assets are disabled, and falls back cleanly when enabled.
    * Verified 100% green tests: 64/64 in `client` (15 suites) and 73/73 in `server` (11 suites).
    * Verified production build generates clean PWA assets with 9 precache entries.

## [2026.10.09.010] - 2026-10-09
### Fixed & Hardened
- **AudioEngine Async Voice Loading & SpeechSynthesis Fallback**:
  - **Asynchronous Voice Population (`client/src/services/audioEngine.js`)**:
    * Implemented `initVoices()` with `voiceschanged` event listener handling asynchronous browser voice initialization.
    * Added `getMalayalamVoice()` dynamically resolving `ml-IN` / `ml*` voice.
    * Implemented `speakText(text)` clearing any hung queue with `speechSynthesis.cancel()`, configuring rate 0.85 and Malayalam voice mapping.
  - **Robust Fallback Playback Pipeline (`playWord`)**:
    * Cleanly catches 404s/network errors on missing static `/audio/words/${wordId}.mp3` files and transitions directly to `SpeechSynthesis`.
    * Supports both word objects (`{ wordId, malayalamText }`) and raw Malayalam strings seamlessly.
  - **Component Audits & UI Polish**:
    * Audited and ensured all speaker button click handlers in `AdventureMap.jsx`, `ConceptScreen.jsx`, `LetterPicker.jsx`, `TracingCanvas.jsx`, and `SoundMatcher.jsx` pass valid Malayalam strings/objects.
    * Added audible pronunciation speaker button to the target vocabulary preview modal in `AdventureMap.jsx`.
  - **Test Suite Updates**:
    * Expanded `client/src/tests/audioEngine.test.js` to 6 tests validating async voice loading, Malayalam voice resolution, TTS speech synthesis parameters, and fallback behavior.
    * Maintained 100% green test suite: 63/63 in `client` (15 suites) and 73/73 in `server` (11 suites).

## [2026.10.09.009] - 2026-10-09
### Fixed & Hardened
- **Duplicate `/api/api` Prefix Elimination & Resilient URL Normalizer**:
  - **Client Environment Cleanup (`client/.env`)**:
    * Cleaned `VITE_API_URL` by removing trailing `/api` (set to empty string), allowing Vite's dev proxy to cleanly forward relative `/api/*` traffic without double-prefixing.
  - **Resilient URL Normalizer Utility (`client/src/utils/api.js`)**:
    * Created `buildApiUrl` and `getApiUrl` to ensure API endpoints normalize cleanly regardless of environment configuration.
    * Automatically prevents `/api/api` duplication if `VITE_API_URL` contains a trailing `/api` or slash.
    * Strips any accidental duplicated `/api/api` in endpoint strings.
  - **Context & Component Modernization**:
    * Replaced manual string interpolations in `AuthContext.jsx`, `ProgressContext.jsx`, `ConceptScreen.jsx`, `AdventureMap.jsx`, and `WordAudit.jsx` with `getApiUrl(...)`.
  - **Test Automation**:
    * Added unit test suite `client/src/tests/ApiUrlHelper.test.js` validating all path normalization combinations (empty base, trailing slashes, duplicate /api prefixes, query parameters).
    * Maintained 100% green test passes: 59/59 in `client` (15 test suites), 73/73 in `server` (11 test suites).

## [2026.10.09.008] - 2026-10-09
### Fixed & Diagnosed
- **Server Router Mounting Order & Dev Request Logging**:
  - Added request logging middleware in non-production environments to log `[REQ] ${req.method} ${req.originalUrl}` for transparent routing diagnostics.
  - Enforced strict router mounting hierarchy:
    1. Mount specific routers first: `/api/auth` -> `authRoutes`, `/api/ai` -> `aiRoutes`, `/api` -> `apiRoutes`.
    2. Direct fallbacks for proxy stripped paths: `/auth` -> `authRoutes`, `/ai` -> `aiRoutes`.
    3. Removed legacy root `app.use('/', apiRoutes)` catchall mount that could intercept or shadow `/api/auth` routes.
    4. Guarded API routes with 404 JSON responder (`{ error: 'API endpoint not found' }`) placed immediately after API router mounts and before static file serving.
- **Client & Proxy Verification**:
  - Audited all URLs in `client/src/context/AuthContext.jsx` verifying correct namespace retaining `/api/auth/*`.
  - Confirmed `client/vite.config.js` proxy does not strip `/api`.
  - Executed smoke test suite verifying all 4 gates pass against `http://localhost:5000`.
  - Full test parity maintained: 73/73 passing in `server`, 52/52 passing in `client`.

## [2026.10.09.007] - 2026-10-09
### Fixed & Standardized
- **Unified Relative Path Contract (`/api`) & Network Parity**:
  - **Vite Local Proxy (`client/vite.config.js`)**:
    * Locked `server.proxy['/api']` target explicitly to IPv4 `http://127.0.0.1:5000` (eliminating Windows localhost/IPv6 ECONNRESET drops).
    * Added `timeout: 10000`, `changeOrigin: true`, and `secure: false`.
  - **Standardized Client Relative API Calls**:
    * Updated `client/src/context/AuthContext.jsx` and `client/src/context/ProgressContext.jsx` with standard `const API_BASE = import.meta.env?.VITE_API_URL || '';`.
    * All endpoints call `${API_BASE}/api/...`, falling back to clean relative `/api/...` calls by default.
  - **Express Server Host Interface (`server/server.js`)**:
    * Bound `app.listen` explicitly to `'0.0.0.0'` on `PORT` for robust network routing across Docker, Synology, and DO PaaS containers.
  - **Canonical DigitalOcean App Spec (`.do/app.yaml`)**:
    * Declared canonical specification for `malayalam-primer-v1` with GitHub repo `jessgeo-personal/malayalam-primer-v1`.
    * Edge-routes `/api` to the backend web service with `preserve_path_prefix: true`.
    * Removed fragile `VITE_API_URL: ${api.PUBLIC_URL}` client build injection; static site cleanly uses same-origin relative `/api/*` edge routing.
  - **Test Suite Updates**:
    * Updated `server/tests/ops.test.js` to assert the canonical `.do/app.yaml` topology.
    * 100% green tests verified: 73/73 passing in `server`, 52/52 passing in `client`.

## [2026.10.09.006] - 2026-10-09
### Fixed & Added
- **Production API Route Prefix Preservation & Strict JSON Guard**:
  - Updated `.do/app.yaml` service `api` routes with `preserve_path_prefix: true` to prevent upstream proxy path stripping.
  - In `server/server.js`, mounted routers under both `/api` and fallback root paths (`/api/auth` & `/auth`, `/api/ai` & `/ai`, `/api` & `/`) so requests resolve regardless of proxy prefix stripping.
  - Added strict JSON 404 guard (`{ error: 'API endpoint not found' }`) for non-existent `/api`, `/auth`, and `/ai` routes, ensuring Express never inadvertently returns `index.html` for API calls.
  - Added regression test suite in `server/tests/ops.test.js` validating route preservation, route fallback handling, and JSON 404 guard.
- **Client Lesson & Practice Auth Gate with Auto-Resume**:
  - In `client/src/App.jsx`, gated all lesson launches (`handleSelectLesson`) and practice launches (`handleStartReview`) behind parent authentication.
  - If unauthenticated, records `pendingLessonId` or `pendingAction` and opens `AuthModal`.
  - Added reactive auto-resume `useEffect` watching `[isAuthenticated, isAuthModalOpen, pendingLessonId, pendingAction]`. Upon successful OTP authentication and onboarding completion (when modal closes), automatically resumes and launches the pending lesson with the newly created/active learner profile.
  - Updated `client/src/components/ui/AdventureMap.jsx` to route train bogie clicks, hero CTA clicks, preview modal start buttons, and daily revision through the auth gate handlers.
  - Added unit test in `client/src/tests/AuthFlow.test.jsx` verifying unauthenticated lesson click interception, modal display, onboarding completion, and seamless auto-launch.

## [2026.10.09.005] - 2026-10-09
### Fixed & Configured
- **DigitalOcean App Platform Start Command & Process Types (Exit Code 190 Fix)**:
  - Added `"start": "node server/server.js"` script to root `package.json`.
  - Confirmed `"start": "node server.js"` in `server/package.json` and updated `"main"` entrypoint from `index.js` to `server.js`.
  - Created `server/Procfile` with `web: node server.js` to explicitly declare default web process type for Cloud Native Buildpacks.
  - Created root `Procfile` with `web: node server/server.js` for root-level buildpack detection parity.

## [2026.10.09.004] - 2026-10-09
### Changed & Added
- **Track D, Task OPS-02 (Production Smoke Testing Suite & Deployment Verification)**:
  - **Automated Smoke Test Runner (`server/scripts/smoke-test.js`)**:
    * Created standalone, zero-dependency Node 18+ smoke test script using native `fetch`.
    * Supports configurable target base URL via CLI argument, `TARGET_URL` environment variable, or default `http://localhost:5000`.
    * Implemented 4 sequential production verification gates:
      1. Gate 1 (Health Check): Asserts HTTP 200 and `{ status: 'ok' }` on `/api/health`.
      2. Gate 2 (Database Seeding & Curriculum): Asserts HTTP 200 and non-empty lesson array on `/api/game/lesson/1?act=1` (with fallback to `/api/session/lesson?lessonId=1`).
      3. Gate 3 (Static Web SPA): Asserts HTTP 200 and `text/html` on root `/` and catchall SPA route `/non-existent-route`.
      4. Gate 4 (Auth & Email Delivery): Asserts HTTP 200 or graceful HTTP 500 without unhandled gateway crashes (502/503) on `POST /api/auth/request-otp`.
    * Formats color-coded progress indicators (`✔` green, `✖` red) with deterministic process exit codes (0 for pass, 1 for failure).
  - **Server Support & SPA Fallback**:
    * Added route alias `GET /api/game/lesson/:lessonId` in `server/routes/api.js`.
    * Added static file serving and SPA fallback in `server/server.js` for non-API GET routes to ensure standalone and dev server parity.
  - **NPM Script & Test Suite**:
    * Added `"test:smoke": "node scripts/smoke-test.js"` script in `server/package.json`.
    * Extended `server/tests/ops.test.js` to run automated in-process smoke verification.
    * 100% green test suites across server (11 suites, 71 tests passing) and client (14 suites, 51 tests passing).

## [2026.10.09.003] - 2026-10-09
### Changed & Added
- **Track D, Task OPS-01 (DigitalOcean App Platform PaaS & Resend Email Integration)**:
  - **DigitalOcean App Platform Spec (`.do/app.yaml`)**:
    * Created declarative PaaS specification featuring dual-component topology: backend Web Service (`api`) and frontend Static Site (`web`).
    * Backend `api`: node engine running `server/server.js`, routed at `/api`, configured with `basic-xxs` instance slug, health check probe at `/api/health`, and secret environment mappings (`MONGO_URI`, `JWT_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NODE_ENV`, `CLIENT_URL`).
    * Frontend `web`: build command `npm run build`, output directory `dist`, root route `/`, SPA catchall routing to `index.html`, and dynamic `VITE_API_URL` build binding (`${api.PUBLIC_URL}`).
  - **Resend Email Service (`server/services/emailService.js`)**:
    * Integrated official `resend` SDK for parent authentication OTP delivery.
    * Implemented responsive, mobile-first HTML email template with emerald `#059669` accent, monospace letter-spaced 6-digit access code, and 10-minute expiry warning.
    * Added CI/Test environment guard (`NODE_ENV === 'test'` or missing `RESEND_API_KEY`) to safely simulate delivery without outbound network calls.
  - **Auth Endpoint Enhancement (`server/routes/auth.js`)**:
    * Updated `POST /api/auth/request-otp` to invoke `sendOTP` after database persistence.
    * Returns `{ success: true, message: 'OTP sent to email' }` with graceful HTTP 500 error handling on email delivery failure.
  - **IaaS Cleanup**:
    * Deprecated and removed legacy Droplet configuration files (`ecosystem.config.js` and `nginx/malayalam-prime.conf`).
  - **Verification & Testing**:
    * Refactored `server/tests/ops.test.js` to assert `.do/app.yaml` syntax, service topology, email simulation, and auth delivery integration.
    * Full backend suite green (11/11 suites, 68/68 tests passing).
    * Full frontend suite green (14/14 suites, 51/51 tests passing).

## [OPS-01-GREEN] - 2026-10-09
### Added & Verified
- **Track D, Task OPS-01 (Green Phase - Production Deployment Configuration)**:
  - Created root `ecosystem.config.js` for PM2 cluster management (`malayalam-api`, script `./server/server.js`, `instances: 'max'`, cluster mode, auto-restart, 500M max memory restart, production & development env configs).
  - Created `nginx/malayalam-prime.conf` production reverse proxy virtual host template:
    * Upstream pool `malayalam_backend` load balancing to `127.0.0.1:5000` with HTTP keepalive.
    * Reverse proxy `/api` routing with WebSocket upgrade headers, real IP forwarding, 60s timeouts.
    * SPA client routing fallback via `try_files $uri $uri/ /index.html` targeting `/var/www/malayalam-prime/client/dist`.
    * Certbot ACME HTTP-01 challenge support at `/.well-known/acme-challenge/`.
    * 30-day static asset cache headers for audio/fonts/images.
    * Hardened security headers (`X-Frame-Options`, `X-XSS-Protection`, `X-Content-Type-Options`, `Referrer-Policy`).
  - Exported Express `app` from `server/server.js` guarded with `require.main === module` for clean supertest integration and process lifecycle isolation.
  - Verified 100% green pass on `server/tests/ops.test.js` (3/3 tests pass).
  - Verified 100% green pass on full server regression test suite (11/11 test suites, 62/62 tests pass).
  - Verified 100% green pass on full client regression test suite (14/14 test suites, 51/51 tests pass).
  - Marked OPS-01 as 🟢 Completed in `docs/EXECUTION_TRACKER.md`.

## [OPS-01-RED] - 2026-10-09
### Added
- **Track D, Task OPS-01 (Red Phase - Production Deployment Configuration)**:
  - Created plan documents at `docs/plans/OPS-01-production-deployment-setup.md` and `.gemini/plans/OPS-01-production-deployment-setup.md`.
  - Added deployment configuration and sanity test suite in `server/tests/ops.test.js`.
  - Verified RED phase test failure expecting missing root `ecosystem.config.js` and `nginx/malayalam-prime.conf`.

## [AUDIO-01-GREEN] - 2026-10-09
### Added & Changed
- **Track C, Task AUDIO-01 (Green Phase - Bounded Audio Pipeline & Fallback Engine)**:
  - Implemented consolidated audio playback service in `client/src/services/audioEngine.js`:
    * `getAudioUrlForWord(wordItem)`: Deterministically resolves static audio asset path `/audio/words/${wordItem.wordId}.mp3`.
    * `playWordSound(wordItem)`: Primary path instantiates HTML5 `Audio(url)` with event handlers (`ended`, `error`), seamlessly falling back to `window.speechSynthesis` on 404, missing file, or decode rejection.
    * Fallback engine guards against non-browser environments and safely invokes Malayalam speech synthesis (`ml-IN`) without throwing unhandled exceptions.
    * Backwards compatibility preserved with `AudioEngine` class, `playPhoneticSound`, and bridging in `client/src/utils/audioEngine.js`.
  - Created directory structure `client/public/audio/words/` with `.gitkeep` for pre-generated audio assets.
  - Verified 100% green pass on `client/src/tests/audioEngine.test.js` (2/2 tests pass).
  - Verified 100% green pass on full client regression suite (14/14 test suites, 51/51 tests pass).
  - Verified 100% green pass on full server regression suite (10/10 test suites, 59/59 tests pass).
  - Marked AUDIO-01 as 🟢 Completed in `docs/EXECUTION_TRACKER.md`.

## [AUDIO-01-RED] - 2026-10-09
### Added
- **Track C, Task AUDIO-01 (Red Phase - Bounded Audio Pipeline & Fallback Engine)**:
  - Created plan documents at `docs/plans/AUDIO-01-bounded-audio-asset-pipeline.md` and `.gemini/plans/AUDIO-01-bounded-audio-asset-pipeline.md`.
  - Added unit test suite `client/src/tests/audioEngine.test.js` specifying `getAudioUrlForWord(word)` static asset path resolution (`/audio/words/${wordId}.mp3`) and safe speech synthesis fallback via `playWordSound(word)`.
  - Confirmed RED phase failure in Vitest.

## [DATA-03-GREEN] - 2026-10-09
### Added & Changed
- **Track B, Task DATA-03 (Green Phase - Cycle 3 Grapheme Splits & Lessons 21–25 Bundling)**:
  - Tightened `server/tests/integrity.test.js` to enforce that each Cycle 3 lesson (21 through 25) contains a viable pedagogical bundle of at least 8 items.
  - Curated and balanced all 100 Cycle 3 vocabulary items in `server/data/seed-300.json` into 5 balanced 20-word curriculum bundles aligned with `ProductBrief-TechnicalArchitecture-v1.md`:
    * **Lesson 21 (Directional & Spatial Foundations)**: 20 words (`അകത്ത്`, `നേരെ`, `വലത്ത്`, `ഇടത്ത്`, `മുന്നിൽ`, `പിന്നിൽ`, `ചുറ്റും`, `പുറമേ`, `കാൽ`, `തല`, `കാട്`, `കടൽ`, `പുഴ`, `മല`, `കല്ല്`, `കൊണ്ടുപോയി`, `കൊണ്ടുവന്നു`, `ചാടി`, `കളിച്ചു`, `അടച്ചു`).
    * **Lesson 22 (Temporal Anchors & Physical Attributes)**: 20 words (`അടുത്ത`, `കഴിഞ്ഞ`, `ആദ്യം`, `അവസാനം`, `സാധാരണയായി`, `കാത്തിരുന്നു`, `സൂര്യൻ`, `ചന്ദ്രൻ`, `നക്ഷത്രം`, `ചിലർ`, `തുറന്നു`, `പാടി`, `പഠിച്ചു`, `പഠിപ്പിച്ചു`, `ചൂട്`, `തണുപ്പ്`, `രൂപ`, `വില`, `ഭാരം`, `നിറം`).
    * **Lesson 23 (Relational Postpositions & Human Environment)**: 20 words (`ഒപ്പം`, `പകരം`, `ഭാര്യ`, `ഭർത്താവ്`, `മാമൻ`, `അമ്മായി`, `സഹായിച്ചു`, `കണ്ണ്`, `കൈ`, `വായ`, `മുഖം`, `മുടി`, `പല്ല്`, `വസ്ത്രം`, `കടലാസ്`, `പേന`, `പെട്ടി`, `താക്കോൽ`, `പൂട്ട്`, `തോന്നി`).
    * **Lesson 24 (Active Predicates & Universal Grounding)**: 20 words (`എഴുതുന്നു`, `വായിക്കുന്നു`, `കേൾക്കുന്നു`, `നൽകുന്നു`, `അറിയുന്നു`, `വിശ്വസിക്കുന്നു`, `മറക്കുന്നു`, `ഓർക്കുന്നു`, `കാണിക്കുന്നു`, `അയക്കുന്നു`, `ഉണ്ടാക്കുന്നു`, `മാറ്റുന്നു`, `നിർത്തുന്നു`, `വാങ്ങിച്ചു`, `വിറ്റു`, `അയച്ചു`, `ആകാശം`, `ഭൂമി`, `കഠിനമായ`, `മൃദുവായ`).
    * **Lesson 25 (Narrative Connectors & Core Descriptors)**: 20 words (`അതായത്`, `എങ്കിൽ`, `ആയാലും`, `പ്രത്യേകിച്ച്`, `പോലും`, `എല്ലാവരും`, `ആരും`, `ഒന്നും`, `പലതും`, `സ്വന്തം`, `മറ്റ്`, `കറുത്ത`, `വെളുത്ത`, `ചുവന്ന`, `പച്ച`, `നീല`, `മഞ്ഞ`, `നീളമുള്ള`, `വൃത്തിയുള്ള`, `വൃത്തികെട്ട`).
  - Enforced atomic grapheme splitting protocol (`docs/word_splitting_protocol.md`) on all 100 words with zero empty boxes, correct detached vowel modifiers, and fixed `w291` (`നൽകുന്നു` -> `["ന", "ൽ", "ക", "ു", "ന്ന", "ു"]`).
  - Re-seeded database via `node seeder.js` importing all 466 words across Cycles 1-4 cleanly without schema or duplicate key errors.
  - Verified 100% green test passes across both `server` (10/10 test suites, 59/59 tests) and `client` (13/13 test suites, 49/49 tests).
  - Marked DATA-03 as 🟢 Completed in `docs/EXECUTION_TRACKER.md`.

## [DATA-03-RED] - 2026-10-09
### Added
- **Track B, Task DATA-03 (Red Phase - Cycle 3 Grapheme Splits & Lessons 21–25 Bundling)**:
  - Created plan documents at `docs/plans/DATA-03-seed-300-grapheme-splits-and-lesson-bundling.md` and `.gemini/plans/DATA-03-seed-300-grapheme-splits-and-lesson-bundling.md`.
  - Added test suite `DATA-03: Cycle 3 (Lessons 21-25) Data Integrity & Zero-Empty-Boxes` to `server/tests/integrity.test.js`.
  - Defined curriculum checks asserting that all Cycle 3 vocabulary items in `seed-300.json` have valid `lessonId` (21–25) and populated non-empty `requiredCharacters` arrays satisfying the Zero-Empty-Boxes rule.

## [2026.10.09.001] - 2026-10-09
### Added
- **Prototype Lab Word Assembly Selector (`client/src/components/ui/PrototypeLab.jsx`)**:
  - Added an interactive word selection workbench control to the Assembly Box (`ASSEMBLY_PRESETS`) with categorized groupings:
    * Left-side mathras: പെട്ടി (`petti` - െ), വേണം (`venam` - േ), ചെറിയ (`cheriya` - െ)
    * Surround mathras: പോയി (`poyi` - ോ), നോക്കി (`nokki` - ോ), ചോദിച്ചു (`chodichu` - ോ), കൊടുത്തു (`koduthu` - ൊ)
    * Base conjuncts & core: അമ്മ (`amma`), കുട്ടി (`kutti`), സ്കൂൾ (`school`), ആന (`aana`)
  - Dynamic re-mounting of `<LetterPicker />` keyed by selected `wordId`, enabling real-time visual inspection of left-side mathra displacement (െ, േ) and surround mathra right-wing slots (ൊ, ോ).
  - Added unit tests in `client/src/tests/PrototypeLab.test.jsx` verifying word selector rendering and dynamic item switching.
  - Added unit tests in `client/src/tests/LetterPicker.test.jsx` verifying correct droppable slot counts and visual reordering for left-side and surround mathras.

## [DATA-02-GREEN] - 2026-10-08
### Added & Changed
- **Track B, Task DATA-02 (Green Phase - Cycle 2 Grapheme Splits & Lessons 15–20 Bundling)**:
  - Curated and populated atomic grapheme splits (`requiredCharacters`) in `server/data/seed-200.json` for all 50 vocabulary items across Lessons 15 to 20 adhering strictly to `docs/word_splitting_protocol.md`.
  - Enforced Zero-Empty-Boxes Rule across all plural suffixes (`-ുകൾ`, `-ങ്ങൾ`, `-മാർ`), locatives (`-ൽ`, `-ിൽ`, `-യിൽ`, `-ത്തിൽ`), and tense transformation roots (`പോ`, `വാ`, `കളി`, `ഓടു`, `വായിക്കു`).
  - Set `isSuffix: true` for concept items and `isSuffix: false` for vocabulary/build items.
  - Verified 100% green pass on `server/tests/integrity.test.js` (6/6 tests passing) and full server test suite (10/10 test suites, 56/56 tests passing).
  - Verified 100% green pass on client test suite (13/13 test suites, 46/46 tests passing).
  - Re-seeded MongoDB database via `node seeder.js` cleanly importing 466 words without validation or unique key errors.
  - Updated `docs/EXECUTION_TRACKER.md` setting DATA-02 to 🟢 Completed.

## [DATA-02-RED] - 2026-10-08
### Added
- **Track B, Task DATA-02 (Red Phase - Cycle 2 Grapheme Splits & Lessons 15–20 Bundling)**:
  - Created plan documents at `docs/plans/DATA-02-seed-200-grapheme-splits-and-lesson-bundling.md` and `.gemini/plans/DATA-02-seed-200-grapheme-splits-and-lesson-bundling.md`.
  - Added new test suite `DATA-02: Cycle 2 (Lessons 15-20) Data Integrity & Zero-Empty-Boxes` to `server/tests/integrity.test.js`.
  - Asserted that all Cycle 2 vocabulary items have valid `lessonId` between 15 and 20 and strictly adhere to the Zero-Empty-Boxes rule on `requiredCharacters`.
  - Confirmed expected Red Phase failure (`expect(Array.isArray(word.requiredCharacters)).toBe(true)` received `false`) without modifying `seed-200.json`.

## [DATA-01-GREEN] - 2026-10-08
### Added
- **Track B, Task DATA-01 (Green Phase - Automated Transliteration Utility & Verification)**:
  - Implemented phonetic transliteration engine in `server/utils/transliterate.js` leveraging `@indic-transliteration/sanscript` and custom phonetic rule sets for Malayalam vowels, vowel signs, consonants, geminates, chillu letters (`ൻ`, `ൽ`, `ൾ`, `ർ`, `ൺ`), anusvara (`ം`), terminal virama suppression/schwa mapping, and affixes (e.g. `-ൽ` -> `'-il'`, `-ഓ` -> `'-o'`).
  - Unit tests passed 100% green via `npx vitest run tests/transliterate.test.js`.
  - Added standalone verification script `server/scripts/verify-transliteration.js` and npm script `npm run verify:transliterate`.
  - Evaluated against all 268 phonetic items in `server/data/seed-100.json`, achieving 99.63% compatibility (267/268 matches) with sole expected discrepancy being internal seed variance on sentence "അമ്മ ഇന്നലെ വന്നു" (innalle vs innale).
  - Maintained 100% green pass on full backend Jest regression test suite (10/10 test suites passed, 54/54 tests).
  - Updated `docs/EXECUTION_TRACKER.md` setting DATA-01 to 🟢 Completed.

## [DATA-01-RED] - 2026-10-08
### Added
- **Track B, Task DATA-01 (Red Phase - Automated Transliteration Utility)**:
  - Created plan documents at `docs/plans/DATA-01-automated-phonetic-transliteration.md` and `.gemini/plans/DATA-01-automated-phonetic-transliteration.md`.
  - Installed `@indic-transliteration/sanscript` in server dependencies and `vitest` in server devDependencies.
  - Created failing test suite at `server/tests/transliterate.test.js` specifying expected phonetic output for pronouns (`ഞാൻ` -> `'njan'`, `അവൻ` -> `'avan'`), conjuncts & chillu letters (`ഉണ്ട്` -> `'undu'`, `അമ്മ` -> `'amma'`, `എന്തുകൊണ്ട്` -> `'enthukond'`), and grammatical suffixes (`-ൽ` -> `'-il'`, `-ഓ` -> `'-o'`).
  - Verified test failure in Red Phase (`Cannot find module '../utils/transliterate.js'`).

## [2026.10.08.004] - 2026-10-08
### Changed
- **Mobile-First Vertical Stacking for 'Your Progress' Card (`client/src/components/ui/AdventureMap.jsx`)**:
  - Configured upper grid container to mobile-first single column with tablet/desktop expansion (`grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch`), allowing major blocks to take 100% width on phone screens (< md).
  - Enforced strict vertical stacking for Column 3 Stat Cards (`flex flex-col gap-3 sm:gap-4 justify-between h-full`) ensuring 'LESSONS COMPLETED' sits directly above 'TOTAL POINTS' across all viewports.
  - Scaled container padding responsive hierarchy (`p-4 sm:p-6 md:p-8`) and text sizes (`text-xl sm:text-2xl` for cycle header, `text-sm sm:text-base md:text-lg` for lesson title) to eliminate mobile clipping and overflow.
  - Verified exact top-to-bottom mobile order: 1. Cycle & Level Information, 2. 'NEXT UP' Card, 3. 'LESSONS COMPLETED' Card, 4. 'TOTAL POINTS' Card, 5. Full-Width Progress Bar.

## [2026.10.08.003] - 2026-10-08
### Changed
- **Emerald Green Theme for 'Your Progress' Hero Card (`client/src/components/ui/AdventureMap.jsx`)**:
  - Replaced container styling with rich emerald green palette (`bg-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-emerald-500`).
  - Header Row: Set title to bold white uppercase (`text-white font-black text-sm uppercase tracking-[0.2em]`), cycle badge to mint (`text-emerald-100 font-semibold`), and divider to `border-b border-emerald-500/50 pb-4 mb-6`.
  - Column 1 (Left): High-contrast dark emerald pill for Level (`bg-emerald-800/60 text-white border border-emerald-400/40 font-bold px-3 py-1 rounded-full text-xs`), cycle title in `text-2xl font-black text-white`, and guidance box in `bg-emerald-700/50 border border-emerald-400/30 text-white rounded-2xl p-4 text-xs font-medium leading-relaxed`.
  - Column 2 (Center - 'NEXT UP'): Crisp white island card (`bg-white text-slate-900 rounded-2xl p-5 shadow-md border border-emerald-100`) with emerald badge (`bg-emerald-600 text-white px-2 py-0.5 rounded-full`), bold title (`text-slate-900 font-black text-base sm:text-lg mt-1`), and dark action pill (`bg-[#1A1E26] hover:bg-slate-800 text-white font-bold rounded-xl`).
  - Column 3 (Right - Stacked Stats): Matching emerald cards (`bg-emerald-700/40 border border-emerald-400/30 rounded-2xl p-4 text-white`) with light mint labels (`text-emerald-100 text-xs font-bold uppercase tracking-wider`) and white values (`text-2xl font-black text-white mt-1`).
  - Progress Bar: Dark emerald track (`bg-emerald-950/40 border border-emerald-400/30 h-4 rounded-full overflow-hidden p-0.5`) with vibrant amber fill (`bg-amber-400 h-full rounded-full transition-all duration-700`), mint label, and white percentage text.

## [2026.10.08.002] - 2026-10-08
### Changed
- **High-Contrast Dark Color Scheme for 'Your Progress' Card (`client/src/components/ui/AdventureMap.jsx`)**:
  - Inverted outer hero card container to obsidian/charcoal theme (`bg-[#1A1E26] text-[#FFFDF6] border border-slate-700/60`).
  - Styled header and typography: High-contrast emerald badge (`text-emerald-400`), cream cycle title (`text-[#FFFDF6]`), muted slate labels (`text-slate-300`, `text-slate-400`).
  - Upgraded guidance box: Light amber/cream typography with translucent background (`text-amber-200/90 bg-amber-500/10 border border-amber-400/20`).
  - High-contrast level badge: Translucent pill with crisp white text (`bg-white/10 text-white border border-white/20`).
  - Enhanced internal cards:
    * 'NEXT UP' card: Dark translucent container (`bg-white/10 border border-white/15 text-white`) with high-contrast tactile action button (`bg-white hover:bg-slate-100 text-[#1A1E26]`).
    * Column 3 Stat Cards ('LESSONS COMPLETED', 'TOTAL POINTS'): Matching translucent containers (`bg-white/10 border border-white/15 text-white`) with clear slate labels (`text-slate-300`) and glowing white values (`text-white`).
    * Full-Width Progress Bar: High-contrast translucent track (`bg-white/20 border border-white/10`) with vibrant emerald fill (`bg-emerald-400`) and pure white percentage label (`text-white`).

## [2026.10.08.001] - 2026-10-08
### Added & Changed
- **Task UI-01: AdventureMap Bento Structure & Section Layout Refactor:**
  - **3-Column Hero Progress Card (`client/src/components/ui/AdventureMap.jsx`)**:
    - Transformed upper hero container into a responsive 3-column Neo-Bento grid (`grid-cols-1 md:grid-cols-3`):
      * **Col 1 (Left)**: Active Cycle metadata (`Cycle {activeCycle}: {cycleName}`), Learner Level badge, and replay guidance note (`⭐ Tap any completed train bogie below to replay and earn 3 stars!`).
      * **Col 2 (Center)**: 'NEXT UP' card featuring active target lesson indicator, lesson number/title, and prominent context-aware CTA pill (`🚀 Start Lesson X` or `▶ Resume Lesson X`).
      * **Col 3 (Right)**: Stacked stat cards for `📚 LESSONS COMPLETED` (`{completed} / {total}`) and `⭐ TOTAL POINTS` (`{points} pts`).
    - Added full-width (`w-full`) Cycle progress bar spanning the bottom of the hero card with percentage display.
  - **Eliminated Redundancies**:
    - Removed redundant learning plan cards, duplicate stats rows, and standalone `<h2>Lessons</h2>` header from `App.jsx`.
  - **Strict Vertical Page Hierarchy**:
    - Enforced the 5-step vertical section progression:
      1. **Your Progress** (Hero with embedded Next Up, Stacked Stats, and Full-Width Progress Bar)
      2. **Practice** (Daily Review / SRS revision card)
      3. **Adventure Map** (Malayalam Express Engine and Lesson Bogeys)
      4. **Fluency Master** (Milestone Badges & Cycle Streaks)
      5. **My Letters** (Mastery Strip / Learned Graphemes Shelf at the bottom)
  - **TDD Green State & Zero Regression**:
    - Backend: 10/10 test suites (54/54 tests) passing.
    - Frontend: 13/13 test suites (46/46 tests) passing.

## [2026.10.07.005] - 2026-10-07
### Added
- **Task AUTH-05: Auth & Navigation UX Polish (GREEN PHASE):**
  - **Plan Documentation**: Created `docs/plans/AUTH-05-auth-and-navigation-ux-polish.md` (mirrored in `.gemini/plans/`) detailing onboarding name customization, profile dismissability, global scroll guarding, and context-aware adventure map CTAs.
  - **First Learner Onboarding (`POST /api/auth/verify-otp` & `PUT /api/auth/profiles/:profileId`)**:
    - Backend detects freshly created accounts or single-profile accounts with default name `'Learner 1'` and 0 progress, returning `isNewAccount: true`.
    - Implemented protected `PUT /api/auth/profiles/:profileId` validating name input, updating profile name within account, and enforcing account ownership boundaries (returning 404 for alien profiles).
    - `AuthContext.jsx` provides `updateProfileName` syncing state and local storage.
    - `AuthModal.jsx` introduces Step 3 ("Learner Onboarding") asking "What is your learner's name?" with placeholders ('Aarav', 'Diya') and a "Save & Start" CTA.
  - **Profile Selector Dismissability (`client/src/components/ui/ProfileSelector.jsx`)**:
    - Added styled "Cancel" button beside "Add Learner" and card header close button invoking `onClose` callback to dismiss the selector in `App.jsx`.
  - **Global Scroll Guard (`client/src/App.jsx`)**:
    - Added `useEffect` hook listening to `[activeView, activeLesson, currentAct]` executing instant top scroll on both window and main container elements across view/lesson/act transitions.
  - **Smart Hero CTAs (`client/src/components/ui/AdventureMap.jsx`)**:
    - Context-aware Hero card displaying `▶ Resume Lesson {currentLesson}` when lesson is active/paused, and `🚀 Start Lesson {currentLesson}` when starting fresh or completing previous lessons.
    - Included secondary motivation prompt: `"⭐ Want to improve your score? Tap any completed bogie on the train map below to replay for 3 stars!"`.
  - **TDD Green State & Zero Regression**:
    - Backend: 10/10 test suites (54/54 tests) passing in `server`.
    - Frontend: 13/13 test suites (45/45 tests) passing in `client`.

## [2026.10.07.004] - 2026-10-07
### Added
- **Task AUTH-04: Frontend Auth Flow (GREEN PHASE):**
  - **Plan Documentation**: Created `docs/plans/AUTH-04-frontend-auth-flow-green-phase.md` (mirrored in `.gemini/plans/`) detailing Option 1 architecture, state models, UI component structures, and verification gates.
  - **AuthContext (`client/src/context/AuthContext.jsx`)**: Implemented dedicated authentication state provider managing JWT tokens, account data, active profile selection, OTP request/verification pipelines, profile creation, switching, and progress reset endpoints with dual `mp_*` and standard key localStorage persistence.
  - **AuthModal Component (`client/src/components/ui/AuthModal.jsx`)**: Built a tablet-first Neo-Bento 2-step modal supporting seamless email submission, 6-digit OTP verification, back navigation, and inline error feedback.
  - **ProfileSelector Component (`client/src/components/ui/ProfileSelector.jsx`)**: Implemented responsive 3-profile card grid with active indicators, profile switching, ceiling limit enforcement (disabling additions at 3 profiles), and confirmed per-profile progress resets.
  - **System Integration (`client/src/App.jsx` & `client/src/context/ProgressContext.jsx`)**: Connected `AuthProvider` to the application hierarchy, added an active profile/login badge to the header, and synced learner progress state to the active profile with safe fallback for unauthenticated play.
  - **TDD Green State & Zero Regression**: Verified 100% green pass on targeted tests (`client/src/tests/AuthFlow.test.jsx`, 6/6 tests), full client test suite (12/12 suites, 40 tests), and full server test suite (10/10 suites, 49 tests).

## [2026.10.07.003] - 2026-10-07
### Added
- **Task AUTH-03: Profile Independent Reset Endpoint & Handlers (GREEN PHASE):**
  - **Plan Documentation**: Created `docs/plans/AUTH-03-profile-reset-green-phase.md` (mirrored in `.gemini/plans/`) detailing route specification, multi-tenant isolation, Progress wipe mechanics, and verification criteria.
  - **Profile Reset Endpoint (`POST /api/auth/profiles/:profileId/reset`)**: Implemented protected route in `server/routes/auth.js` applying `authMiddleware`, verifying profile ownership within `req.account.profiles`, and returning `404 Not Found` if the profile is invalid or belongs to another account.
  - **Isolated Progress Purge**: Integrated `Progress.deleteMany({ userId: profileId })` to completely wipe spaced repetition and attempt logs exclusively for the target learner, preserving sibling profiles and alien account records intact.
  - **TDD Green State & Zero Regression**: Verified 100% green pass on `tests/profile_reset.test.js` (5/5 tests), full server test suite (10/10 suites, 49 tests), and full client test suite (11/11 suites, 34 tests).

## [2026.10.07.002] - 2026-10-07
- **Task AUTH-02: Profile Management & Switching (GREEN PHASE):**
  - **Auth Middleware (`server/middleware/auth.js`)**: Created reusable JWT Bearer token authentication middleware validating token integrity and attaching MongoDB account instance to `req.account`.
  - **Profile Listing (`GET /api/auth/profiles`)**: Protected endpoint returning authenticated account's profiles array.
  - **Profile Creation (`POST /api/auth/profiles`)**: Implemented profile creation with name validation, unique timestamp-based `profileId` generation, and strict enforcement of the 3-profile maximum ceiling (`400 Bad Request` with `Maximum of 3 profiles reached`).
  - **Active Profile Switching (`POST /api/auth/profiles/switch`)**: Protected endpoint verifying profile existence under authenticated account and returning active profile object.
  - **Atomic Query Refactor (`server/routes/auth.js`)**: Updated `POST /request-otp` to use atomic `findOneAndUpdate` with `returnDocument: 'after'` to prevent concurrent race conditions.
  - **TDD Green State**: Verified 100% green state on `server/tests/profiles.test.js` (8/8 tests passing), full backend test suite (9/9 suites, 44 tests passing), and full frontend test suite (11/11 suites, 34 tests passing).

## [2026.10.07.001] - 2026-10-07
### Added
- **Task AUTH-01: Backend Email + OTP Auth (GREEN PHASE):**
  - **Account Model (`server/models/Account.js`)**: Implemented Mongoose model with email indexing, OTP token/expiry timestamps, default profile initialization (`p1`, `'Learner 1'`), and auto-timestamps.
  - **Auth Router (`server/routes/auth.js`)**: Implemented Express endpoints `POST /request-otp` and `POST /verify-otp` with regex email verification, 6-digit numeric OTP generation, 10-minute expiry window, and replay protection (nullifying OTP upon verification).
  - **JWT Token Generation**: Successfully signed and issued 30-day JWT authentication tokens upon valid OTP verification.
  - **Server Integration (`server/server.js`)**: Mounted `/api/auth` onto the Express application.
  - **TDD Green State**: Verified 100% green state on `server/tests/auth.test.js` (6/6 tests passing), full backend test suite (8/8 suites, 36 tests passing), and full frontend test suite (11/11 suites, 34 tests passing).
