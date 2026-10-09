# Plan: Fixing App Flow & Progress Inconsistency

## Objective
To resolve the issues where the application flow feels disconnected, progress stats are hardcoded or incorrect, and buttons (like Reset and Sync) are either missing or non-functional.

## Scope
1. **Backend Reset Logic:** Fix `POST /api/progress/reset` to fully wipe both the `Progress` and `User` state.
2. **Backend Stats logic:** Calculate dynamic `currentCycle` and `cycleProgress` (percentage) based on actual MongoDB data.
3. **Frontend Progress Integration:** Update `ProgressContext` and `App.jsx` to use these dynamic stats instead of hardcoded placeholders (like 78%).
4. **Intuitive Navigation:** 
   - Restore the "Restart Game" button to a visible location.
   - Fix the "Daily Sync" (Revision) feedback loop so the user knows when they are done.
   - Ensure the "Adventure Map" correctly locks/unlocks cycles based on actual progress.

## Key Changes

### Phase 1: Backend Refactoring (`server/routes/api.js`)
- **Reset Endpoint:** Update to clear `User` fields: `currentLesson`, `lessonHistory`, `lastRevisionDate`, `currentCycle`.
- **Stats Endpoint:**
  - Determine `currentCycle`: The highest `unlockCycle` where at least one lesson is unlocked, or the cycle where the user is currently working.
  - Calculate `% Completion`: `(words_encountered_in_cycle / total_words_in_cycle) * 100`.
  - Include these in the JSON response.

### Phase 2: Context & State Update (`client/src/context/ProgressContext.jsx`)
- Add `cycleProgress` state.
- Update `fetchStats` to handle the new backend fields.
- In `startRevision`, if the payload is empty, ensure the UI reflects that "Revision is already complete for today" via a toast or clear visual state change.

### Phase 3: UI Refinement
- **`App.jsx`:**
  - Replace hardcoded `78%` with `{cycleProgress}%`.
  - Ensure the "Reset" button is easily accessible (e.g., a "Settings" button in the HUD that opens a small overlay).
- **`AdventureMap.jsx`:**
  - Use dynamic `currentCycle` from context to determine which card is expanded.
  - Ensure "Daily Sync" button has a "Ready" state that feels satisfying.

## Verification
- Click "Reset" and verify all cycles lock and progress goes to 0%.
- Complete a lesson and verify the progress percentage increases.
- Click "Daily Sync" and verify it correctly marks revision as done for the day.
- Run all existing unit tests to ensure SRS logic remains intact.