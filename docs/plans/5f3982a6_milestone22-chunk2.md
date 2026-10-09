# Plan: Milestone 2.2 - Chunk 2 & 3 (Frontend & Data Expansion)

## Objective
Proceed with executing Chunk 2 (Frontend Concept Screen) and prepare for Chunk 3 (Data Expansion). 

## User Constraints Addressed
1. **Reinforcement Queue ("Try Again" logic):** The system already has active Reinforcement Queue logic inside `client/src/context/ProgressContext.jsx`. When a student gets an answer wrong, `isReinforcement: true` is appended to the item, and it is pushed to the end of the `sessionItems` array. This guarantees that any incorrectly answered question will re-appear at the end of the lesson until they get it right.
2. **10+ Words Per Lesson:** During Chunk 3 (Data Expansion), the `seed-200.json` file will be expanded so that every Cycle 2 grammar lesson (Lessons 10, 11, 12, 13, 14) contains at least 10 words. 

## Chunk 2 Steps:
1. Create `client/src/components/games/ConceptScreen.jsx` with automated visual morphing.
2. Export `ConceptScreen` from `index.js`.
3. Add `ConceptScreen` to the main game loop in `client/src/App.jsx`.
4. Create and run tests in `client/src/tests/ConceptScreen.test.jsx`.