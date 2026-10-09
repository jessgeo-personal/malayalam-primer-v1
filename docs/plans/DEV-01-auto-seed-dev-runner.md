# Plan DEV-01: Auto-Seed on Boot & Single-Command Dev Runner

## 1. Context & Objectives
1. Make database seeding automatic on backend startup if the database is empty or out-of-date.
2. Provide a single root-level `npm run dev` command to spin up both client and server concurrently.

## 2. Impact Analysis (SRS & Pedagogy)
- **Pedagogical Integrity**: Unaltered. Words are loaded strictly from the verified seed files (`seed-100.json`, `seed-200.json`, `seed-300.json`).
- **SRS State Protection**: Seeding only triggers if `countDocuments() === 0` or is less than Cycle 1 count in `seed-100.json`. When the database is already seeded, seeding is safely skipped, protecting existing user progress and repetition intervals.
- **Graceful Failure**: Seeder and server connection errors are caught and logged cleanly.

## 3. Testing Strategy (4-Pillar Evaluation Matrix)
- **Accuracy**: Unit tests verify `seedDatabaseIfNeeded()` correctly compares word counts against Cycle 1 count.
- **Functional Adherence**:
  - If empty or out-of-date: seeds DB and logs `[AutoSeed] Dictionary populated successfully`.
  - If up-to-date: skips seeding and logs `[AutoSeed] Dictionary up to date, skipping seed`.
  - Standalone execution (`node seeder.js`) remains functional when executed directly.
- **Process Faultlines**: Test handling of DB errors and ensure server fails gracefully if connection is unavailable.
- **Zero-Regression**: Full execution of existing server Jest tests and client Vitest suites.

## 4. Execution Steps
1. Write failing / new unit tests in `server/tests/seeder.test.js` covering `seedDatabaseIfNeeded()`.
2. Refactor `server/seeder.js`:
   - Export `seedDatabaseIfNeeded`.
   - Guard standalone DB connection and execution behind `if (require.main === module)`.
3. Update `server/server.js`:
   - Import `seedDatabaseIfNeeded` from `./seeder`.
   - Await `seedDatabaseIfNeeded()` after `mongoose.connect()`.
4. Update `server/package.json`:
   - Ensure `"dev": "node server.js"` is present.
5. Create root `package.json`:
   - Include `concurrently` in `devDependencies`.
   - Add `"dev"`, `"seed"`, and `"test"` scripts.
6. Run `npm install` at root.
7. Run all test suites across client and server.
8. Bump version in `client/src/config/version.js` to `2026.10.06.001`.
9. Update `docs/log/CHANGELOG.md` and `docs/regression_checklist.md`.
