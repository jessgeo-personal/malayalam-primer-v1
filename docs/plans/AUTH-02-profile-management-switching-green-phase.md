# Plan AUTH-02: Profile Management & Switching (GREEN Phase)

## 1. Context & Objectives
- Transition Task AUTH-02 from RED to GREEN phase.
- Implement reusable JWT authentication middleware in `server/middleware/auth.js`.
- Implement profile endpoints in `server/routes/auth.js`:
  - `GET /profiles`: List authenticated account's profiles.
  - `POST /profiles`: Add new profile (with validation, unique ID, and 3-profile ceiling).
  - `POST /profiles/switch`: Validate and switch to active profile.
- Verify 100% green pass on `tests/profiles.test.js`, full server test suite, and client regression suite.
- Update `docs/EXECUTION_TRACKER.md` (AUTH-02 -> Completed, AUTH-03 -> Next).
- Update versioning, regression checklist, and changelog.

## 2. Impact Analysis (SRS & Pedagogy)
- **Pedagogical Integrity**: Untouched. No modifications to curriculum, word dictionary, or character splitting rules.
- **SRS State Protection**: Profile switching provides explicit boundaries so learner progress and SRS repetitions remain isolated per profile.
- **Security & Faultlines**: Middleware securely validates JWT signatures, handles expired/malformed tokens, checks account existence, and enforces a hard ceiling of 3 profiles per account.

## 3. Testing Strategy (4-Pillar Evaluation Matrix)
- **Accuracy**: Exact enforcement of 3-profile ceiling, unique profileId generation, and active profile lookup.
- **Visual Consistency**: N/A for backend API endpoints.
- **Functional Adherence**:
  1. `GET /api/auth/profiles` rejects unauthenticated requests (401).
  2. `GET /api/auth/profiles` returns profiles array for authenticated user (200).
  3. `POST /api/auth/profiles` rejects missing/empty profile name (400).
  4. `POST /api/auth/profiles` adds second profile and returns 201.
  5. `POST /api/auth/profiles` adds third profile and returns 201.
  6. `POST /api/auth/profiles` rejects fourth profile with 400 error.
  7. `POST /api/auth/profiles/switch` returns 404 for invalid profileId.
  8. `POST /api/auth/profiles/switch` returns active profile on valid profileId (200).
- **Process Faultlines**: Reject unauthenticated access, handle non-existent accounts, and invalid profile IDs.

## 4. Execution Steps
1. Create `server/middleware/auth.js`.
2. Add profile route handlers to `server/routes/auth.js`.
3. Run `npm --prefix server test tests/profiles.test.js` to verify 8/8 tests pass (GREEN).
4. Run full backend suite (`npm --prefix server test`) - verify 44/44 tests pass.
5. Run full client suite (`npm --prefix client test -- --run`) - verify 34/34 tests pass.
6. Update `docs/EXECUTION_TRACKER.md` (AUTH-02 Completed, AUTH-03 Next).
7. Bump version to `2026.10.07.002` in `client/src/config/version.js`.
8. Update `docs/regression_checklist.md` and `docs/log/CHANGELOG.md`.
