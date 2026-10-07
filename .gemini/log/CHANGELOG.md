# Malayalam Prime - Project Changelog

All notable changes to this project will be documented in this file.

## [2026.10.07.004] - 2026-10-07
### Added
- **Task AUTH-04: Frontend Auth Flow (GREEN PHASE):**
  - **Plan Documentation**: Created `docs/plans/AUTH-04-frontend-auth-flow-green-phase.md` (mirrored in `.gemini/plans/`) detailing Option 1 architecture, state models, UI component structures, and verification gates.
  - **AuthContext (`client/src/context/AuthContext.jsx`)**: Implemented dedicated authentication state provider managing JWT tokens, account data, active profile selection, OTP request/verification pipelines, profile creation, switching, and progress reset endpoints with dual `mp_*` and standard key localStorage persistence.
  - **AuthModal Component (`client/src/components/ui/AuthModal.jsx`)**: Built a tablet-first Neo-Bento 2-step modal supporting seamless email submission, 6-digit OTP verification, back navigation, and inline error feedback.
  - **ProfileSelector Component (`client/src/components/ui/ProfileSelector.jsx`)**: Implemented responsive 3-profile card grid with active indicators, profile switching, ceiling limit enforcement (disabling additions at 3 profiles), and confirmed per-profile progress resets.
  - **System Integration (`client/src/App.jsx` & `client/src/context/ProgressContext.jsx`)**: Connected `AuthProvider` to the application hierarchy, added an active profile/login badge to the header, and synced learner progress state to the active profile with safe fallback for unauthenticated play.
  - **TDD Green State & Zero Regression**: Verified 100% green pass on targeted tests (`client/src/tests/AuthFlow.test.jsx`, 6/6 tests), full client test suite (12/12 suites, 40 tests), and full server test suite (10/10 suites, 49 tests).

## [2026.10.07.003] - 2026-10-07
### Added
- **Task AUTH-03: Profile Independent Reset Endpoint & Handlers (GREEN PHASE):**
  - **Plan Documentation**: Created `docs/plans/AUTH-03-profile-reset-green-phase.md` (mirrored in `.gemini/plans/`) detailing route specification, multi-tenant isolation, Progress wipe mechanics, and verification criteria.
  - **Profile Reset Endpoint (`POST /api/auth/profiles/:profileId/reset`)**: Implemented protected route in `server/routes/auth.js` applying `authMiddleware`, verifying profile ownership within `req.account.profiles`, and returning `404 Not Found` if the profile is invalid or belongs to another account.
  - **Isolated Progress Purge**: Integrated `Progress.deleteMany({ userId: profileId })` to completely wipe spaced repetition and attempt logs exclusively for the target learner, preserving sibling profiles and alien account records intact.
  - **TDD Green State & Zero Regression**: Verified 100% green pass on `tests/profile_reset.test.js` (5/5 tests), full server test suite (10/10 suites, 49 tests), and full client test suite (11/11 suites, 34 tests).

## [2026.10.07.002] - 2026-10-07
- **Task AUTH-02: Profile Management & Switching (GREEN PHASE):**
  - **Auth Middleware (`server/middleware/auth.js`)**: Created reusable JWT Bearer token authentication middleware validating token integrity and attaching MongoDB account instance to `req.account`.
  - **Profile Listing (`GET /api/auth/profiles`)**: Protected endpoint returning authenticated account's profiles array.
  - **Profile Creation (`POST /api/auth/profiles`)**: Implemented profile creation with name validation, unique timestamp-based `profileId` generation, and strict enforcement of the 3-profile maximum ceiling (`400 Bad Request` with `Maximum of 3 profiles reached`).
  - **Active Profile Switching (`POST /api/auth/profiles/switch`)**: Protected endpoint verifying profile existence under authenticated account and returning active profile object.
  - **Atomic Query Refactor (`server/routes/auth.js`)**: Updated `POST /request-otp` to use atomic `findOneAndUpdate` with `returnDocument: 'after'` to prevent concurrent race conditions.
  - **TDD Green State**: Verified 100% green state on `server/tests/profiles.test.js` (8/8 tests passing), full backend test suite (9/9 suites, 44 tests passing), and full frontend test suite (11/11 suites, 34 tests passing).

## [2026.10.07.001] - 2026-10-07
### Added
- **Task AUTH-01: Backend Email + OTP Auth (GREEN PHASE):**
  - **Account Model (`server/models/Account.js`)**: Implemented Mongoose model with email indexing, OTP token/expiry timestamps, default profile initialization (`p1`, `'Learner 1'`), and auto-timestamps.
  - **Auth Router (`server/routes/auth.js`)**: Implemented Express endpoints `POST /request-otp` and `POST /verify-otp` with regex email verification, 6-digit numeric OTP generation, 10-minute expiry window, and replay protection (nullifying OTP upon verification).
  - **JWT Token Generation**: Successfully signed and issued 30-day JWT authentication tokens upon valid OTP verification.
  - **Server Integration (`server/server.js`)**: Mounted `/api/auth` onto the Express application.
  - **TDD Green State**: Verified 100% green state on `server/tests/auth.test.js` (6/6 tests passing), full backend test suite (8/8 suites, 36 tests passing), and full frontend test suite (11/11 suites, 34 tests passing).
