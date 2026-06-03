# Plan: Fix Sentence Scrambler Progression Bug

## Diagnosis
The reported issues (infinite loop and random refreshing) share a single root cause in `SentenceScrambler.jsx`. 
When a user correctly builds a sentence, the component calls `onComplete()` without any arguments. The global `ProgressContext` expects `onComplete(isCorrect, time)`. Because `isCorrect` is undefined, the context evaluates `!isCorrect` to `true`, treating every correct answer as a **failure**.

As a result, the progression engine:
1. Penalizes the user's score.
2. Instantly appends a "reinforcement" copy of the *exact same sentence* to the session queue.
3. Advances the session to that reinforcement copy. 

When the session advances, React passes the new reinforcement object to `SentenceScrambler`. The component's `useEffect` detects the new object and resets the game board. To the user, it appears as though the game randomly refreshed and is forcing them to answer the same question in an infinite loop.

## Implementation Steps

### 1. Fix the `onComplete` Callback (`SentenceScrambler.jsx`)
- Introduce a `startTime` state variable when the component mounts to track response time.
- Update the `setTimeout` inside `handleCheck` to explicitly pass the success flag and the calculated response time:
  `setTimeout(() => onComplete && onComplete(true, Date.now() - startTime), 1500);`
- Disable the "Check Answer" button while the timeout is running to prevent accidental double-taps.

### 2. Reinforce Component Mounting (`App.jsx`)
- To prevent any future state bleeding between consecutive identical lesson types, we will add an explicit `key={currentItem.wordId + currentIndex}` to the dynamic component renderer in `App.jsx`. This forces React to unmount and remount the component cleanly whenever the session advances.

### 3. Unit Test Update
- Update `SentenceScrambler.test.jsx` to explicitly verify that `onComplete` is called with the `true` boolean argument when a correct answer is submitted.

## Validation
- Execute `npm test` in the `/client` directory to ensure the fixed unit test passes.
- No database changes or backend testing are required for this frontend state fix.

---
**[APPROVAL REQUIRED]: Please approve this targeted bug-fix plan so I can implement the corrections and restore Lesson 1's playability.**