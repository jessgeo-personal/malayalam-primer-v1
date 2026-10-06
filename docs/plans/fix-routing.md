# Plan: Fix Adventure Map Lesson Routing

## Objective
Fix the `AdventureMap.jsx` component so it correctly calculates the lesson IDs for each cycle, preventing Cycle 2 from rendering lessons 1-9.

## Issue
Currently, `AdventureMap` uses `totalLessons` to render nodes starting from `lessonId = 1` for *every* cycle. Cycle 2 has lessons 10, 11, 12, but because the highest lesson in cycle 2 is 12, it renders 1 through 12 in the Cycle 2 card. Clicking the first node in Cycle 2 triggers Lesson 1.

## Steps
1. Update `/api/session/cycle/lessons` in `server/routes/api.js` to return `startLessonId` and `endLessonId` instead of just `totalLessons`.
2. Update `AdventureMap.jsx` in `client/src/components/ui/AdventureMap.jsx` to use `startLessonId` and `endLessonId` to render the correct range of nodes (e.g., `lessonId` 10, 11, 12).
3. Run tests to ensure no regressions.