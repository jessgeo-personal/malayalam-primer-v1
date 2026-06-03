# Plan: Refactor Verb Suffix Splits

## Objective
Remove the "shortcut" verb ending block `ുക` (uka) from the database entirely. It should not be taught as a single visual block. Instead, words ending in `ുക` must be split into their pedagogically correct phonetic components: the 'u' mathra (`ു`) and the base consonant 'ka' (`ക`). 

## Scope & Impact
This fix requires changes across multiple entries in `seed-100.json`:
1.  **Deletion**: Remove tracing item `t030` and matching item `m030` (the isolated `ുക` blocks).
2.  **Word Splits**: Update the `requiredCharacters` array for the following 8 verbs to split `"ുക"` into `"ു", "ക"`.
    *   w018 (പോകുക)
    *   w019 (കാണുക)
    *   w020 (കേൾക്കുക)
    *   w021 (ചെയ്യുക)
    *   w023 (കുടിക്കുക)
    *   w024 (കഴിക്കുക)
    *   w025 (ഉറങ്ങുക)
    *   w026 (എഴുന്നേൽക്കുക)
3.  **Prerequisites**: Update the `prerequisites` arrays for these words. Remove `m030` and ensure they include `m041` (u mathra) and `m026` (ka consonant).

## Implementation Steps
Because this requires modifying multiple specific nodes within a large JSON file, I will execute a temporary Node.js script to read, modify, and rewrite `server/data/seed-100.json`. This is significantly safer and cleaner than attempting 10+ manual string replacements.

### Script Logic:
1.  Load `seed-100.json`.
2.  Filter out items where `wordId === 't030' || wordId === 'm030'`.
3.  For all `lessonType: 'build'` words:
    *   If `requiredCharacters` includes `"ുക"`, find its index.
    *   Remove `"ുക"` and insert `"ു", "ക"` in its place.
    *   If `prerequisites` includes `"m030"`, remove it.
    *   Ensure `"m041"` and `"m026"` are present in `prerequisites`.
4.  Write the changes back to `seed-100.json`.

## Verification & Deployment
1.  Run `node seeder.js` to wipe and repopulate the MongoDB database.
2.  Navigate to the in-app "DATABASE AUDIT" page.
3.  Confirm that all 8 of the impacted verbs are now showing the correct split components (`ു`, `ക`) and that their status reads **"Valid"**.
4.  Ensure `uka` is no longer visible as a separate character anywhere in the curriculum.