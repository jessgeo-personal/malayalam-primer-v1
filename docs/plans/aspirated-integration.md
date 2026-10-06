# Implementation Plan: Aspirated Consonant Integration & Achchan Simplification

## Objective
Standardize the curriculum based on user feedback:
1.  **Simplify Achchan:** Change "അച്ഛൻ" to the unaspirated "അച്ചൻ" across all lessons and components.
2.  **Integrate Aspirated Consonants:** For all other words (Bha, Tha, Dha, Kha groups), keep the formal aspirated spelling and inject new **Trace** and **Match** lessons to ensure the child learns these characters.
3.  **Visual Correction:** Update the `Word Assembly` game to show the correct spelling when a mistake is made.

## Scope & Impact
*   **Seed Data (`seed-100.json`, `seed-200.json`, `seed-300.json`):** Update text for Achchan and inject new character traces.
*   **Frontend Game (`LetterPicker.jsx`):** Feedback overlay enhancement to show correct spelling.
*   **Database:** Full re-seeding required.

## Phased Implementation Plan

### Phase 1: Achchan Simplification (Global)
1.  Search and replace `അച്ഛൻ` with `അച്ചൻ` in all 3 seed files.
2.  Update `requiredCharacters` for Achchan (w010) to `["അ", "ച്ച", "ൻ"]`.
3.  Update `prerequisites` to point to `m018` (ച്ച).

### Phase 2: Aspirated Character Trace Injection
1.  **Identify First Encounters:**
    *   **ഭ (Bha):** Required for `ഭാര്യ` (Lesson 12).
    *   **ഠ (Tha):** Required for `പഠിച്ചു` (Lesson 20).
    *   **ധ (Dha):** Required for `സാധാരണയായി` (Lesson 25).
    *   **ഖ (Kha):** Required for `മുഖം` (Lesson 10 - Cycle 2).
2.  **Inject Traces:** Add `t-series` and `m-series` for each of these characters in the lesson they are first introduced.

### Phase 3: Word Puzzle Refactoring
1.  Update all affected word puzzles (Face, Studied, Earth, Wife, etc.) to ensure their `requiredCharacters` array contains the aspirated character as a single tile.
2.  Ensure `prerequisites` correctly link to the new aspirated `match` IDs.

### Phase 4: Feedback UI Update (LetterPicker.jsx)
1.  Modify the `feedback` state overlay.
2.  If `isCorrect` is false, add:
    ```jsx
    <p className="text-white/80 font-bold mb-1 uppercase tracking-widest text-[10px]">Correct spelling:</p>
    <div className="text-4xl font-black text-white mb-2">{word.malayalamText}</div>
    <div className="text-lg font-bold text-white/90 bg-black/20 px-4 py-1 rounded-lg mb-6">{word.phonetic}</div>
    ```

### Phase 5: Verification
1.  Run `node seeder.js` in `/server`.
2.  Run `npm test` across `/client` and `/server`.
3.  Manual QA: Fail "He" (avan) and "Father" (achan) to verify the new correction screen.

## Verification & Testing Strategy
*   **Accuracy:** Every word containing an aspirated consonant must have that consonant as a single tile in the `LetterPicker`.
*   **Data Parity:** Run an automated script to ensure `requiredCharacters.join('') === malayalamText` for all 300 words.
*   **Visual Polish:** The correction screen must use the same "Neo-Bento" design language (large text, rounded corners).