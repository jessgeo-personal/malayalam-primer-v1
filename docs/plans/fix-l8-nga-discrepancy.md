# Plan: Fix Lesson 8 Trace Discrepancy (nga -> nnga)

## Diagnosis
The user correctly identified that the trace for "nga" (`ങ`) in Lesson 8 does not visually match its appearance in the word "engane" (`എങ്ങനെ`). This is because the word uses the doubled conjunct "nnga" (`ങ്ങ`). The current seed data teaches `ങ` (t057) and `്ങ` (t061) as separate traces, which is confusing for a child.

## Objective
Consolidate the "nga" tracing items into a single, visually accurate "nnga" (`ങ്ങ`) conjunct trace.

## Proposed Changes

### 1. Update `server/data/seed-100.json`
- **Consolidate Traces:** 
    - Update `t057` (malayalamText: `ങ`) to `ങ്ങ`.
    - Update `m057` (malayalamText: `ങ`) to `ങ്ങ`.
    - Change `englishTranslation` and `phonetic` labels from "nga" to "nnga".
- **Remove Redundant Fragments:**
    - Delete `t061` (`്ങ`) and `m061` (`്ങ`).
- **Update Lesson Gating:**
    - Remove `m061` from the `prerequisites` array of `c008_a2`.
- **Update Word Building:**
    - Update `w053` (`എങ്ങനെ`) `requiredCharacters` from `["എ", "ങ", "്ങ", "ന", "െ"]` to `["എ", "ങ്ങ", "ന", "െ"]`.

### 2. Synchronization
- Run `node seeder.js` to update the MongoDB database.

## Verification Plan

### Automated Tests
- Run `npm test` in the `/server` directory. The `integrity.test.js` should pass, confirming that:
    - No characters in `w053` are orphaned (all are traced in Act 1).
    - The lesson sequence and prerequisites are consistent.

### Manual Verification
- Start the application.
- Navigate to Lesson 8.
- Verify that Act 1 shows the `ങ്ങ` (nnga) trace.
- Verify that Act 2 (`എങ്ങനെ`) uses the `ങ്ങ` tile and that it matches the example word visually.
