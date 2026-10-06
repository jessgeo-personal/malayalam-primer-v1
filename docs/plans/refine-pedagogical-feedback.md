# Implementation Plan: Pedagogical Feedback Refinement

## 🎯 Objective
Refine the custom error feedback in the **Suffix Snapper** game to be more pedagogically accurate. Specifically, update the explanation for `-മാർ` (maar) to clarify it is for older/respectful people, and provide a comprehensive set of reasons for all current suffixes.

## 📂 Key Files & Context
*   **Game Component:** `client/src/components/games/SuffixSnapper.jsx`
*   **Target Logic:** `getFeedbackMessage` helper function.

## 🛠️ Implementation Steps

### Phase 1: Update Feedback Logic
1.  Open `SuffixSnapper.jsx`.
2.  Update the `getFeedbackMessage` function with the following refined rules:
    *   **മാർ (maar):** "Used for people who are older or need respect (like mothers or teachers)."
    *   **ങ്ങൾ (ngal):** "Used when a word ends in the 'M' sound (ം). Example: മരം -> മരങ്ങൾ."
    *   **ുകൾ (ukal):** "Used for words ending in a 'U' sound or a chillu letter. Example: വീട് -> വീടുകൾ."
    *   **കൾ (kal):** "The standard plural ending for objects, animals, and young children."
    *   **ിൽ (il) / യിൽ (yil):** "This means 'in' or 'on'. It doesn't make a word plural!"
    *   **Default:** "That ending doesn't fit here. Try another one!"

### Phase 2: Verification
1.  Run frontend unit tests.
2.  Perform a manual check on the tablet:
    *   Go to Lesson 12.
    *   Find "Boy" (`ആൺകുട്ടി`).
    *   Intentionally drop `-മാർ`.
    *   Verify the new respectful/older person explanation appears.

## 🧪 Verification Strategy
*   Confirm `SuffixSnapper.test.jsx` still passes.
*   Manual audit of Lesson 12 on the device.
*   Confirm version increment to `2026.06.01.014`.