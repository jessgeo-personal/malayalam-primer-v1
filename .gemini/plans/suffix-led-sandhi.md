# Plan: Suffix-Led Sandhi Refactor

## Objective
Shift the pedagogical approach for morphological changes (Sandhi) in the Suffix Snapper game. Instead of the base word generating the linking vowel, the draggable suffix tile will carry the vowel mathra, and the base word will morph by stripping its terminal modifier.

## Rationale
This approach teaches the child that specific suffixes *cause* the grammatical change by bringing their own phonetic weight, rather than the base word changing arbitrarily. 

## Technical Steps
1. **Update Seed Data:** Modify `server/data/seed-200.json`.
   - Locate word `s001` ("Houses").
   - Change `morphedBase` from `"വീടു"` to `"വീട"`.
   - Change `targetSuffix` from `"കൾ"` to `"ുകൾ"`.
   - Update `distractorSuffixes` to match the new pattern (e.g., `["മാർ", "ിൽ"]`).
2. **Re-seed Database:** Run `node seeder.js` in the `/server` directory to update the local MongoDB instance with the new data patterns.
3. **Verification:** The frontend React component (`SuffixSnapper.jsx`) already supports `morphedBase`, so no UI code changes are required. We will verify that the tile renders the mathra correctly and the animation strips the tail off the base word.
