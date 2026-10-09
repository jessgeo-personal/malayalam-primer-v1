# Plan: Update Pedagogical Grapheme Splitting Rules

## Objective
Revise the core word-splitting protocol to explicitly detach dependent vowel signs from base consonants, reinforcing the child's understanding of how alphabets combine with sounds.

## Scope & Context
- `.gemini/docs/word_splitting_protocol.md`: Requires an update to Rule 1.
- `server/data/seed-100.json`: Requires adjustments for existing Cycle 1 words (specifically w002: നീ).

## Implementation Steps
1. **Protocol Update:** Modify `.gemini/docs/word_splitting_protocol.md` to strictly mandate separating dependent vowel signs (e.g., ാ, ി, ീ, ു, ൂ) from base consonants.
2. **Seed Data Correction:** Update `seed-100.json`:
   - Change w002 (നീ) from `["നീ"]` to `["ന", "ീ"]`.
   - Verify w001 (ഞാൻ), w003 (അവൻ), w004 (അവൾ), and w005 (അവർ) comply with the updated rules.
3. **Database Reseed:** Execute `node seeder.js` in the `/server` directory to propagate the changes to MongoDB.
4. **Documentation:** Increment the version in `client/src/config/version.js` and document the pedagogical shift in `.gemini/log/CHANGELOG.md`.

## Verification
- Run the development servers.
- Play the "Letter Picker" game and verify that the word "നീ" now presents two separate draggable tiles ("ന" and "ീ").