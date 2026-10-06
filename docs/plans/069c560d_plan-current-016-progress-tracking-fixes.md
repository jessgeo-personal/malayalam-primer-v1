# Plan: 016 - Progress Tracking & Mastery Calculation Fixes

## Objective
Fix three critical progress tracking bugs observed by Learner 3: 
1. Replaying a lesson incorrectly inflates the `currentLesson` pointer (unlocking unplayed lessons).
2. "Lessons Completed" stat on the dashboard is artificially high.
3. "Cycle 1 Mastery" remains stuck at 0% despite gameplay.

## Root Cause Analysis
### 1. Inflated `currentLesson`
**File:** `server/routes/api.js` -> `POST /session/lesson/complete`
**Bug:** The logic `if (lid === user.currentLesson) user.currentLesson += 1;` is unsafe. If a user clicks "Start Lesson 1", finishes it, and the frontend state hasn't hard-refreshed, or if they replay Lesson 1, it might increment `currentLesson` multiple times. 
**Fix:** Change the condition to strictly unlock the *next* lesson: `user.currentLesson = Math.max(user.currentLesson, lid + 1)`.

### 2. Inflated "Lessons Completed" Stat
**File:** `client/src/App.jsx`
**Bug:** The UI shows `{currentLesson}` under the "Lessons Completed" stat box. However, `currentLesson` tracks the *next available* lesson (e.g., if you are on Lesson 1, you have completed 0).
**Fix:** Update the UI to render `Math.max(0, currentLesson - 1)` or rely on the length of `lessonHistory`. Using `lessonHistory.length` is the most accurate reflection of distinct completed lessons.

### 3. Cycle Mastery Stuck at 0%
**File:** `server/routes/api.js` -> `GET /progress/stats`
**Bug:** The logic calculates mastery by checking for `Progress` entries where `itemType: 'word'` AND the word has `lessonType: 'build'`. However, `ProgressContext.jsx` might be sending `itemType: 'word'` for *all* items (trace, match, build), or the `seed-100.json` uses different types. Wait, in `srsEngine.js`, when payloads are generated, we do: `itemType: 'word'` for ALL items in `generateLessonPayload`. The issue is that `itemId` in Progress is tracked by `wordId` (e.g., `w001`), but `seed-100.json` has `wordId` as `t001`, `m001`, `w001`. 
The `stats` logic searches: `const wordsInCycle = await Word.find({ unlockCycle: activeCycle, lessonType: 'build' })`. It finds `w001`. Then it looks for `Progress.find({ itemId: 'w001', itemType: 'word', correctCount: > 0 })`. If the user only played Lesson 1, maybe they only completed traces (`t001` to `t007`), and haven't actually completed a `build` game (`w001`) yet because they quit early or it wasn't triggered?
**Correction:** Lesson 1 *does* contain `build` words (ഞാൻ, നീ). The issue is that `updateProgress` in `ProgressContext.jsx` might not be sending the correct `itemType` or `itemId`. Let's verify how `itemId` is passed. Ah, `LetterPicker.jsx` might not trigger `updateProgress` correctly, or the backend is failing to save it. 

Wait, the bug says: "I only worked on lesson 1... total score has gone upto 370 but 'Cycle 1 Mastery' says 0%".
If score is 370, progress *is* being saved. 370 score = 37 correct answers (10 pts each). 
Let's check `api.js` again: `const cycleProgress = wordsInCycle.length > 0 ? Math.round((masteredInCycle.length / wordsInCycle.length) * 100) : 0;`
If `masteredInCycle.length` is 0, it means no `build` words have `correctCount > 0`. Is the user actually completing the "Build" phase, or does the lesson end prematurely? Or maybe the `lessonType` in the DB for the words is not exactly `'build'`? Let's check `seed-100.json`.

## Implementation Steps
### Backend (`server/routes/api.js`)
1. **Fix `POST /session/lesson/complete`**: `user.currentLesson = Math.max(user.currentLesson, lid + 1);`
2. **Refine Cycle Mastery**: Update the mastery calculation to check for completion of *any* item in the cycle, or specifically verify `lessonType: 'build'` is correct. Let's calculate mastery based on all items in the cycle to give smoother progress. `const itemsInCycle = await Word.find({ unlockCycle: activeCycle }); const masteredInCycle = await Progress.find({ userId, itemId: { $in: itemsInCycle.map(w => w.wordId) }, correctCount: { $gt: 0 } }); cycleProgress = Math.round((masteredInCycle.length / itemsInCycle.length) * 100);`

### Frontend (`client/src/App.jsx`)
3. **Fix Lessons Completed Stat**: Change `<div className="text-4xl...">{currentLesson}</div>` to `{lessonHistory.length}`.

### TDD & Guardrails
4. **Unit Tests**: Update `session.test.js` or `api.test.js` to verify `currentLesson` does not increment beyond `lid + 1` if a lesson is replayed.

## Verification
- Run backend tests to ensure the `/complete` route behaves idempotently.
- Restart the app, play Lesson 1. Verify "Lessons Completed" becomes 1.
- Verify "Cycle 1 Mastery" increases above 0%.
