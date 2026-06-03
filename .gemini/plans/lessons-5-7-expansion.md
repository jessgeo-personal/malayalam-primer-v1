# Implementation Plan: Lessons 5-7 High-Density Expansion

## Objective
Increase the pedagogical density of Lessons 5, 6, and 7 by adding 3 additional sentences per lesson, along with the required supporting characters and words.

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
- **New Trace:** യിൽ (yil - locative suffix) - `t051`, `m051`
- **New Word:** കടയിൽ (kadail - in the shop) - `w049` (Split: ["ക", "ട", "യ", "ി", "ൽ"])
- **New Word:** അവിടെ (avide - there) - `w050` (Split: ["അ", "വ", "ി", "ട", "െ"])

## 3. Lesson 7: WHEN? (എപ്പോൾ?) - High Density
**New Sentences:**
- ss028: അനിയൻ ഇപ്പോൾ വന്നു (Younger brother came now)
- ss029: നാളെ പോയി (Went tomorrow)
- ss030: സമയം എന്ത്? (What is the time?)

**Supporting Data:**
- **New Word:** പോയി (poyi - went) - `w051` (Split: ["പ", "ോ", "യ", "ി"])

## 4. Technical Adjustments
- **ID Shifting:** Scramble IDs from L5 onwards will be shifted significantly to accommodate 3 new items per lesson.
- **Prerequisites:** Update `c005_a3`, `c006_a3`, and `c007_a3` to include the new sentence IDs.
- **TDD:** Add a specific test case for the "yil" (locative) suffix rendering in `integrity.test.js`.

## 5. Implementation Steps
1.  **Draft JSON:** Generate the objects for the new words (`w049-w051`) and traces (`t051`).
2.  **Insert Sentences:** Add the 9 new scramble objects (`ss017-ss019`, `ss023-ss025`, `ss028-ss030`).
3.  **Audit:** Run Audit Tool v2 to verify prerequisite timing (ensure `w049` is traced after `ൽ` is taught).
4.  **Seed:** Execute `node seeder.js`.

## 6. Verification Checklist
- [ ] 5 sentences per lesson for L4, L5, L6, L7.
- [ ] 100% split accuracy for "കടയിൽ" (locative form).
- [ ] Adventure Map remains functional with shifted IDs.
