# DATA-03 Plan: Cycle 3 Grapheme Splits & Lessons 21–25 Bundling

## 📌 Context & Purpose
Following the successful completion of Track B Tasks DATA-01 (Phonetic Transliteration Tooling) and DATA-02 (Cycle 2 `seed-200.json` curation and bundling), we now proceed to Task **DATA-03**.

Currently, `server/data/seed-300.json` contains raw vocabulary entries intended for Cycle 3 (Lessons 21 through 25). However, entries in `seed-300.json` currently have unassigned or invalid `lessonId` values and unpopulated or empty `requiredCharacters` arrays. Without proper curation, attempting to build or interact with Cycle 3 words will cause crashes, missing character choices, or empty puzzle boxes on the Android tablet interface.

The objective of Task DATA-03 is to curate and structure `seed-300.json`, ensuring every target Cycle 3 word:
1. Is cleanly assigned to Lessons 21 through 25.
2. Has its `requiredCharacters` array populated in strict compliance with the **atomic grapheme splitting protocol** (`docs/word_splitting_protocol.md`).
3. Satisfies the **Zero-Empty-Boxes Rule**.

---

## 🎯 Pedagogical & Technical Constraints

### 1. Atomic Grapheme Splitting Protocol (`docs/word_splitting_protocol.md`)
- **Detached Vowel Modifiers**: Dependent vowel signs (e.g., ാ, ി, ീ, ു, ൂ, െ, േ, ൈ, ൊ, ോ, ൌ) must be completely detached from their base consonants.
- **Strict Phonetic Ordering**: Modifiers must strictly follow their consonant in the array, even when visual rendering displays them to the left (െ, േ, ൈ) or as a surrounding glyph (ൊ, ോ, ൌ).
- **Atomic Conjuncts**: Preserved as single phonetic units if introduced as a taught unit, but mathras attached to conjuncts must be detached (e.g., base conjunct + mathra).
- **Chillu Letters & Viramas**: Standalone chillu letters (ൻ, ൽ, ൾ, ർ, ൺ) and halant forms must be preserved correctly as single grapheme units.
- **No Shortcut Suffixes**: Never group phonetic components into combined blocks (e.g., `ുക` must be split into `["ു", "ക"]`).

### 2. Cycle 3 Lesson ID Boundaries
- Cycle 3 encompasses **Lessons 21 to 25**.
- All entries in `seed-300.json` must have a defined `lessonId` satisfying:
  $$21 \le \text{lessonId} \le 25$$
- Non-overlapping with Cycle 1 (Lessons 1–14) and Cycle 2 (Lessons 15–20).

### 3. Zero-Empty-Boxes Rule
- For all buildable vocabulary items (`!word.isSuffix`):
  - `requiredCharacters` must be an `Array` with `length > 0`.
  - Every character token must be a non-empty string (`typeof char === 'string' && char.trim().length > 0`).

---

## 🧪 Testing Strategy (Red-Green-Refactor)

### 1. Red Phase (Current Task)
- Extend `server/tests/integrity.test.js` with the test suite:
  ```javascript
  const seed300 = require('../data/seed-300.json');

  describe('DATA-03: Cycle 3 (Lessons 21-25) Data Integrity & Zero-Empty-Boxes', () => {
    it('should ensure all Cycle 3 words have valid lessonId between 21 and 25', () => {
      expect(seed300.length).toBeGreaterThan(0);
      seed300.forEach((word) => {
        expect(word.lessonId).toBeDefined();
        expect(word.lessonId).toBeGreaterThanOrEqual(21);
        expect(word.lessonId).toBeLessThanOrEqual(25);
      });
    });

    it('should enforce the Zero-Empty-Boxes rule on requiredCharacters', () => {
      seed300.forEach((word) => {
        if (!word.isSuffix) {
          expect(Array.isArray(word.requiredCharacters)).toBe(true);
          expect(word.requiredCharacters.length).toBeGreaterThan(0);
          word.requiredCharacters.forEach((char) => {
            expect(typeof char).toBe('string');
            expect(char.trim().length).toBeGreaterThan(0);
          });
        }
      });
    });
  });
  ```
- Run `npm test tests/integrity.test.js` in `server/`.
- Verify and capture the failing test output (Red Phase) without modifying `server/data/seed-300.json`.

### 2. Green Phase (Next Task)
- Curate and structure `server/data/seed-300.json` for Lessons 21–25.
- Populate `requiredCharacters` for all vocabulary words adhering to `docs/word_splitting_protocol.md`.
- Run `npm test tests/integrity.test.js` to confirm all tests turn green.

### 3. Refactor & Verification Phase
- Run full server test suite (`npm test`).
- Verify seeder execution (`node seeder.js`).
- Update `docs/EXECUTION_TRACKER.md` and `.gemini/log/CHANGELOG.md`.
