# Plan: Fix LetterPicker UI & Establish Word Splitting Protocol

## Objective
Resolve the blank rendering issue in the `LetterPicker` component caused by empty `requiredCharacters` arrays in the seed data. Additionally, establish a permanent protocol for how to split Malayalam graphemes safely.

## Implementation Steps
1. **Source Control Checkpoint:** Commit the current functional Phase 1 state to Git before making changes.
2. **Protocol Documentation:** Create a new markdown file `.gemini/docs/word_splitting_protocol.md` detailing how to use the Gemini CLI to safely generate grapheme splits for future database seeding.
3. **Data Correction:** Modify `server/data/seed-100.json` to populate the `requiredCharacters` array for the first 5 words (w001 to w005).
4. **UI Safety Net:** Update `client/src/components/games/LetterPicker.jsx` to render an explicit error message ("Error: Word pieces not defined") if `word.requiredCharacters` is empty, preventing a silent blank screen.
5. **Database Sync:** Re-run `node seeder.js` in the `/server` directory to update the local MongoDB with the split characters.

## Verification & Testing
1. Run `npm test` in the `/client` directory to ensure the `LetterPicker` tests still pass.
2. Verify the seeder script executes successfully.
3. Visually verify the UI renders the draggable letters on `http://localhost:3000`.