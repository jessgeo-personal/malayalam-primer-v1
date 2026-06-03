# Plan: Morphing Stems for Suffix Snapper

## Objective
Update the database schema and Suffix Snapper component to visually support Malayalam morphological changes (Sandhi), such as the transformation of "വീട്" (House) into "വീടു" when the suffix "കൾ" is added.

## Assumptions
1. This is a critical pedagogical feature to teach correct Malayalam spelling without breaking the Drag-and-Drop mechanic.
2. We need a new field `morphedBase` in the `Word` schema to store the transformed stem.

## Steps
1. **Schema Update:** Edit `server/models/Word.js` to add `morphedBase: { type: String }`.
2. **Seed Data Update:** Edit `server/data/seed-200.json` to include `"morphedBase": "വീടു"` for the "Houses" puzzle (`s001`).
3. **Database Sync:** Run `normalize_data.js` and `seeder.js` to purge and refresh the database with the new field.
4. **UI Animation:** Update `client/src/components/games/SuffixSnapper.jsx`.
    * When a correct suffix is dropped, conditionally check for `word.morphedBase`.
    * If present, render the `morphedBase` instead of `baseWord`.
    * Add a brief Tailwind CSS animation (e.g., text color flash) to draw the user's eye to the changed character.
5. **Testing:** Run client and server tests to ensure no regressions.