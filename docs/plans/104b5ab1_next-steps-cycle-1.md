# Next Steps: Cycle 1 Completion (Lessons 4-10)

## 🏁 Immediate Action Items
To be performed at the start of the next session:
1. **JSON Data Generation:** Create the actual dictionary objects for Lessons 4-10 in `server/data/seed-100.json` following the approved 80-word curriculum.
2. **Character Split Audit:** Ensure all new words in Lessons 4-10 have accurate `requiredCharacters` arrays (following the phonetic word splitting protocol).
3. **Database Re-Seeding:** Run `node seeder.js` in the `/server` directory to ingest the new curriculum.
4. **Lesson Sequence Verification:** Perform a dry run of Lesson 4 to verify that the 3-Act gating (Concept -> Games) works with the newly added data.

## 📚 Curriculum Reference (Approved)
| Lesson | Question | Answer Category | Key Words |
| :--- | :--- | :--- | :--- |
| **L4** | ആര്? (Who) | Kinship | സുഹൃത്ത്, അനിയൻ, അനിയത്തി, മുത്തശ്ശി... |
| **L5** | എന്ത്? (What) | Environment | പാല്, പുലി, മാൻ, പൂച്ച, കിളി... |
| **L6** | എവിടെ? (Where) | Locations | കട, കാട്, വഴി, സ്കൂൾ, കുന്നിൻ... |
| **L7** | എപ്പോൾ? (When) | Time | ഇന്ന്, നാളെ, പകൽ, രാത്രി, സമയം... |
| **L8** | എങ്ങനെ? (How) | Feelings/State | നല്ല, സന്തോഷം, വിഷമം, പുതിയ, പഴയ... |
| **L9** | ഏത്? (Which) | Properties | വലിയ, ചെറിയ, കറുത്ത, ചുവന്ന, നീല... |
| **L10** | എത്ര? (How many)| Quantity | ഒത്തിരി, കുറച്ച്, എല്ലാം, ഒന്ന്, രണ്ട്... |

## 🛠️ TDD Checklist for Next Phase
- [ ] **Data Integrity:** Verify no `wordId` collisions in `seed-100.json`.
- [ ] **Phonetic Accuracy:** Check that mathras are correctly detached in `requiredCharacters` for all 55 new words.
- [ ] **Gating Test:** Ensure `c004_a1` correctly locks Lesson 4 until Lesson 3 is mastered (or in replay mode).
- [ ] **UI Contrast:** Verify that the new "Which?" color words display correctly in the high-contrast feedback overlays.
