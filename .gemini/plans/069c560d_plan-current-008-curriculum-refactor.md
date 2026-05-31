# Plan: 008 - Curriculum Refactor & Pedagogical Alignment

## Objective
Transition from "Algorithmic Loading" to "Intentional Bundling". We will manually group vocabulary into cohesive lessons (5-6 characters + 2-3 words) and ensure 100% of Cycle 1 words are correctly split for the building game.

## 1. Data Schema & Engine Refactor
- **Word Model:** Add `lessonId` (Number) and `sequence` (Number) fields to explicitly define lesson order.
- **SRS Engine:** Refactor `generateLessonPayload` to fetch items strictly by `lessonId` instead of skip/limit.
- **Adventure Map:** Dynamically render lesson nodes based on the highest `lessonId` present in the database for the active cycle.

## 2. Cycle 1 Content Refinement (The "Great Split")
- **Grapheme Splitting:** Use the official protocol to populate `requiredCharacters` for words `w006` through `w050`.
- **Lesson Grouping (Cycle 1):**
    - **Lesson 1:** Trace/Match (അ, ന, ൻ, ഞ, ാ, ീ) + Build (ഞാൻ, നീ, അവൻ, അവൾ, അവർ).
    - **Lesson 2:** Introduce next 5-6 characters + related words.
    - *Repeat until Cycle 1 is complete.*

## 3. Testing Strategy (Zero-Regression)
### Unit Tests (Jest)
- `srsEngine.test.js`: Verify `generateLessonPayload` returns only items for the requested `lessonId`.
- `seeder.test.js`: Add a "Data Integrity Check" to ensure NO word in Cycle 1 has an empty `requiredCharacters` array.
- `validation.test.js`: Ensure every `build` word's characters exist as `trace` items in the same or previous lesson.

### Regression Checks
- Verify `LetterPicker.jsx` renders exactly the number of boxes defined in `requiredCharacters`.
- Confirm `AdventureMap.jsx` correctly shows stars and completion status for explicitly ID'd lessons.

## 4. Implementation Steps
1. **Refactor Backend Models & Engine:** Update Mongoose schema and `srsEngine.js`.
2. **Bulk Data Update:** Update `seed-100.json` with `lessonId` and `requiredCharacters` for Cycle 1.
3. **Write & Run Tests:** Ensure the data and engine are perfectly aligned.
4. **Update Regression Checklist:** Add "Phase 10: Pedagogical Data Integrity".

## 5. Documentation Update
- Update `UI_CHARTER.md` to reflect the fixed lesson structure.
- Update `CHANGELOG.md`.
