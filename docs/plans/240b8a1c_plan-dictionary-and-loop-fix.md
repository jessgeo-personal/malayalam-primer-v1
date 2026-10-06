# Implementation Plan: Lesson 2 Dictionary Fix & Session Fail-Out Logic

## Background & Motivation
The user reported several issues in Lesson 2:
1. The English translation for ന്റ incorrectly labeled it as "(Aspirated)".
2. The combination suffix 'ിച്ചി' was incorrectly stored as a single trace item, breaking the word assembly for "ചേച്ചി".
3. Failing a word repeatedly in the Word Assembly game caused an infinite loop. The `ProgressContext.jsx` blindly appended failed items to the session queue without a cap.

## Scope & Impact
- `server/data/seed-100.json` (Dictionary fixes)
- `client/src/context/ProgressContext.jsx` (Session loop logic)

## Proposed Solution

### 1. Dictionary Fixes (`seed-100.json`)
- **nta Fix:** Locate `t014` and `m014` (ന്റ). Change the `englishTranslation` from "nta (Aspirated)" to "nta".
- **icchi Fix:** Delete the entire objects for `t020` and `m020` (the invalid ിച്ചി trace and match items).
- **Chechi Fix:** Locate `w009` (ചേച്ചി). Change its `requiredCharacters` array from `["ച", "േ", "ിച്ചി"]` to `["ച", "േ", "ച്ച", "ി"]`.

### 2. Infinite Loop Prevention (`ProgressContext.jsx`)
- **Fail Tracking:** Introduce a new state (e.g., `itemFailCounts`) in `ProgressContext.jsx` to track how many times a specific `itemId` has been answered incorrectly in the current session.
- **Fail-Out Threshold:** In `updateProgress`, when `!isCorrect` occurs:
  - Increment the fail count for `currentItem.itemId`.
  - Check if the fail count has reached `3`.
  - If it reaches 3, **do not append** it to the session queue. Instead, immediately trigger `completeSession` with enough errors to yield 0 stars (e.g., `errors = 3`), effectively failing out the user.
- **User Experience:** The existing `App.jsx` already handles `lastStars === 0` by showing a "Lesson Incomplete / Keep Practicing" screen, which is the perfect UX for this fail-out.

## Implementation Steps
1. Modify `server/data/seed-100.json` using string replacement to fix the 3 dictionary issues.
2. Edit `client/src/context/ProgressContext.jsx` to add the `itemFailCounts` state map.
3. Update `updateProgress` in `ProgressContext` to increment the fail count and implement the 3-fail early exit.
4. Clear the `itemFailCounts` inside `startLesson` and `startRevision` so it resets on new attempts.

## Verification
- Seed the DB (`node seeder.js` if necessary, or just verify the JSON since the app pulls directly or via seed scripts).
- Run the app, start a lesson, and intentionally fail a single word 3 times. Verify the lesson ends immediately with a 0-star state.
- Verify Lesson 2 loads correctly and "ചേച്ചി" has the correct 4 tiles.