# Implementation Plan: Lesson Sequencing & Gating Fix

## Background & Motivation
The user reported that during Lesson 3, the Concept screens (word and sentence contexts) were appearing out of order, and the mini-games were interleaving incorrectly.
My investigation revealed that this occurs during **Replays**. When a user replays a lesson, the backend (`srsEngine.js`) checks prerequisites against the user's historical database progress (`masteredIds`). Because they've played it before, all prerequisites evaluate to `true` instantly. This dumps the entire lesson into the payload, which the slice/grouping logic then mishandles, breaking the strict `Concept -> Game -> Concept -> Game` flow.

## Scope & Impact
- `server/services/srsEngine.js` (Backend Payload Generation)

## Proposed Solution

### 1. Refactor Prerequisite Check
In `generateLessonPayload`, the prerequisite check determines if an item is unlocked:
```javascript
const arePrereqsMet = !w.prerequisites || w.prerequisites.length === 0 || 
                     w.prerequisites.every(preId => masteredIds.has(preId));
```
We need to update this to distinguish between first-time play and replays.
- **If `isReplay` is true:** We MUST ignore `masteredIds`. Instead, we check `completedSet.has(preId)`, meaning the prerequisite must have been completed *in the current active session* to unlock the next item.
- **If `isReplay` is false:** We check `masteredIds.has(preId) || completedSet.has(preId)`. This ensures seamless progression if the database update is delayed.

This forces the backend to deliver the lesson in strict, sequential chunks exactly like it did the first time.

### 2. Grouping Logic Simplification
With the prerequisite logic strictly enforcing the order, the `payload` array will only ever contain items for the *currently unlocked act*. We can keep the existing `firstConcept`, `traces`, `others` grouping to ensure alphabets appear before words within a chunk, but the slicing will no longer accidentally pull from future acts.

## Implementation Steps
1. Edit `server/services/srsEngine.js`.
2. Update the `arePrereqsMet` assignment in `generateLessonPayload`:
   ```javascript
   const arePrereqsMet = !w.prerequisites || w.prerequisites.length === 0 || 
                         w.prerequisites.every(preId => 
                            isReplay ? completedSet.has(preId) : (masteredIds.has(preId) || completedSet.has(preId))
                         );
   ```
3. Run the backend unit tests (`npm test` in `/server`) to ensure the session logic and mock tests remain green.

## Verification
- First-time play of Lesson 3: The user receives `c003_a1`. Then traces. Then matches. Then `c003_a2`. Then builds. Then `c003_a3`. Then scrambles.
- Replaying Lesson 3: The exact same sequence is strictly enforced. No interleaving of `build` and `scramble` items.