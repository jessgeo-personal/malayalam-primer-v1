# Implementation Plan: Cycle 1 Expansion (Lessons 8-10)

## Objective
Finalize Cycle 1 by adding the remaining vocabulary covering States (How?), Properties (Which?), and Quantities (How Many?). Lesson 8 is already partially seeded; this plan focuses on completing Lessons 9 and 10 to reach the ~75-word milestone for Cycle 1.

## 1. Lesson 9: WHICH? (ഏത്?) - High Density
**Concept:** "Which one? Let's learn to describe things."
**Target Goal:** The user learns to attach adjectives to nouns.

**Traces & Matches (Act 1):**
- `t059` / `m059`: ഏ (Ae)
- `t060` / `m060`: റ (Ra)
- `t061` / `m061`: ള്ള (Lla)

**Build Words (Act 2):**
- `w061`: വലിയ `["വ", "ല", "ി", "യ"]` (Big)
- `w062`: ചെറിയ `["ച", "െ", "റ", "ി", "യ"]` (Small)
- `w063`: കറുത്ത `["ക", "റ", "ു", "ത്ത"]` (Black)
- `w064`: ചുവന്ന `["ച", "ു", "വ", "ന്ന"]` (Red)
- `w065`: നീല `["ന", "ീ", "ല"]` (Blue)
- `w066`: പച്ച `["പ", "ച്ച"]` (Green)
- `w067`: വെള്ള `["വ", "െ", "ള്ള"]` (White)
- `w068`: ഏത് `["ഏ", "ത", "്"]` (Which)

**Sentences (Act 3):**
- `ss035`: ഏത് പൂവ്? (Which flower?)
- `ss036`: ചുവന്ന പൂവ്. (Red flower.)
- `ss037`: വലിയ ആന. (Big elephant.)
- `ss038`: ചെറിയ കിളി. (Small bird.)
- `ss039`: പച്ച ഇല. (Green leaf.)

## 2. Lesson 10: HOW MANY? (എത്ര?) - High Density
**Concept:** "How many are there? Let's count!"
**Target Goal:** The user learns basic numbers and quantifiers.

**Traces & Matches (Act 1):**
- `t064` / `m064`: ഒ (O)

*(Note: "ണ", "ര", "്ര" have already been traced in previous lessons.)*

**Build Words (Act 2):**
- `w069`: എത്ര `["എ", "ത", "്ര"]` (How many)
- `w070`: ഒത്തിരി `["ഒ", "ത്ത", "ി", "ര", "ി"]` (A lot / Many)
- `w071`: കുറച്ച് `["ക", "ു", "റ", "ച്ച", "്"]` (A little / Few)
- `w072`: എല്ലാം `["എ", "ല്ല", "ാ", "ം"]` (All)
- `w073`: ഒന്ന് `["ഒ", "ന്ന", "്"]` (One)
- `w074`: രണ്ട് `["ര", "ണ്ട", "്"]` (Two)
- `w075`: മൂന്ന് `["മ", "ൂ", "ന്ന", "്"]` (Three)
- `w076`: പത്ത് `["പ", "ത്ത", "്"]` (Ten)
- `w077`: വേണം `["വ", "േ", "ണ", "ം"]` (Want)

**Sentences (Act 3):**
- `ss040`: എത്ര ഉണ്ട്? (How many are there?)
- `ss041`: രണ്ട് കിളി. (Two birds.)
- `ss042`: ഒത്തിരി പൂവ്. (Many flowers.)
- `ss043`: ഒന്ന് വേണം. (Want one.)
- `ss044`: പത്ത് വീട്. (Ten houses.)

## 3. Data Integrity & TDD Requirements
1. **Schema Check:** All items will correctly follow the `c00X_aX` prerequisite gating to maintain the 3-Act structure (Concept -> Trace -> Match -> Build -> Scramble).
2. **Grapheme Splitting:** The required characters adhere strictly to the phonetics-first strategy outlined in `word_splitting_protocol.md`.
3. **Orphan Validation:** Running `npm run test` in `/server` must pass the `integrity.test.js` to ensure no characters are used in Build mode without being traced in Act 1.
4. **Data Seeding:** Run `node seeder.js` to populate MongoDB with the newly structured JSON payload.

## 4. Implementation Steps
1. Append the JSON array for Lessons 9 and 10 to `server/data/seed-100.json`.
2. Run `npm test` inside `/server` to validate the sequence and catch orphaned characters.
3. Run `node seeder.js` to update the local database.
4. Start the frontend, navigate to Lessons 9 and 10 on the Adventure Map, and verify the UI rendering of the new clusters (`ള്ള`, `്ര`, `ച്ച`).