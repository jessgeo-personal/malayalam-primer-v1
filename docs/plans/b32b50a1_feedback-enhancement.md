# Implementation Plan: Feedback Enhancement & Spelling Corrections

## Objective
Address user reports of incorrect word validation and improve the pedagogical feedback loop:
1.  **Correct "Achchan" (Father):** Fix the discrepancy between the target word "അച്ഛൻ" and its components.
2.  **Improve Feedback UI:** Update the `Word Assembly` game to display the correct spelling when a user makes a mistake.
3.  **Comprehensive Data Audit:** Verify all Cycle 1 words for joined-string consistency.

## Scope & Impact
*   **Seed Data (`seed-100.json`):** Add missing traces and fix component mismatches.
*   **Frontend Game (`LetterPicker.jsx`):** Enhance the feedback overlay to show correct answers on failure.

## Implementation Steps

### Phase 1: Data Corrections (seed-100.json)
1.  **Inject Trace/Match for "ച്ഛ" (ccha):**
    *   `t052`/`m052`: **ച്ഛ** (Lesson 3).
2.  **Update "w010" (Achchan):**
    *   Set `requiredCharacters` to `["അ", "ച്ഛ", "ൻ"]`.
    *   Set `prerequisites` to `["m001", "m052", "m005"]`.
3.  **Audit other words:**
    *   Check for any other words where `requiredCharacters.join('') !== malayalamText`.

### Phase 2: Frontend Feedback Logic (LetterPicker.jsx)
1.  **Modify Feedback Overlay:**
    *   When `feedback.isCorrect` is `false`, display the target `word.malayalamText` with a "Correct spelling is:" label.
    *   Ensure the typography is large and clear (32px+).
    *   Include the phonetic spelling as well.

### Phase 3: Database & Verification
1.  **Re-seed Database:** Run `node seeder.js` in `/server`.
2.  **Test Execution:** Run `npm test` across `/client` and `/server`.

## Verification & Testing Strategy
*   **Visual Check:** Manually trigger a wrong answer in the Word Assembly game to verify the correction screen appears.
*   **Data Integrity:** Verify `w010` payload via API to ensure components are correctly mapped.
*   **Regression:** Ensure existing 100% test pass rate is maintained.