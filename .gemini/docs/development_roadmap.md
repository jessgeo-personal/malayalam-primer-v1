# Roadmap: Malayalam Prime Development Progression

This document outlines the strategic progression from our current scaffolding to a functional, gamified literacy app for an 8-year-old.

## Phase 1: The "Foundation" (The Core Loop)
*Goal: Establish the basic "Fetch Word -> Show Puzzle -> Submit Answer -> Update SRS" cycle.*
1.  **Database Seeding**: Finalize the `Word` schema and seed the first 100 words (Cycle 1).
2.  **State Management**: Implement the `Progress` context to track unlocked words and current session state.
3.  **The "Base" Mini-Game**: Build a simple "Letter Picker" (Drag-and-Drop) to verify the `@dnd-kit` integration and backend communication.
4.  **SRS Logic**: Implement the 11-bucket scoring logic on the backend.

## Phase 2: The "Grammar Factory" (The 11 Buckets)
*Goal: Build the specialized mini-games for different grammatical concepts.*
*   **Cycle A: Basic Nouns & Verbs**: Simple object identification.
*   **Cycle B: The Suffix Snapper**: Mini-game for plural markers and case endings (e.g., adding "-kal" to nouns).
*   **Cycle C: Tense Transformations**: Mini-game for Past/Present/Future verb changes.
*   **Cycle D: Sentence Scrambler**: Drag-and-drop words to form basic Malayalam sentences.

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
