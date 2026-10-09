# Implementation Plan: Unified Relative Path Contract (/api) for Local & CDN Parity

## 1. Context & Objectives
1. **Local Vite Proxy**: Fix Windows IPv6 resolution drops / ECONNRESET proxy crashes by locking Vite's `/api` proxy target explicitly to IPv4 `http://127.0.0.1:5000` with explicit timeout and secure settings.
2. **Standardize Relative Client API Calls**: Ensure all client API calls in contexts and components use clean relative `/api/...` paths directly (prefixed with `const API_BASE = import.meta.env.VITE_API_URL || '';`), removing hard dependency on `VITE_API_URL` domain interpolations.
3. **Bind Express to IPv4 / Any Interface**: In `server/server.js`, bind `app.listen` explicitly to `'0.0.0.0'`.
4. **Canonical DigitalOcean App Spec (`.do/app.yaml`)**:
   - Update `.do/app.yaml` with the canonical specification (name `malayalam-primer-v1`, github repo bindings to `jessgeo-personal/malayalam-primer-v1`, route `/api` with `preserve_path_prefix: true`, static site `/` with `catchall_document: index.html`, eliminating the need for `VITE_API_URL: ${api.PUBLIC_URL}`).
5. **Testing & Quality Assurance**:
   - Update `server/tests/ops.test.js` to match the updated `.do/app.yaml` spec.
   - Run all server tests (73 tests) and all client tests (52 tests) ensuring 100% green test passes.
   - Increment version in `client/src/config/version.js` to `2026.10.09.007`.
   - Update `CHANGELOG.md` and `regression_checklist.md`.

## 2. Testing Strategy
- **Backend**:
  - Run `npm test` in `server/` to verify all 73 tests pass, including `ops.test.js` checking `.do/app.yaml` syntax, services, routes, envs, and static site configs.
- **Frontend**:
  - Run `npm test -- --run` in `client/` to verify all 52 tests pass, including auth flows and navigation components.
- **Verification of Zero Regression**:
  - Confirm all test suites pass with zero regressions.
