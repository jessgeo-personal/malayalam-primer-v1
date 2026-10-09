# Plan: Implement Local UI Feedback Loop

## Objective
Prevent the game from instantly advancing upon completing a word. Instead, implement a pedagogical feedback layer that evaluates the user's answer, provides visual success/failure indicators, and explicitly shows the correct spelling and phonetics before moving on.

## Scope & Context
- `client/src/components/games/LetterPicker.jsx`: Needs state management for the feedback overlay and logic to pause the `onComplete` transition.

## Implementation Steps
1. **State Update:** In `LetterPicker.jsx`, add a `feedback` state object (`{ isCorrect: boolean, time: number, attempt: string[] }`).
2. **Halt Auto-Submit:** Modify `handleDragEnd`. When `newPlaced.every(l => l !== null)` is true, calculate `isCorrect`, but instead of calling `onComplete`, set the `feedback` state.
3. **Feedback UI (Overlay/Section):**
   - Render a feedback panel below the puzzle.
   - **If Correct:** Display a green success message ("Correct!") and a "Next Word" button.
   - **If Incorrect:** Display a red error message ("Not quite!"), show the correct grapheme sequence explicitly, provide the phonetic hint again, and render a "Got it ->" button.
4. **Submission:** Bind the "Next Word" / "Got it ->" buttons to actually trigger `onComplete(feedback.isCorrect, feedback.time)`, resuming the SRS loop.
5. **Reset internal state:** When the `word` prop changes (because the SRS loop fed a new word), ensure the `feedback` state resets to `null`.

## Verification
- Run the Vite development server.
- Play a word and intentionally arrange the tiles incorrectly.
- Verify the game stops, highlights the error, shows the correct spelling, and waits for manual user confirmation before fetching the next word.