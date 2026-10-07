# Malayalam Prime - Project Changelog

All notable changes to this project will be documented in this file.

## [2026.10.06.001] - 2026-10-06
### Added
- **Task DEV-01: Auto-Seed on Boot & Single-Command Dev Runner:**
  - **Auto-Seed on Startup**: Refactored `server/seeder.js` to export an idempotent `seedDatabaseIfNeeded()` checking `Word.countDocuments()`. If count is 0 or less than Cycle 1 count in `seed-100.json`, populates MongoDB dictionary and logs `[AutoSeed] Dictionary populated successfully`. If already populated, logs `[AutoSeed] Dictionary up to date, skipping seed`.
  - **Server Integration**: Integrated `await seedDatabaseIfNeeded()` into `server/server.js` immediately following `mongoose.connect()`, prior to `app.listen()`.
  - **CLI Backwards Compatibility**: Maintained standalone `node seeder.js` and `npm run seed` CLI execution via `if (require.main === module)`.
  - **Monorepo Dev Runner**: Added root `package.json` with `concurrently` managing simultaneous boot of `server` (port 5000) and `client` (port 3000) with colored logs.
  - **Testing & Verification**: Added unit tests in `server/tests/seeder.test.js` validating auto-seed logic and skipping conditions. 100% green test pass across server (30 tests) and client (34 tests). Verified live concurrent boot with HTTP 200 OK responses.
