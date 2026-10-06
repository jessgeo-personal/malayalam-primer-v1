# Plan: Refactor Alphabet Shortcuts

## Objective
Address the user's feedback from the Alphabet Audit tool by breaking down or correcting several alphabet components that act as pedagogical shortcuts. We must ensure absolute phonetic atomicity for all characters taught.

## Targeted Fixes (`seed-100.json`)

### 1. `t037` / `m037` (y)
- **Issue:** Currently displays `യ്` (with chandrakkala). The user requested `യ` ('ya' without chandrakkala).
- **Action:** Update `malayalamText` to `യ`, `englishTranslation` to `Ya`, and `phonetic` to `ya`.

### 2. `t042` / `m042` (unna)
- **Issue:** Currently displays `ുന്ന` (a shortcut combining `ു` mathra and `ന്ന` conjunct).
- **Action:** Update `malayalamText` to `ന്ന`, `englishTranslation` to `nna`, and `phonetic` to `nna`.

### 3. `t044` / `m044` (Taa)
- **Issue:** Currently displays `ടാ` (a shortcut combining `ട` and `ാ` mathra).
- **Action:** Delete `t044` and `m044` entirely, as both `ട` (t021) and `ാ` (t004) already exist in the curriculum, making this combination redundant.

### 4. `t051` / `m051` (skoo)
- **Issue:** The old `്കൂ` shortcut block. 
- **Action:** Delete `t051` and `m051` entirely, as we are replacing this logic with the explicit `സ്ക` conjunct.

### 5. `t067` / `m067` (SKoo -> SKa) & New `t068` (oo)
- **Issue:** `t067`/`m067` currently display `സ്കൂ` (skoo). The user requested they be split into `സ്ക` (ska) and `ൂ` (oo).
- **Action:** 
  - Update `t067`/`m067` to display `സ്ക` with phonetic `ska`.
  - Create new `t068`/`m068` entries for the long `oo` mathra (`ൂ`).
  - Update `w035` (School) to use the new exact split: `["സ്ക", "ൂ", "ൾ"]` and update its prerequisites to `["m067", "m068", "m010"]`.

## Implementation Strategy
Since I am currently lacking shell execution tools, I will request to exit Plan Mode. Once in execution mode, I will use a Node.js script to parse, modify, and rewrite `server/data/seed-100.json` with precision, and then run `node seeder.js` to sync the database.

## Verification
- Load the "DATABASE AUDIT" page.
- Switch to the "Alphabets & Mathras" tab.
- Confirm `t037` shows `യ`, `t042` shows `ന്ന`, `t067` shows `സ്ക`, and `t068` shows `ൂ`.
- Confirm `t044` and `t051` are completely gone.
- Switch to the "Word Assembly" tab and confirm `w035` (സ്കൂൾ) split reads exactly `["സ്ക", "ൂ", "ൾ"]`.