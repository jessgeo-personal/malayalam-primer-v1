# Implementation Plan: Audit Dictionary Grammar Tab & Lesson 14 Fix

## 🎯 Objective
1. **Enhance Audit Dictionary:** Add a dedicated "Grammar & Mechanics" tab to `WordAudit.jsx` so that `suffix` (sXXX), `tense` (tmXXX), and `concept` (cXXX) words can be fully audited, displaying their base words, target suffixes, and morphed forms.
2. **Fix Lesson 14 Bug:** Correct the phonetic sandhi mapping for word `s040` (In the forest) in Lesson 14, changing `കാട്ട` + `ിൽ` to `കാ` + `ട്ടിൽ`.

## 📂 Key Files & Context
*   **Component:** `client/src/components/ui/WordAudit.jsx`
*   **Data Source:** `server/data/seed-200.json`

## 🛠️ Implementation Steps

### Phase 1: Update Audit Dictionary (`WordAudit.jsx`)
1.  **Add Tab State:** Add a third tab option `'grammar'` to the `activeTab` state.
2.  **Filter Logic:** Group words with `lessonType === 'suffix'`, `'tense'`, or `'concept'` into a new `grammarItems` array.
3.  **UI Updates:**
    *   Add a tab button for "Grammar & Mechanics".
    *   Create a new table for the `'grammar'` tab that displays:
        *   ID, Cycle/Lesson, Type (Concept/Suffix/Tense)
        *   Base Word (`baseWord`)
        *   Morph/Suffix Detail (e.g., shows `targetSuffix` and `morphedBase` for suffixes, or the past/present/future forms for tenses).
    *   Remove the old "Non-Build Grammar Items (Subtle)" footer section.

### Phase 2: Update Seed Data (`seed-200.json`)
1.  **Fix `s040`:** Change `morphedBase` to `"കാ"` and `targetSuffix` to `"ട്ടിൽ"`.

### Phase 3: Seeding & Verification
*   Run `node seeder.js` to update the database.
*   Verify the new "Grammar & Mechanics" tab appears in the Audit Dictionary and displays the `sXXX` and `tmXXX` items.
*   Verify `s040` shows the correct `ട്ടിൽ` suffix in the audit table.