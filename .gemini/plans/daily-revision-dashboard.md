# Plan: Learned Letters Strip & Phased Gamification

## Objective
Implement a persistent visual reinforcement of learned characters and structure the learning loop into clear "Revision" and "New Learning" phases, enhanced with basic gamification (Points).

## Scope & Context
- `server/routes/api.js`: Add endpoint for fetching mastered letters and tracking total score.
- `client/src/context/ProgressContext.jsx`: Manage global state for mastered letters, current learning phase, and user score.
- `client/src/App.jsx`: Update UI to include a persistent "Mastery Strip" and a Score/Phase indicator.
- `client/src/components/ui/MasteryStrip.jsx`: New component to visually display learned alphabets/chillus.

## Implementation Steps

### 1. Backend Updates
- **Mastered Characters API (`GET /api/progress/mastered`):** Fetch all `trace` type words where the user has a `Progress` entry. Return the Malayalam text.
- **Score Tracking:** Add a basic calculation to the existing `/api/progress/update` to return a global `score` (e.g., total correct answers * 10).

### 2. Context & Logic Updates (`ProgressContext.jsx`)
- Fetch `masteredCharacters` on load and after every `updateProgress`.
- Calculate the `currentPhase`: 
  - **"Revision Phase"**: If the `currentWord` has existing progress.
  - **"New Learning Phase"**: If the `currentWord` has no prior progress.
- Track `score`.

### 3. Frontend UI (`MasteryStrip.jsx` & `App.jsx`)
- **Mastery Strip:** Create a horizontal scrollable strip at the bottom of the screen. Display the `masteredCharacters` as golden/glowing tiles to reinforce learning.
- **Header Gamification:** Add a "Star/Points" counter in the header.
- **Phase Badge:** Display a prominent badge above the puzzle indicating if the child is in "🌟 Revision" or "✨ New Sound/Word".

### 4. Guardrails & Closing Actions
- Write Jest tests for the new `/api/progress/mastered` endpoint.
- Verify Vitest components render correctly.
- Update `CHANGELOG.md`, `regression_checklist.md`, and version number.
- Commit to the `dev` branch.

## Verification
- Run tests (`npm test`).
- Open the app. The bottom strip should show 'അ', 'ന', 'ൻ' after tracing them.
- The top header should show a points score increasing upon completion.
- The UI should clearly state if a puzzle is a Revision or New Lesson.