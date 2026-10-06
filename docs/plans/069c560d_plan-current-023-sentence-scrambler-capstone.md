# Plan: Milestone 2.4 - Sentence Scrambler (Cycle 1 Capstone)

## Objective
Implement the "Sentence Scrambler" mini-game as the Cycle 1 Capstone (Lesson 10). This game will test the user's ability to assemble full sentences using Subject-Object-Verb (SOV) word order, specifically ensuring they place the "Anchor" words (`ആണ്`, `അല്ല`, `ഉണ്ട്`, `ഇല്ല`) at the end of the sentence.

## Scope & Impact
- **New Lesson:** Adds "Lesson 10: Building Sentences" as the final Capstone for Cycle 1.
- **Data Shift:** Shifts the existing Cycle 2 lessons (currently 10-15) to 11-16 to maintain pedagogical continuity.
- **New Mini-Game Prototyping:** Introduces 3 variations of `SentenceScrambler` to the Prototype Lab for user testing.
- **Database Schema:** Adds `scramble` to `lessonType` enum and `sentenceParts` array to `WordItem` schema.

## Lesson Content (Lesson 10)

### 1. The Concept Screen (`c016`)
Before playing, the user will be presented with a rule summary.
*   **Title:** Building Sentences!
*   **English Translation:** "In Malayalam, the action or the 'IS' word always goes at the VERY END of the sentence!"
*   **Visual Examples:**
    *   `[ഇത്] [വീട്] [ആണ്]` -> Rule: 'ആണ്' (Is) at the end! (Identity)
    *   `[അമ്മ] [ഉണ്ട്]` -> Rule: 'ഉണ്ട്' (Exists) at the end! (Existence)

### 2. The Exercises (`lessonType: 'scramble'`)
The user will be presented with scrambled word tiles and must arrange them into the correct SOV order.
*   **Exercise 1 (Identity):** `ഇത്` + `അമ്മ` + `ആണ്` (This is mother.)
*   **Exercise 2 (Identity Negative):** `ഞാൻ` + `കുട്ടി` + `അല്ല` (I am not a child.)
*   **Exercise 3 (Existence):** `അമ്മ` + `ഉണ്ട്` (Mother is here.)
*   **Exercise 4 (Existence Negative):** `വീട്` + `ഇല്ല` (There is no house.)
*   **Exercise 5 (Adjective Modifier):** `അവൻ` + `നല്ല` + `കുട്ടി` + `ആണ്` (He is a good child.)

### 3. Dictionary Segments Utilized
*   **Bucket 1 (Pronouns):** ഇത് (This), ഞാൻ (I), അവൻ (He)
*   **Bucket 2 (Existence/Identity):** ആണ് (Is), അല്ല (Is not), ഉണ്ട് (Exists), ഇല്ല (Does not exist)
*   **Bucket 9 (Adjectives):** നല്ല (Good)
*   **Bucket 10/11 (Nouns):** അമ്മ (Mother), കുട്ടി (Child), വീട് (House)

## Implementation Steps

### Phase 1: Schema & Data Migration
1.  **Update `Word.js`:** Add `scramble` to the `lessonType` enum. Add a `sentenceParts` array of strings to the schema to hold the correct ordered words.
2.  **Shift Cycle 2 (`seed-200.json`):** Increment all `lessonId` values by +1 (Lesson 10 becomes 11, etc.). Ensure `unlockCycle` remains `2`.
3.  **Seed Capstone (`seed-100.json`):** Append the new Concept and 5 Scramble items under `lessonId: 10`, `unlockCycle: 1`.

### Phase 2: Frontend UI & Prototyping (The 3 Options)
We will build three distinct variations in `PrototypeLab.jsx` for testing tablet ergonomics and 8-year-old comprehension.

*   **Option A: The "Fridge Magnets" (Sortable List)**
    *   **Mechanic:** Words are presented in a single horizontal row. The user can drag and drop any word to any position to swap them.
    *   **Instruction:** "Drag the word tiles left or right to make a sentence. Press CHECK when you are done!"
    *   **Pros:** Maximum freedom; visually compact.
    *   **Cons:** Requires holding and dragging across other items, which can be slippery on tablets.

*   **Option B: The "Puzzle Box" (Slot-Filling)**
    *   **Mechanic:** Re-uses the `WordAssembly` logic. Empty target boxes at the top, scrambled word bank at the bottom. User drags words from bank to boxes.
    *   **Instruction:** "Drag the words from the bank into the empty boxes above. Put the 'IS' word in the very last box!"
    *   **Pros:** Highly structured; familiar to the user from the Letter Picker game.
    *   **Cons:** Takes up more vertical screen space.

*   **Option C: The "Tap-to-Build" (Duolingo Style)**
    *   **Mechanic:** No drag-and-drop. Scrambled words are presented as buttons. Tapping a word flies it up to the sentence line. Tapping it in the sentence line returns it to the bank.
    *   **Instruction:** "Tap the words in the right order to build the sentence. Tap the 'IS' word last!"
    *   **Pros:** Extremely fast and tactile for tablets; requires zero fine-motor dragging skills.
    *   **Cons:** Loses the physical "rearranging" feel.

### Phase 3: Audit Dictionary Integration
1.  **Update `WordAudit.jsx`:** 
    - Add `scramble` items to the `grammarItems` tab list.
    - Enhance the table row UI to render the scrambled `sentenceParts` vs. the assembled `malayalamText` for easy visual verification of the database seed.

## Testing & Quality Assurance (Zero-Regression Mandate)

1. **Unit Testing (Frontend):**
   - Create tests for all 3 prototype variations ensuring state updates correctly based on interactions (drag, drop, tap).
   - Test that validation strictly requires an exact match with the `sentenceParts` array.
   
2. **Regression Testing (Backend Integrity):**
   - Update `integrity.test.js` to assert that Cycle 1 now ends at Lesson 10 (instead of 9), and Cycle 2 begins at Lesson 11 (instead of 10).
   - Ensure the recent cycle progression fix (`POST /api/session/lesson/complete`) correctly interprets the new boundary between Lesson 10 and 11 to unlock the Adventure Map.