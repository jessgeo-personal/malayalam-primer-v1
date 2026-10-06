# Plan: Refactor Conjuncts & Shortcuts

## Objective
Address the pedagogical feedback regarding specific conjuncts and mathra shortcuts in the Cycle 1 vocabulary (`seed-100.json`). We need to introduce two new specific alphabet/conjunct blocks (`യ്യ` and `സ്കൂ`) to the tracing/matching curriculum, and eliminate a shortcut block (`ുന്ന`).

## Data Issues & Fixes

### 1. `w021` (ചെയ്യുക / Do)
*   **Current Split:** `["ച", "െ", "യ്", "യ", "ു", "ക"]`
*   **Issue:** The user requested that the double-Ya conjunct (`യ്യ`) be taught as a single phonetic block, rather than explicitly dragging `യ്` and `യ`.
*   **Action:** 
    *   Create new `trace` and `match` entries for `യ്യ` (e.g., `t066` and `m066`).
    *   Update `w021` `requiredCharacters` to `["ച", "െ", "യ്യ", "ു", "ക"]`.
    *   Update `w021` `prerequisites` to depend on `m066` instead of whatever represented `യ്`/`യ`.

### 2. `w026` (എഴുന്നേൽക്കുക / Wake up)
*   **Current Split:** `["എ", "ഴ", "ുന്ന", "േ", "ൽ", "ക്ക", "ു", "ക"]`
*   **Issue:** `ുന്ന` is a shortcut block consisting of the 'u' mathra (`ു`) and the double-Na conjunct (`ന്ന`). This violates our atomic phonetic rules.
*   **Action:**
    *   Update `w026` `requiredCharacters` to `["എ", "ഴ", "ു", "ന്ന", "േ", "ൽ", "ക്ക", "ു", "ക"]`.
    *   *Note:* Ensure `m042` (ന്ന) and `m041` (ു) are listed in the prerequisites for `w026`.

### 3. `w035` (സ്കൂൾ / School)
*   **Current Split:** `["സ", "്", "ക", "ൂ", "ൾ"]`
*   **Issue:** The user explicitly requested that the complex conjunct-mathra combination `സ്കൂ` (skoo) be introduced to the student as a single alphabet block.
*   **Action:**
    *   Create new `trace` and `match` entries for `സ്കൂ` (e.g., `t067` and `m067`).
    *   Update `w035` `requiredCharacters` to `["സ്കൂ", "ൾ"]`.
    *   Update `w035` `prerequisites` to depend on `m067`.

## Implementation Logic
I will write a Node.js script to read `seed-100.json`, safely inject the new trace/match entries (`t066`, `m066`, `t067`, `m067`) at the end of the letter sequence (before the words), and refactor the specific target words.

## Verification
- Run `node seeder.js`.
- Load the "DATABASE AUDIT" page.
- Verify that `w021`, `w026`, and `w035` are listed as **Valid** with their new, exact required character arrays.