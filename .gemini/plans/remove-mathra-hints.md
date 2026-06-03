# Plan: Remove UI Mathra Hints

## Objective
Remove the visual "ghost" mathra outlines from empty drop slots in the `LetterPicker` component. This ensures the Word Assembly game remains pedagogically challenging by forcing the student to rely on their phonetic knowledge rather than visual matching.

## Key Files
- `client/src/components/games/LetterPicker.jsx`

## Implementation Steps
1. Modify the `DroppableSlot` component in `LetterPicker.jsx`.
2. Remove the conditional rendering block that displays the `expectedChar` (and `DOTTED_CIRCLE` for left mathras) when `!isFilled`.
3. The slot will now appear as a standard, empty dashed border box, identical to consonant slots.

## Verification
- Run tests to ensure `LetterPicker` still renders correctly.
- Ensure dragging and dropping still functions normally without the visual guide.