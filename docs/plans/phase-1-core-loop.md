# Plan: Phase 1 - Core Loop Implementation

## Objective
Implement Phase 1 of the development roadmap by building the foundational "Core Loop." This phase is broken down into two testable milestones: Backend Foundation (Database & SRS Logic) and Frontend Foundation (State & Base Mini-Game).

## Testing Strategy & 4-Pillar Evaluation Matrix
In accordance with the Zero-Regression Mandate, all development will be Test-Driven.
- **Accuracy (Backend):** Write Jest unit tests to ensure `srsEngine.js` correctly calculates `srsWeight` without hallucinating or bypassing unlocked cycles. Ensure database seeding passes data integrity checks.
- **Visual Consistency (Frontend):** Write Vitest tests for the "Letter Picker" to verify draggable components render with large touch targets suitable for a tablet.
- **Functional Adherence:** Ensure the drag-and-drop state resets gracefully on correct/incorrect submissions.
- **Process Faultlines:** Test for MongoDB connection drops and ensure the API returns a `500` rather than crashing the Node process.

---

## Milestone 1.1: Backend Testing, Seeding & SRS Logic
**Goal:** Establish the database source of truth and the SRS calculation logic.

**Implementation Steps:**
1. **Testing Setup:** Install `jest` and `supertest` in `/server`. Update `server/package.json` to configure the test script.
2. **Data Integrity Test:** Write `server/tests/seeder.test.js` to assert that `seed-100.json` strictly adheres to the schema (all words have `unlockCycle` and `bucketId`).
3. **SRS Engine Implementation:** Create `server/services/srsEngine.js` with a function `calculateNewWeight(currentWeight, isCorrect, responseTimeMs)`.
4. **SRS Unit Tests:** Write `server/tests/srsEngine.test.js` to verify the math logic (e.g., penalty for wrong answers, slight boost for correct answers).
5. **API Routes:** Implement `GET /api/words/next` (fetch the next puzzle based on lowest SRS weight and unlocked cycle) and `POST /api/progress/update` (update the `Progress` schema).

**Validation for 1.1:** 
- Run `npm test` in the `/server` directory. It must be 100% green.
- Verify `npm run start` connects to MongoDB and handles seeding without errors.

---

## Milestone 1.2: Frontend Testing, State & Letter Picker UI
**Goal:** Build the UI that consumes the SRS API and handles tablet-first interactions.

**Implementation Steps:**
1. **Testing Setup:** Install `vitest`, `@testing-library/react`, and `jsdom` in `/client`. Update Vite configuration to support Vitest.
2. **Context Provider:** Create `client/src/context/ProgressContext.jsx` to manage the currently unlocked cycle and fetched words.
3. **Base Component Tests:** Write `client/src/tests/LetterPicker.test.jsx` to test that the component renders a drop zone and draggable letter tiles.
4. **The Letter Picker:** Implement `client/src/components/games/LetterPicker.jsx` using `@dnd-kit/core`. The component will fetch a word from `/api/words/next` and break the `malayalamText` into draggable characters based on `requiredCharacters`.
5. **Feedback Loop:** Add clear visual states (e.g., green highlight for success, red shake for failure) upon dropping a letter. On success, post to `/api/progress/update`.

**Validation for 1.2:**
- Run `npm test` in the `/client` directory. It must be 100% green.
- Open `http://localhost:3000` (desktop) and `http://192.168.x.x:3000` (tablet) to manually verify the drag-and-drop interaction size and feel.

---

## Verification & Final Approval
Before concluding Phase 1, we will execute the **Regression Mandate**:
1. Run both test suites simultaneously.
2. Confirm the `.gemini/docs/regression_checklist.md` is updated with the new SRS and Letter Picker features.
3. Increment version and log to `.gemini/log/CHANGELOG.md`.