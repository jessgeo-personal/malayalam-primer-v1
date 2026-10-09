# Implementation Plan: Phase 1 - Documentation Consolidation & Audit Enhancement

## Objective
Establish a reliable "Ground Truth" for the Cycle 1 expansion by consolidating all historical context and upgrading the `WordAudit` tool to perform automated pedagogical verification.

## 1. Documentation Consolidation (The "No-Loss" Rule)
- **Task:** Mirror all implementation plans from temporary session directories into the project's permanent repository.
- **Source Paths:** `C:/Users/jessg/.gemini/tmp/malayalam-prime-v1/*/plans/*.md`
- **Destination Path:** `D:/MyApps/malayalam-prime-v1/.gemini/plans/`
- **Shell Commands:**
  ```powershell
  # Create directory if it doesn't exist
  mkdir -p .gemini/plans
  # Copy all files from nested tmp plan folders
  Get-ChildItem -Path "C:/Users/jessg/.gemini/tmp/malayalam-prime-v1/*/plans/*.md" | Copy-Item -Destination "D:/MyApps/malayalam-prime-v1/.gemini/plans/" -Force
  ```
- **Verification:** Confirm that the count of files in `.gemini/plans` matches the 124+ files found in the `tmp` search.

## 2. Word Audit Tool Enhancement (The "Zero-Error" Guard)
- **Component:** `client/src/components/ui/WordAudit.jsx`
- **Task:** Inject advanced verification logic into the `checkValidity` function and the rendering loop.

### 2.1 Prerequisite Trace Checker
- **Logic:** For every word where `lessonType === 'build'`, scan the full `words` array. 
- **Requirement:** Every character in `word.requiredCharacters` MUST exist as a `trace` item in a `lessonId` <= `word.lessonId`.
- **UI Feedback:** Display a 🔴 icon next to words with missing traces.

### 2.2 Atomic Split Visualizer
- **Logic:** Create a new column "Reconstructed String" that joins `requiredCharacters` and compares it to `malayalamText`.
- **Requirement:** `word.requiredCharacters.join('') === word.malayalamText`.
- **UI Feedback:** Highlight mismatches in bold red.

### 2.3 Sequence & Schema Validator
- **Checks:**
  - `lessonId` must be a positive integer.
  - `unlockCycle` must match the lesson's target phase (Cycle 1 = Lessons 1-10).
  - `wordId` must be unique across the entire dictionary.

## 3. TDD & Automated Testing
- **New Test File:** `client/src/tests/WordAudit.test.jsx`
- **Test Cases:**
  1. **Prerequisite Failure:** Assert that a build word "അമ്മ" flags an error if "മ്മ" trace is missing from previous lessons.
  2. **Split Mismatch:** Assert that if `requiredCharacters` is `["അ", "മ"]` but text is `അമ്മ`, it flags a "Join Mismatch" error.
  3. **Empty Data:** Assert the component handles `null` or `undefined` arrays without crashing.

## 4. Guardrails & Regression
- **Zero-Seeding Rule:** No new data will be added to `seed-100.json` until this tool is 100% green and verified.
- **Visual Consistency:** The UI must maintain the "Soft Premium Neo-Bento" look with high-contrast obsidian text.

## 5. Verification Checklist
- [ ] All 124 historical plans moved to `.gemini/plans`.
- [ ] `WordAudit.jsx` enhanced with new logic.
- [ ] `npm test` in `/client` passes with new audit tests.
- [ ] Manual check of the Audit Tool shows 0 errors for Lessons 1-3.
