# Implementation Plan: Fix 'API endpoint not found' on /api/auth/request-otp & Add Route Diagnostics

## 1. Context & Root Cause
- When running in development, requests may hit unexpected 404s if router mounting order or catchall middleware intercepts requests, or if router fallbacks interfere.
- Specifically:
  1. `server/server.js` previously had `app.use('/', apiRoutes)` which could conflict or create unexpected routing edge cases.
  2. Lack of request logging in development makes diagnosing incoming request URLs and proxy rewrites difficult.
  3. Mounting order needs to be strictly organized:
     - Dev request logger: `[REQ] ${req.method} ${req.originalUrl}`
     - Specific routers first: `/api/auth`, `/api/ai`, `/api`
     - Direct fallbacks: `/auth`, `/ai` (and removing any root `app.use('/', apiRoutes)` catch-all)
     - Strict API 404 Guard returning JSON `{ error: 'API endpoint not found' }` for `/api`, `/auth`, `/ai`
     - Static file serving & SPA catchall for non-API GET routes
  4. Client `AuthContext.jsx` URLs audit: verify all auth endpoints use the `/auth/` namespace with `${API_BASE}/api/auth/...`.
  5. `client/vite.config.js`: confirm no rewrite functions strip `/api`.

## 2. Testing Strategy
- **Backend Tests (`server`)**:
  - Run `npm test` (all 73 tests must pass).
  - Verify `ops.test.js` continues to pass with updated fallback routing.
  - Test smoke runner: `npm run test:smoke` or in-process verification.
- **Frontend Tests (`client`)**:
  - Run `npm test -- --run` (all 52 tests must pass).
- **Regression Checklist & Versioning**:
  - Increment version to `2026.10.09.008`.
  - Update `CHANGELOG.md` and `regression_checklist.md`.
