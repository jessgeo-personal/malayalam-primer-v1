# Implementation Plan: The Great Split (Cycle 2 & Beyond)

## 🎯 Objective
Execute the "Great Split" data normalization for the remaining vocabulary in `seed-300.json` (w201 - w300). These words currently have empty `requiredCharacters` arrays (`[]`), which will cause the "Word Assembly" mini-game to crash or display empty boxes when these words are introduced. This plan ensures pedagogical and technical integrity for all future cycles and establishes strict TDD guardrails.

## 📂 Key Files & Context
*   **Target Data File:** `server/data/seed-300.json`
*   **Protocol Document:** `.gemini/docs/word_splitting_protocol.md`
*   **Test Suite:** `server/tests/integrity.test.js`
*   **Seeder:** `server/seeder.js`

## 🛠️ Implementation Steps

### 1. Data Normalization (The Split)
*   Analyze `server/data/seed-300.json` for all items where `isSuffix: false` and `requiredCharacters` is empty (`[]`).
*   Generate the split arrays using the AI-assisted protocol defined in `word_splitting_protocol.md`.
*   Apply the pedagogical splitting rules:
    *   Detach dependent vowel signs (e.g., ാ, ി, ീ, ു, ൂ, െ, േ) from base consonants (e.g., പോയി -> `["പ", "ോ", "യ", "ി"]`).
    *   Maintain strict phonetic order (modifiers follow the consonant).
    *   Keep standalone conjunct consonants as a single unit unless they contain a mathra (e.g., വന്നു -> `["വ", "ന്ന", "ു"]`).
*   Update `seed-300.json` with the newly populated `requiredCharacters` arrays for all target words.

### 2. TDD Guardrails (Automated Verification)
*   **Update `server/tests/integrity.test.js`:** Add a new describe block titled `"Database Capacity & Integrity: The Great Split"`.
*   Write a unit test that validates the JSON seed data directly or queries the database after seeding.
*   **The Guardrail:** Assert that **every single word** (where `isSuffix: false`, `lessonType: 'build'`, or lacking `lessonType` but functioning as a core word) has a `requiredCharacters` array with `length > 0`.

### 3. Database Seeding & Regression
*   Execute `node seeder.js` in the `/server` directory to purge and re-ingest the data.
*   Verify that Mongoose schema validation passes during insertion.

## 🧪 Verification & Testing Strategy
*   **TDD Validation:** Run `npm run test` in `/server`. The new Integrity Test must pass (100% green), confirming no empty boxes can be served to the frontend.
*   **Accuracy Check:** Manually audit a random sample of the newly split words (e.g., verbs with compound mathras) to ensure strict adherence to the pedagogical rules.
*   **Zero-Regression Mandate:** Ensure that all previously passing tests (SRS Engine, API routes, Multi-user logic) remain 100% green after the database updates.