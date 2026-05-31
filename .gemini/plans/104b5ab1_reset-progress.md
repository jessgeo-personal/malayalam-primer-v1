# Plan: Implement Progress Reset Mechanism

## Objective
Provide a way to reset the Spaced Repetition System (SRS) progress so the developer can repeatedly test the Cycle 1 words from the beginning.

## Implementation Steps
1. **Reset Script:** Create a utility script `server/reset-progress.js` that connects to MongoDB and calls `Progress.deleteMany({})`.
2. **NPM Command:** Add a `"reset"` script to `server/package.json` (`"reset": "node reset-progress.js"`).
3. **Execution:** Run `npm run reset` from the `/server` directory to wipe the current state.

## Verification
- Run the script and observe the success message.
- Refresh the browser at `http://localhost:3000` and confirm the game starts back at "I" (ഞാൻ) and then proceeds to "You" (നീ).