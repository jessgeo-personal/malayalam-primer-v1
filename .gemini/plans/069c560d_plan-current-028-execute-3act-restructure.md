# Plan: Execution & Validation of 3-Act Restructure (L1-L3)

## Objective
To safely execute the database restructuring script (`rebuild-l1-l3-strict.js`) and formally validate the new "3-Act Lesson Structure" across Lessons 1, 2, and 3. This execution must strictly follow TDD principles: we will write tests that assert the existence of the Hard Gates *before* we run the seeder, watch them fail, run the seeder, and watch them pass.

---

## Phase 1: Test-Driven Development (TDD) Implementation
Before modifying the live database, we must codify the new pedagogical rules into our backend test suite.

1.  **Update `server/tests/integrity.test.js`:**
    *   Create a new test block specifically named: `"The 3-Act Structure Integrity Check"`.
    *   **Rule 1 (Act 2 Gate):** Assert that for any lesson containing `scramble` items, there MUST be a `concept` item that lists ALL `build` items in that lesson as prerequisites.
    *   **Rule 2 (Act 3 Gate):** Assert that for any lesson containing `build` items, there MUST be a `concept` item that lists ALL `match` items in that lesson as prerequisites.

2.  **Execute Failing Tests:**
    *   Run `npm test tests/integrity.test.js`.
    *   *Expected Result:* The new "3-Act Structure" tests will FAIL because the current database state does not have these strict prerequisite arrays.

---

## Phase 2: Database Migration
Once the TDD framework is in place, we will execute the data transformation.

1.  **Run the Restructure Script:**
    *   Execute `node rebuild-l1-l3-strict.js` from the root directory. This will overwrite `server/data/seed-100.json` with the new, uniquely ID'd (e.g., `_new` suffix) and correctly gated L1-L3 items.
2.  **Run the Seeder:**
    *   Navigate to the `/server` directory and execute `node seeder.js`.
    *   This will wipe the `WordItem` collection in MongoDB and repopulate it with the updated `seed-100.json` data.

---

## Phase 3: Regression & Validation
With the database updated, we must prove the zero-regression mandate has been upheld.

1.  **Run Passing Tests:**
    *   Re-run `npm test tests/integrity.test.js`.
    *   *Expected Result:* All tests, including the new "3-Act Structure" tests, should now PASS, confirming the Hard Gates are securely wired.
2.  **Verify Cycle Boundaries:**
    *   Ensure the existing tests for Cycle 1 (L1-L10) and Cycle 2 (L11-L16) boundaries continue to pass without overlap errors.

---

## Phase 4: Documentation & Finalization
1.  **Update `regression_checklist.md`:**
    *   Add a new entry for "Phase 25: 3-Act Structure Validation" under the active milestone.
    *   Include checkboxes confirming that Act 2 and Act 3 Hard Gates are enforced programmatically.
2.  **Increment Version:**
    *   Update `client/src/config/version.js` to reflect the completed execution (e.g., `2026.06.02.026`).
3.  **Update Changelog:**
    *   Document the strict TDD validation of the 3-Act Structure in `CHANGELOG.md`.

---
**[APPROVAL REQUIRED]: Please review this execution plan. Upon your approval, I will exit plan mode and begin the TDD implementation.**