# Plan: Fix User Profile for Map Unlock

## Objective
Update the `User` document for "Learner 3" in MongoDB so the Adventure Map correctly reflects the completion of Lessons 1-9 and unlocks Lesson 10.

## Issue
The previous script only updated the `Progress` collection (which calculates mastery percentages), but the Adventure Map UI relies on the `User` collection's `lessonHistory` and `currentLesson` fields to determine which nodes are visually unlocked.

## Steps
1. Execute a Node.js shell command within the `/server` directory.
2. Find the `User` document where `userId: 'Learner 3'`.
3. Update `lessonHistory` to include 3-star completions for `lessonId` 1 through 9.
4. Set `currentLesson` to 10.
5. Set `currentCycle` to 2.