# Plan History: 001 - Foundation & SRS Engine

## Objective
Establish the core learning loop: fetch a word, present a puzzle, track progress using an adaptive Spaced Repetition System (SRS).

## Context
Initial project scaffolding is complete. This phase builds the "brain" of Malayalam Prime.

## Implementation Steps
### 1. Backend: SRS Engine & Data Models
- Implement `Word`, `User`, and `Progress` schemas in Mongoose.
- Create `srsEngine.js` with `calculateNewWeight` (adaptive scoring based on time/accuracy).
- Implement `GET /api/words/next` to serve words based on lowest SRS weight and prerequisites.
- Implement `POST /api/progress/update` to log interactions.

### 2. Frontend: Progress Context & Letter Picker
- Create `ProgressContext.jsx` to manage global state (current word, score, mastered characters).
- Build `LetterPicker.jsx` using `@dnd-kit/core` for drag-and-drop word building.
- Implement success/fail feedback loop with phonetic audio hints.

### 3. Database: Seed Cycle 1
- Create `seed-100.json` with the first 50 identity-focused words.
- Implement `seeder.js` to populate MongoDB.

## Verification & Testing
- **Backend Tests:** Verify SRS weight calculation and next-word selection logic via Jest.
- **Frontend Tests:** Verify drag-and-drop state updates and API calls via Vitest.
- **Manual Audit:** Confirm progress persists in MongoDB after a session.
