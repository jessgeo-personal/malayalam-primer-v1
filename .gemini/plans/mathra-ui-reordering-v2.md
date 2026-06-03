# Plan: Malayalam Mathra UI Reordering Support (v2 - Surround Splitting)

## Objective
Update the visual-first ordering system in the Word Assembly prototype to handle "surrounding" mathras (ൊ, ോ, ൌ) more intuitively. Instead of rendering both parts of a surround mathra in a single slot preceding the consonant, the mathra tile will visually split upon placement. The left part will render in the preceding slot, and the right part will dynamically render in a decorative element immediately following the base consonant slot.

## Key Files & Context
- `client/src/components/games/LetterPickerPrototype.jsx`

## Implementation Steps

### 1. Define Mathra Parts Mapping
Introduce a `SURROUND_PARTS` dictionary to map the Unicode surround mathras to their visual left and right components:
```javascript
const SURROUND_PARTS = {
  'ൊ': { left: 'െ', right: 'ാ' },
  'ോ': { left: 'േ', right: 'ാ' },
  'ൌ': { left: 'െ', right: 'ൗ' }
};
```

### 2. Update DraggableLetter Rendering
Modify `DraggableLetter` to accept an `isSurroundLeftOnly` boolean prop. 
- If `true` and the character is a surround mathra, it will render ONLY the `left` string from `SURROUND_PARTS`.
- If `false` (in the pool), it will continue to render the full mathra with the dotted circle (e.g., `ോ◌`).

### 3. Update DroppableSlot Props
Modify `DroppableSlot` to pass `isSurroundLeftOnly={true}` down to the `DraggableLetter` when a surround mathra tile is successfully placed inside it.

### 4. Inject Dynamic Right-Side Elements
Within the `LetterPickerPrototype` main rendering loop (`visualSlots.map`):
- After rendering each `DroppableSlot` (which holds a consonant), check the original phonetic array to see if the *next* logical character is a surround mathra.
- If it is, and that mathra tile is currently placed in its slot, dynamically render a new `div` containing the `right` string from `SURROUND_PARTS` immediately after the consonant slot.

## Verification & Testing
- **Visual Accuracy Check:** Build the word "പോകുക" (poguka). Ensure dropping the "ോ" tile into the first slot changes it to "േ", and a non-draggable "ാ" appears after the "പ" slot.
- **State Integrity Check:** Ensure "Clear All" correctly removes the dynamic right-side elements and resets the surround mathra tiles in the pool to their full state.