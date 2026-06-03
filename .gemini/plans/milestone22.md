# Implementation Plan: Milestone 2.2 - Grammar Expansion & Concept Screens

## Objective
Expand Cycle 2 (Lessons 10-14) with 25+ grammatical permutations using Suffix-Led Sandhi. Introduce a new `ConceptScreen` component that appears at the start of these lessons to explicitly teach the grammar rule. 

To ensure safety and allow for incremental user testing, this milestone is broken into three distinct, testable chunks. After each chunk, the regression checklist will be updated and full test suites run.

---

## Chunk 1: Backend Schema & Payload Routing
**Goal:** Prepare the backend to recognize and properly sequence `concept` items.
1. **Schema Update:** Modify `server/models/Word.js` to add `'concept'` to the `lessonType` enum.
2. **Payload Routing (`server/services/srsEngine.js`):** Update `generateLessonPayload` so that any item with `lessonType === 'concept'` is grouped and placed at the **absolute front** (index 0) of the returned array, guaranteeing the child sees the instruction before any `trace`, `match`, or `suffix` games.
3. **TDD / Backend Tests:** Add a test in `server/tests/srsEngine.test.js` to assert that `concept` items are correctly routed to the front of the payload.
4. **Verification:** Run `npm test` in the `/server` directory. Update `.gemini/docs/regression_checklist.md`. User can review the backend code changes.

---

## Chunk 2: Frontend ConceptScreen Integration
**Goal:** Build the visual instructional page and hook it into the main game loop.
1. **Component Creation:** Create `client/src/components/games/ConceptScreen.jsx`.
   - Title (`malayalamText`)
   - Rule Description (`englishTranslation`)
   - Visual Example: Display `baseWord` + `targetSuffix` morphing into `morphedBase`.
   - Action: A "GOT IT! ➜" button to trigger `onComplete(true)` and proceed.
2. **App Routing:** Update `client/src/App.jsx` to render `<ConceptScreen />` when `currentItem.lessonType === 'concept'`.
3. **TDD / Frontend Tests:** Add `client/src/tests/ConceptScreen.test.jsx` to verify rendering and button clicks.
4. **Verification:** Run `npm test` in the `/client` directory. Update `.gemini/docs/regression_checklist.md`. User can review the UI code.

---

## Chunk 3: Data Expansion & Normalization
**Goal:** Inject the new curriculum and ensure DB-to-Frontend map alignment.
1. **Data Seeding (`server/data/seed-200.json`):**
   - Add 5 `concept` items (Lessons 10, 11, 12, 13, 14).
   - Add ~25 new `suffix` items (Plurals, Anunaasika, Kinship, Locative).
2. **Normalization:** Run the existing `normalize_data.js` script to ensure all new items are strictly locked within the Cycle 2 boundary (Lessons 10-15) and do not bleed into Cycle 1 or 3.
3. **Database Sync:** Run `node seeder.js` to populate MongoDB.
4. **Verification:** User can manually test the app as "Learner 3" starting from Lesson 10 to see the Concept Screen followed by the new Suffix Snapper puzzles. Update `.gemini/docs/regression_checklist.md` and `CHANGELOG.md`.