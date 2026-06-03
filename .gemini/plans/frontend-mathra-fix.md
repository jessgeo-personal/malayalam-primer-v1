# Bug Fix Plan: Frontend Mathra Reordering (Ra-Subscript)

## Objective
Leverage the existing visual reordering engine in `LetterPicker.jsx` to handle the 'ra-subscript' (്ര), providing the correct drag-and-drop UX without altering the phonetic database structure.

## 1. Context & Rationale
You are absolutely correct. The frontend already handles visual reordering brilliantly for `െ`, `േ`, `ൈ`, and `ോ`. My previous plan to alter the database and the audit tools was a step backward. The database MUST remain in phonetic Unicode order (e.g., `["ര", "ാ", "ത", "്ര", "ി"]`). 

To make `്ര` visually appear before the `ത` drop-zone, we simply need to instruct the frontend engine to treat it as a left-sided mathra.

## 2. Code Modification
**File:** `client/src/components/games/LetterPicker.jsx`

**Current Logic (Line 20-21):**
```javascript
// Mathras that visually appear to the left of the consonant
const LEFT_MATHRAS = ['െ', 'േ', 'ൈ'];
```

**Proposed Fix:**
```javascript
// Mathras that visually appear to the left of the consonant
const LEFT_MATHRAS = ['െ', 'േ', 'ൈ', '്ര'];
```

## 3. Impact Analysis
By adding `്ര` to `LEFT_MATHRAS`, the `useMemo` hook that calculates `visualSlots` will automatically subtract an index offset for this character. 
This means when the child plays Lesson 7 (രാത്രി), the empty boxes will render in the visual order: `[ര] [ാ] [്ര] [ത] [ി]`, while the validation logic will correctly expect the `.join('')` to match `ര` + `ാ` + `ത` + `്ര` + `ി`.

## 4. Implementation Steps
1. Apply the one-line fix to `LetterPicker.jsx` via the `replace` tool.
2. Confirm the frontend compiles successfully without errors.
