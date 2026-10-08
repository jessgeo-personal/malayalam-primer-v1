# DATA-02 Plan: Cycle 2 Grapheme Splits & Lessons 15–20 Bundling

## 📌 Context & Purpose
Cycle 1 (Lessons 1–14) currently passes all integrity checks and curriculum gates. However, in `seed-200.json`, vocabulary words designated for Cycle 2 (Lessons 15 through 20) lack populated `requiredCharacters` arrays or have unassigned lesson IDs/bundles across raw word lists. If unaddressed, word assembly exercises in Cycle 2 will crash or render empty puzzle boxes on the Android tablet.

The objective of Task DATA-02 is to curate and populate `server/data/seed-200.json` so that all buildable vocabulary items for Cycle 2 are assigned to Lessons 15 through 20 with valid atomic grapheme splits satisfying the **Zero-Empty-Boxes Rule**.

## 🎯 Pedagogical & Technical Constraints
1. **Word Splitting Protocol (`docs/word_splitting_protocol.md`)**:
   - Dependent vowel signs (modifiers like ാ, ി, ീ, ു, ൂ, െ, േ, ോ, ൊ) MUST be detached from their base consonants.
   - Modifiers must strictly follow the base consonant in phonetic order (e.g., `അതെ` -> `["അ", "ത", "െ"]`, `പോ` -> `["പ", "ോ"]`).
   - Conjunct consonants (e.g., ണ്ട, ന്ത, മ്മ, റ്റ, ക്ക) remain intact if taught as a single phonetic block.
   - Complex clusters with a mathra are split into base conjunct + mathra (e.g., `സ്കൂ` -> `["സ്ക", "ൂ"]`).
   - No shortcut suffixes (e.g., `ുക` must be split atomically into `["ു", "ക"]`).
2. **Cycle 2 Bounds (Lessons 15–20)**:
   - All Cycle 2 words must have `lessonId` between 15 and 20 (inclusive).
   - Non-overlapping with Cycle 1 (Lessons 1–14) and Cycle 3 (Lesson 21+).
3. **Zero-Empty-Boxes Rule**:
   - For all buildable vocabulary items, `requiredCharacters` must be a non-empty array (`length > 0`).
   - Every element in `requiredCharacters` must be a non-empty, non-null string (`char.trim().length > 0`).

## 🧪 Testing Strategy (Red-Green-Refactor)
### 1. Red Phase (Current Task)
- Extend `server/tests/integrity.test.js` with the suite `DATA-02: Cycle 2 (Lessons 15-20) Data Integrity & Zero-Empty-Boxes`.
- Tests assert:
  - Every item in `seed-200.json` has `lessonId` defined and between 15 and 20.
  - Every buildable item (where `!word.isSuffix`) has a non-empty `requiredCharacters` array with valid non-empty string tokens.
- Execute `npm test tests/integrity.test.js` in `server/` to confirm failure in Red Phase without modifying `seed-200.json`.

### 2. Green Phase (Next Task)
- Curate and update `server/data/seed-200.json`:
  - Properly structure vocabulary words and lessons 15–20.
  - Populate atomic `requiredCharacters` according to `docs/word_splitting_protocol.md`.
- Run tests and confirm 100% green pass.

### 3. Refactor / Verification Phase
- Re-run database curriculum integrity scans and seeder tests.
- Update `EXECUTION_TRACKER.md` and `CHANGELOG.md`.
