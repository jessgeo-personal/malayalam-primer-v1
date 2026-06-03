# Phase 2: Interrogative-Led Data Payload Drafting (Lessons 4-10)

## Objective
Draft the complete JSON payload for the 7 missing lessons in Cycle 1, adhering to the high-density (8+ words) and interrogative-led structure.

## 1. Data Structure (Per Lesson)
Each lesson will follow the 3-Act Structure:
- **Act 1:** Concept Screen (Intro) + Traces + Matches for all new characters.
- **Act 2:** Concept Screen (Building) + Word Building puzzles (8+ items).
- **Act 3:** Concept Screen (Speaking) + Sentence Scrambler (2-3 items).

## 2. Grapheme Splitting & Phonetics
- **Task:** Apply the **Word Splitting Protocol** to all 55+ new words.
- **Examples:**
    - `സുഹൃത്ത്` -> `["സ", "ു", "ഹൃ", "ത്ത", "്"]`
    - `എന്തുകൊണ്ട്` -> `["എ", "ന്ത", "ു", "ക", "ൊ", "ണ്ട", "്"]`
- **Phonetic Audit:** Verify `phonetic` labels for all new items to match the Malayalam audio engine's expectations.

## 3. TDD & Integrity Checks
- **Schema Validation:** Ensure every item has a unique `wordId` (following the `w0xx`, `t0xx`, `m0xx`, `ss0xx`, `c0xx` conventions).
- **Gating Check:** Verify that `prerequisites` are correctly chained (e.g., `w041` (Who) requires `m041` (Trace-Match of Who)).
- **Volume Constraint:** Minimum 8 `build` items per lesson.

## 4. Guardrails
- **STRICT AI CONSTRAINTS:** No words outside the 100-word whitelist.
- **Zero Hallucination:** Every character used in a word MUST have a corresponding trace in the payload.
