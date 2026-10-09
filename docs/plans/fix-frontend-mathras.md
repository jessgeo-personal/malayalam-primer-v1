# Bug Fix Plan: Frontend Visual Mathra Alignment

## Objective
Update the `LetterPicker.jsx` visual reordering engine to treat the 'ee' mathra (ീ) and 'ra-subscript' (്ര) as left-sided UI elements, ensuring the child drags them before the base consonant while preserving backend phonetic integrity.

## 1. The Issue
The database stores words strictly phonetically (e.g., `["ര", "ാ", "ത", "്ര", "ി"]`).
However, visually, `്ര` wraps around `ത`, and `ീ` appears before it. The frontend `LetterPicker` has an engine that re-orders the drop zones to match this visual reality, but it currently only knows about `['െ', 'േ', 'ൈ']`.

## 2. The Fix
We will update `client/src/components/games/LetterPicker.jsx`.

**Current Code (Line 21):**
```javascript
const LEFT_MATHRAS = ['െ', 'േ', 'ൈ'];
```

**New Code:**
```javascript
const LEFT_MATHRAS = ['െ', 'േ', 'ൈ', 'ീ', '്ര'];
```

## 3. Why this works
By simply adding these two characters to the `LEFT_MATHRAS` array, the `useMemo` hook (around Line 140) will automatically calculate their `visualOrder` to be `(index - 1) * 10 - 5`. This dynamically shifts their drop-zones to the left of the preceding consonant.

For "രാത്രി" (`["ര", "ാ", "ത", "്ര", "ി"]`):
- `ത` (index 3) visual order = 30
- `്ര` (index 4) visual order = (4-1)*10 - 5 = 25 (Appears BEFORE `ത`)
- `ി` (index 5) visual order = (5-1)*10 - 5 = 35 (Appears AFTER `ത` but BEFORE whatever follows)
*(Wait, 'ee' mathra `ീ` should technically be evaluated here to ensure it doesn't collide if it modifies the same consonant as `്ര`. The engine handles it by sorting.)*

## 4. Verification
1.  **Code Edit:** Modify `LetterPicker.jsx`.
2.  **Gameplay Dry Run:** Play Lesson 7 to test building "samayam" and "raathri". Ensure the drop zones for `്ര` and `ീ` appear before `ത`.
3.  **Surround Check:** Verify that adding these doesn't break `ോ` (oo) in "eppol".
