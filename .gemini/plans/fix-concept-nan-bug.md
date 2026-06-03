# Implementation Plan: Fix Concept Screen 'NaN' Bug

## 🎯 Objective
Fix the `NaN` rendering bug in the Concept Screens for lessons 12 and 13. The issue occurred because the newly introduced `examples` array was not added to the Mongoose `Word` schema, causing the backend to silently drop this data during seeding. This left the frontend without both the `examples` and the legacy `baseWord` fields, resulting in `undefined + undefined = NaN`.

## 📂 Key Files & Context
*   **Database Schema:** `server/models/Word.js`
*   **Seeder Script:** `server/seeder.js`

## 🛠️ Implementation Steps

### Phase 1: Update Mongoose Schema
1.  Open `server/models/Word.js`.
2.  Add the `examples` array definition to the `wordItemSchema`.
    ```javascript
    examples: [{
      base: String,
      suffix: String,
      result: String,
      rule: String
    }],
    ```

### Phase 2: Re-Seed Database
1.  Run `node seeder.js` in the `server` directory to ingest the JSON data again. With the schema updated, Mongoose will now save the `examples` array to MongoDB.
2.  Run `npm test` to ensure integrity tests still pass.

## 🧪 Verification Strategy
*   The user will revisit Lesson 12 or 13.
*   The `examples` data will now be successfully passed to the frontend, `hasExamples` will be true, and the dynamic multi-step rendering will work as intended, showing the rules rather than `NaN`.