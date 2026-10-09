# Bug Fix Plan: Lesson 7 Tense Correction

## Objective
Correct a grammatical and pedagogical error in Lesson 7 where the past tense verb "പോയി" (went) was incorrectly paired with the future temporal marker "നാളെ" (tomorrow).

## 1. The Issue
The sentence `ss028` in Lesson 7 is currently "നാളെ പോയി" (naale poyi). This translates literally to "went tomorrow," which is grammatically impossible and confusing for an 8-year-old learner.

## 2. The Correction
We will update the sentence to use the future/permissive tense: **നാളെ പോകാം** (naale pookam - "can go tomorrow" / "will go tomorrow").

**Affected Items in `seed-100.json`:**
1.  **w051 (The Verb):**
    - Change from: പോയി (poyi)
    - Change to: പോകാം (pookam)
    - Split: `["പ", "ോ", "ക", "ാ", "ം"]`
2.  **ss028 (The Sentence):**
    - Change Malayalam text to: നാളെ പോകാം
    - Change English translation to: We will go tomorrow.
    - Change phonetic to: naale pookam
    - Change sentenceParts to: `["നാളെ", "പോകാം"]`

## 3. Prerequisite Traces & Verification
- `പ` (pa), `ോ` (oo mathra), `ക` (ka), `ാ` (aa mathra), and `ം` (am) are all characters that have been explicitly traced in Lesson 7 or earlier lessons.
- The 3-Act gating (`c007_a3`) will be verified to ensure `w051` remains a prerequisite for the sentence scrambler.

## 4. Implementation Steps
1. Apply the replacement to `w051` and `ss028` in `seed-100.json`.
2. Run `node seeder.js` to update the local MongoDB.
3. Run `npm test integrity.test.js` to confirm the new splits and prerequisites are valid.
