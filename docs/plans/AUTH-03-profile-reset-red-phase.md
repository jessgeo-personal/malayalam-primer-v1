# Plan AUTH-03: Profile Independent Reset Endpoint & Handlers (RED Phase)

## 1. Context & Objectives
- Building on `AUTH-01` (Account & OTP authentication) and `AUTH-02` (Multi-profile management & switching), implement an independent reset mechanism per profile.
- In multi-learner households where up to 3 learner profiles exist under one account, a parent or learner must be able to reset progress for an individual profile without affecting any sibling profiles or alien accounts.
- Strict BDD/TDD RED Phase: Author the comprehensive failing test suite in `server/tests/profile_reset.test.js` covering 5 core acceptance scenarios.
- Confirm clean test failures (unmounted endpoint) and stop before implementation.

## 2. Impact Analysis (SRS & Pedagogy)
- **Pedagogical Integrity**: Dictionary data, word definitions, curriculum trees, and grammatical buckets remain immutable. Only learning attempt logs in the `Progress` collection associated with the target `profileId` are purged.
- **SRS State Protection**: Progress reset operations are strictly filtered by `{ userId: profileId }`. Sibling profiles on the same account (`p2`) and other accounts (`p_other`) retain all spaced repetition weights, encounter counts, and graduation statuses.
- **Security & Multi-Tenant Isolation**: The endpoint requires a valid JWT Bearer token via `authMiddleware`. Reset requests verify ownership of the requested `profileId` within `req.account.profiles`. Any attempt to reset a profile not belonging to the authenticated account must fail with `404 Profile not found`.

## 3. Testing Strategy (4-Pillar Evaluation Matrix)
- **Accuracy**: Verify that `Progress.deleteMany({ userId: profileId })` removes only the target learner's progress, leaving all other learners' progress records intact.
- **Visual Consistency**: N/A for backend REST API.
- **Functional Adherence**:
  1. `POST /api/auth/profiles/p1/reset` without Authorization header returns `401 Unauthorized`.
  2. `POST /api/auth/profiles/p_invalid/reset` with Account A's JWT token returns `404 Not Found` with error `'Profile not found'`.
  3. `POST /api/auth/profiles/p_other/reset` with Account A's JWT token returns `404 Not Found` (cross-account isolation prevents resetting an alien profile).
  4. `POST /api/auth/profiles/p1/reset` with Account A's JWT token returns `200 OK` with success status and confirmation message.
  5. Verify that Progress documents for `p1` are completely deleted (`count === 0`), while Progress documents for `p2` and `p_other` remain intact (`count === 2`).
- **Process Faultlines**: Unauthorized requests, foreign profile hijacking, and invalid profile IDs are rejected safely.
- **Red Phase Verification**: The endpoint `POST /api/auth/profiles/:profileId/reset` is not yet mounted in `server/routes/auth.js`. The test suite must run and fail cleanly due to 404 Route Not Found on unmounted route handlers.

## 4. Execution Steps
1. Create `docs/plans/AUTH-03-profile-reset-red-phase.md` and mirror to `.gemini/plans/AUTH-03-profile-reset-red-phase.md`.
2. Record planning in `.gemini/log/CHANGELOG.md`.
3. Create `server/tests/profile_reset.test.js` with database setup, Account A / B seeding, and dummy Progress data for `p1`, `p2`, and `p_other`.
4. Execute `npm --prefix server test tests/profile_reset.test.js`.
5. Verify clean RED failures and report output without modifying `server/routes/auth.js`.
