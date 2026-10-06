# Plan: Malayalam Mathra UI Reordering Support

## Objective
Implement a visual-first ordering system for the Word Assembly mini-game to correctly display left-side mathras (െ, േ, ൈ) and surrounding mathras (ൊ, ോ, ൌ). To ensure stability, this will first be developed as an isolated prototype component for user testing before being integrated into the live game. It will also enforce strict regression testing to guarantee existing logic remains unaffected.

## Key Files & Context
- `client/src/components/games/LetterPickerPrototype.jsx` (New Prototype File)
- `client/src/components/games/LetterPicker.jsx` (Target Component)
- `client/src/tests/LetterPicker.test.jsx` (Test Suite)

## Implementation Steps

### Phase 1: Prototype Development
1. **Create Prototype Component:** Duplicate `LetterPicker.jsx` into a new file `LetterPickerPrototype.jsx`.
2. **Define Mathra Categories:** Add constants for `LEFT_MATHRAS` (`['െ', 'േ', 'ൈ']`) and `SURROUND_MATHRAS` (`['ൊ', 'ോ', 'ൌ']`).
3. **Generate Visual Slot Mapping:** Create a `useVisualSlots` hook/logic in the prototype to calculate `visualOrder` (e.g., subtracting from the index for `LEFT_MATHRAS` so they render before the consonant).
4. **Update Render Logic:** Sort drop zones in JSX by `visualOrder`. Render `SURROUND_MATHRAS` with a dotted circle `◌` (U+25CC) to indicate wrapping.
5. **Create Testing Harness:** Create a simple temporary route or testing harness component that renders `LetterPickerPrototype` and feeds it test words (e.g., വേണം, പോയി, അമ്മ) so the user can interact with the prototype directly in the browser.

### Phase 2: User Validation
- Pause development to allow the user to manually test the prototype and confirm the visual layout and drag-and-drop feel before touching the live codebase.

### Phase 3: Integration & Regression
- Once the prototype is approved, merge the changes into the live `LetterPicker.jsx`.
- Clean up prototype files.

## Verification & Testing Strategy
*Mandatory Zero-Regression Checks:*

1. **Unit Tests (Vitest):**
   - Update `LetterPicker.test.jsx` to include new test cases for words with left-side and surrounding mathras, ensuring `visualOrder` sorting logic is correct.
   - **Regression Test:** Run existing `LetterPicker` tests with standard linear words (like അമ്മ) to ensure they still pass without any functional or layout disruption.
2. **Functional Integrity:**
   - **Validation:** Ensure the internal `handleDragEnd` logic continues to use the logical array index. Dragging tiles into visual slots must result in an `attempt` string that exactly matches the original Unicode `word.malayalamText`.
   - **State Reset:** Ensure the "Clear All Tiles" button correctly resets both the pool and the new visual slots.
3. **Manual UI/UX Checks:**
   - Verify drag-and-drop state resets correctly on failure/success.
   - Ensure audio playback (🔊 button) still functions correctly on all tiles, including newly formatted mathra tiles.