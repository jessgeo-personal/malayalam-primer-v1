# Implementation Plan: Comprehensive Curriculum Alignment & Grapheme Refactor

## Objective
Fix critical pedagogical and data alignment issues in Cycle 1:
1.  **Grapheme Consolidation:** Ensure all words using double consonants (ല്ല, മ്മ, ന്ന, ട്ട, റ്റ, പ്പ, ച്ച, ക്ക, ങ്ങ) use consolidated character tiles instead of individual components (e.g., ["അ", "മ്മ"] instead of ["അ", "മ", "്", "മ"]).
2.  **Lesson Alignment:** Re-map words to Lessons 1-9 to ensure they match the concept screen descriptions and follow a strict prerequisite trace -> build flow.
3.  **Missing Traces:** Add explicit tracing/matching for all consolidated double consonants used in the curriculum.

## Scope & Impact
*   **Seed Data (`seed-100.json`):** Massive refactor of `lessonId`, `requiredCharacters`, and `prerequisites` for approximately 100 items.
*   **Database:** Re-seeding required to apply the fixes.
*   **Frontend/Backend Logic:** No logic changes required, purely a data-driven fix.

## Implementation Steps (TDD Approach)

### Phase 1: Data Audit & Trace Injection
1.  **Inject Missing Traces/Matches into Lesson 3 (or earlier):**
    *   `t045`/`m045`: **ല്ല** (LLa)
    *   `t046`/`m046`: **മ്മ** (MMa)
    *   `t047`/`m047`: **ന്ന** (NNa)
    *   `t048`/`m048`: **ട്ട** (TTa)
    *   `t049`/`m049`: **ച്ച** (CHa)
    *   `t050`/`m050`: **ക്ക** (KKa)
    *   `t051`/`m051`: **ങ്ങ** (NGa)

### Phase 2: Lesson Re-Mapping (Lessons 1-4)
1.  **Lesson 1 (Basics):**
    *   **Traces:** അ, വ, ന, ാ, ൻ.
    *   **Words:** അവൻ (He - w003).
2.  **Lesson 2 (People):**
    *   **Traces:** ഞ, മ, മ്മ (t046), ീ, ൾ, ർ.
    *   **Words:** ഞാൻ (I - w001), നീ (You - w002), അവൾ (She - w004), അവർ (They - w005), നമ്മൾ (We - w008).
3.  **Lesson 3 (Our World):**
    *   **Traces:** ഇ, ത, ്, ല, ല്ല (t045), ച, ച്ച (t049).
    *   **Words:** ഇത് (w006), അത് (w007), അമ്മ (w086), അച്ഛൻ (w087), നല്ല (w078), അല്ല (w014).
4.  **Lesson 4 (Existence):**
    *   **Traces:** ഉ, ണ, ട, ട്ട (t048), ആ.
    *   **Words:** ഉണ്ട് (w011), ഇല്ല (w012), ആണ് (w013), അതെ (w015).

### Phase 3: Character Refactor (Global)
1.  Update `requiredCharacters` for all affected words:
    *   `അമ്മ`: `["അ", "മ്മ"]`
    *   `അച്ഛൻ`: `["അ", "ച്ച", "ൻ"]`
    *   `നമ്മൾ`: `["ന", "മ്മ", "ൾ"]`
    *   `ഇല്ല`: `["ഇ", "ല്ല"]`
    *   `അല്ല`: `["അ", "ല്ല"]`
    *   `നല്ല`: `["ന", "ല്ല"]`
    *   `പെട്ടി`: `["പ", "െ", "ട്ട", "ി"]`
    *   `കുട്ടി`: `["ക", "ു", "ട്ട", "ി"]`
    *   `നിന്നു`: `["ന", "ി", "ന്ന", "ു"]`
    *   `ഇരുന്നു`: `["ഇ", "ര", "ു", "ന്ന", "ു"]`
    *   ... and ensure `prerequisites` point to the new `m` (match) IDs.

### Phase 4: Database Synchronization
1.  Run `node seeder.js` in `/server`.
2.  Verify Lesson 1 and 2 payloads via API.

## Verification & Testing Strategy
*   **Accuracy:** Every word containing a double consonant must have that consonant as a single tile in the `LetterPicker`.
*   **Pedagogical Adherence:** No word can be assigned to a lesson unless all its component traces have been introduced in that lesson or a previous one.
*   **Regression:** Run `npm test` in `/server` to ensure seeder integrity and SRS weight logic remains intact.