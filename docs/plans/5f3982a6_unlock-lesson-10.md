# Plan: Unlock Lesson 10 for Learner 3

## Objective
Run a MongoDB script to fast-forward progress for "Learner 3" so the user can immediately test the Milestone 2.1 Suffix Snapper component (which appears in Lesson 10) without playing through Lessons 1-9 manually.

## Steps
1. Execute a Node.js shell command within the `/server` directory that connects to the local MongoDB instance.
2. Clear existing progress for "Learner 3".
3. Insert mock progress entries with max `encounters`, `correctCount`, and `srsWeight` for all words in Lessons 1-9.
4. Mark the constituent letters of those words as `graduated`.