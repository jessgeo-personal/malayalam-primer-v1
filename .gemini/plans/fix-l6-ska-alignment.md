# Bug Fix Plan: Lesson 6 'ska' Conjunct Alignment

## Objective
Align the word assembly for "സ്കൂൾ" (school) with the "സ്ക" (ska) conjunct, ensuring the student uses the specific ligature they traced.

## 1. Trace Item Addition
- **Task:** Add "സ്ക" (ska) as an explicit Trace and Match item in Lesson 6 Act 1.
- **Reason:** The child should recognize the "ska" cluster as a single unit when building words like "school".
- **IDs:** `t056`, `m056`.

## 2. Word Building Correction
- **Word:** സ്കൂൾ (w036)
- **Correction:** Update `requiredCharacters` from `["സ", "്", "ക", "ൂ", "ൾ"]` to `["സ്ക", "ൂ", "ൾ"]`.
- **Note:** This matches your feedback that "ska" should be treated as a recognizable unit.

## 3. Gating Update
- **Task:** Update `c006_a2` (Act 2 Intro) to include `m056` in its `prerequisites`.
- **Reason:** Ensures the student traces and matches "ska" before building "school".

## 4. Implementation Steps
1.  **Draft JSON Fix:** Add `t056`, `m056` to `seed-100.json`.
2.  **Update Word:** Change `w036` splitting.
3.  **Integrity Check:** Run the backend integrity suite to verify the new trace-word relationship.

## 5. Verification
- **Audit Tool:** Verify "സ്കൂൾ" has 3 tiles: `["സ്ക", "ൂ", "ൾ"]`.
- **Gameplay:** Confirm "ska" appears in the Tracing act and the Word Building act of Lesson 6.
