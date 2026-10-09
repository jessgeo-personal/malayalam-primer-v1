# Plan: Audit & Fix Word Splitting Data Errors

## Objective
Identify and fix words in the database (like "ഉണ്ട്") where the `requiredCharacters` array does not accurately construct the target `malayalamText`. This causes the Word Assembly game to be unwinnable. We will build an in-app audit tool to visualize these splits and apply the fixes to the raw seed data.

## Root Cause Analysis
The error with "ഉണ്ട്" occurred because the trailing Chandrakkala (`്`) was omitted from its `requiredCharacters` array in `seed-100.json`. The array contained `["ഉ", "ണ്ട"]`, which assembles into "ഉണ്ട" instead of "ഉണ്ട്". Because the assembled word did not match the target word, the validation logic failed every time.

## Implementation Steps

### 1. Build the Audit Prototype Page (`WordAudit.jsx`)
We will create a temporary UI component to visualize the data structure of every word.
- **Backend Route:** Add a `GET /api/words/audit` route in `server/routes/api.js` to return the full dictionary from MongoDB.
- **Frontend Component:** Create `client/src/components/ui/WordAudit.jsx`.
  - It will fetch the data and display a table.
  - Columns: `Word`, `Translation`, `Lesson Type`, `Required Characters Array`, `Assembled String`, and a `Status` flag.
  - Logic: It will dynamically join the `requiredCharacters` array and compare it strictly against `malayalamText`. If they do not match, it will flag the row in red as an **ERROR**.
- **Integration:** Temporarily add an "AUDIT DICTIONARY" button to `App.jsx` so you can view this page.

### 2. Run Audit & Fix Seed Data
Once the audit page is live, we will identify all broken words. 
- I will manually update `server/data/seed-100.json` (and `seed-200.json`, `seed-300.json` if necessary) to correct the `requiredCharacters` arrays for "ഉണ്ട്" and any other flagged words.
- *Fix for "ഉണ്ട്" (w013):* Update the array to `["ഉ", "ണ്ട", "്"]`.

### 3. Database Reseed
- Run `node seeder.js` in the backend to wipe the database and re-ingest the corrected JSON files.

## Verification
- Load the Word Audit prototype page in the browser and confirm 0 errors are flagged.
- Manually play Lesson 5 (or load "ഉണ്ട്" in Word Assembly) to verify that 3 slots are present and the word can be successfully completed.