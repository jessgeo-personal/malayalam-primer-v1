# Unified Regression Test Checklist

## 🟢 Core Infrastructure
- [x] Monorepo scaffolding verified
- [x] Docker-compose structure valid
- [x] MongoDB/Express/React connectivity placeholders established
- [x] Vite development server starts without PostCSS errors (Tailwind v4 fix)
- [x] SRS Engine logic verified (Accuracy)
- [x] Backend API routes for next word and progress update verified (Functional Adherence)
- [x] Letter Picker component renders and handles drag-and-drop state (Visual Consistency)
- [x] Spaced Repetition persistence in MongoDB verified (Accuracy)
- [x] Global 'Restart Session' functionality verified (Functional Adherence)
- [x] Pedagogical feedback loop (Success/Fail/Correction) verified (Functional Adherence)
- [x] Alphabet tracing canvas verified with touch/mouse events (Visual Consistency)
- [x] Phonetic audio playback (TTS placeholder) verified (Functional Adherence)
- [x] Pedagogical prerequisite system (Trace before Build) verified (Accuracy)
- [x] Visual phonetics on tracing canvas verified (Visual Consistency)
- [x] Mastery Strip UI displaying learned letters at TOP verified (Visual Consistency)
- [x] Global score tracking and gamification (Stars/Points) verified (Functional Adherence)
- [x] SoundMatcher (Listen & Pick) mini-game verified (Pedagogical Alignment)
- [x] DND-Kit Touch sensors and closestCenter collision verified (Tablet UX)
- [x] Drop zone active highlighting on hover verified (Visual Consistency)
- [x] Prerequisite Trace -> Match -> Build sequence verified (Accuracy)

## 🔵 Phase 2: Session Management & Adventure Map
- [x] **3-Tier SRS:** Independent tracking of Letter, Word, and Sentence progress verified (Accuracy).
- [x] **Graduation Logic:** Mastered letters used correctly in word-building are removed from isolated revision verified (Accuracy).
- [x] **Daily Revision:** Mandatory revision block correctly identifies items needing review verified (Functional Adherence).
- [x] **Empty Revision Handling:** If no items need review, revision is auto-completed verified (Process Faultlines).
- [x] **Adventure Map UI:** Visual path with interactive Lesson nodes verified (Visual Consistency).
- [x] **Lesson Star System:** 1-3 stars awarded based on session accuracy verified (Gamification Adherence).
- [x] **Session Summary:** Reward screen for Revision (Prize) and Lessons (Stars) verified (Visual Consistency).
- [x] **Concurrent Access:** Lessons and Revision are simultaneously clickable on the map verified (UX Flow).
- [x] **Backend API:** Lesson history and current lesson progress persistence verified (Accuracy).
