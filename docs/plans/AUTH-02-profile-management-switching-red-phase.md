# Plan AUTH-02: Profile Management & Switching (RED Phase)

## 1. Context & Objectives
- Building on `AUTH-01`, enable multi-profile management (up to 3 learner profiles per account) and active profile switching.
- Strict BDD/TDD RED Phase: Create the comprehensive failing test suite in `server/tests/profiles.test.js` covering 8 acceptance scenarios.
- Verify test failure and stop before implementation.

## 2. Impact Analysis (SRS & Pedagogy)
- **Pedagogical Integrity**: Untouched. Profile management establishes per-learner isolation for future multi-user progress tracking without altering word databases or SRS logic.
- **SRS State Protection**: Isolated profiles ensure that learning scores and revision queues for one child do not leak into another child's session.

## 3. Testing Strategy (4-Pillar Evaluation Matrix)
- **Accuracy**: Tests verify exact 3-profile ceiling enforcement and active profile switching validation.
- **Visual Consistency**: N/A for backend API.
- **Functional Adherence**:
  1. `GET /api/auth/profiles` rejects requests lacking a valid Bearer JWT token (401).
  2. `GET /api/auth/profiles` returns account's profiles when authenticated (200).
  3. `POST /api/auth/profiles` rejects requests with missing or empty name (400).
  4. `POST /api/auth/profiles` creates 2nd profile with unique `profileId` (201).
  5. `POST /api/auth/profiles` creates 3rd profile successfully (201).
  6. `POST /api/auth/profiles` rejects 4th profile creation attempt (400).
  7. `POST /api/auth/profiles/switch` rejects non-existent or unauthorized profileId (404/400).
  8. `POST /api/auth/profiles/switch` returns active profile on valid profileId (200).
- **Process Faultlines**: Reject unauthenticated access, malformed tokens, and exceeding profile limits.
- **Red Phase Verification**: Ensure test suite runs and fails (404 Not Found) before code implementation.

## 4. Execution Steps
1. Create `server/tests/profiles.test.js` with helper authentication utilities and 8 acceptance test cases.
2. Execute `npm --prefix server test tests/profiles.test.js`.
3. Confirm test suite runs and fails as expected (RED phase).
4. Update `docs/log/CHANGELOG.md` and STOP.
