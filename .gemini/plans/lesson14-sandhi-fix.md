# Implementation Plan: Fix Lesson 14 Locative Review Bug

## 🎯 Objective
Fix the data mismatch for word `s040` ("കാട്ടിൽ" / In the forest) in Lesson 14. The recent locative phonetic sandhi update was applied to this word in Lesson 13 (`s029`) but was missed in the Lesson 14 review set. This causes the game to present the old phonetic split (`കാട്ട` + `ിൽ`) instead of the new intuitive split (`കാ` + `ട്ടിൽ`), confusing the user.

## 📂 Key Files & Context
*   **Data Source:** `server/data/seed-200.json` (Word `s040`)

## 🛠️ Implementation Steps

### Phase 1: Update Seed Data (`seed-200.json`)
Modify the `s040` payload to match the phonetic split established in Lesson 13:
1.  **Locate `s040`:** Find the entry for "In the forest" in Lesson 14.
2.  **Update Mappings:** 
    *   Change `morphedBase` from `"കാട്ട"` to `"കാ"`.
    *   Change `targetSuffix` from `"ിൽ"` to `"ട്ടിൽ"`.
3.  **Distractors:** The distractors `["മാർ", "ങ്ങൾ", "കൾ"]` are appropriate for a review lesson, so they can remain unchanged.

### Phase 2: Seeding & Regression
*   Run `node seeder.js` in the `/server` directory to refresh the MongoDB instance with the corrected mapping.
*   Run the backend test suite (`npm test`) to ensure schema integrity is maintained.

## 🧪 Verification Strategy
*   The user can then check the **Dictionary Audit** on the tablet.
*   Locate the entry for `s040` (kaattil) and verify that the `targetSuffix` is correctly listed as `ട്ടിൽ`.