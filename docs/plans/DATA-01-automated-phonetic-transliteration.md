# DATA-01 Plan: Automated Phonetic Transliteration Utility

## 📌 Context & Purpose
Currently, phonetic English pronunciation strings in our database seeding (`seed-100.json`, etc.) require manual authoring or maintenance, which is error-prone and inconsistent across grammatical buckets and vocabulary expansions.
The goal of Track B, Task DATA-01 is to build an automated transliteration utility function (`transliterateMalayalam(text)`) using `@indic-transliteration/sanscript` (or similar transliteration logic) that converts Malayalam text into standardized, child-friendly phonetic English strings matching our seed data expectations.

## 🎯 Target Transliterations (BDD Criteria)
The utility must accurately convert:
1. **Basic Pronouns**:
   - `ഞാൻ` -> `'njan'`
   - `അവൻ` -> `'avan'`
2. **Complex Conjuncts & Chillu Letters**:
   - `ഉണ്ട്` -> `'undu'`
   - `അമ്മ` -> `'amma'`
   - `എന്തുകൊണ്ട്` -> `'enthukond'`
3. **Grammatical Suffixes / Sandhi Elements**:
   - `-ൽ` -> `'-il'`
   - `-ഓ` -> `'-o'`

## 🧪 Testing Strategy (Red-Green-Refactor)
### 1. Red Phase (Current Task)
- Define test assertions in `server/tests/transliterate.test.js` using Vitest importing `transliterateMalayalam` from `../utils/transliterate.js`.
- Execute test runner (`npx vitest run tests/transliterate.test.js`) and confirm failure because `server/utils/transliterate.js` does not exist.
- Preserve existing Jest test suite passing 100% green (`npm test` / `jest --runInBand`).

### 2. Green Phase (Next Task)
- Implement `server/utils/transliterate.js` using `@indic-transliteration/sanscript` and any custom phonetic mapping overrides/normalizers.
- Verify that all test cases pass.

### 3. Refactor Phase
- Integrate automated transliteration into seeder verification or pipelines.
- Verify regression suite across all existing tests.
