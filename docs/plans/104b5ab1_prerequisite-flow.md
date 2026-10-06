# Plan: Implement Prerequisite Flow & Visual Phonetics

## Objective
1. **Pedagogical Sequence:** Enforce a rule where a user must trace the individual graphemes (alphabets, vowel modifiers, chillus) *before* building words containing those characters.
2. **Visual Phonetics:** Enhance the Tracing Canvas to display the phonetic text visually alongside the audio.
3. **Strict Compliance:** Adhere to all project guardrails including TDD, regression checklists, and Git commits.

## Scope & Context
- `server/models/Word.js`: Introduce a `prerequisites` array.
- `server/routes/api.js`: Modify the next-word selection logic.
- `server/data/seed-100.json`: Restructure the initial lessons to demonstrate the Trace -> Build sequence.
- `client/src/components/games/TracingCanvas.jsx`: Update UI to display the phonetic text.

## Implementation Steps
1. **Schema Update:** Modify the `Word` schema to include `prerequisites: [{ type: String }]`. This holds an array of `wordId`s.
2. **API Logic Update:** In `GET /api/words/next`:
   - Before returning a new word, check if it has `prerequisites`.
   - Ensure the user has a `Progress` record for every `wordId` listed in the `prerequisites` array. If not, skip this word.
3. **Tracing UI Enhancement:** Update `TracingCanvas.jsx` to render `word.phonetic` visibly under the English translation.
4. **Seed Data Restructuring:** Update `seed-100.json` for Cycle 1:
   - Create distinct tracing lessons for: `ഞ`, `ാ`, `ൻ`, `ന`, `ീ`.
   - Set the `prerequisites` for "ഞാൻ" (`w001`) to the tracing IDs for `ഞ`, `ാ`, `ൻ`.
   - Set the `prerequisites` for "നീ" (`w002`) to the tracing IDs for `ന`, `ീ`.
5. **Database Reseed:** Run `node seeder.js` and `npm run reset`.
6. **Closing Actions (Guardrails):**
   - Update unit tests in `server/tests/api.test.js`.
   - Run backend and frontend test suites (`npm test`).
   - Update `.gemini/docs/regression_checklist.md`.
   - Update `.gemini/log/CHANGELOG.md` and version number.
   - Commit all changes to the `dev` branch.

## Verification & Testing
1. Verify unit tests are 100% green.
2. Start the application with a fresh session (`npm run reset`).
3. Verify the Tracing screen now shows the phonetic text.
4. Verify the flow: The user must trace all component characters *before* the puzzle for "ഞാൻ" appears.