# Plan: 017 - Progression Accuracy & Reinforcement Thresholds

## Objective
Fix the critical lesson tracking bug, implement a bounded score system, add an immediate reinforcement queue for failed items, and enforce a 75% passing threshold to unlock new lessons.

## Root Cause Analysis & Solutions

### 1. Replaying Lesson 1 Unlocks Lesson 3 (The Pointer Bug)
- **Root Cause:** In `ProgressContext.jsx`, `completeSession(..., currentLesson)` passes the user's *global* next-lesson pointer, rather than the `lessonId` they just played.
- **Fix:** Introduce `activeLessonId` to `ProgressContext` state. When `startLesson(id)` is called, set this state. Pass `activeLessonId` to `completeSession` and display it in the "Active Lesson" HUD.

### 2. Infinite Score Inflation
- **Root Cause:** The score is calculated by summing `correctCount * 10` for every database entry. Playing 100 times yields infinite score.
- **Fix:** Tie the score directly to the `lessonHistory` array. 
  - 1 Star = 100 pts, 2 Stars = 200 pts, 3 Stars = 300 pts.
  - The maximum score for a lesson is strictly 300, achieved only by earning 3 stars.

### 3. "Retry" Doesn't Reinforce
- **Root Cause:** Clicking Retry just closes the feedback modal and moves `currentIndex + 1`, skipping the failed item.
- **Fix:** In `updateProgress`, if `!isCorrect`, duplicate the `currentItem` and append it to the end of the `sessionItems` array. The user *must* encounter it again at the end of the lesson until they get it right.

### 4. Stricter Passing Threshold (The 0-Star Fail)
- **Logic Mapping:** For an 8-item lesson, the user wants a strict failure condition based on initial mistakes.
  - 0 initial mistakes = 3 Stars.
  - 1 initial mistake = 2 Stars.
  - 2 initial mistakes = 1 Star.
  - 3+ initial mistakes = 0 Stars (Fail).
  *(Note: The `sessionErrors` counter only tracks the *initial* mistake per item, even if the user sees the item again due to the reinforcement queue. Yes, the reinforcement queue means the user might answer 9 or 10 questions total if they make mistakes, but the stars are based on the number of unique mistakes made).*
- **Fix:** In `server/routes/api.js`, update the unlock logic: `if (stars > 0) user.currentLesson = Math.max(user.currentLesson, lid + 1);`. If they get 0 Stars, their score updates (to 0), but the next lesson remains locked.

## TDD & Guardrails
- **Backend Unit Tests:** Update `api.test.js` to verify that `stars: 1` does NOT advance `currentLesson`, while `stars: 2` DOES.
- **Backend Score Test:** Verify score calculates as `stars * 100`.

## Implementation Steps
1. **Refactor Context:** Add `activeLessonId` and append-to-array logic in `ProgressContext.jsx`.
2. **Refactor HUD:** Use `activeLessonId` for the top-right bubble in `App.jsx`.
3. **Refactor API:** Update `POST /session/lesson/complete` threshold logic and `GET /progress/stats` scoring logic.
4. **Testing:** Run backend tests to ensure the threshold and scoring work flawlessly.
