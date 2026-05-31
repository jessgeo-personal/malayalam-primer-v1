# Implementation Plan: Milestone 1.3 - Cycle 1 Intro Screens Retrofit

## Objective
Retrofit all 9 lessons in Cycle 1 with an instructional summary slide (Concept Screen) that appears before the interactive gameplay. This slide will explain the game mechanics (trace, match, build) and provide an interactive summary of the vocabulary covered in that specific lesson, complete with phonetics and audio buttons.

## Architecture Strategy
1. **Extend ConceptScreen:** We will enhance the existing `ConceptScreen.jsx` component (built in Milestone 2.2) to support a new `variant: "summary"` prop or detect a specific data structure.
2. **Data Model Expansion:** For `lessonType: 'concept'`, we will utilize a new optional array field in the payload to hold the summary items (e.g., `summaryItems: [{ malayalamText, englishTranslation, phonetic, audioKey }]`).
3. **Database Seeding (`seed-100.json`):** We will inject 9 new `concept` items at the beginning of each of the 9 lessons in Cycle 1.

## Implementation Steps (TDD Approach)

### Phase 1: Backend & Seed Data Updates
1. **Schema Update:** Modify `server/models/Word.js` to allow an optional array for summary items if needed, or simply rely on the frontend fetching the preview data from the existing `/api/session/lesson/preview` route.
   - *Alternative (Better):* Instead of bloating the `Word` schema, the `ConceptScreen` can automatically fetch the lesson summary using the existing `fetchPreview(lessonId)` logic when it detects it's a "summary" variant.
2. **Seed Data (`seed-100.json`):**
   - Add 9 new items with `lessonType: 'concept'`.
   - Assign them to `lessonId` 1 through 9.
   - Set `malayalamText` to the Lesson Title (e.g., "Lesson 1: The Basics").
   - Set `englishTranslation` to the instructions (e.g., "First trace the letters, then match the sounds, and finally build the words!").

### Phase 2: Frontend ConceptScreen Enhancement
1. **Update `ConceptScreen.jsx`:**
   - Detect if the current cycle is Cycle 1 (or if a specific flag is passed).
   - If it's a summary screen, render a clean list or grid of the target letters/words for that lesson.
   - Add a speaker icon (🔊) next to each item in the summary list that triggers `audioEngine.speak(item.malayalamText)`.
   - Display the `phonetic` spelling alongside the English translation.
2. **Frontend Tests:** Update `ConceptScreen.test.jsx` to verify that the summary variant renders the list and audio buttons correctly.

### Phase 3: Verification
1. Run `npm test` across `/client` and `/server`.
2. Run `node seeder.js` to update the database.
3. Test Learner 1 (reset to Lesson 1) to ensure the first thing they see is the new interactive summary screen.
4. Update `.gemini/docs/regression_checklist.md` and `CHANGELOG.md`.