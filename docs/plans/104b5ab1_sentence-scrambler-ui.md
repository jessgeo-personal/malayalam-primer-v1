# Implementation Plan: Sentence Scrambler Auto-Check & High-Contrast Feedback

## Background & Motivation
The user reported multiple UI issues with the Sentence Scrambler mini-game:
1. The manual "Check Answer" button lacks contrast, blending into the background.
2. The error "TIP" bubble at the top right is unreadable due to white-on-white colors.
3. The flow requires manual clicking, which slows down the tablet-first experience.

The user requested an auto-check feature (triggering when all words are placed) and a high-contrast feedback overlay displaying the correct sentence on failure, similar to the Word Assembly (LetterPicker) component.

## Scope & Impact
- `client/src/components/games/SentenceScrambler.jsx`

## Proposed Solution

### 1. Remove Obsolete UI Elements
- Delete the "Check Answer" button and its surrounding footer container.
- Delete the top-right floating error bubble (`<div className="absolute top-8 right-8...`).

### 2. Implement Auto-Check Logic
- Modify `handleTapBank` to update `placedWords` and immediately check if the new length equals `word.sentenceParts.length`.
- If the lengths match, validate the array of strings against `word.sentenceParts`.
- Set the `isCorrect` state to trigger the feedback overlay.
- Store the `timeTaken` in state immediately so the time spent reading the feedback screen doesn't penalize the user.

### 3. High-Contrast Feedback Overlay
- Add a new conditional block at the end of the component: `{isCorrect !== null && (...)}`.
- The overlay will use `absolute inset-0 z-50 flex flex-col items-center justify-center p-8 backdrop-blur-md` to cover the entire scrambler card.
- **Success State (`isCorrect === true`):**
  - Background: `bg-prime-teal-green/95` (Solid green).
  - Content: Large ✅ icon, "Correct!", and a "CONTINUE ➜" button.
- **Failure State (`isCorrect === false`):**
  - Background: `bg-[#1A1E26]/95` (Obsidian dark).
  - Content: Large ❌ icon.
  - Correction Box: A `bg-white/10` rounded box displaying "Correct sentence:", the full sentence (`word.sentenceParts.join(' ')`), and the phonetic English translation (`word.phonetic`).
  - Button: "RETRY ➜".
- **Action:** Both buttons will call `onComplete(isCorrect, timeTaken)`, letting the global `ProgressContext` handle whether to advance or queue the word for reinforcement.

## Implementation Steps
1. Open `SentenceScrambler.jsx` and add a `timeTaken` state.
2. Rewrite `handleTapBank` to perform the length check and validation.
3. Delete the manual `handleCheck` function.
4. Replace the old footer and tip bubble with the new `isCorrect !== null` overlay JSX.
5. Ensure the overlay uses `text-white` to guarantee WCAG contrast compliance on the dark backgrounds.

## Verification
- Test placing words correctly: Verify auto-trigger, green overlay, and progression.
- Test placing words incorrectly: Verify auto-trigger, obsidian overlay, readable correct sentence/phonetics, and proper reinforcement queuing upon clicking RETRY.