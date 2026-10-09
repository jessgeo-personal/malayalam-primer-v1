# Implementation Plan: Fix Time Machine Logic Bugs

## 🎯 Objective
Fix two distinct bugs reported by the user in the Time Machine component (Lesson 15):
1.  **Translation Mismatch:** The component randomly selects a tense (e.g., 'future') but the English translation doesn't match the required tense for the active word (e.g., it asks for 'Will run' when the base word is 'പോ'/Go).
2.  **Progression Freeze:** After successfully dropping the tile, the `onComplete` callback is not properly advancing the session to the next question.

## 📂 Key Files & Context
*   **Component:** `client/src/components/games/TimeMachine.jsx`

## 🛠️ Implementation Steps

### Phase 1: Fix Translation Mismatch
The issue stems from `useState(() => { ... })` potentially holding onto stale state between re-renders or when the `word` prop changes.
1.  **Dependency Issue:** The `targetTense` should be randomly generated, but it must be bound to the *current* `word`.
2.  **Fix:** Move the randomization into a `useEffect` that depends on `word.wordId`. When a new word is passed in, it picks a new random target tense.
3.  **UI Update:** Ensure `targetEnglish` updates reactively when `targetTense` changes.

### Phase 2: Fix Progression Freeze
The issue stems from how `onComplete` is called and how the component resets for the next word.
1.  **Reset State:** When `onComplete(true)` is called, the parent `App.jsx` moves to the next word. If the *next* word is also a `tense` lesson, the `TimeMachine` component stays mounted, but its internal state (`isSuccess`, `placedWord`, `activeZone`) is stuck in the "success" position.
2.  **Fix:** In the `useEffect` that listens for `word.wordId` changes (from Phase 1), explicitly reset `isSuccess`, `placedWord`, and `activeZone` to their default states.

### Phase 3: TDD & Regression
*   Update `client/src/tests/TimeMachine.test.jsx` to verify that changing the `word` prop correctly resets the component state and generates a new target.

## 🧪 Verification Strategy
*   User will test Lesson 15 on the tablet.
*   Verify that the English instruction matches the Malayalam base word (e.g., Base: പോ -> Target: Went/Going/Will go).
*   Verify that upon successfully dropping the tile, the game advances to the next verb in the lesson sequence.