# Malayalam Prime - Project Changelog

All notable changes to this project will be documented in this file.

## [2026.10.07.001] - 2026-10-07
### Added
- **Task AUTH-01: Backend Email + OTP Auth (GREEN PHASE):**
  - **Account Model (`server/models/Account.js`)**: Implemented Mongoose model with email indexing, OTP token/expiry timestamps, default profile initialization (`p1`, `'Learner 1'`), and auto-timestamps.
  - **Auth Router (`server/routes/auth.js`)**: Implemented Express endpoints `POST /request-otp` and `POST /verify-otp` with regex email verification, 6-digit numeric OTP generation, 10-minute expiry window, and replay protection (nullifying OTP upon verification).
  - **JWT Token Generation**: Successfully signed and issued 30-day JWT authentication tokens upon valid OTP verification.
  - **Server Integration (`server/server.js`)**: Mounted `/api/auth` onto the Express application.
  - **TDD Green State**: Verified 100% green state on `server/tests/auth.test.js` (6/6 tests passing), full backend test suite (8/8 suites, 36 tests passing), and full frontend test suite (11/11 suites, 34 tests passing).

## [2026.10.06.001] - 2026-10-06
### Added
- **Task DEV-01: Auto-Seed on Boot & Single-Command Dev Runner:**
  - **Auto-Seed on Startup**: Refactored `server/seeder.js` to export an idempotent `seedDatabaseIfNeeded()` checking `Word.countDocuments()`. If count is 0 or less than Cycle 1 count in `seed-100.json`, populates MongoDB dictionary and logs `[AutoSeed] Dictionary populated successfully`. If already populated, logs `[AutoSeed] Dictionary up to date, skipping seed`.
  - **Server Integration**: Integrated `await seedDatabaseIfNeeded()` into `server/server.js` immediately following `mongoose.connect()`, prior to `app.listen()`.
  - **CLI Backwards Compatibility**: Maintained standalone `node seeder.js` and `npm run seed` CLI execution via `if (require.main === module)`.
  - **Monorepo Dev Runner**: Added root `package.json` with `concurrently` managing simultaneous boot of `server` (port 5000) and `client` (port 3000) with colored logs.
  - **Testing & Verification**: Added unit tests in `server/tests/seeder.test.js` validating auto-seed logic and skipping conditions. 100% green test pass across server (30 tests) and client (34 tests). Verified live concurrent boot with HTTP 200 OK responses.
