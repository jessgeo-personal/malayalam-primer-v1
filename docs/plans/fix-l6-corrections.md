# Bug Fix Plan: Lesson 6 Corrections (Conjunct & Vocabulary)

## Objective
Correct two pedagogical issues in Lesson 6: Align the word assembly for "school" with the "സ്ക" (ska) conjunct, and correct the vocabulary word for "Hill" from "kunnin" to "kunnu".

## 1. Trace Item Addition ('ska')
- **Task:** Add "സ്ക" (ska) as an explicit Trace and Match item in Lesson 6 Act 1.
- **IDs:** `t056`, `m056`.

## 2. Word Building Correction ('school')
- **Word ID:** `w036` (സ്കൂൾ)
- **Correction:** Update `requiredCharacters` from `["സ", "്", "ക", "ൂ", "ൾ"]` to `["സ്ക", "ൂ", "ൾ"]`.
- **Gating Update:** Update `c006_a2` (Act 2 Intro) to include `m056` in its `prerequisites`.

## 3. Vocabulary Correction ('Hill')
- **Task:** Correct the word for "Hill" from the genitive form "കുന്നിൻ" to the nominative base form "കുന്ന്" (kunnu).
- **Word ID:** `w037`
- **Updates:**
    - `malayalamText`: "കുന്ന്" (kunnu)
    - `phonetic`: "kunnu"
    - `requiredCharacters`: `["ക", "ു", "ന്ന", "്"]`
- **Prerequisite Check:** `ന്ന` (nna) is already traced in Lesson 5, so no new traces are needed.

## 4. Implementation Steps
1.  **Draft JSON Fix:** Apply changes to `w036`, `w037`, `t056`, `m056`, and `c006_a2` in `seed-100.json`.
2.  **Integrity Check:** Run the backend integrity suite to verify the new trace-word relationship and unique IDs.

## 5. Verification
- **Audit Tool:** Verify "സ്കൂൾ" has 3 tiles: `["സ്ക", "ൂ", "ൾ"]`. Verify "കുന്ന്" has 4 tiles: `["ക", "ു", "ന്ന", "്"]`.
- **Vocabulary:** Check that "kunnin" is removed from the system.
