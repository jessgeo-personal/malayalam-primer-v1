# Phase 2 Implementation Plan: Session Management & Visual Progress

## Objective
To implement an engaging daily play loop for an 8-year-old by introducing a 3-Tier Adaptive SRS (Letter -> Word -> Sentence), structuring gameplay into a mandatory Daily Revision block followed by 5-game Bundles, and visualizing this journey via an interactive Adventure Map.

## Scope & Impact
* **Backend:** Updates to MongoDB Schemas (`Progress` and `User`) to handle item-level tracking and session state. Creation of a `SessionService` to generate Revision and Bundle payloads.
* **Frontend:** Creation of the `AdventureMap` dashboard. Refactoring the game loop to handle the Bundle structure.
* **Pedagogy:** Implementation of the "Graduation Protocol" (removing mastered letters from isolated review once used successfully in words).

## Key Files & Context
* `server/models/Progress.js`: Will track `itemType` and `errorCount`.
* `server/models/User.js`: Will track daily session state (revision completed?).
* `server/services/srsEngine.js`: Will implement the 3-Tier grading and graduation logic.
* `server/routes/api.js`: New endpoints for `/session/revision` and `/session/bundle`.
* `client/src/components/ui/AdventureMap.jsx`: New UI component.
* `client/src/context/ProgressContext.jsx`: State management for the new map and bundle flow.

## Implementation Steps

### Step 1: Backend Data Model Refactoring
1. **Update `Progress.js`:** 
   * Change `wordId` to `itemId`.
   * Add `itemType: { type: String, enum: ['letter', 'word', 'sentence'], required: true }`.
   * Add `errorCount: { type: Number, default: 0 }`.
   * Add `graduated: { type: Boolean, default: false }`.
2. **Update `User.js`:**
   * Add `lastRevisionDate: { type: Date }`.
   * Add `unlockedLetters: [String]`.

### Step 2: The 3-Tier SRS & Session Service (`server/services/srsEngine.js`)
1. **Graduation Logic:** Create a function `evaluateGraduation(userId, itemId, itemType)`. If a letter is successfully identified within a word-building game, mark the *letter* progress doc as `graduated: true`.
2. **Generate Revision Payload:** Create an endpoint `GET /api/session/revision`. It queries `Progress` for items where `lastReviewed` dictates review AND `graduated === false`. It strictly orders them: Letters -> Words -> Sentences.
3. **Generate Bundle Payload:** Create an endpoint `GET /api/session/bundle`. It returns exactly 5 game payloads based on the user's current frontier (e.g., Learn Letter -> Use Letter in Word).

### Step 3: Frontend - The Adventure Map (`client/src/components/ui/AdventureMap.jsx`)
1. Build a visual node-based map component.
2. The map checks the user state:
   * If `lastRevisionDate` !== today, only the "Daily Revision" node is active/clickable.
   * If Revision is done, the current "Game Bundle" node (and previous nodes) are unlocked.
3. Integrate the Mastery Strip at the top of the map to show overarching score/level.

### Step 4: Frontend - Bundle Game Loop
1. Refactor `App.jsx` / `ProgressContext.jsx` to handle an array of 5 games.
2. Create a "Bundle Complete" transition screen that offers the choice to "Play Another Bundle" or "Return to Map".

## Verification & Testing (Zero-Regression Mandate)

### Backend Tests (Jest)
* `srsEngine.test.js`:
    * **Test 1 (Graduation):** Assert that answering a Word puzzle correctly sets `graduated: true` on its constituent letters.
    * **Test 2 (Revision Payload):** Assert that graduated letters DO NOT appear in the revision payload.
    * **Test 3 (Bundle Logic):** Assert that `GET /api/session/bundle` returns exactly 5 items and fails gracefully if not enough items exist.

### Frontend Tests (Vitest)
* `AdventureMap.test.jsx`:
    * **Test 1 (Lockout):** Assert that Bundle nodes are disabled if `needsRevision` is true.
    * **Test 2 (Click):** Assert that clicking the Revision node triggers the correct API fetch and view change.

## Note on Project Charter (`GEMINI.md`)
Because I am currently operating in a strictly Sandboxed "Plan Mode", I cannot modify the root `GEMINI.md` file directly to update the charter rules. 
**Immediate Action Item upon Execution:** The very first step of implementation must be updating `GEMINI.md` with the 3-Tier SRS logic and Game Bundle structures as agreed upon.