# Plan: Phase 1 - UI Refinement & Cleanup (Sentence Scrambler)

## Objective
Execute **Phase 1 only**. We will refine the existing "Sentence Scrambler" UI to exclusively use the user-approved "Tap-to-Build" interaction model. All other experimental code, prototyping tabs, and drag-and-drop dependencies will be stripped out to ensure a lean, production-ready component. 

*Note: Following the execution of this plan, I will halt all implementation and await further pedagogical planning for Phase 2 (Micro-Scrambles).*

---

## Phase 1 Execution Steps

### 1. Implementation Cleanup
- **Refactor `SentenceScrambler.jsx`:**
  - Completely remove `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` imports and logic.
  - Remove the `variant` prop logic (Magnets/Puzzle/Tap) and solidify the "Tap" logic (Duolingo-style) as the only interaction model.
  - Simplify the state management to just `shuffledWords`, `placedWords`, and `isCorrect`.
- **Refactor `PrototypeLab.jsx`:**
  - Remove the tabs for "SCRAMBLER (MAGNETS)" and "SCRAMBLER (PUZZLE)".
  - Rename the remaining tab to simply "SENTENCE SCRAMBLER".
- **Dependency Removal:**
  - Execute `npm uninstall @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities` in the `client` directory to clean up the `package.json`.

### 2. Unit Testing Update
- **Update `SentenceScrambler.test.jsx`:**
  - Remove tests related to the `magnets` variant.
  - Ensure the test explicitly renders the standard component and simulates the tap interactions (clicking words in the bank, clicking "Check Answer") to verify the win/loss logic.

### 3. Regression Testing & Audit Verification
- **Frontend Verification:** Execute `npm test` in the `/client` directory to ensure the refactored `SentenceScrambler` passes its unit tests and no other components are broken by the dependency removal.
- **Backend Integrity:** Execute `npm test tests/integrity.test.js` in the `/server` directory to confirm the database integrity (Lesson 10-16 bounds) remains stable.
- **Audit Tool Check:** Visually confirm via the local server that `WordAudit.jsx` correctly displays the `scramble` items (Lesson 10) in the "Grammar & Sentences" tab, verifying the `sentenceParts` logic.

---
**[APPROVAL REQUIRED]: Please approve this plan to authorize the execution of Phase 1. Upon completion, I will stop and return to Plan Mode for Phase 2.**
