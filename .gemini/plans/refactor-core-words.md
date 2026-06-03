# Plan: Refactor Word Splits & Cycle 2 Explanation

## Objective
1. Correct the `requiredCharacters` arrays for specific words in Cycle 1 (`seed-100.json`) that contain typographical or phonetic errors, preventing them from assembling into the target `malayalamText`.
2. Provide a clear pedagogical explanation for the absence of `lessonType: "build"` words in Cycle 2.

## Part 1: Cycle 1 Word Corrections (`seed-100.json`)
I have analyzed the current splits and identified the specific errors:

*   **w013 (ഉണ്ട്)**: *Status: Already Fixed.* The missing Chandrakkala (`്`) was added in my previous update.
*   **w032 (എപ്പോൾ)**: 
    *   *Target:* എപ്പോൾ
    *   *Current Split:* `["എ", "പ്പ", "ൊ", "ൾ"]`
    *   *Error:* Uses the short 'o' mathra (`ൊ`) instead of the long 'o' mathra (`ോ`).
    *   *Fix:* Update array to `["എ", "പ്പ", "ോ", "ൾ"]`.
*   **w034 (വീട്)**: 
    *   *Target:* വീട്
    *   *Current Split:* `["വ", "ീ", "ഡ", "്"]`
    *   *Error:* Uses the aspirated Dda (`ഡ`) instead of the hard Ta/Da (`ട`).
    *   *Fix:* Update array to `["വ", "ീ", "ട", "്"]`.
*   **w035 (സ്കൂൾ)**: 
    *   *Target:* സ്കൂൾ
    *   *Current Split:* `["സ", "്കൂ", "ള"]`
    *   *Error:* `്കൂ` is an invalid standalone modifier block, and `ള` is a base consonant, not the chillu `ൾ`.
    *   *Fix:* Break into proper phonetic components: `["സ", "്", "ക", "ൂ", "ൾ"]`.
*   **w040 (ചെറിയ)**:
    *   *Target:* ചെറിയ
    *   *Current Split:* `["ച", "റ", "ി", "യ"]`
    *   *Error:* Missing the 'e' mathra (`െ`) for the first character.
    *   *Fix:* Update array to `["ച", "െ", "റ", "ി", "യ"]`.

**Action:** I will use the `replace` tool to apply these specific array corrections to `server/data/seed-100.json`, followed by running `node seeder.js` to update the database.

## Part 2: Explanation of Cycle 2 (The "Grammar Factory")
The user asked why there are no standard words (i.e., `lessonType: "build"`) listed for Cycle 2. 

As defined in the `development_roadmap.md` and `ProductBrief-TechnicalArchitecture-v1.md`, Phase 2 (Cycle 2) is titled **"The Grammar Factory"**. 
*   **Pedagogical Goal:** Cycle 1 taught the child how to build base words (nouns, verbs, pronouns) from letters. Cycle 2 shifts the focus entirely to **Grammatical Mutation**. It teaches the child how to take those base words and add suffixes to change their meaning (e.g., making words plural or indicating location).
*   **Game Mechanics:** Instead of the Word Assembly (`build`) game, Cycle 2 relies exclusively on the **Suffix Snapper** (`suffix`) mini-game and instructional **Concept Screens** (`concept`).
*   **Data Structure:** If you look inside `seed-200.json`, you will find 50 entries, but they all use `lessonType: "suffix"` or `lessonType: "concept"`. They use `baseWord` and `targetSuffix` keys rather than `requiredCharacters`.

Therefore, the lack of `build` words in Cycle 2 is not a gap or an error; it is the intentional design of the curriculum progression. Word building will resume in Cycle 3 to introduce new base vocabulary.