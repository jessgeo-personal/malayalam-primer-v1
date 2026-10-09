# Implementation Plan: Phase 2 - High-Density Interrogative Data Payload (Lessons 4-10)

## Objective
Generate the complete pedagogical JSON payload for Cycle 1 Lessons 4-10. Each lesson will introduce a core interrogative (Who, What, Where, etc.) with a high-density vocabulary (8+ words) and contextual sentences, following the 3-Act Structure.

## 1. Curriculum Architecture (Lessons 4-10)

### Pedagogical Requirements (Per Lesson):
- **Act 1: Alphabets**
    - 1 `concept` screen (Lesson Intro).
    - 4-6 `trace` items (new graphemes or complex ligatures).
    - 4-6 `match` items (SoundMatcher).
- **Act 2: Words**
    - 1 `concept` screen (Building Rules).
    - 8+ `build` items (High-density vocabulary).
- **Act 3: Sentences**
    - 1 `concept` screen (Speaking/Grammar rule).
    - 2-3 `scramble` items (Full sentences).

## 2. Technical Data Specs (TDD for Data)
- **ID Strategy:** 
    - `w051-w120` (Words)
    - `t066-t100` (Traces)
    - `m066-m100` (Matches)
    - `ss010-ss030` (Scrambles)
    - `c004_a1-c010_a3` (Concepts)
- **Word Splitting Protocol:** Every `build` item MUST have a manually verified `requiredCharacters` array following the atomic phonetic order.
- **Prerequisite Chaining:** Every `build` word must list the `match` IDs of its component characters in its `prerequisites` array.

## 3. Audit & Quality Assurance
- **Integrity Scan:** Immediately after drafting, the data will be run through the **Audit Tool v2** (implemented in Phase 1).
- **Checks:**
    - **No Orphan Characters:** Every tile in a word must have a corresponding Trace.
    - **Zero Spacing Errors:** Sentence scrambler parts must join with spaces to match the full text.
    - **Volume Audit:** Confirm exactly 10 lessons exist for Cycle 1 by the end of this phase.

## 4. TDD & Regression Tests
- **Backend Test:** Add a test to `server/tests/integrity.test.js` to check for:
    - `wordId` duplicates.
    - Missing `lessonId` sequence (4, 5, 6, 7, 8, 9, 10).
    - Empty `requiredCharacters` or `sentenceParts`.
- **Frontend Test:** Verify that the `ConceptScreen` correctly renders the "Summary" variant for the new lesson ranges.

## 5. Implementation Steps
1. **Draft JSON Segment:** Generate the JSON for one lesson (e.g., L4: WHO?).
2. **Splitting Audit:** Manually verify grapheme clusters for that lesson.
3. **Repeat:** Continue for L5 through L10.
4. **Schema Validation:** Run the new integrity tests.
5. **Approval:** Present the full JSON structure for final review before moving to Phase 3 (Seeding).

## 6. Guardrails
- **No Hallucination:** Vocabulary is restricted to the 100-word core list approved in the product brief.
- **Tablet-First:** Vocabulary length and character counts per word are checked to ensure tiles fit on tablet screens.
