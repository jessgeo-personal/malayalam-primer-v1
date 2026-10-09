# Plan: OPS-02 - Production Smoke Testing Suite & Deployment Verification

## 1. Overview & Objective
Establish Track D (OPS-02): the live deployment verification gate and automated production smoke-test harness. This guarantees that post-deployment environments (DigitalOcean App Platform, staging, or local dev containers) can be autonomously validated across health, database seeding, static SPA routing, and authentication delivery.

## 2. Pre-Flight GitHub & DigitalOcean App Platform Configuration
1. **GitHub Repository Pre-flight**:
   - Ensure the repository has `.do/app.yaml` committed on branch `dev` or `main`.
2. **DigitalOcean App Platform Setup**:
   - Create App in DigitalOcean App Platform using `.do/app.yaml`.
   - Configure secrets in the App Platform dashboard:
     - `MONGO_URI`: Connection string to MongoDB cluster (e.g. MongoDB Atlas or DigitalOcean Managed MongoDB).
     - `JWT_SECRET`: 256-bit secure secret string.
     - `RESEND_API_KEY`: Production Resend API key (`re_...`).
   - Validate that build-time and runtime environment variables match the App Spec.
3. **Smoke Test Execution**:
   - Run `node server/scripts/smoke-test.js https://<app-name>.ondigitalocean.app` directly from terminal or CI workflow.

## 3. Scope of Changes
1. **Smoke Test Runner Script (`server/scripts/smoke-test.js`)**:
   - Native Node.js `fetch` harness accepting a target base URL via CLI argument or `process.env.TARGET_URL` (default: `http://localhost:5000`).
   - Normalizes target URL (stripping trailing slashes).
   - Gate 1: Health Check (`GET /api/health` -> HTTP 200, `{ status: 'ok' }`).
   - Gate 2: Database Seeding & Curriculum (`GET /api/game/lesson/1?act=1` or `/api/session/lesson?lessonId=1` -> HTTP 200, non-empty lesson items array).
   - Gate 3: Static Web SPA Routing (`GET /` -> HTTP 200 `text/html`; `GET /non-existent-route` -> HTTP 200 `text/html` catchall).
   - Gate 4: Auth & Email Delivery (`POST /api/auth/request-otp` with valid payload -> HTTP 200 operational or structured 500 error, zero 502/503 crashes).
   - Color-coded CLI reporting (`✔` green, `✖` red) with exit codes `0` on success and `1` on failure.
   - Modular export of `runSmokeTest` for unit testing integration.
2. **Server Route Support (`server/routes/api.js` & `server/server.js`)**:
   - Add route alias `GET /api/game/lesson/:lessonId` in `server/routes/api.js` mapping to `srsEngine.generateLessonPayload`.
   - Add static asset serving and SPA fallback in `server/server.js` for non-API GET routes to ensure standalone and dev server parity with DigitalOcean App Platform's SPA catchall routing.
3. **NPM Script Addition (`server/package.json`)**:
   - Add `"test:smoke": "node scripts/smoke-test.js"` script.
4. **Ops Test Suite Enhancement (`server/tests/ops.test.js`)**:
   - Add automated verification for `runSmokeTest` against an ephemeral in-process test server.
5. **Tracker, Changelog, & Versioning**:
   - Update `docs/EXECUTION_TRACKER.md` row OPS-02.
   - Update `docs/regression_checklist.md`.
   - Update `docs/log/CHANGELOG.md` and `.gemini/log/CHANGELOG.md`.
   - Increment application version in `client/src/config/version.js` (`2026.10.09.004`).

## 4. Testing Strategy (4-Pillar Matrix)

### Pillar 1: Accuracy (Data Contracts & Gates)
- Health gate strictly requires `{ status: 'ok' }`.
- Curriculum gate strictly verifies that seeded items exist in MongoDB and return valid structures.
- Auth gate verifies JSON response with either `{ success: true, message: ... }` or controlled `{ error: ... }`.

### Pillar 2: Visual Consistency (CLI Output & Content-Type)
- Terminal output formats clear, legible colored indicators with elapsed timing and concise gate descriptors.
- Static gate asserts `Content-Type` contains `text/html`.

### Pillar 3: Functional Adherence (Execution & Exit Codes)
- Passing suites return exit code 0; any failing assertion triggers exit code 1.
- CLI argument overrides environment variable and default URL.

### Pillar 4: Process Faultlines (Edge Cases & Resilience)
- Handles network connectivity issues (e.g. server down / connection refused) with clear diagnostic logs.
- Handles unexpected non-JSON or HTML 502/503 gateway responses with informative failures.

## 5. Architectural Integrity Checks
- **PWA & Synology Parity**: No changes to Synology NAS Docker configurations or PWA manifests.
- **Zero Cloud Cost**: Script executes locally or via CI without external vendor dependencies.
- **Node 18+ Compatibility**: Uses native global `fetch`.
