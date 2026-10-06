# Implementation Plan: Cycle 2 Plurals & Suffix Overhaul

## 🎯 Objective
Address user-reported bugs in the Cycle 2 Suffix Snapper lessons (Lessons 10-14). This includes clarifying concept screens regarding plural rules, fixing a UI overlap issue with the tutorial guide, providing custom pedagogical feedback for incorrect suffix drops, and fixing a misleading generic instruction that confused locative cases ("IN") with plurals.

## 📂 Key Files & Context
*   **Data Source:** `server/data/seed-200.json` (Concept Screens)
*   **Game Component:** `client/src/components/games/SuffixSnapper.jsx`

## 🛠️ Implementation Steps

### Phase 1: Clarifying Concept Screens (Data)
Update `seed-200.json` to make the plural rules explicit:
*   **`c010`:** Make it clear that `-ുകൾ` (ukal) is the plural for words ending in a chillu or U-sound.
*   **`c011`:** Clarify that `-കൾ` (kal) is the standard plural for most other words.
*   **`c012`:** Emphasize that `-മാർ` (maar) is strictly a plural for *people* and respectful titles.
*   **`c013` & `c014`:** Ensure locative case screens ("In/On") clearly differentiate themselves from plurals.

### Phase 2: Fixing Suffix Snapper UI Overlap
*   In `SuffixSnapper.jsx`, locate the `<div data-testid="tutorial-guide">`.
*   Adjust the margins (`mb-40` on the text box and `mt-40` on the hand icon) and add `pt-32` to the container so it floats directly above the drop zone, rather than overlapping the top instruction header.

### Phase 3: Fixing Misleading Instructions
*   In `SuffixSnapper.jsx`, change the hardcoded header text:
    *   *From:* `Make the word plural: "{word.englishTranslation}"`
    *   *To:* `Complete the word for: "{word.englishTranslation}"`
*   This resolves Issue 18, where the child thought they were supposed to make "In the house" plural because of the hardcoded instruction.

### Phase 4: Custom Error Feedback
*   When a child drops an incorrect suffix, we need to tell them *why* it's wrong (Issue 17).
*   Add a helper function `getFeedbackMessage(placedSuffix)` to `SuffixSnapper.jsx`.
*   **Feedback Map:**
    *   If `മാർ` (maar): "മാർ (maar) is only used to make plurals for people!"
    *   If `ങ്ങൾ` (ngal): "ങ്ങൾ (ngal) is for making plurals of words ending in 'm'."
    *   If `കൾ` (kal) or `ുകൾ` (ukal): "That's a plural ending. Check the base word's sound!"
    *   If `ിൽ` (il) or `യിൽ` (yil): "That ending means 'in' or 'on'."
    *   *Fallback:* "That ending doesn't fit here."
*   Display this custom message in the red "Try Again" overlay.

## 🧪 Verification Strategy
*   Run the database seeder to inject the new concept rules.
*   Test `SuffixSnapper` via the Prototype Lab (or test route) to verify the UI overlay no longer overlaps the header.
*   Intentionally drop the wrong suffix (e.g., `മാർ`) to verify the custom pedagogical feedback appears.