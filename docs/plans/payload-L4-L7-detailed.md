# Detailed Implementation Plan: Phase 2A - Lessons 4-7 Expansion

## 🎯 Objective
Implement the data layer for Lessons 4, 5, 6, and 7. This phase introduces "Interrogative-Led" learning while ensuring total pedagogical continuity with Lessons 1-3.

## 1. Pedagogical Continuity & Overlap
To prevent learner confusion, this payload manages dependencies as follows:
- **L4 (Who):** Reuses `എന്റെ` (My) from L2 and `അത്` (That) from L1.
- **L5 (What):** Reuses `വന്നു` (Came) from L4 (introduced as a Trace there).
- **L6 (Where):** Reuses `അവൻ` (He) from L4.
- **L7 (When):** Reuses `അമ്മ` (Mother) from L1.

**Safety Check:** The `prerequisites` array for every new word will include the IDs of these earlier items to ensure the SRS engine and Gating logic don't serve them out of order.

## 2. 3-Act Structure & Context Screens
Each lesson will be gated by 3 specific `concept` items:

| Lesson | Act 1 Intro (Alphabets) | Act 2 Intro (Words) | Act 3 Intro (Sentences) |
| :--- | :--- | :--- | :--- |
| **L4: WHO?** | "Meet the Family: New letters for people." | "Building names for your family." | "Asking 'Who is that?'" |
| **L5: WHAT?** | "Nature Sounds: Letters for animals & plants." | "Naming things in the world." | "Identifying what things are." |
| **L6: WHERE?** | "Finding Places: Letters for locations." | "Building names for where we go." | "Asking 'Where is it?'" |
| **L7: WHEN?** | "Time Ticks: Letters for Day and Night." | "Building words for time." | "Asking 'When did they come?'" |

## 3. Atomic Split Audit (The "Ground Truth")
I will verify the following complex splits before seeding:
- **`ഹൃ` (hru):** `["ഹ", "ൃ"]` (Corrected from earlier cluster).
- **`സ്ക` (ska):** `["സ", "്", "ക"]` (Atomic breakdown for tracing).
- **`ന്റെ` (nte):** `["ന", "്", "റ", "െ"]` (Ensuring the 'e' mathra follows phonetically).
- **`ന്ന` (nna):** `["ന", "്", "ന"]` (Standard conjunct split).

## 4. TDD & Integrity Tests
I will add the following test cases to `server/tests/integrity.test.js`:
1.  **Orphan Check:** No `build` word uses a character that doesn't have a `trace` entry in `lessonId <= X`.
2.  **Continuity Check:** Lessons 4-7 must have exactly 1 `isSummary: true` concept screen at the start.
3.  **Unique ID Guard:** Confirm `w016-w048` are not already in use.

## 5. Regression Strategy
- **Map Verification:** Confirm Adventure Map bogeys 4, 5, 6, and 7 unlock correctly.
- **Scrambler Reset:** Verify that L4 sentences reset correctly on error (preventing the infinite loop issue found in earlier sessions).
- **Touch Target Audit:** Check `സ്കൂൾ` and `സുഹൃത്ത്` tiles for width on tablet (max 5 tiles per word).

## 6. Verification Steps
1.  **Run Audit Tool v2:** Perform a "Deep Scan" of the new Lesson 4-7 records.
2.  **Dry Run:** Manually play through Lesson 4 on the simulator to verify `c004_a1` -> Traces -> `c004_a2` -> Build -> `c004_a3` -> Scramble.
3.  **SRS Verify:** Check MongoDB `progress` collection to ensure L4 items are added with `weight: 10.0`.
