# Bug Fix Plan: Lesson 7 Idiomatic Grammar Corrections

## Objective
Correct grammatical and pedagogical errors in Lesson 7 to ensure the student learns natural, conversational Malayalam.

## 1. Tense Correction (Future Tense)
**The Issue:** The sentence `ss028` is "നാളെ പോയി" (went tomorrow), which is a tense mismatch.
**The Fix:** Update to **നാളെ പോകാം** (We will go tomorrow).
- **Update w051:**
    - Text: പോകാം (pookam)
    - Split: `["പ", "ോ", "ക", "ാ", "ം"]`
- **Update ss028:**
    - Text: നാളെ പോകാം
    - Parts: `["നാളെ", "പോകാം"]`

## 2. Idiomatic Correction (Asking the Time)
**The Issue:** The sentence `ss029` is "സമയം എന്ത്?" (samayam enthu), which is an unnatural literal translation of "What is the time?". The correct idiom uses "how much" (എത്ര) + "became" (ആയി).
**The Fix:** Update to **സമയം എത്രയായി?** (samayam ethrayaayi).
- **Update Sentence (ss029):**
    - Text: സമയം എത്രയായി?
    - Phonetic: samayam ethrayaayi
    - Parts: `["സമയം", "എത്രയായി?"]`
- **Update/Add Words:**
    - We currently use `എന്ത്` (w024) from Lesson 5. We must replace it with `എത്രയായി` (how much became).
    - Let's reuse `എത്ര` (w065), which is currently planned for Lesson 10. *Wait, moving `w065` forward to L7 breaks the sequence.*
    - Instead, we will introduce **എത്രയായി** directly in Lesson 7.
    - **Add w052:**
        - Text: എത്രയായി (ethrayaayi)
        - Split: `["എ", "ത", "്ര", "യ", "ാ", "യ", "ി"]`
        - Note: `ത`, `്ര`, `യ`, `ാ`, `ി` are all known by Lesson 7.
- **Update Gating:** Add `w052` to the prerequisites of `c007_a3`.

## 3. Implementation Steps
1. Apply the replacements for `w051`, `ss028`, and `ss029` in `seed-100.json`.
2. Insert `w052` (എത്രയായി) into the Act 2 list for Lesson 7.
3. Update `c007_a3` prerequisites to include `w052`.
4. Run `node seeder.js` and `npm test integrity.test.js`.

## 4. Verification
- Verify the atomic split for `എത്രയായി` via the Word Audit Tool.
- Confirm the sentences sound natural via the text-to-speech engine.
