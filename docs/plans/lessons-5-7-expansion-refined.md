# Implementation Plan: Lessons 5-7 High-Density Expansion (Refined)

## Objective
Increase the pedagogical density of Lessons 5, 6, and 7 to 5 sentences each. In Lesson 6, the locative concept 'in' (യിൽ) will be introduced as a 3-character phonetic extension (യ+ി+ൽ) to prepare for formal suffix rules in Cycle 2.

## 1. Lesson 5: WHAT? (എന്ത്?) - High Density
**New Sentences:**
- ss017: അത് പാല് (That is milk)
- ss018: ഇത് കിളി (This is a bird)
- ss019: ഇല വന്നു (Leaf came)

**Supporting Data:** 
- All words/characters already exist in L1-L5.

## 2. Lesson 6: WHERE? (എവിടെ?) - High Density
**New Sentences:**
- ss023: കട എവിടെ? (Where is the shop?)
- ss024: അച്ചൻ കടയിൽ (Father is in the shop)
- ss025: വീട് അവിടെ (House is there)

**Supporting Data:**
- **Character Extensions (Act 1):** 
    - t051: യ (ya), t052: ി (i), t053: ൽ (l) - *Already traced, but revisited for 'yil' context.*
- **New Words (Act 2):**
    - w049: കടയിൽ (in the shop) - Split: ["ക", "ട", "യ", "ി", "ൽ"]
    - w050: അവിടെ (there) - Split: ["അ", "വ", "ി", "ട", "െ"]

## 3. Lesson 7: WHEN? (എപ്പോൾ?) - High Density
**New Sentences:**
- ss028: അനിയൻ ഇപ്പോൾ വന്നു (Younger brother came now)
- ss029: നാളെ പോയി (Went tomorrow)
- ss030: സമയം എന്ത്? (What is the time?)

**Supporting Data:**
- **New Word (Act 2):**
    - w051: പോയി (went) - Split: ["പ", "ോ", "യ", "ി"]

## 4. Technical Adjustments
- **Cycle 2 Alignment:** The 3-character split for "യിൽ" ensures it is treated as a word assembly task, not a suffix game, keeping it distinct from Cycle 2's `SuffixSnapper`.
- **ID Shifting:** Scramble IDs shifted to `ss015-ss030`.
- **Gating:** Update Act 3 Concept screens to include new prerequisite IDs.

## 5. Implementation Steps
1.  **Draft JSON:** Generate objects for `w049-w051`.
2.  **Insert Sentences:** Add 9 new scramble objects with standardized IDs.
3.  **Audit:** Run Audit Tool v2 to verify 100% split accuracy.
4.  **Seed:** Execute `node seeder.js`.

## 6. Verification Checklist
- [ ] 5 sentences per lesson verified in Audit Dictionary.
- [ ] "കടയിൽ" assembles correctly with 5 tiles.
- [ ] All "nta" characters verified as "ൻ്റ".
