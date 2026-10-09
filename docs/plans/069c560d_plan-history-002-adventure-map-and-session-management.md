# Plan History: 002 - Adventure Map & Session Management

## Objective
Transition from a continuous loop to a structured, gamified session model with visual progress tracking.

## Context
The core loop is functional. Users now need a sense of "place" and "progression" to stay engaged.

## Implementation Steps
### 1. The Adventure Map
- Create `AdventureMap.jsx` featuring a winding path of "Lesson" nodes.
- Implement `GET /api/session/lesson` to serve 5-game bundles.
- Add a "Daily Revision" node that must be completed first.

### 2. Graduation & 3-Tier SRS
- Refactor `srsEngine.js` to track Letter, Word, and Sentence levels independently.
- Implement "Graduation Logic": Mastered characters used in words are removed from isolated letter revision.

### 3. Gamification: Stars & Persistence
- Add `lessonHistory` to `User` schema to track star ratings (1-3 stars) for each lesson.
- Implement `POST /api/session/lesson/complete` to save stars and unlock the next node.
- Create a "Session Complete" reward screen.

## Verification & Testing
- **Integration Test:** Verify that completing a lesson updates the star count and unlocks the next node on the map.
- **SRS Test:** Confirm graduated letters no longer appear in the Revision payload.
- **Visual Check:** Ensure the Adventure Map path scales correctly on tablet resolutions.
