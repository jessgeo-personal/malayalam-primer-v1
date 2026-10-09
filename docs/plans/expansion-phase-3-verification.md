# Phase 3: Seeding, Validation & Regression Testing

## Objective
Apply the new curriculum data to the local MongoDB instance and perform exhaustive validation to ensure a zero-error rollout.

## 1. Database Seeding
- **Task:** Append the drafted payload to `server/data/seed-100.json`.
- **Action:** Execute `node seeder.js` in the `/server` directory.
- **Verification:** Check terminal output for "Seeded X items successfully."

## 2. Full-Cycle Validation
- **Adventure Map:** Verify that nodes 4-10 are visible (initially locked) and have the correct titles/themes.
- **Word Audit Tool:** Use the Phase 1 tool to perform a "Full System Scan." Resolve any "Missing Trace" or "Split Mismatch" errors flagged by the tool.
- **Gameplay Dry Run:** Play through Lesson 4 (WHO?) and Lesson 5 (WHAT?) on the tablet/simulator to ensure:
    - Traces render correctly.
    - Drag-and-drop tiles are sized for touch.
    - Sentence scrambler accepts the correct word order.

## 3. Regression Testing
- **SRS Engine:** Run `npm test` in `/server` to ensure the `srsEngine` correctly weights the new items.
- **Progress Tracking:** Verify that completing Lesson 4 correctly updates `user.currentLesson` to 5 and grants stars.
- **Multi-User Safety:** Verify that Lesson 4 progress for "Learner 1" does not affect "Learner 2."

## 4. Final Polish & Versioning
- **Version Update:** Increment `client/src/config/version.js`.
- **Changelog:** Perform a final update to `.gemini/logs/CHANGELOG.md` reflecting the successful Cycle 1 expansion.
