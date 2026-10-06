# Implementation Plan: Cycle 1 High-Density Expansion (Lessons 4-10)

## Objective
Expand the Cycle 1 curriculum from 3 lessons to 10 lessons, incorporating 55+ new words and 15+ new sentences. This plan ensures a high-density learning experience (minimum 8 words per lesson) while maintaining strict pedagogical prerequisites and zero-regression safety.

## Scope & Impact
- **Data (`seed-100.json`):** Full payload for Lessons 4-10.
- **UI (`WordAudit.jsx`):** Enhanced verification tools for the user to audit splits and prerequisites.
- **Pedagogy:** Strict adherence to Trace -> Build -> Scramble sequence.

## 1. Proposed Curriculum Map (Cycle 1 Expansion)

### Lesson 4: Basic Actions & Movement
**Words (8):** പോയി (Went), വന്നു (Came), കണ്ടു (Saw), കേട്ടു (Heard), പറഞ്ഞു (Said), ചെയ്തു (Did), നടന്നു (Walked), ഓടി (Ran).
**Traces:** പ, യ, ോ, ക, ട, റ, ഞ, സ.
**Sentences (2):** അമ്മ വന്നു. അച്ചൻ പോയി.

### Lesson 5: Food, Water & Daily Life
**Words (8):** വെള്ളം (Water), ഭക്ഷണം (Food), പാല് (Milk), ചോറ് (Rice), കഴിച്ചു (Ate), കുടിച്ചു (Drank), ഉറങ്ങി (Slept), ചിരിച്ചു (Laughed).
**Traces:** ഷ, ം, പ, ല, ച, റ, ക, ി.
**Sentences (2):** വെള്ളം കുടിച്ചു. ഭക്ഷണം കഴിച്ചു.

### Lesson 6: Interrogatives (The "Wh" Questions)
**Words (8):** ആര് (Who), എന്ത് (What), എവിടെ (Where), എപ്പോൾ (When), എങ്ങനെ (How), ഏത് (Which), എത്ര (How many), വേണോ (? Want).
**Traces:** ര, വ, ട, ത, പ, റ, െ, എ.
**Sentences (2):** അത് എന്ത്? ആര് വന്നു?

### Lesson 7: Needs, Desires & Modals
**Words (8):** വേണം (Want), വേണ്ട (Don't want), മതി (Enough), അറിയാം (Know), അറിയില്ല (Don't know), തന്നു (Gave), എടുത്തു (Took), നോക്കി (Looked).
**Traces:** വ, േ, ണ, മ, ി, അ.
**Sentences (2):** വെള്ളം വേണം. അത് വേണ്ട.

### Lesson 8: Places, Pointers & Proximity
**Words (8):** സ്കൂൾ (School), കട (Shop), മുറി (Room), ഇവിടെ (Here), അവിടെ (There), ഉള്ളിൽ (Inside), പുറത്ത് (Outside), ദൂരെ (Far).
**Traces:** സ, കൂ, ഡ, മ, റ, വ, ത, പ.
**Sentences (2):** ഇത് സ്കൂൾ. അച്ചൻ അവിടെ.

### Lesson 9: Adjectives & Descriptions
**Words (8):** വലിയ (Big), ചെറിയ (Small), പുതിയ (New), പഴയ (Old), നല്ല (Good), ചീത്ത (Bad), കറുത്ത (Black), വെളുത്ത (White).
**Traces:** ല, യ, ച, റ, പ, ത.
**Sentences (2):** വലിയ ആന. നല്ല കുട്ടി.

### Lesson 10: Family & Review
**Words (8):** മകൻ (Son), മകൾ (Daughter), കുട്ടി (Child), ആൾ (Person), പേര് (Name), വീട് (House), നിലം (Floor), പന്ത് (Ball).
**Traces:** മ, ക, ൻ, ൾ, പ, ന, ല.
**Sentences (2):** എന്റെ മകൻ. അത് പന്ത്.

## 2. Technical Safeguards (Audit Tool Enhancement)
To allow the user to verify these details, the `WordAudit.jsx` will be updated to include:
- **Missing Trace Alert:** Flags words where `requiredCharacters` have not been traced in current or prior lessons.
- **Split Visualizer:** Displays the atomic tiles side-by-side with the final word for visual confirmation.
- **Sequence Validator:** Ensures `lessonId` and `unlockCycle` follow a linear progression.

## 3. Verification & Testing Strategy
- **Manual Audit:** Use the enhanced Word Audit tool to review all 70+ new items.
- **TDD Logic:** Run `npm test` in `/server` to ensure the `generateLessonPayload` correctly slices these high-density lessons into manageable gameplay bundles.
- **Regression:** Verify that replaying Lesson 1 still works perfectly and scores are bounded correctly.

## 4. Rollout Strategy
1. **Enhance Audit Tool:** Update UI to provide verification.
2. **Draft JSON Payload:** Prepare the 140+ JSON objects (Concepts + Traces + Matches + Builds + Scrambles).
3. **Seed & Sync:** Run `node seeder.js` and verify on the Adventure Map.
