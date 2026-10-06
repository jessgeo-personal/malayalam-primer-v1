# Plan: 019 - Word Assembly Ergonomics & Audio

## Objective
Improve the ergonomics and accessibility of the Word Assembly (`LetterPicker.jsx`) game. Specifically, widen the main interface by approximately 35% to prevent the drop zones (boxes) and draggable tiles from wrapping into multiple rows for long words. Enforce a single-row layout for these elements. Additionally, add a speaker button under the phonetic translation to allow auditory preview of the word.

## Key Files & Context
- `client/src/components/games/LetterPicker.jsx`: Contains the UI layout for Word Assembly. Needs flexbox updates and a new audio button.
- `client/src/tests/LetterPicker.test.jsx`: Needs an updated test case to verify the presence and function of the new speaker button.

## Implementation Steps

### Step 1: Layout Expansion
1. In `LetterPicker.jsx`, locate the top-level wrapper: `<div className="flex flex-col items-center gap-8 w-full max-w-5xl animate-pop">`.
2. Update `max-w-5xl` (1024px) to `max-w-[1400px]` (roughly a 35% increase) or `max-w-7xl` to provide significantly more horizontal space.

### Step 2: Enforce Single-Row Elements
1. **Drop Zones:** Locate the drop zones container (`<div className="flex flex-wrap justify-center gap-4 py-8 border-b border-slate-100">`).
2. Change `flex-wrap` to `flex-nowrap overflow-x-auto` with appropriate padding to ensure it strictly remains on one line and gracefully handles extreme edge cases with horizontal touch-scrolling.
3. **Tile Pool:** Locate the tile pool container (`<div className="flex-1 flex flex-wrap justify-center gap-6 content-center min-h-[160px]">`).
4. Similarly, change `flex-wrap` to `flex-nowrap overflow-x-auto` to force a single row for available draggable tiles.

### Step 3: Add Phonetic Speaker Button
1. In the right-hand Reference Info column, locate the Phonetic section.
2. Add a `mb-4` or similar margin to the phonetic text to create space.
3. Insert a new circular speaker button below it, styling it consistently with the `TracingCanvas` speaker button.
4. Bind the `onClick` event to `audioEngine.speak(word.malayalamText)`.

### Step 4: TDD Verification
1. Update `client/src/tests/LetterPicker.test.jsx`.
2. Mock the `audioEngine` (similar to `TracingCanvas.test.jsx`).
3. Add a test asserting that the 🔊 button renders and triggers `audioEngine.speak` when clicked.

### Step 5: Regression Update
1. Add "Phase 21: Word Assembly Ergonomics" to the `.gemini/docs/regression_checklist.md` noting the layout changes and audio button.

## Verification & Testing
- Load a long word (e.g. `എഴുന്നേൽക്കുക`) in the browser.
- Verify the boxes and tiles stay on a single horizontal row without breaking the layout.
- Click the speaker button in the right-hand panel and verify audio plays.