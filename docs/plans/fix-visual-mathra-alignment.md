# Bug Fix Plan: Frontend Mathra Visual Alignment

## Objective
Update the frontend `LetterPicker.jsx` component to correctly reorder the 'ra-subscript' (്ര) and 'ee' (ീ) mathras, ensuring they are visually dragged *before* their base consonant, matching the established pattern for 'e' (െ) and 'o' (ോ).

## 1. The Challenge
While the database must remain in strict Phonetic Order (Consonant + Mathra) for Unicode validity (e.g., `["ര", "ാ", "ത", "്ര", "ി"]` for രാത്രി), visually, the `്ര` (ra-subscript) and `ീ` (ee mathra) appear *before/around* the consonant.

## 2. The Frontend Solution
We will leverage the existing **Visual Reordering Engine** in `client/src/components/games/LetterPicker.jsx`. This engine intercepts the strict phonetic array and re-calculates the drop-zone positions on the screen.

- **Task:** Add `്ര` and `ീ` to the `LEFT_MATHRAS` array.

**Current Code:**
```javascript
const LEFT_MATHRAS = ['െ', 'േ', 'ൈ'];
```

**Proposed Code:**
```javascript
const LEFT_MATHRAS = ['െ', 'േ', 'ൈ', '്ര', 'ീ'];
```

## 3. Implementation Steps
1.  **Draft Fix:** Modify the `LEFT_MATHRAS` constant in `LetterPicker.jsx`.
2.  **Verify Rendering:** Ensure that for a word like `രാത്രി`, the target drop zones appear in the order: `ര`, `ാ`, `്ര`, `ത`, `ി`. (Note: Because both `്ര` and `ി` act on `ത`, the engine will place them both around the consonant based on the index shift).

## 4. Regression & Verification
- **Audit UI Check:** Ensure this frontend change does not break the backend integrity tests (which remain blissfully unaware of the visual shift).
- **Gameplay Check:** Play Lesson 7 (WHEN?) to confirm "samayam" and "raathri" assemble naturally.
