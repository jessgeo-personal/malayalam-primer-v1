# Plan AUTH-01: Backend Email + OTP Auth (RED Phase)

## 1. Context & Objectives
- Initiate authentication for "Malayalam Prime".
- Enable parent authentication via Email + 6-digit OTP.
- Strict TDD Red Phase: create comprehensive failing test suite in `server/tests/auth.test.js` and verify failure.

## 2. Impact Analysis (SRS & Pedagogy)
- **Pedagogical & SRS Safety**: Auth endpoints do not modify SRS algorithms, word buckets, or lesson progression. Existing word schemas and progression tracking remain intact.
- **Account Isolation**: Authentication will establish the foundation for multi-profile account isolation.

## 3. Testing Strategy (4-Pillar Evaluation Matrix)
- **Accuracy**: Tests verify 6-digit numeric OTP generation, 10-minute expiry window, and replay protection.
- **Visual Consistency**: N/A for backend API tests.
- **Functional Adherence**:
  1. `POST /api/auth/request-otp` returns 400 for invalid/missing email.
  2. `POST /api/auth/request-otp` returns 200 and returns OTP in test/dev environment for valid email.
  3. `POST /api/auth/verify-otp` returns 401 for incorrect OTP.
  4. `POST /api/auth/verify-otp` returns 401 for expired OTP.
  5. `POST /api/auth/verify-otp` returns 200 with JWT token and profile list on valid OTP.
  6. Re-using the same OTP returns 401 (replay protection).
- **Process Faultlines**: Test malformed payloads and expired credentials.
- **Red Phase Verification**: Ensure test suite runs and fails with 404 (endpoints not yet implemented).

## 4. Execution Steps
1. Create `server/tests/auth.test.js` specifying the 6 acceptance test cases using Supertest and Jest.
2. Run `npm --prefix server test tests/auth.test.js`.
3. Verify tests run and fail as expected (RED phase).
4. Update running changelog and STOP.
