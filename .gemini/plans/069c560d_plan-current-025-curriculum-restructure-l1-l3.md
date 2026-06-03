# Plan: Curriculum Restructure (Lessons 1-3) & Early Sentence Building

## Objective
To restructure the beginning of Cycle 1 (Lessons 1-3) so that the user learns functional vocabulary and basic sentence construction (`scramble` exercises) from Day 1. We will introduce specific nouns, pronouns, and anchor verbs incrementally, ensuring every lesson follows a strict **Alphabets -> Words -> Sentences** pedagogical flow.

## 1. Pedagogical Realignment

### Lesson 1: Pointing, People & Animals
**Goal:** The user can point at things, identify their parents, and learn a fun animal word.
- **Alphabets (Trace & Match):** 
  - ഇ (I), ത (Tha)
  - അ (A), മ (Ma), ച (Cha)
  - ആ (Aa), ന (Na), ൻ (n chillu)
- **Words (Build):** 
  - ഇത് (This)
  - അത് (That)
  - അമ്മ (Mother)
  - അച്ചൻ (Father)
  - ആന (Elephant)
- **Sentences (Scramble):**
  - `[ഇത്] [അമ്മ]` (This is mother - colloquial)
  - `[അത്] [അച്ചൻ]` (That is father - colloquial)
  - `[ഇത്] [ആന]` (This is an elephant - colloquial)

### Lesson 2: Family & Belongings
**Goal:** The user can identify extended family members and state possession (My).
- **Alphabets (Trace & Match):** എ (E), ന്റ (Aspirated 'nta' cluster, no chandrabindu), വ (Va), ദ (Da), ക (Ka), ള (La)
- **Words (Build):**
  - എന്റെ (My)
  - വീട് (House)
  - ചേട്ടൻ (Older Brother)
  - ചേച്ചി (Older Sister)
  - മകൻ (Son)
  - മകൾ (Daughter)
- **Sentences (Scramble):**
  - `[ഇത്] [എന്റെ] [വീട്]` (This is my house)
  - `[അത്] [എന്റെ] [ചേട്ടൻ]` (That is my older brother)

### Lesson 3: The Anchor Verbs (Is / Exists)
**Goal:** The user can formally state identity and existence (introducing the SOV rule where anchors go at the end).
- **Alphabets (Trace & Match):** ആ (Aa - *Revision*), ണ (Na), ഉ (U), ണ്ട (Nda), ല (La)
- **Words (Build):**
  - ആണ് (Is)
  - അല്ല (Is not)
  - ഉണ്ട് (Exists/Is here)
  - ഇല്ല (Does not exist/Is not here)
- **Sentences (Scramble):**
  - `[ഇത്] [അമ്മ] [ആണ്]` (This is mother - formal)
  - `[അത്] [എന്റെ] [വീട്] [അല്ല]` (That is not my house)
  - `[അച്ചൻ] [ഉണ്ട്]` (Father is here)
  - `[ചേച്ചി] [ഇല്ല]` (Sister is not here)

## 2. Dictionary Implementation (seed-100.json)
This requires a significant reshuffling of `seed-100.json`.
1.  **Extract & Re-assign:** Pull the requested vocabulary words (and their prerequisite alphabets) from later lessons and assign them to `lessonId: 1`, `2`, and `3`. Ensure `ന` and `ആ` are explicitly taught in Lesson 1 before `ൻ`.
2.  **Add New Words:** Create new `WordItem` entries for missing words like `എന്റെ` (My), `ചേട്ടൻ`, `ചേച്ചി`, `മകൻ`, `മകൾ`. Ensure accurate grapheme splitting for `requiredCharacters` (e.g., explicitly using the `ന്റ` character cluster).
3.  **Inject Scrambles:** Add the 9 specific `scramble` sentences listed above to their respective lessons.
4.  **Prerequisite Linking:** Ensure every `build` word lists its component `match` characters as prerequisites, and every `scramble` sentence lists its component `build` words as prerequisites (or a preceding `concept` screen).

## 3. Mechanical Considerations
- **Sentence Scrambler UI:** The scrambles introduced in Lessons 1-3 will utilize the newly refined `SentenceScrambler.jsx` (Tap Variant). 
- **Concept Screens:** Add a `concept` screen at the start of Lesson 3 specifically teaching the rule: "The 'IS' or 'EXISTS' word always goes at the VERY END."

## 4. Regression & Integrity
- **Database Bounds:** Update `integrity.test.js` to ensure the curriculum shifts do not violate the Cycle boundaries.
- **Lesson Capacity:** Ensure Lessons 1-3 maintain a healthy item count given the influx of new alphabets, words, and sentences.
- **Cycle 1 Review:** Existing Lessons 4-9 will need a quick audit in a later phase to ensure they aren't left sparse due to vocabulary being pulled forward to L1-L3.

## 5. Documentation Updates
**Proposed update to `GEMINI.md` and `ProductBrief-TechnicalArchitecture-v1.md`:**
- **Update Section 2.2 / Part B (Cycle 1 Logic):** Redefine the Cycle 1 "Fact & Identity" loop to explicitly state that basic 2-word sentence building begins immediately in Lesson 1 (including fun vocabulary like `ആന`), and formal SOV anchoring (ആണ്/ഉണ്ട്) is introduced in Lesson 3.