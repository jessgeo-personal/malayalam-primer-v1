# Plan: OPS-01 - DigitalOcean App Platform PaaS & Resend Email Integration

## 1. Overview & Objective
Pivot Track D operations away from IaaS Droplet/Nginx/PM2 hosting to a zero-maintenance PaaS deployment on DigitalOcean App Platform (`.do/app.yaml`) comprising a Web Service (`api`) and Static Site (`web`) with auto-SSL. Concurrently, integrate Resend (`resend`) for parent OTP email delivery while preserving local Synology NAS Docker deployment.

## 2. Scope of Changes
1. **Dependencies**:
   - Install `resend` in `server/package.json`.
2. **Email Service (`server/services/emailService.js`)**:
   - Initialize Resend client using `process.env.RESEND_API_KEY`.
   - Export `sendOTP(email, otpCode)`.
   - Implement clean HTML template with `#059669` styling, 6-digit bold display, and 10-minute expiry note.
   - Guard test/CI environments (`NODE_ENV === 'test'` or missing `RESEND_API_KEY`) to resolve immediately with `{ success: true, simulated: true, id: 'mock-msg-id' }`.
   - Return `{ success: false, error }` upon failure.
3. **Auth Routes (`server/routes/auth.js`)**:
   - In `POST /api/auth/request-otp`, call `await sendOTP(normalizedEmail, otp)` after persisting the OTP in MongoDB.
   - Return `{ success: true, message: 'OTP sent to email', ...(process.env.NODE_ENV !== 'production' && { devOtp: otp, otp }) }`.
   - If sending fails, return HTTP 500 `{ error: 'Failed to send verification code. Please try again later.' }`.
4. **Environment Template (`server/.env.example`)**:
   - Document `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CLIENT_URL`.
5. **DigitalOcean App Platform Spec (`.do/app.yaml`)**:
   - Create `.do/app.yaml` with service `api` (port 5000, `/api` route, `/api/health` healthcheck, secret envs) and static site `web` (`dist`, SPA catchall, `VITE_API_URL`).
6. **IaaS Deprecation & Cleanup**:
   - Delete `ecosystem.config.js`.
   - Delete `nginx/malayalam-prime.conf` and `nginx/` directory.
7. **Testing Suite Refactor (`server/tests/ops.test.js`)**:
   - Validate `.do/app.yaml` parsing and required service/static_site spec.
   - Validate `emailService.js` test simulation behavior and export.
   - Validate `POST /api/auth/request-otp` integration with `sendOTP`.
   - Maintain `/api/health` 200 OK test.
8. **Tracker, Changelog & Versioning**:
   - Update `docs/EXECUTION_TRACKER.md`.
   - Update `docs/regression_checklist.md`.
   - Update `docs/log/CHANGELOG.md` and `.gemini/log/CHANGELOG.md`.
   - Bump version in `client/src/config/version.js` (`2026.10.09.003`).

## 3. Testing Strategy (4-Pillar Matrix)

### Pillar 1: Accuracy (Pedagogy & Data Contract)
- `POST /api/auth/request-otp` continues to persist the 6-digit OTP code and expiry timestamp in MongoDB with replay protection intact.
- App platform spec accurately maps backend routes to `/api` and frontend routes to `/`.

### Pillar 2: Visual Consistency (Mobile/Tablet & Email Aesthetics)
- Email HTML template is responsive and mobile-friendly with clear typography, high contrast, `#059669` accent, and legible letter spacing for the 6-digit code.

### Pillar 3: Functional Adherence (Gameplay & Workflow)
- `sendOTP` delivers simulated response in test/CI environments without external network hits.
- Real production sends invoke `resend.emails.send` with correct headers (`from`, `to`, `subject`, `html`).
- Frontend auth flow continues to seamlessly request and verify OTP.

### Pillar 4: Process Faultlines (Edge Cases & Resilience)
- Missing `RESEND_API_KEY` in non-test mode or Resend API rejection safely returns `{ success: false, error }`, which triggers HTTP 500 with user-friendly error message without crashing Node process.
- Dropping old Nginx/PM2 configs does not affect local Docker Compose workflow.

## 4. Architectural Integrity Checks
- **PWA Safety**: Android tablet PWA unaffected; client build produces `dist` SPA assets.
- **Local Pathing & Synology Parity**: `docker-compose.yml` unaffected; local network development and NAS deployment continue as normal.
- **Environment Variable Parity**: `.env.example` documents all newly introduced variables without leaking API secrets.
