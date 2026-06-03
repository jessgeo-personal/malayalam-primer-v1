# Implementation Plan: Locative Phonetic Sandhi Update

## 🎯 Objective
Update the phonetic splits for locative suffixes attached to chillu letters in Lesson 13. The goal is to make the draggable suffix tiles represent the full phonetic chunk that is added/modified, rather than just the mathra (vowel sign).

For example, changing `കടൽ + ിൽ = കടലിൽ` to `കട + ലിൽ = കടലിൽ`. This is far more intuitive for a child learning to read.

## 📂 Key Files & Context
*   **Data Source:** `server/data/seed-200.json` (Lesson 13 items)
*   **Game Component:** `client/src/components/games/SuffixSnapper.jsx`

## 🛠️ Implementation Steps

### Phase 1: Database Seed Updates (`seed-200.json`)
We need to update the `morphedBase` and `targetSuffix` fields for words ending in chillu letters when the locative case is applied.

1.  **കടലിൽ (kadalil - In the sea) [s028, s036]:**
    *   *Current:* `morphedBase: "കടല"`, `targetSuffix: "ിൽ"`
    *   *New:* `morphedBase: "കട"`, `targetSuffix: "ലിൽ"`
    *   *Distractors:* Add `ിൽ`, `ത്തിൽ`.
2.  **Concept Screen (`c013`):**
    *   Update Example 1 in `examples` array:
        *   `base: "കടൽ"`
        *   `suffix: "ലിൽ"`
        *   `result: "കടലിൽ"`
        *   `rule: "RULE 1: Replace the chillu 'L' (ൽ) with -ലിൽ (lil)."`

### Phase 2: Feedback Logic Update (`SuffixSnapper.jsx`)
Update the `getFeedbackMessage` function to correctly identify these new, highly specific locative suffixes:
*   *From:* `if (['ിൽ', 'യിൽ', 'ത്തിൽ', 'ട്ടിൽ'].includes(suffix))`
*   *To:* `if (['ിൽ', 'യിൽ', 'ത്തിൽ', 'ട്ടിൽ', 'ലിൽ', 'രിൽ', 'ളിൽ', 'നിൽ'].includes(suffix))`
*   This ensures that dropping one of these new variants incorrectly on a different word still yields the "This means in/on" pedagogical feedback, rather than the generic fallback message.

### Phase 3: TDD & Regression
*   Execute `node seeder.js` to ingest the new phonetic mappings.
*   Run the test suite to ensure the database schema remains valid.

## 🧪 Verification Strategy
*   User will test Lesson 13 via the live app or Prototype Lab.
*   Verify that for the word `കടൽ` (Sea), the available suffix options clearly include `ലിൽ`, and dragging it correctly forms `കടലിൽ`.
*   Verify the Concept Screen for Lesson 13 explicitly teaches this specific letter replacement.