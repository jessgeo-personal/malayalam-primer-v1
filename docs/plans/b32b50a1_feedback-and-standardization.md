# Implementation Plan: Aspirated Consonant Removal & Feedback Optimization

## Objective
Standardize the curriculum to use unaspirated (Alpa-prana) consonants and improve pedagogical feedback:
1.  **Aspirated to Unaspirated Conversion:** Replace all aspirated consonants in the top 300 words with their unaspirated equivalents (e.g., "അച്ഛൻ" -> "അച്ചൻ", "മുഖം" -> "മുഗം", "ഭാര്യ" -> "ബാര്യ") to simplify learning for an 8-year-old.
2.  **Visual Correction Feedback:** Update the `Word Assembly` game to display the correct spelling and phonetic guide when a mistake is made.
3.  **Data Parity Fix:** Ensure every word's `requiredCharacters` exactly join to match its `malayalamText`.

## Scope & Impact
*   **Seed Data (`seed-100.json`, `seed-200.json`, `seed-300.json`):** Global find-and-replace for aspirated characters and realignment of components.
*   **Frontend Game (`LetterPicker.jsx`):** Feedback overlay enhancement.
*   **Database:** Full re-seeding required.

## Phased Implementation Plan

### Phase 1: Global Data Refactor (Consonants)
I will perform the following replacements across all seed files:
*   `ച്ഛ` (Chcha) -> `ച്ച` (Cca)
*   `ഖ` (Kha) -> `ഗ` (Ga) (middle) / `ക` (Ka) (start)
*   `ഘ` (Gha) -> `ഗ` (Ga)
*   `ഛ` (Cha) -> `ച` (Ca)
*   `ഝ` (Jha) -> `ജ` (Ja)
*   `ഠ` (Tha) -> `ട` (Ta)
*   `ഢ` (Dha) -> `ഡ` (Da)
*   `ഥ` (Tha) -> `ത` (Ta)
*   `ധ` (Dha) -> `ദ` (Da)
*   `ഫ` (Pha) -> `പ` (Pa)
*   `ഭ` (Bha) -> `ബ` (Ba)

**Specific High-Frequency Fixes:**
*   `അച്ഛൻ` -> `അച്ചൻ`
*   `മുഖം` -> `മുഗം`
*   `ഭാര്യ` -> `ബാര്യ`
*   `പഠിക്കുക` -> `പടിക്കുക`
*   `സാധാരണ` -> `സാദാരണ`

### Phase 2: Trace/Match Alignment
1.  Remove any trace/match items that are strictly aspirated and no longer used.
2.  Ensure `requiredCharacters` and `prerequisites` for all 300 words are synchronized with the new spellings.

### Phase 3: Frontend Feedback UI (LetterPicker.jsx)
1.  Update the `feedback` overlay in `LetterPicker.jsx`.
2.  If `isCorrect` is false:
    *   Show "CORRECT SPELLING IS:" label.
    *   Render the `word.malayalamText` in large, bold primary color.
    *   Render the `word.phonetic` guide.
    *   Keep the "RETRY ➜" button.

### Phase 4: Verification & Synchronization
1.  Run `node seeder.js` in `/server`.
2.  Run `npm test` across `/client` and `/server`.

## Verification & Testing Strategy
*   **Data Integrity Check:** Run a script to verify `requiredCharacters.join('') === malayalamText` for every word in the DB.
*   **UX QA:** Manually fail a word in Lesson 3 ("അച്ചൻ") and verify the correct spelling appears in the feedback overlay.
*   **Pedagogical Check:** Ensure all remaining traces in Lessons 1-9 are unaspirated.