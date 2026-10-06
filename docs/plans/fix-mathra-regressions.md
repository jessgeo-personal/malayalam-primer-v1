# Bug Fix Plan: Ra-Subscript & Surround Mathra Restore

## Objective
Correctly visually reorder the 'ra-subscript' (്ര) without affecting phonetic order, and fix a regression where surround mathras (like ോ) fail to render their right-hand component (ാ) correctly in the UI.

## 1. Ra-Subscript Fix (LEFT_MATHRA)
**The Issue:** The `്ര` (ra-subscript) wraps around the consonant but visually begins to its left. It needs to be dragged first.
**The Fix:** Update `client/src/components/games/LetterPicker.jsx`.
- Change: `const LEFT_MATHRAS = ['െ', 'േ', 'ൈ'];`
- To: `const LEFT_MATHRAS = ['െ', 'േ', 'ൈ', '്ര'];`

## 2. Surround Mathra Regression Fix (SURROUND_MATHRA)
**The Issue:** The user noted that for a surround mathra like `ോ` (which splits into `േ` on the left and `ാ` on the right), the second part is no longer showing up after the alphabet box.
**Investigation:** The logic in `LetterPicker.jsx` starting at Line 274 attempts to render the right part:
```javascript
if (nextCharObj && SURROUND_MATHRAS.includes(nextCharObj.value)) {
  const rightPart = SURROUND_PARTS[nextCharObj.value].right;
  // It renders a static box for the right part...
```
**The Fix:** I will need to inspect the rendering loop around Line 283 to ensure the `surround-right` div is not being hidden by CSS (e.g., missing `z-index` or broken Flexbox layout) or if the `nextCharObj` detection is failing due to recent changes in the `visualOrder` sorting.

## 3. Implementation Steps
1. **Apply `്ര` Fix:** Update the `LEFT_MATHRAS` array.
2. **Diagnose Surround Logic:** Read `LetterPicker.jsx` lines 270-300 to find the specific UI bug preventing `ാ` from showing up.
3. **Draft Code Fix:** Propose the exact React/Tailwind correction.
4. **Validation:** Ensure "എപ്പോൾ" (`ോ`) and "രാത്രി" (`്ര`) assemble correctly.

*(Pending approval to proceed with reading the surround logic and applying these fixes).*
