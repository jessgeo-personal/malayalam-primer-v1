# Implementation Plan: Fix Production API Route Prefix & Implement Lesson Auth Gate

## 1. Context & Objectives
1. **DigitalOcean App Platform Path Stripping**: Fix issue where requests to `/api` lose their prefix downstream and inadvertently return `index.html`.
   - Update `.do/app.yaml` to include `preserve_path_prefix: true` under `services` -> `name: api` -> `routes`.
2. **Server Route Preservation & Strict JSON Guard**:
   - In `server/server.js`, mount API routers under both `/api` and fallback root paths (`/api/auth` & `/auth`, `/api` & `/`). Also mount `/ai` fallback for completeness.
   - Guard catch-all handler: for non-GET requests or requests starting with `/api` or `/auth`, return JSON 404 (`{ error: 'API endpoint not found' }`) instead of returning HTML.
3. **Client Lesson & Practice Auth Gate**:
   - Gate all Lesson and Practice clicks behind authentication.
   - If `!isAuthenticated`:
     - In `handleSelectLesson(lessonId)`: store `pendingLessonId(lessonId)` and trigger `openAuthModal()`.
     - In `handleStartReview`: store `pendingAction('review')` (or handle review pending state) and trigger `openAuthModal()`.
   - Add auto-resume effect watching `[isAuthenticated, pendingLessonId, ...]`:
     - Once authenticated and `pendingLessonId` is set, extract target lesson, clear pending state, and invoke `startLesson(targetLesson)`.
     - Similarly, if pending action is review, trigger `startRevision()`.
   - Ensure `AdventureMap` uses these handlers (e.g. passing `onSelectLesson={handleSelectLesson}` or handling auth gate directly/via props, or verifying `AdventureMap` delegates or calls `handleSelectLesson`).
4. **Testing & Quality Assurance**:
   - Add unit tests in `client/src/tests/AuthFlow.test.jsx` verifying the auth gate, pending lesson persistence, and auto-resume execution.
   - Update any tests in `server/tests/ops.test.js` or `server/tests/api.test.js` to assert `preserve_path_prefix: true` and the strict JSON 404 guard for `/api` and `/auth`.
   - Confirm 100% green tests in both `/server` and `/client`.
   - Increment `client/src/config/version.js` to `2026.10.09.006`.
   - Document changes in `.gemini/log/CHANGELOG.md` and `.gemini/docs/regression_checklist.md`.

## 2. Testing Strategy
- **Backend Unit & Ops Tests**:
  - Test `server/tests/ops.test.js`: Check `.do/app.yaml` specifies `preserve_path_prefix: true`.
  - Test JSON 404: Requests to `/api/unknown` or `/auth/unknown` return status 404 with `{ error: 'API endpoint not found' }` and `application/json` Content-Type, never `text/html`.
  - Test stripped routes: Requests to `/health`, `/session/lesson`, etc. resolve properly via fallback mounts.
- **Frontend Vitest Suites**:
  - Add test in `client/src/tests/AuthFlow.test.jsx`:
    - Clicking a lesson while unauthenticated triggers `AuthModal` and sets pending lesson.
    - Simulating successful authentication (and onboarding if new learner) auto-starts the target lesson.
- **Regression Verification**:
  - Run `npm test` in `server` (asserting all 71+ tests pass).
  - Run `npm test -- --run` in `client` (asserting all 51+ tests pass).
