# Plan: Fix Duplicate '/api/api' Prefix in Client API Calls

## 1. Problem Statement & Impact Analysis
- **Symptom:** Server console logs show requests arriving with doubled prefixes:
  `POST /api/api/auth/request-otp`
  `GET /api/api/progress/stats`
  which triggers Express's 404 guard (`API endpoint not found`).
- **Root Cause:**
  1. `client/.env` contained `VITE_API_URL=http://localhost:5000/api`.
  2. Frontend callers in `AuthContext.jsx` and `ProgressContext.jsx` concatenated `${API_BASE}/api/...`.
  3. When `API_BASE` included `/api`, it produced `/api/api/...`.
- **SRS & Architectural Impact:**
  - Zero regression risk to SRS mathematical model (SuperMemo SM-2 / spacing / bucket scores).
  - High positive impact on SRS reliability: Ensures progress updates, stats, session loads, and review requests correctly reach Express `/api/progress/*` and `/api/session/*` without being dropped by the 404 guard.

## 2. Proposed Changes

### A. Environment Files
- Update `client/.env`:
  Set `VITE_API_URL=` (empty string) or ensure it contains no trailing `/api` (and no trailing slash).
  When empty, Vite's dev proxy forwards `/api/*` to `http://127.0.0.1:5000/api/*`, perfectly mirroring production DigitalOcean edge routing.

### B. Client Helper: `client/src/utils/api.js`
- Export `getApiUrl(endpoint)`:
  ```javascript
  export const getApiUrl = (endpoint) => {
    const rawBase = (import.meta.env?.VITE_API_URL || '').replace(/\/+$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Prevent /api/api duplication if base already ends with /api
    if (rawBase.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
      return `${rawBase}${cleanEndpoint.slice(4)}`;
    }
    // Prevent accidental duplication if cleanEndpoint already has /api
    if (!rawBase && cleanEndpoint.startsWith('/api/api/')) {
      return cleanEndpoint.replace('/api/api/', '/api/');
    }
    return `${rawBase}${cleanEndpoint}`;
  };
  ```

### C. Context Refactoring
- In `client/src/context/AuthContext.jsx`:
  Import `getApiUrl` from `../utils/api`.
  Replace all `const url = ${API_BASE}/api/...` with `getApiUrl('/api/auth/...')`.
- In `client/src/context/ProgressContext.jsx`:
  Import `getApiUrl` from `../utils/api`.
  Replace all `${API_BASE}/api/...` calls with `getApiUrl('/api/progress/...')` and `getApiUrl('/api/session/...')`.

### D. Unit & Integration Testing
- Create `client/src/tests/ApiUrlHelper.test.js` to rigorously test `getApiUrl` against all combinations:
  - Empty `VITE_API_URL`: `/api/auth/request-otp` -> `/api/auth/request-otp`
  - Base without trailing slash or api: `http://localhost:5000` + `/api/auth/request-otp` -> `http://localhost:5000/api/auth/request-otp`
  - Base with `/api`: `http://localhost:5000/api` + `/api/auth/request-otp` -> `http://localhost:5000/api/auth/request-otp` (prevents duplication)
  - Base with trailing slash: `http://localhost:5000/` + `/api/auth/request-otp` -> `http://localhost:5000/api/auth/request-otp`
  - Endpoint starting without leading slash: `api/progress/stats` -> `/api/progress/stats`
  - Accidental `/api/api` in endpoint: `/api/api/auth/request-otp` -> `/api/auth/request-otp`

## 3. Testing Strategy (Zero-Regression Mandate)
- **Accuracy:**
  Ensure all auth, progress, and session endpoints construct URLs that match backend route tables (`/api/auth/*`, `/api/progress/*`, `/api/session/*`).
- **Visual Consistency:**
  No UI changes.
- **Functional Adherence:**
  All existing AuthFlow and ProgressContext tests pass with mock fetch calls receiving expected `/api/...` strings.
- **Process Faultlines (Edge Cases):**
  Missing or malformed `VITE_API_URL` values (extra slashes, duplicated `/api`, undefined env) safely normalize to a single `/api/` prefix.

## 4. Execution Order
1. Write `client/src/tests/ApiUrlHelper.test.js` (Failing test first).
2. Create `client/src/utils/api.js`.
3. Update `client/.env`.
4. Update `client/src/context/AuthContext.jsx`.
5. Update `client/src/context/ProgressContext.jsx`.
6. Run `npm test` in `client` and `npm test` in `server`.
7. Update `.gemini/log/CHANGELOG.md` and `.gemini/docs/regression_checklist.md`.
8. Increment version in `client/src/config/version.js`.
