# Implementation Plan: Seeding Tense Lessons (Cycle 2)

## 🎯 Objective
Seed `server/data/seed-200.json` with new verb tense transformation lessons to activate the "Time Machine" mini-game in the live gameplay loop. This completes the data injection portion of Milestone 2.3.

## 📂 Key Files & Context
*   **Data Source:** `server/data/seed-200.json`
*   **Database Seeder:** `server/seeder.js`
*   **Testing:** `server/tests/integrity.test.js`

## 🛠️ Implementation Steps

### Phase 1: Define the Tense Payload (Lesson 15)
The last lesson in Cycle 2 is currently `lessonId: 14`. We will add a new set of entries under `lessonId: 15`. This module will focus on basic motion and action verbs.

We will inject a Concept Screen entry, followed by 5 `tense` items:
1.  **Concept Screen (`c015`):** Explaining the Time Machine / Tenses.
2.  **Go (`tm001`):** പോ -> പോയി / പോകുന്നു / പോകും
3.  **Come (`tm002`):** വാ -> വന്നു / വരുന്നു / വരും
4.  **Play (`tm003`):** കളി -> കളിച്ചു / കളിക്കുന്നു / കളിക്കും
5.  **Run (`tm004`):** ഓടു -> ഓടി / ഓടുന്നു / ഓടും
6.  **Read (`tm005`):** വായിക്കു -> വായിച്ചു / വായിക്കുന്നു / വായിക്കും

### Phase 2: Update `seed-200.json`
*   Append the JSON objects for the concept screen and the 5 tense items to `seed-200.json`.
*   Ensure all schema requirements are met: `wordId`, `malayalamText`, `englishTranslation`, `bucketId: 3`, `unlockCycle: 2`, `lessonId: 15`, `lessonType: 'tense'`, `baseWord`, `pastForm`, `presentForm`, `futureForm`, `pastEnglish`, `presentEnglish`, `futureEnglish`.

### Phase 3: Seeding and Regression
*   Update `server/tests/integrity.test.js` to ensure it checks that Lesson 15 has >= 6 items.
*   Run the backend test suite to ensure the new data doesn't violate schema requirements.
*   Execute `node seeder.js` in the `/server` directory to refresh the local MongoDB instance.

## 🧪 Verification Strategy
*   User will log into a test account or open the `Audit Dictionary` on the frontend.
*   Verify the new verbs (tm001-tm005) show up in the audit with all tense forms correctly mapped.