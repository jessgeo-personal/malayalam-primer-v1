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

## 🚂 Phase 3: Train UI & Audio Tiles
- [x] **Malayalam Express UI:** Adventure Map reskinned as a train with Engine (Revision) and Bogeys (Lessons) verified (Visual Consistency).
- [x] **Info Popup ('i'):** Lesson preview modal correctly displays content before starting verified (Functional Adherence).
- [x] **Audio Tiles:** Individual letter tiles in Word Building now have functional "🔊" buttons verified (UX Enhancement).
- [x] **Replayability:** Completed lesson bogeys are clickable and allow star improvement verified (Functional Adherence).
- [x] **Dictionary Audit:** Current dictionary supports 23 lessons (~118 items) verified (Resource Audit).

## 💎 Phase 4: Professional UI Refinement
- [x] **Compact Layout:** Global font and element sizes reduced by ~50% for tablet optimization verified (Visual Consistency).
- [x] **Tracing Fix:** Canvas ghost letter guide rendered correctly using valid CSS font shorthand verified (Functional Adherence).
- [x] **Professional Palette:** Muted sky blue background and refined 3D button colors verified (Visual Consistency).
- [x] **Enhanced Map:** Scaled-down railway nodes showing 15+ bogeys on one screen verified (Visual Consistency).
- [x] **Repositioned Hints:** "Start Drawing" hint moved to bottom of canvas to avoid obstructing characters verified (UX Enhancement).

## 🏙️ Phase 5: Cyber-Pop UI Rebuild (UI Charter)
- [x] **Dark Mode Base:** Slate-900 background and high-contrast text verified (Charter Adherence).
- [x] **Neon Accents:** Violet primary and Emerald success palette verified (Charter Adherence).
- [x] **Arcade Button System:** .btn-arcade classes with 4px tactile shadows and pop animations verified (UX Enhancement).
- [x] **Tracing Matrix Fix:** Ghost letter guide scaled and rendered correctly on a larger slate-900 canvas verified (Functional Adherence).
- [x] **HUD Header:** Rotated, arcade-style score HUD and HUD-style badge shelf verified (Visual Consistency).
- [x] **Map Grid:** Neon grid background and 20+ scaled node visibility verified (Visual Consistency).
- [x] **Contrast Compliance:** All text elements meet WCAG AA standards as per Charter verified (Accessibility).
- [x] **Tailwind v4 Alignment:** Legacy tailwind.config.js removed and @theme directive used in index.css verified (Technical Debt).
- [x] **CSS Compilation:** Build succeeds without 'unknown utility' errors using @reference verified (Process Faultlines).




## 🎨 Phase 4: Consumer-Grade UI Overhaul
- [x] **Game Background:** Vibrant, fixed-pattern sky background implemented verified (Visual Consistency).
- [x] **3D Buttons:** Chunky .btn-3d classes with physical press animations verified (UX Enhancement).
- [x] **Polished Map:** Railway/Train Map with high-quality gradients and wheels verified (Visual Consistency).
- [x] **Component Redesign:** Games (Trace, Match, Pick) use high-contrast, rounded card layouts verified (Visual Consistency).
- [x] **Badge Shelf:** Mastery Strip redesigned as a physical badge shelf with pop-in animations verified (Gamification Adherence).
- [x] **Audio Engine Safety:** Added checks for speechSynthesis to prevent test/headless environment crashes verified (Process Faultlines).


