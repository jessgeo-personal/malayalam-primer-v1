# Implementation Plan: Gamification Overhaul & UI Refinement

## 🎯 Objective
Elevate the core gameplay loop by introducing a robust "Micro-Joy" system (Confetti/Stars) for specific pedagogical milestones. Additionally, refactor the Session Summary screen to provide clear, actionable feedback on performance (correct/wrong counts and mastery status), and standardize global UI text. This must be completed and tested before advancing to Milestone 2.3 (Tense Progression).

## 📂 Key Files & Context
*   **Dependency:** `canvas-confetti` (to be added for lightweight, performant particle effects).
*   **State Management:** `client/src/context/ProgressContext.jsx`
*   **Global Layout:** `client/src/App.jsx`
*   **Documentation:** `.gemini/docs/UI_CHARTER.md` (New file to document global design standards).

## 🛠️ Implementation Steps

### Phase 1: Context & Tracking Refactor
1.  **Update `ProgressContext.jsx`:**
    *   Add tracking for `initialCorrect` and `initialWrong` counts per session.
    *   Identify "Fixed Errors": When `updateProgress` is called with `isCorrect = true`, check if `currentItem.isReinforcement` is true. If yes, trigger a "Redemption" event.
    *   Identify "Hard Words": Define a heuristic (e.g., length > 5 characters or `bucketId` > 5) or check a new `isHard` flag on the word object.
2.  **State Flags:** Expose a `showConfetti` trigger mechanism from the context.

### Phase 2: The "Micro-Joy" Animation System
1.  Install `canvas-confetti` in the `client` directory.
2.  Create a utility function or component (`client/src/components/ui/ConfettiOverlay.jsx`) that can trigger different effects:
    *   **Standard Sparkle:** For regular correct answers.
    *   **Redemption Starburst:** For fixing a previously failed word.
    *   **Epic Confetti:** For completing a "hard" word or finishing the lesson.

### Phase 3: The Session Summary Overhaul
1.  **Refactor `App.jsx` (Session Complete View):**
    *   Remove the generic "Done!" message.
    *   Add a visual breakdown: `Total Correct` vs. `Total Errors`.
    *   Implement the "Mastery Check":
        *   If `initialErrors` === 0 (3 Stars): "Lesson Mastered!"
        *   If `initialErrors` <= 2 (1-2 Stars): "Good Work! Needs Practice."
        *   If `initialErrors` > 2 (0 Stars): "Lesson Incomplete. Let's try again tomorrow!"
    *   Show a grayed-out or red indicator if the lesson was deemed "Incomplete".

### Phase 4: Global UI Standardization
1.  **Update `App.jsx` Header:** Change "Let's Learn!" to **"Let's Learn Malayalam!!"**.
2.  **Create UI Charter:** Document these specific feedback rules (Redemption triggers, Summary breakdowns, Header text) in `.gemini/docs/UI_CHARTER.md` so the AI remembers these standards for all future cycles.

### Phase 5: TDD & Regression Audits
1.  Write tests for `ProgressContext.test.jsx` to verify the new tracking logic (correct/wrong counts, reinforcement detection).
2.  Run the full test suite (`npm test` in both `client` and `server`) to ensure no existing routing or SRS logic was broken.

## 🧪 Verification Strategy
*   User will test a live lesson to ensure confetti fires on the correct triggers.
*   User will intentionally fail a word to ensure the summary screen correctly reports the error and displays the appropriate "Incomplete" or "Needs Practice" status.
*   Only after sign-off will we begin the Tense Transformations (Milestone 2.3).