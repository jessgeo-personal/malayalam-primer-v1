# Plan: Full Data Normalization

## Objective
Purge the existing database and strictly reorganize all JSON seed data to ensure `unlockCycle` and `lessonId` bounds never overlap, and map rendering is flawless. Also, update the UI contrast for locked map nodes.

## Strategy
1. **The Great Realignment:** We will update `seed-100.json`, `seed-200.json`, and `seed-300.json` so that they follow a strict, unified sequence.
   - Cycle 1 (Foundation): Lessons 1 - 9
   - Cycle 2 (Grammar): Lessons 10 - 15
   - Cycle 3 (Sentence Basics): Lessons 16 - 20
   - Cycle 4 (Fluency): Lessons 21+
2. **Data Cleansing:** For every word in the JSON files, its `lessonId` will explicitly dictate its `unlockCycle` according to the bounds above.
3. **Database Purge & Re-ingest:** The database will be wiped and seeded fresh with the aligned files. We will reset Learner 3 to exactly Lesson 10 so we can test safely.
4. **UI Fix:** `AdventureMap.jsx` will be updated to give locked nodes high contrast (`opacity-50 grayscale` instead of rendering them invisible in colored backgrounds).
5. **Testing:** A new database integrity test will be added.

## Execution
I will write a script to rewrite the JSON seed files to match this strict bound, update the UI CSS, and reset the environment for testing.