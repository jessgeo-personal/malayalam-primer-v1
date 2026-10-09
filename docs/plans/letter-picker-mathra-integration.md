# Plan: Integrate Mathra UI Reordering (Surround Splitting)

## Objective
Migrate the approved v2 Mathra Prototype logic into the live `LetterPicker.jsx` component. This integration will enforce visual reordering for left-side mathras (െ, േ, ൈ) and implement dynamic visual splitting for surrounding mathras (ൊ, ോ, ൌ). The dynamically injected right-side mathra parts will exactly match the font styling (size `text-3xl`, weight `font-black`) of the standard tiles. Additionally, the project's word splitting documentation must be updated to mandate phonetic (logical) splitting to support this system.

## Impact Audit
The following existing database words contain surrounding mathras and will benefit from this updated layout logic:
- `പോകുക` (Go) - Contains `ോ`
- `എപ്പോൾ` (When) - Contains `ൊ`
- `കൊണ്ടുപോയി` (Took away) - Contains `ൊ` and `ോ`
- `കൊണ്ടുവന്നു` (Brought) - Contains `ൊ`
- `തോന്നി` (Felt) - Contains `ോ`
- `താക്കോൽ` (Key) - Contains `ോ`
- `പോലും` (Even) - Contains `ോ`

## Implementation Steps

### 1. Update `LetterPicker.jsx`
- Replace the current content of `client/src/components/games/LetterPicker.jsx` with the logic from `LetterPickerPrototype.jsx`.
- **Refinement:** Ensure the dynamic right-side injection uses `text-3xl` to match the `DroppableSlot` text size exactly:
  ```jsx
  <div 
    key={`surround-right-${nextCharIndex}`} 
    className="w-12 h-16 sm:h-20 flex items-center justify-center text-3xl font-black text-prime-action-dark animate-fade-in -ml-2 -mr-2 pointer-events-none"
  >
    {rightPart}
  </div>
  ```
- Retain all existing feedback, audio, and state reset logic.

### 2. Update `App.jsx`
- Remove the temporary `MathraPrototypeTester` import, component rendering, and toggle button. Return `App.jsx` to its clean production state.

### 3. Update `word_splitting_protocol.md`
- The success of this UI reordering system relies heavily on the `requiredCharacters` array being in strict **phonetic/logical order** (i.e., Base Consonant + Vowel Modifier), not visual order.
- Update `.gemini/docs/word_splitting_protocol.md` to explicitly state this requirement in the Prompt Template rules:
  - Add Rule: "4. Maintain Strict Phonetic Order: Modifiers must always follow the consonant they modify in the array, even if they visually appear to the left (e.g., േ, െ) or surround the consonant (e.g., ോ, ൊ)."
  - Add specific examples for left and surround mathras to the Reference Example section.

### 4. Clean Up
- Delete `client/src/components/games/LetterPickerPrototype.jsx`.
- Delete `client/src/components/games/MathraPrototypeTester.jsx`.
- Delete `client/src/tests/LetterPickerPrototype.test.jsx`.

## Verification & Testing
- **Integration Test:** Manually run the live application and test building `പോകുക` (Go) to verify the mathra logic functions flawlessly within the main application context and the right-side part matches the slot text size.
- **Regression:** Run `npm test` in the `client` directory to ensure the main `LetterPicker.test.jsx` still passes.