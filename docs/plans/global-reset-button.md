# Plan: Implement Global Progress Reset Button

## Objective
Address the issue where the user becomes stuck on words with missing configurations (like 'This') by providing a persistent, global "Reset Session" button in the top right corner. 

## Scope & Context
- `server/routes/api.js`: Needs a new endpoint to clear progress from the frontend.
- `client/src/context/ProgressContext.jsx`: Needs a new function to call the reset API.
- `client/src/App.jsx`: Needs UI updates to place the persistent reset button in the top right.
- `client/src/components/games/LetterPicker.jsx`: Rename internal "Reset" to "Clear Tiles" to distinguish it from the global session reset.

## Implementation Steps
1. **Backend Route:** Add `POST /api/progress/reset` to `server/routes/api.js` to execute `Progress.deleteMany({ userId })`.
2. **Context Update:** Add `resetSession` to `ProgressContext.jsx` that fetches the reset endpoint and then triggers a fresh `fetchNextWord()`.
3. **UI Layout:** In `App.jsx`, add a styled `<button>` positioned at the top right corner (`absolute top-4 right-4` or via header flexbox) that calls `resetSession`. This button will render *regardless* of whether the current word is broken or not.
4. **Clarification:** In `LetterPicker.jsx`, change the text of the internal puzzle reset button from "Reset" to "Clear Tiles" so it's not confused with the session reset.
5. **Documentation & Source Control:** 
   - Perform a `git commit` for all recent work (including this fix).
   - Update `client/src/config/version.js` to `2026.05.27.008`.
   - Update `.gemini/log/CHANGELOG.md` and `.gemini/docs/regression_checklist.md`.

## Verification
- Refresh `http://localhost:3000`.
- Verify the global Reset button is visible in the top right corner, even on the "⚠️ Word not split" error screen.
- Click the global Reset button and verify the app immediately jumps back to word #1 (ഞാൻ).