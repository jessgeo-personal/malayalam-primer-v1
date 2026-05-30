## 4. Tracing Directional Arrows (Stroke Skeletons)
**Observation:** The tracing canvas currently only shows the final outline of the character. It lacks pedagogical guidance on *how* to draw it (stroke order and direction).
**Action Item:** Implement a stroke-guide system.
- *Technical Note:* Standard fonts do not contain centerline path data. This will require building a hidden "Developer Recorder" tool to manually map and save the exact [x, y] coordinate paths for every Malayalam character into a JSON dictionary. The tracing canvas will then render dotted lines and arrows along these saved coordinate paths.

## Completed Features

- **Daily Revision Plan (Session Management)**: Mandatory revision block implemented to prevent rote burnout.
- **Adventure Map Dashboard**: Visual winding path for progress tracking and lesson selection.
- **Mastery Strip / Sticker Book**: Integrated as a persistent achievement indicator at the top of the UI.

## 1. Pedagogical Pacing & Sequencing
**Observation:** The strict prerequisite system (tracing *every* character before building a word) can cause the tracing phase to feel too long.
**Action Item:** Revisit the ratio of Tracing vs. Word Building. 
- *Potential Solution:* "Quick Trace" mode for letters already encountered in words.

## 2. Learner Dashboard & Progress Visualization
**Observation:** The child needs more "juicy" feedback on global mastery.
**Action Item:** Create a "Mastery Gallery".
- *Feature:* A digital environment (e.g., a garden or space station) that populates with items as the child learns words.

## 3. AI-Assisted "Vibe Decoder"
**Observation:** Intent recognition is a major milestone for Cycle 2.
**Action Item:** Use Gemini to generate "vibes" (Statements vs. Questions).
- *Feature:* A game where the child swipes sentences into "Talking" or "Asking" bins based on the ending sound/suffix.
