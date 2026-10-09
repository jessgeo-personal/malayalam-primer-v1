# Roadmap: Malayalam Prime Development Progression

This document outlines the strategic progression from our current scaffolding to a functional, gamified literacy app for an 8-year-old.

## Phase 0: The "Alphabet Foundation" (Tracing & Phonetics) [COMPLETED]
*Goal: Teach the shape and phonetic sound of individual graphemes before word building.*
- [x] **The Tracing Canvas**: Build an HTML5 `<canvas>` optimized for tablet touch events.
- [x] **Phonetic Integration**: Provide audio hints (phonetic pronunciations).
- [x] **Core Lessons**: Grouped graphemes into manageable pedagogical blocks.

## Phase 1: The "Foundation" (The Core Loop) [COMPLETED]
*Goal: Establish the basic "Fetch Word -> Show Puzzle -> Submit Answer -> Update SRS" cycle.*
- [x] **Database Seeding**: Finalized the `Word` schema and seeded initial word set.
- [x] **State Management**: Implemented the `Progress` context.
- [x] **The "Base" Mini-Game**: Built "Letter Picker" (Drag-and-Drop) with `@dnd-kit`.
- [x] **SRS Logic**: Implemented 3-tier adaptive scoring (Letter/Word/Sentence).
- [x] **Adventure Map**: Visual dashboard with lesson nodes and revision engine.
- [ ] **Milestone 1.3: Cycle 1 Intro Screens**: Retrofit 9 lessons with interactive summaries and audio.

## Phase 2: The "Grammar Factory" (The 11 Buckets) [ACTIVE]
*Goal: Build the specialized mini-games for different grammatical concepts.*
1. [x] **Milestone 2.1: Suffix Snapper**: Drag-and-drop plural markers and basic case markers.
2. [x] **Milestone 2.2: Concept Screens & Expansion**: Visual instruction pages and massive Cycle 2 vocabulary (Plurals, Locative, Kinship).
3. **Milestone 2.3: Tense Transformations**: Mini-game for Past/Present/Future verb changes.
4. **Milestone 2.4: Sentence Scrambler**: Drag-and-drop words to form basic Malayalam sentences using Bucket 1 & 2.
5. **Milestone 2.5: Vibe Decoder**: Use AI-generated sentences to test "Intent" recognition (Statement vs. Question).

## Phase 3: The "AI Tutor" (Gemini Integration)
*Goal: Use AI to generate dynamic, non-repetitive challenges based on the user's unlocked vocabulary.*
1.  **The "Mad-Libs" Mode**: Gemini generates a sentence with a missing word; the child must pick the correct word from their "backpack."
2.  **Contextual Feedback**: Gemini explains *why* an answer was wrong in simple English/Malayalam.
3.  **Strict Filtering**: Ensure the `geminiService` only uses the 300-word whitelist to prevent hallucinations.

## Phase 4: The "Tablet Polish" (UX & PWA)
*Goal: Ensure the app feels like a "game" on the Android tablet.*
1.  **Audio Engine**: Integrate success/fail sounds and Malayalam pronunciation clips.
2.  **Haptic & Visuals**: Add "juicy" animations (particles on success, shakes on fail).
3.  **Offline Support**: Optimize the Service Worker to ensure the game works even if the Wi-Fi blips.
4.  **Full-Screen PWA**: Finalize manifest and icons for a "native app" feel on the Synology/Tablet connection.

## The "Cycle of Growth" (Repeated Loop)
For every set of 25-50 words, we repeat:
1.  **Seed**: Add new words to the database.
2.  **Game**: Map new words to their specific Grammar Bucket mini-game.
3.  **Test**: Run regression tests to ensure old words aren't forgotten.
4.  **Release**: Update the version and changelog.
