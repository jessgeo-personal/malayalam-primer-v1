# QA Plan: Milestone 2.3 Comprehensive Audit

## 🎯 Objective
Perform a final Test-Driven Development (TDD) review, complete a full regression audit, and update the project checklists and changelog. This formally closes out Milestone 2.3 (Tense Transformations) and prepares the codebase for the next phase.

## 📂 Key Files & Context
*   **Test Suites:** `client/src/tests/*`, `server/tests/*`
*   **Documentation:** `.gemini/docs/regression_checklist.md`, `.gemini/log/CHANGELOG.md`
*   **Version Config:** `client/src/config/version.js`

## 🛠️ Implementation Steps

### Phase 1: Automated Regression (TDD Audit)
1.  **Backend Integrity:** Run `npm test` in the `/server` directory to ensure:
    *   The SRS Engine algorithm handles the new `tense` data types correctly.
    *   Mongoose Schema validation passes for all 340 words.
    *   The `integrity.test.js` confirms Lesson 15 meets the minimum required items.
2.  **Frontend Stability:** Run `npm test -- --runInBand --no-watch` in the `/client` directory to ensure:
    *   The `TimeMachine` component tests pass.
    *   The `App.jsx` dispatcher correctly routes the new lesson types.
    *   The `PrototypeLab` and `WordAudit` tests are stable.

### Phase 2: Manual Heuristic Audit
*   Review the recent code changes in `TimeMachine.jsx` to ensure they strictly adhere to the Tablet-First UX constraints (no complex inputs, large tap targets, clear haptic/audio feedback).
*   Verify the "No Cloud Bill" rule remains unbroken (no external dependencies were added).

### Phase 3: Documentation Updates
1.  **Regression Checklist:** Open `.gemini/docs/regression_checklist.md`.
    *   Add a new section: `## 🛠️ Phase 2: The Grammar Factory (Milestones 2.1 - 2.3)`.
    *   Add specific checklist items for the Suffix Snapper fixes and the new Time Machine component, marking them as verified.
2.  **Changelog:** Open `.gemini/log/CHANGELOG.md`.
    *   Add a new entry for `[2026.06.01.022]` detailing the fixes to the Audit Dictionary, the Locative Sandhi rules, the Suffix Snapper UI overhaul, and the official release of the Time Machine.

## 🧪 Verification Strategy
*   Terminal output must show 100% test passing rates before updating the documentation.
*   Once completed, present the updated changelog to the user for final sign-off.