# Implementation Plan: Cycle 1 High-Density Expansion (Interrogative Focus - RECOVERED)

## Objective
Implement Lessons 4-10 of Cycle 1 using the recovered "Interrogative Focus" structure. Each lesson sequentially introduces a core question (Who, What, Where, etc.) with at least 8 words and 2-3 sentences, ensuring functional conversation skills.

## Scope & Impact
- **Documentation Migration:** Copy all historical plans from `tmp/**/plans/*.md` to `.gemini/plans/`.
- **Data Expansion:** Add ~70 new items to `server/data/seed-100.json`.
- **Verification:** Enhance `WordAudit.jsx` to audit prerequisites and splits.

## 1. Recovered & Expanded Curriculum Map (Lessons 4-10)

### Lesson 4: WHO? (ആര്? - aaru) - People & Kinship
- **Words (8):** ആര് (Who), സുഹൃത്ത് (Friend), അനിയൻ (Younger brother), അനിയത്തി (Younger sister), മുത്തശ്ശി (Grandmother), മുത്തശ്ശൻ (Grandfather), ചേട്ടൻ (Elder brother), ചേച്ചി (Elder sister).
- **Traces:** ഹൃ, ത്ത, നി, യ, ശ്ശി, ശ്ശ, ട്ട, ച്ച.
- **Sentences (2):** അത് ആര്? എന്റെ സുഹൃത്ത്.

### Lesson 5: WHAT? (എന്ത്? - enthu) - Objects & Environment
- **Words (8):** എന്ത് (What), പാല് (Milk), പുലി (Tiger), മാൻ (Deer), പൂച്ച (Cat), കിളി (Bird), പൂവ് (Flower), ഇല (Leaf).
- **Traces:** ന്ത, പ, ാ, ല, ി, മ, ാ, ന, പ, ൂ, ച, ച്ച, ക, ി, ള, ി, പ, ൂ, വ, ി, ല.
- **Sentences (2):** അത് എന്ത്? പൂച്ച വന്നു.

### Lesson 6: WHERE? (എവിടെ? - evide) - Locations & Places
- **Words (8):** എവിടെ (Where), കട (Shop), കാട് (Forest), വഴി (Road), സ്കൂൾ (School), കുന്നിൻ (Hill), മുകളിൽ (On top), താഴെ (Below).
- **Traces:** വ, ി, ട, െ, ക, ഡ, ക, ാ, ഡ, വ, ഴ, ി, സ, കൂ, ള, ക, ു, ന്ന, ി, ന, മ, ു, ക, ള, ി, ല, ത, ാ, ഴ, െ.
- **Sentences (2):** സ്കൂൾ എവിടെ? അവൻ കാട്ടിൽ.

### Lesson 7: WHEN? (എപ്പോൾ? - eppol) - Time & Sequence
- **Words (8):** എപ്പോൾ (When), ഇന്ന് (Today), നാളെ (Tomorrow), ഇന്നലെ (Yesterday), പകൽ (Day), രാത്രി (Night), സമയം (Time), ഇപ്പോൾ (Now).
- **Traces:** പ, ോ, ള, ി, ന, ്ന, ന, ാ, ള, െ, ന, ്ന, ല, െ, പ, ക, ല, ര, ാ, ത, ്റ, ി, സ, മ, യ, ം, ഇ, പ, ്പ, ൊ.
- **Sentences (2):** അമ്മ എപ്പോൾ വന്നു? ഇന്ന് പോയി.

### Lesson 8: HOW? (എങ്ങനെ? - engane) - Feelings & State
- **Words (8):** എങ്ങനെ (How), നല്ല (Good), സന്തോഷം (Happy), വിഷമം (Sad), പുതിയ (New), പഴയ (Old), സുഖം (Fine), ചീത്ത (Bad).
- **Traces:** ങ, ന, െ, ന, ല്ല, സ, ന്ത, ോ, ഷ, ം, വ, ി, ഷ, മ, ം, പ, ു, ത, ി, യ, പ, ഴ, യ, സ, ു, ഖ, ം, ച, ീ, ത, ്ത.
- **Sentences (2):** എങ്ങനെ ഉണ്ട്? സന്തോഷം ഉണ്ട്.

### Lesson 9: WHICH? (ഏത്? - ethu) - Properties & Colors
- **Words (8):** ഏത് (Which), വലിയ (Big), ചെറിയ (Small), കറുത്ത (Black), ചുവന്ന (Red), നീല (Blue), പച്ച (Green), വെള്ള (White).
- **Traces:** ഏ, ത, ്, വ, ല, ി, യ, ച, െ, റ, ി, യ, ക, റ, ു, ത്ത, ച, ു, വ, ന്ന, ന, ീ, ല, പ, ച്ച, വ, െ, ള്ള.
- **Sentences (2):** ഏത് പൂവ്? ചുവന്ന പൂവ്.

### Lesson 10: HOW MANY? (എത്ര? - ethra) - Quantity & Numbers
- **Words (8):** എത്ര (How many), ഒത്തിരി (Many), കുറച്ച് (A little), എല്ലാം (All), ഒന്ന് (One), രണ്ട് (Two), മൂന്ന് (Three), പത്ത് (Ten).
- **Traces:** ത, ്റ, ഒ, ത്ത, ി, ര, ി, ക, ു, റ, ച്ച, എ, ല്ല, ാ, ം, ഒ, ന്ന, ര, ണ്ട, മ, ൂ, ന്ന, പ, ത്ത.
- **Sentences (2):** എത്ര ഉണ്ട്? രണ്ട് കിളി.

## 2. Mandatory Documentation Cleanup
1. **Source:** `C:/Users/jessg/.gemini/tmp/malayalam-prime-v1/*/plans/*.md`
2. **Destination:** `D:/MyApps/malayalam-prime-v1/.gemini/plans/`
3. **Rule:** Use a shell command (once approved) to copy all historical plans to ensure no further loss of pedagogical designs.

## 3. Rollout Strategy
1. **JSON Generation:** Draft the 140+ objects (Traces, Matches, Builds, Scrambles) for all 7 lessons.
2. **Audit Enhancement:** Update `WordAudit.jsx` with the Prerequisite and Split Validator.
3. **Database Update:** Run `node seeder.js`.
4. **Validation:** Verify Adventure Map and perform a dry run of Lesson 4 (WHO?).

## 4. Verification & Testing
- **100% Grapheme Accuracy:** Every split must result in correctly assembled Malayalam text.
- **Prerequisite Integrity:** No word appears before its component characters are traced.
- **Zero Regression:** Lessons 1-3 remain fully functional.
