# Plan: 015 - Word Assembly Refactor & DND Enhancements

## Objective
Refactor `LetterPicker.jsx` into "Word Assembly". Implement a side-by-side tablet layout, add clear instructions, and significantly improve the Drag-and-Drop (DND) UX to prevent accidental snaps and allow repositioning of placed tiles.

## 1. UI Refactor (`LetterPicker.jsx`)
- **Title & Instructions:** 
    - Change heading to "Word Assembly".
    - Add a compact instruction box at the top: *"Drag the tiles in the correct order to build the word."*
- **Side-by-Side Layout:** Split the card into two columns (`flex-row`):
    - **Left Column:** The Drop Zones (empty boxes) and the Tile Pool.
    - **Right Column:** 
        - Label: "English meaning:" followed by `{word.englishTranslation}`.
        - Label: "Phonetic:" followed by `{word.phonetic}`.

## 2. Drag-and-Drop (DND) UX Fixes
- **Fix "Click-to-Snap" Bug:** Change `collisionDetection` from `closestCenter` to `pointerWithin` (or a custom intersection). This forces the user to physically drag the tile *into* the boundaries of the square before it registers, preventing accidental snaps on simple taps.
- **Draggable Placed Tiles:** 
    - Refactor the state so that `placedLetters` stores the actual tile objects instead of just strings.
    - Render the `<DraggableLetter>` *inside* the `<DroppableSlot>` when a tile is placed.
    - Update `handleDragEnd`:
        - **Slot to Slot:** If a tile is dragged from one box to another, update both slots (swap or move).
        - **Slot to Pool:** If a tile is dragged outside of any box, it returns to the pool (slides back).
        - **Pool to Slot:** Normal placement.

## 3. TDD & Quality Guardrails (Zero-Regression)
### Unit Testing (`LetterPicker.test.jsx`)
- Update existing tests to reflect the new "Word Assembly" title and English/Phonetic labels.
- Verify that rendering the component shows the required number of slots and tiles.
- Verify that the feedback logic (Correct/Try Again) still triggers correctly when all slots are filled.

### Documentation & Process
- **Changelog**: Add an entry for Version 2026.05.28.019 detailing the Word Assembly refactor.
- **Regression Checklist**: Add "Phase 16: Word Assembly Ergonomics" to `regression_checklist.md`.
- **Full Test Pass**: Run `npm test` in `/client` to guarantee 100% green status.

## 4. Implementation Steps
1. **State Refactor**: Update how `shuffledLetters` and `placedLetters` interact to support moving tiles back and forth.
2. **DND Logic**: Apply `pointerWithin` collision and update `onDragEnd` routing.
3. **UI Layout**: Apply the Tailwind grid/flex classes to create the left/right split and instruction box.
4. **Test & Verify**: Run Vitest and manually audit the drag interactions on tablet mode.
