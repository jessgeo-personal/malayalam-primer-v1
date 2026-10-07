# Plan AUTH-03: Profile Independent Reset Endpoint & Handlers (GREEN Phase)

## 1. Context & Objectives
- Building on `AUTH-01` and `AUTH-02`, implement the independent progress reset endpoint for learner profiles.
- Ensure that resetting a profile completely purges all spaced repetition attempt logs for that learner without leaking across profiles in the same account or cross-account.
- Transition from RED to GREEN phase under strict BDD/TDD.

## 2. Implementation Architecture & Route Specification
- **Endpoint**: `POST /api/auth/profiles/:profileId/reset`
- **Security / Middleware**: Protected via `authMiddleware` (Bearer JWT verification).
- **Parameters**: `profileId` supplied via route parameter (`req.params.profileId`).
- **Authorization & Multi-Tenant Ownership Check**:
  - Inspect `req.account.profiles`.
  - Ensure the target `profileId` exists in the authenticated account's profiles array.
  - If not found or profile does not belong to the account, return `404 Not Found` with `{ error: 'Profile not found' }`.
- **Progress Purge**:
  - Model: `Progress = require('../models/Progress')`
  - Query: `await Progress.deleteMany({ userId: profileId });`
  - Eliminates all learning records (`itemId`, `encounters`, `correctCount`, `errorCount`, `srsWeight`, `graduated`) specifically tied to `userId: profileId`.
- **Response**:
  - Status: `200 OK`
  - Body: `{ success: true, message: 'Profile progress reset successfully', profileId }`

## 3. Impact Analysis (SRS & Pedagogy)
- **Pedagogical Integrity**: Unlocked dictionary words, lessons, and grammatical structures remain unchanged.
- **SRS Isolation**: Resetting `profileId` deletes only the progress documents matching `{ userId: profileId }`. Sibling profiles (`p2`) on the same account and profiles belonging to other accounts (`p_other`) retain their exact SRS weights, review intervals, and graduation flags.
- **Security Boundary**: Cross-tenant isolation guarantees that Account A cannot trigger a reset on any profile belonging to Account B, even if the profile ID is known.

## 4. Testing & Verification Strategy (4-Pillar Evaluation Matrix)
- **Accuracy**: `Progress.deleteMany({ userId: profileId })` targets strictly the specific profile's documents.
- **Visual Consistency**: N/A (Backend REST endpoint).
- **Functional Adherence**:
  - `POST /api/auth/profiles/p1/reset` without token -> `401 Unauthorized`.
  - `POST /api/auth/profiles/p_invalid/reset` with token -> `404 Not Found` (`error: 'Profile not found'`).
  - `POST /api/auth/profiles/p_other/reset` with Account A token -> `404 Not Found` (`error: 'Profile not found'`).
  - `POST /api/auth/profiles/p1/reset` with Account A token -> `200 OK` (`success: true`).
  - Database verification: `Progress` count for `p1` becomes `0`, while `p2` and `p_other` retain their counts (`2` each).
- **Process Faultlines**: Graceful 500 handling on unexpected database or server errors.
- **Zero-Regression Mandate**: Full server test suite (`npm --prefix server test`) and full client test suite (`npm --prefix client test`) must pass with 100% green status.

## 5. Execution Steps
1. Create `docs/plans/AUTH-03-profile-reset-green-phase.md` and mirror to `.gemini/plans/`.
2. Edit `server/routes/auth.js` to import `Progress` and implement `POST /profiles/:profileId/reset`.
3. Execute `npm --prefix server test tests/profile_reset.test.js` to verify all 5 tests pass (GREEN).
4. Run full server test suite (`npm --prefix server test`) and client test suite (`npm --prefix client test`).
5. Update `client/src/config/version.js` to `2026.10.07.003`.
6. Update `docs/EXECUTION_TRACKER.md` (AUTH-03 -> Completed, AUTH-04 -> Next).
7. Update `docs/log/CHANGELOG.md` and `.gemini/log/CHANGELOG.md`.
