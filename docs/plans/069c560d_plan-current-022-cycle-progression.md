# Plan: 022 - Fix Cycle Progression & Explain Pedagogical Gap

## Objective
Address two user concerns:
1. Explain why certain letters (ഡ, ള, ജ, റ്റ) lack example words in Lessons 8 and 9.
2. Fix the progression bug preventing Cycle 2 from unlocking after completing Cycle 1 (Lesson 9).

## Investigation Summary
### 1. Missing Example Words
- **Reason:** The backend dynamically pulls example words from the `build` dictionary. Characters like ഡ, ള, ജ, and റ്റ are intentionally introduced at the very end of Cycle 1 (Lessons 8 & 9) to *prepare* the student for Cycle 2 vocabulary. 
- **Reality:** There are currently no buildable words in the 100-word Cycle 1 dictionary that utilize these specific letters. They appear heavily in Cycles 2-4 (e.g., കളിച്ചു, വെളുത്ത). Because the examples are dynamically generated from available words, none show up yet. 
- **Action:** No code fix required; this is a pedagogical design choice (frontloading character recognition before spelling). I will explain this to the user.

### 2. Cycle Progression Bug
- **Reason:** When a user completes a lesson (e.g., Lesson 9), `user.currentLesson` increments (to 10). However, the backend logic in `POST /api/session/lesson/complete` never updates `user.currentCycle`. 
- **Reality:** Since `user.currentCycle` remains 1, the Adventure Map remains locked to Cycle 1, and Cycle 2's lessons (starting at 10) stay locked.
- **Action:** Update the backend API to dynamically evaluate and update `user.currentCycle` whenever `user.currentLesson` advances.

## Implementation Steps (Cycle Progression Fix)

### Step 1: Update API Route (`api.js`)
1. Open `server/routes/api.js`.
2. Locate `POST /api/session/lesson/complete`.
3. After calculating `nextLessonId` (`Math.max(user.currentLesson, lid + 1)`), query the `Word` collection to find any item belonging to `nextLessonId`.
4. If an item is found, extract its `unlockCycle`.
5. If the extracted `unlockCycle` is greater than `user.currentCycle`, update `user.currentCycle`.

### Step 2: Verification
1. Run backend tests to ensure `POST /api/session/lesson/complete` is still idempotent and handles the new query safely.

## Regression Checklist Update
- Add Phase 24: Cycle Progression Fix.