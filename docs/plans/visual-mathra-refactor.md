# Implementation Plan: Visual-Order Mathra Refactoring

## Objective
Update the word assembly arrays in the database to match the **visual drag-and-drop order** (left-to-right) for all left-sided mathras, and update the validation tools to support this visual syntax without failing Unicode join checks.

## 1. The Challenge
Standard Malayalam Unicode dictates phonetic order: `വ` (va) + `ീ` (ee) = `വീ` (vee).
However, visually, the child sees the `ീ` *before* the `വ`. If they drag `ീ` then `വ`, the standard `.join('')` results in `ീവ`, which breaks validation.

## 2. Technical Solution: The "Visual-to-Phonetic" Reassembler
We will update `WordAudit.jsx` and `integrity.test.js` with a utility function that understands visual order. If it encounters a left-sided mathra in the array, it swaps it with the *next* character before joining.

**Target Mathras/Modifiers:**
- `ീ` (ee)
- `െ` (e)
- `േ` (E)
- `ൈ` (ai)
- `ോ` (oo - acts as a wrapper, but child drags left part first)
- `്ര` (ra-subscript)

## 3. Tool Updates
### A. `WordAudit.jsx` & `WordAudit.test.jsx`
- Introduce `visualToPhoneticJoin(requiredCharacters)`:
  ```javascript
  const visualToPhoneticJoin = (chars) => {
    let result = [...chars];
    const leftMathras = ['ീ', 'െ', 'േ', 'ൈ', 'ോ', '്ര'];
    for (let i = 0; i < result.length - 1; i++) {
      if (leftMathras.includes(result[i])) {
        // Swap the mathra with the consonant following it
        let temp = result[i];
        result[i] = result[i+1];
        result[i+1] = temp;
      }
    }
    return result.join('');
  };
  ```

### B. `integrity.test.js`
- Implement the same `visualToPhoneticJoin` logic before comparing against `word.malayalamText`.

## 4. Database Updates (`seed-100.json`)
Once the tools support visual ordering, we will update the arrays for affected words across the dictionary.

**Examples of Updates:**
- `വീട്`: `["വ", "ീ", "ട", "്"]` ➡️ `["ീ", "വ", "ട", "്"]`
- `ചേച്ചി`: `["ച", "േ", "ച്ച", "ി"]` ➡️ `["േ", "ച", "ച്ച", "ി"]`
- `എപ്പോൾ`: `["എ", "പ്പ", "ോ", "ൾ"]` ➡️ `["എ", "ോ", "പ്പ", "ൾ"]`
- `രാത്രി`: `["ര", "ാ", "ത", "്ര", "ി"]` ➡️ `["ര", "ാ", "്ര", "ത", "ി"]`

## 5. Verification
- Run `npm test` in client and server.
- Review Word Audit tool to ensure all 369 words pass the new visual join logic.
