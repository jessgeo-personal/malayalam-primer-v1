# Implementation Plan: Lesson 12 Concept Refinement

## 🎯 Objective
Update the `c012` concept screen in `seed-200.json` to explicitly contrast the use of `-മാർ` (maar) for elders/respect and `-കൾ` (kal) for children. This resolves the user's feedback that the current screen only shows `-മാർ` twice, failing to provide the full context for plurals regarding people.

## 📂 Key Files & Context
*   **Data Source:** `server/data/seed-200.json` (Concept `c012`)

## 🛠️ Implementation Steps

### Phase 1: Update Seed Data (`seed-200.json`)
Modify the `c012` concept screen payload:
1.  **First Example:** Keep the example for `അമ്മ` (Mother) -> `അമ്മമാർ` (Mothers) to illustrate the rule for elders/respect.
2.  **Second Example:** Introduce `ആൺകുട്ടി` (Boy) -> `ആൺകുട്ടികൾ` (Boys) to illustrate the contrasting rule that young children still use the standard `-കൾ` ending.

### Phase 2: Seeding & Regression
*   Run `node seeder.js` in the `/server` directory to refresh the MongoDB instance with the updated examples.
*   Run the backend test suite (`npm test`) to ensure schema integrity is maintained.

## 🧪 Verification Strategy
*   Review the JSON payload structure.
*   The user can then test Lesson 12 on the tablet and verify that the two contrasting examples are clearly presented before the game begins.