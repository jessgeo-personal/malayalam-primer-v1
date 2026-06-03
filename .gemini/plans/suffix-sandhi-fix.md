# Implementation Plan: Sandhi (Spelling) Suffix Fixes

## 🎯 Objective
Make the locative ("IN/ON") suffixes more intuitive by ensuring the draggable tiles represent the *entire* phonetic addition when a base word undergoes complex Sandhi (spelling mutation). For example, changing the expected drop for `മരം` (tree) -> `മരത്തിൽ` (in the tree) from just `ിൽ` to `ത്തിൽ`.

## 📂 Key Files & Context
*   **Data Source:** `server/data/seed-200.json`
*   **Game Component:** `client/src/components/games/SuffixSnapper.jsx`

## 🛠️ Implementation Steps

### Phase 1: Database Seed Updates (`seed-200.json`)
We need to update the `morphedBase` and `targetSuffix` fields for words where the consonant doubles or changes when the case marker is applied.

1.  **Words ending in 'am' (ം -> ത്ത + ിൽ):**
    *   `s031` (മരത്തിൽ / On the tree): `baseWord: "മരം"`, `morphedBase: "മര"`, `targetSuffix: "ത്തിൽ"`. (Update distractors to include `ിൽ`).
    *   `s032` (പുസ്തകത്തിൽ / In the book): `baseWord: "പുസ്തകം"`, `morphedBase: "പുസ്തക"`, `targetSuffix: "ത്തിൽ"`.
2.  **Words ending in 'du' (ട് -> ട്ട + ിൽ):**
    *   `s029` (കാട്ടിൽ / In the forest): `baseWord: "കാട്"`, `morphedBase: "കാ"`, `targetSuffix: "ട്ടിൽ"`.
    *   `s030` (വീട്ടിൽ / In the house): `baseWord: "വീട്"`, `morphedBase: "വീ"`, `targetSuffix: "ട്ടിൽ"`.
    *   `s044` (വീട്ടിൽ - Lesson 14 Review): Same update as s030.
3.  **Concept Screen (`c013`):**
    *   Update the English explanation to reflect these phonetic variants: "To say something is 'in' or 'on', we add endings like -ിൽ (il), -യിൽ (yil), or -ത്തിൽ (thil) depending on the word. This is NOT a plural!"

### Phase 2: Feedback Logic Update (`SuffixSnapper.jsx`)
Update the `getFeedbackMessage` function to correctly identify the new locative suffixes:
*   *From:* `if (suffix === 'ിൽ' || suffix === 'യിൽ')`
*   *To:* `if (['ിൽ', 'യിൽ', 'ത്തിൽ', 'ട്ടിൽ'].includes(suffix))`
*   This ensures that dropping one of these new variants incorrectly on a different word still yields the correct "This means in/on" pedagogical feedback.

### Phase 3: TDD & Regression
*   Execute `node seeder.js` to ingest the new Sandhi mappings.
*   Run the test suite to ensure the database schema remains valid.

## 🧪 Verification Strategy
*   User will test Lesson 13 via the Prototype Lab or live app.
*   Verify that for the word `മരം`, the available suffix options clearly include `ത്തിൽ`, and dragging it correctly forms `മരത്തിൽ`.