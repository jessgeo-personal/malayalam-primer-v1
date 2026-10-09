# Plan AUTH-01: Backend Email + OTP Auth (GREEN Phase)

## 1. Context & Objectives
- Transition Task AUTH-01 from RED to GREEN phase.
- Implement the Account Mongoose model (`server/models/Account.js`).
- Implement Auth routes (`server/routes/auth.js`) for `POST /request-otp` and `POST /verify-otp` with JWT token generation.
- Mount auth routes in `server/server.js`.
- Install `jsonwebtoken` dependency in `server`.
- Validate that all 6 tests in `server/tests/auth.test.js` pass, along with the full server (8 suites) and client regression suites.
- Update `docs/EXECUTION_TRACKER.md`, `docs/regression_checklist.md`, and `docs/log/CHANGELOG.md`.

## 2. Impact Analysis (SRS & Pedagogy)
- **Pedagogical Integrity**: 100% untouched. No modifications to curriculum, word bank, or character splitting.
- **SRS State Protection**: Progress collection and SRS engine algorithms remain unaltered.
- **Data Isolation**: Account model introduces the foundation for multi-learner profiles without disrupting existing single-learner progress logic.

## 3. Testing Strategy (4-Pillar Evaluation Matrix)
- **Accuracy**: Regex email validation, 6-digit cryptographic-safe OTP, 10-minute expiry timestamps, and JWT signed payloads.
- **Visual Consistency**: N/A for backend API endpoints.
- **Functional Adherence**:
  1. `POST /api/auth/request-otp` rejects missing/malformed email (400).
  2. `POST /api/auth/request-otp` generates 6-digit OTP, upserts Account, and includes OTP in test/development environments (200).
  3. `POST /api/auth/verify-otp` rejects mismatched OTP (401).
  4. `POST /api/auth/verify-otp` rejects expired OTP (401).
  5. `POST /api/auth/verify-otp` issues signed JWT token and returns account profiles (200).
  6. Replay protection clears OTP upon verification, failing subsequent attempts (401).
- **Process Faultlines**: Graceful handling of missing body fields, database errors, and invalid tokens.

## 4. Execution Steps
1. Install `jsonwebtoken` in `server`.
2. Create `server/models/Account.js`.
3. Create `server/routes/auth.js`.
4. Mount `/api/auth` in `server/server.js`.
5. Run `npm --prefix server test tests/auth.test.js` to verify 6/6 tests passing (GREEN).
6. Run full server test suite (`npm --prefix server test`).
7. Run full client test suite (`npm --prefix client test -- --run`).
8. Update `docs/EXECUTION_TRACKER.md` (AUTH-01 -> Completed, AUTH-02 -> Next).
9. Update `client/src/config/version.js`, `docs/regression_checklist.md`, and `docs/log/CHANGELOG.md`.
