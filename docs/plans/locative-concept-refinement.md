# Implementation Plan: Locative Rule Breakdown (Lesson 13)

## 🎯 Objective
Provide a highly structured and pedagogical explanation of the locative ("IN/ON") rules in Lesson 13. The child must see exactly when each variant (`-ിൽ`, `-യിൽ`, `-ത്തിൽ`, `-ട്ടിൽ`) is used, which base letters are replaced, and why.

## 📂 Key Files & Context
*   **Data Source:** `server/data/seed-200.json` (Concept `c013`)
*   **Game Component:** `client/src/components/games/ConceptScreen.jsx`

## 🛠️ Implementation Steps

### Phase 1: Refining the Concept Screen Component
The current `ConceptScreen` only shows one "Base + Suffix = Result" animation. To meet the user's request for showing each case *separately*, I will update `ConceptScreen.jsx` to support an array of examples if provided in the word object.

1.  **Modify `ConceptScreen.jsx`:**
    *   If `word.examples` exists (an array of objects: `{ base, suffix, result, rule }`), render a scrollable or multi-step breakdown instead of the single static animation.
    *   Add a `currentExampleIndex` state to cycle through the different sandhi rules.

### Phase 2: Updating the Seed Data (`seed-200.json`)
I will transform `c013` from a single string into a structured pedagogical payload.

**The Rules to Teach:**
1.  **Rule 1 (Chillu):** `കടൽ + ിൽ = കടലിൽ`. (Simple addition).
2.  **Rule 2 (Vowels):** `വല + യിൽ = വലയിൽ`. (Use -യിൽ for words ending in A/I/E).
3.  **Rule 3 (The Circle):** `മരം + ത്തിൽ = മരത്തിൽ`. (Replace circle `ം` with `ത്ത`).
4.  **Rule 4 (The Hard 'T'):** `വീട് + ട്ടിൽ = വീട്ടിൽ`. (Replace `ട്` with `ട്ട`).

### Phase 3: Seeding & Verification
1.  Re-run `seeder.js`.
2.  Verify the new multi-step concept screen works in the app.

## 🧪 Verification Strategy
*   User will open Lesson 13.
*   Verify that they see four distinct examples of the "IN/ON" rule.
*   Verify that the "Why" (e.g., "Replace the circle") is displayed for each example.
*   Ensure the "GOT IT!" button only appears after all rules have been reviewed.