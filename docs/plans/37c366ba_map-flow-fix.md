# Refactoring Adventure Map Flow & Lessons

## Objective
Fix the dead-end empty Revision bug, rename "Bundles" to "Lessons", introduce a 1-3 Star rating system for completed lessons, and ensure Revision and the current Lesson are simultaneously accessible on the Adventure Map.

## Scope
* **Backend Models:** Update `User.js` to track `currentLesson`, `lessonHistory` (for stars), and accurately report `needsRevision`.
* **Backend API:** Add endpoints for completing a Revision and completing a Lesson (saving stars).
* **Frontend State (`ProgressContext.jsx`):** Track `sessionErrors` to calculate stars. Auto-complete revision if the payload is empty.
* **Frontend UI (`AdventureMap.jsx`):** Redesign the map to show Daily Revision + a list of Lessons. Previously completed lessons show their stars. `currentLesson` is always glowing/active.
* **Frontend UI (`App.jsx`):** Build a dedicated "Session Complete" summary screen that awards a "Prize" (bonus points/visuals) for Revision and Stars for Lessons.

## Key Changes
1. **User Schema:** Add `currentLesson` (default: 1) and `lessonHistory` (array of objects with `lessonId` and `stars`).
2. **Empty Revision Fix:** `GET /api/progress/stats` will now determine `needsRevision` by checking both `lastRevisionDate` (is it today?) and if there are actually items needing review. If no items need review, it will set `lastRevisionDate` to today automatically so it resolves.
3. **Concurrent Access:** The Adventure Map will no longer lock Lessons behind Revision. They are independent buttons.
4. **Lesson Generation:** `GET /api/session/bundle` becomes `GET /api/session/lesson?lessonId=X`.
5. **Session Complete Screen:** When a session ends, instead of jumping right to the map, a summary component shows the results.

## Testing Strategy
* **Backend:** Verify that `needsRevision` evaluates correctly based on dates.
* **Frontend:** Verify that Map displays stars for past lessons and allows clicking the current lesson even if Revision is not done.