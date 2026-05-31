# Plan: Fix Tailwind Styling & Update Pedagogical Grapheme Splits

## Objective
1. Resolve the styling failure where the UI renders in black and white without Tailwind classes applied.
2. Adjust the grapheme splitting for the word "I" (ഞാൻ) to reflect the 3-piece structure (consonant + vowel modifier + chillu) requested by the user.

## Implementation Steps
1. **Fix Tailwind Injection:** Add `@import "tailwindcss";` to the very top of `client/src/index.css`. This is a strict requirement for Tailwind CSS v4 to generate utility classes.
2. **Clean Legacy CSS:** Remove the legacy Vite boilerplate CSS from `client/src/index.css` and `client/src/App.css` as it interferes with Tailwind's resets.
3. **Update Seed Data:** Modify `server/data/seed-100.json` to split "ഞാൻ" into `["ഞ", "ാ", "ൻ"]` instead of `["ഞാ", "ൻ"]`.
4. **Reseed Database:** Run the seeder script (`node seeder.js`) to apply the updated array to the MongoDB backend.

## Verification & Testing
1. Refresh the browser at `http://localhost:3000`.
2. Visually confirm that the screen is no longer black and white and that the drag-and-drop letter tiles appear as distinct blue rounded squares.
3. Confirm that the word "ഞാൻ" now correctly presents 3 distinct draggable pieces.