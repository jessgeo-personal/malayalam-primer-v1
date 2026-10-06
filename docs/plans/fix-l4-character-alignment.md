# Bug Fix Plan: Lesson 4 Character Standardization & Trace Alignment

## Objective
Correct the visual representation of the 'nta' conjunct and ensure all characters used in Lesson 4 sentences are explicitly taught in the tracing phase of that lesson.

## 1. Character Standardization
- **Task:** Replace all instances of the standard conjunct `ന്റ` with the Chillu-N form `ൻ്റ` in `server/data/seed-100.json`.
- **Reason:** User feedback identifies `ൻ്റ` as the correct visual form for the target learner.
- **Affected Items:** `t014`, `m014`, `w006` (Lesson 2), `ss011` (Lesson 4), and various sentence parts.

## 2. Pedagogical Alignment (Lesson 4)
- **Task:** Add `എ` (e) and `ൻ്റ` (nta) to the Lesson 4 Act 1 Traces.
- **Reason:** Even though they were introduced in Lesson 2, they are critical for the interrogative context in Lesson 4 ("My friend"). Adding them ensures Lesson 4 is self-contained for these specific characters.
- **New IDs:** `t039`, `m039` (എ), `t040`, `m040` (ൻ്റ). *Note: Subsequent IDs will be incremented.*

## 3. Spelling Verification
- **Word:** `സുഹൃത്ത്` (su-hru-tth-u).
- **Check:** Ensure the word used in `ss011` is `സുഹൃത്ത്` and its split is `["സ", "ു", "ഹ", "ൃ", "ത്ത", "്"]`.
- **Note:** The user mentioned "suhurthu", but the correct dictionary word is `സുഹൃത്ത്`. I will verify the rendering.

## 4. Implementation Steps
1.  **Draft JSON Fix:** Update `seed-100.json` with standard `ൻ്റ` and added L4 traces.
2.  **Integrity Check:** Run the new orphan check to ensure `ൻ്റ` is traced before it is used in words.
3.  **Audit Tool Scan:** Verify the split join in the UI Audit Dictionary.

## 5. Regression Testing
- **L2 Verification:** Ensure Lesson 2 still works with the new `ൻ്റ` character.
- **L4 Flow:** Play through Lesson 4 to confirm the new traces appear before the sentences.
