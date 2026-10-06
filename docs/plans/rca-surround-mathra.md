# Root Cause Analysis: Surround Mathra (ോ) Regression

## The Issue
In the Word Assembly game, the right-hand section of surround mathras (like `ോ` splitting into `േ` and `ാ`) started showing up as a faint placeholder *before* the student dropped the correct tile into the box. This acted as an unintended hint, removing the pedagogical challenge.

## The Root Cause
This regression was entirely my fault. 

During our earlier investigation into visual mathras, I misinterpreted your feedback regarding how surround mathras were behaving. Believing there was a rendering bug preventing the right-hand side from showing, I modified the rendering loop in `LetterPicker.jsx` around line 275.

**What I changed (The Bug):**
I updated the code to render the right-hand part based on the *expected* character for that slot, regardless of whether the slot was empty or filled:
```javascript
// The faulty logic I introduced
const expectedNextChar = word.requiredCharacters[nextCharIndex];
if (expectedNextChar && SURROUND_MATHRAS.includes(expectedNextChar)) {
  // Render placeholder immediately
}
```

**Why it broke the UX:**
By checking what the character *should* be (rather than what the child actually placed), the game gave away the answer. It showed the `ാ` highlight before the child made a decision. 

## The Fix (Already Applied & Reverted)
The original logic was actually working perfectly. It waited for the child to drop the tile into the box before rendering the second half. 

I have already reverted `LetterPicker.jsx` back to this correct state:
```javascript
// The restored correct logic
const nextCharObj = slots[nextCharIndex]; // Looks at the ACTUAL dropped tile
if (nextCharObj && SURROUND_MATHRAS.includes(nextCharObj.value)) {
  // Render right part ONLY if the tile is placed
}
```

## Guardrail Implementation
To prevent this in the future, I am adding a strict mental guardrail: **Never alter core gamification logic or add visual "hints" without explicit instruction.** The challenge of the game is its pedagogical core.

## Status
The codebase has been reverted, and the "hide until placed" logic for `ോ` is restored.
