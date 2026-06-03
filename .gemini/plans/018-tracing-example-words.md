# Plan: 018 - Tracing Example Words Enhancement

## Objective
Enhance the `TracingCanvas` component to display up to 3 example vocabulary words that utilize the character currently being traced. This reinforces the connection between individual letters and functional words. Each example will include the Malayalam word, English translation, and an audio playback button.

## Key Files & Context
- `server/services/srsEngine.js`: Needs updating to attach `exampleWords` to `trace` payloads.
- `client/src/components/games/TracingCanvas.jsx`: Needs UI updates to display the `exampleWords` list and play audio.
- `server/tests/session.test.js`: Needs a new test to verify `exampleWords` are populated.
- `client/src/tests/TracingCanvas.test.jsx` (or similar, if exists/needed): Needs tests for the new UI elements.
- `.gemini/docs/regression_checklist.md`: Needs updating with the new feature verification steps.

## Implementation Steps

### Step 1: Backend Payload Enrichment (`srsEngine.js`)
1. In `generateLessonPayload`, iterate through the grouped `tracing` items.
2. For each `trace` item, extract its base character (the `malayalamText`).
3. Query the `Word` model for up to 3 words (`lessonType: 'build'`) where the `requiredCharacters` array contains this base character. Prioritize words from the same or earlier cycles/lessons to ensure they are pedagogically relevant.
4. Attach these matching words as an `exampleWords` array to the `trace` item's payload. Each example word object must include `malayalamText`, `englishTranslation`, and `phonetic`.

### Step 2: Backend TDD Verification
1. Open `server/tests/session.test.js`.
2. Add a new test case: `generateLessonPayload should attach up to 3 exampleWords to trace items`.
3. Mock the database calls to return a trace item and corresponding build items.
4. Assert that the returned payload for the trace item includes the `exampleWords` array with the correct data structure.

### Step 3: UI Enhancement (`TracingCanvas.jsx`)
1. Below the existing "Phonetic sound" block in the right-hand column, add a new container for "Example Words" (conditionally rendered only if `word.exampleWords` exists and has length > 0).
2. Map through `word.exampleWords` and render a row for each.
3. Each row should display:
    - The `malayalamText` (prominently).
    - The `englishTranslation` (smaller, perhaps below or beside).
    - A "🔊" button that calls `audioEngine.speak(exampleWord.malayalamText)`.
4. Style the list to fit within the "Soft Premium Neo-Bento" design system, ensuring it looks clean on a tablet without causing excessive scrolling.

### Step 4: Regression Checklist Update
1. Update `.gemini/docs/regression_checklist.md` to include a new phase or section specifically for this enhancement.
2. Add checkboxes for the backend logic, frontend UI, audio functionality, and a lesson-by-lesson data integrity check.

## Verification & Testing (Lesson-by-Lesson Audit)
After implementation, we will manually verify a sample from each Cycle 1 lesson (1-9) to ensure at least one trace character successfully pulls example words, confirming the database queries are functioning correctly across the curriculum.

- **Lesson 1 (അ, വ, ന, ാ, ൻ):** Verify `അ` shows examples like `അവൻ`, `അവൾ`, or `അവർ`.
- **Lesson 2 (ഞ, മ, മ്മ, ീ, ൾ, ർ):** Verify `ഞ` shows `ഞാൻ`. Verify `മ` shows `അമ്മ` or `നമ്മൾ`.
- **Lesson 3 (ഇ, ത, ്, ല, ല്ല, ച, ച്ച):** Verify `ഇ` shows `ഇത്` or `ഇല്ല`.
- **Lesson 4 (ഉ, ണ, ട, ട്ട, ആ, ണ്ട, െ):** Verify `ഉ` shows `ഉണ്ട്`.
- **Lesson 5 (ക, ഗ, ര, ി, ങ്ങ, ക്ക, പ, റ, ോ, ഞ്ഞ, യ, ന്ന):** Verify `ക` shows `വരിക`, `പോകുക`, etc.
- **Lesson 6 (ഴ, എ, േ, ു, ൽ):** Verify `ഴ` or `എ` shows examples.
- **Lesson 7 (ന്ത, പ്പ, ൊ, ം, മ്പ, ന്ദ, ഞ്ച, ങ്ക):** Verify complex conjuncts pull words correctly.
- **Lesson 8 (ഡ, സ, ള, സ്ക, ൂ):** Verify characters pull relevant vocabulary.
- **Lesson 9 (ജ, യ, ത്ത, റ്റ, ്യ):** Verify characters pull relevant vocabulary.

## Migration & Rollback
- No database schema changes are required. The changes are confined to API payload generation and UI rendering.
- Rollback involves reverting `srsEngine.js` and `TracingCanvas.jsx` to their previous states.