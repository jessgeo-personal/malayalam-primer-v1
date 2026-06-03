# Plan: Train UI, Audio Tiles, and Replayable Lessons

## 1. Dictionary Audit
* **Current Status:** The database currently contains exactly **118 items** (18 letter components and 100 core words).
* **Deficit:** At 5 items per lesson, this provides exactly **23 lessons**. To support 15 lessons per day for 5 days (75 lessons / 375 items), we are short by about **250+ items**. 
* **Action:** I will need to expand the seeding script (or create a `seed-200.json` and `seed-300.json`) with proper grapheme splitting to populate enough lessons. *For this phase, I will focus on the UI/UX requests first, and we can bulk-add the vocabulary in the next step.*

## 2. Feature: Audio Buttons on Tiles
* **Goal:** Allow the child to hear individual letter sounds while assembling a word.
* **Implementation:** Update `LetterPicker.jsx` (and potentially the `SortableLetter` component). Add a small speaker icon (🔊) to each tile.
* **Logic:** Clicking the speaker will trigger the `audioEngine.playAudio(letter.phonetic)` function. Prevent the click event from interfering with the drag-and-drop mechanism (using `onPointerDown` stop-propagation or similar).

## 3. Feature: Train and Bogeys UI
* **Goal:** Reskin the Adventure Map to look like a train.
* **Implementation:** Update `AdventureMap.jsx`.
* **Design:** 
  * Lesson 1 can be the "Engine" (or the revision can be the station/engine).
  * Subsequent lessons are "Bogeys" (train cars) connected by train tracks (SVG path).
  * The `maxLessonToShow` logic will determine how long the train is.
  * *Replayability:* Existing logic already allows clicking 'completed' lessons. I will ensure the UI makes it obvious that old bogeys can be replayed to improve stars.

## 4. Feature: Info Popup ('i')
* **Goal:** Show parents/users what a lesson contains before starting.
* **Implementation:** 
  * Backend: Create a quick endpoint `GET /api/session/lesson/preview?lessonId=X`.
  * Frontend: Add an 'i' button above each bogey. Clicking it opens a modal listing the Malayalam text, English translations, and lesson types (Trace vs. Build) for the 5 items in that lesson.

## Next Steps
1. Get approval for this Train UI and Audio Plan.
2. Once approved, I will implement the UI changes.
3. Afterward, we will tackle the bulk data generation to reach the 375+ item threshold.