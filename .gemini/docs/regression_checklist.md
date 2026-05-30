# Unified Regression Test Checklist

## 🛠️ Phase 2: The Grammar Factory (Milestone 2.2)
- [x] **Data Expansion:** Cycle 2 expanded to ensure every lesson (10-14) contains at least 10 words verified (Volume Constraint).
- [x] **ConceptScreen Component:** Automated UI animation built to visually explain rules before gameplay verified (Visual Consistency).
- [x] **Game Loop Integration:** App.jsx routes `concept` items correctly to the new instructional screen verified (Functional Adherence).
- [x] **Concept Payload Routing:** Backend accurately sorts `lessonType: 'concept'` items to the very front of the lesson bundle verified (Accuracy).

## 🛠️ Phase 2: The Grammar Factory (Milestone 2.1)
- [x] **Full Data Normalization:** Database purged and re-ingested with strictly non-overlapping Cycle/Lesson boundaries verified (Accuracy).
- [x] **Curriculum Integrity Test:** Automated test verifies lesson ranges per cycle to prevent future desync verified (TDD Mandate).
- [x] **Map Contrast Fix:** Locked nodes in Adventure Map use high-contrast styling (grayscale/semi-white) for visibility verified (Visual Consistency).
- [x] **Lesson Routing Fix:** Adventure Map correctly identifies lesson ranges per cycle, preventing cross-cycle duplication verified (Functional Adherence).
- [x] **Suffix Snapper Component:** Drag-and-drop magnetic snap mechanics for suffixes verified (Functional Adherence).
- [x] **Guided Tutorial:** In-game tutorial hand appears on first encounter of a concept verified (Pedagogical Alignment).
- [x] **Schema Expansion:** Word model supports `baseWord`, `targetSuffix`, and `distractorSuffixes` verified (Accuracy).
- [x] **ShowTutorial Logic:** Backend accurately calculates `showTutorial` flag based on user progress verified (Accuracy).
- [x] **Seed Data (seed-200.json):** First batch of plural and location grammar lessons verified (Resource Audit).
- [x] **TDD Validation:** 100% green state for new suffix-specific unit tests (backend & client) verified.

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

## 🍱 Phase 7: Soft Premium "Neo-Bento" UI
- [x] **Warm Canvas Backdrop**: Creamy #FFFDF6 background and high-contrast obsidian text verified.
- [x] **Neo-Bento Layout**: Card-stack dashboard with Hero slot and Bento Grid stats verified.
- [x] **Premium Dark Pills**: All primary actions migrated to bg-prime-action-dark capsules verified.
- [x] **Dynamic Course Deck**: Adventure Map refactored into stacked cycle cards with alternating accents verified.
- [x] **High-Res Tracing Hub**: Large, hyper-rounded tracing canvas with calibrated ghost guide verified.
- [x] **Floating Nav Dock**: Floating dark navigation dock implemented at screen bottom verified.
- [x] **Stability Fix**: Adventure Map JSX syntax error (missing closing tags/export) resolved and verified.
- [x] **Accessibility (WCAG AA)**: Contrast ratios audited for Obsidian text on Pastel backgrounds verified.

## 🗣️ Phase 8: Simple Language & High-Contrast Visuals
- [x] **Terminology Simplification**: All technical/cyber-pop jargon (Sync, Grapheme, Deploys) replaced with simple terms (Practice, Letter, Lessons) verified.
- [x] **Visual Clarity**: Drop zone borders darkened to Slate-400 for better visibility against white/light backgrounds verified.
- [x] **Tracing Accessibility**: Ghost letter guide darkened to Slate-300 (#cbd5e1) for clearer target recognition verified.
- [x] **Navigation Fix**: Settings button replaced with a functional "Restart Session" (🔄) button with confirmation safety verified.
- [x] **Encouraging Feedback**: Game feedback banners updated to use learner-friendly language ("Correct!", "Try Again!") verified.

## 🧠 Phase 9: Micro-Loop Refactor & HUD
- [x] **Batch Acquisition Logic**: generateLessonPayload groups Tracing before Matching/Building verified.
- [x] **Recall Challenge**: Matching and Building tasks are randomized after tracing verified.
- [x] **Exit Strategy**: EXIT button moved to top-left verified.
- [x] **Progress HUD**: "My Progress" strip implemented in top-right verified.
- [x] **TDD Green State**: npm test in /server and /client 100% green verified.

## 🗺️ Phase 10: Pedagogical Data Integrity (The Great Split)
- [x] **Explicit Lesson ID Schema**: Word model updated with lessonId and sequence verified.
- [x] **Curated Payload Engine**: generateLessonPayload fetches strictly by lessonId verified.
- [x] **Cycle 1 Grapheme Splits**: requiredCharacters populated for w001-w050 using split protocol verified.
- [x] **Dynamic Adventure Map**: Lesson nodes calculated based on database lessonId counts verified.
- [x] **Zero-Empty-Boxes Rule**: All Cycle 1 build games verified to have non-empty character arrays.

## 🔄 Phase 11: HUD Sync & Curriculum Consolidation
- [x] **Phonetic Restoration**: Phonetic English labels restored in "Build" game verified.
- [x] **Real-time HUD Update**: "My Progress" strip updates immediately after correct trace verified.
- [x] **Cycle 1 Consolidation**: Curriculum reduced from 14 fragments to 9 high-density lessons verified.
- [x] **Missing Graphemes Added**: Traces for ൽ, ൂ, സ, ഷ, ഭ added to complete Cycle 1 dependencies verified.

## 👥 Phase 12: Multi-User Isolation
- [x] **User Switcher UI**: Dropdown in top-right corner allows switching between 3 learners verified.
- [x] **State Persistence**: Selected user persists across page refreshes via localStorage verified.
- [x] **Data Isolation**: Progress, score, and mastered letters are strictly independent per userId verified.
- [x] **Session Safety**: Switching users mid-lesson correctly resets the session and returns to the map verified.
- [x] **Dynamic Previews**: Lesson info popups show data relevant to the currently active user verified.

## 📱 Phase 13: Tablet-First Layout & HUD Sync
- [x] **Side-by-Side Tracing**: Drawing pad (left) and control panel (right) layout implemented verified (No-Scroll UX).
- [x] **Interactive Controls**: Phonetic sound display and larger speaker replay button verified.
- [x] **HUD Clarity**: Active Lesson bubble now includes specific lesson ID verified.
- [x] **Progress Awareness**: Placeholder added for empty "My Progress" state verified.
- [x] **Vertical Button Stack**: CLEAR and DONE buttons positioned for easy thumb-access on right side verified.

## 🧭 Phase 14: Nav Dock Relocation
- [x] **Unobstructed Gameplay**: Global navigation dock is conditionally hidden during active lessons verified.
- [x] **Consolidated Header Controls**: Home, Restart, and Status controls relocated into the game card header verified.
- [x] **Consistent Exit UX**: EXIT and Home actions consolidated into a clean dark-capsule grouping verified.
- [x] **Conditional Rendering Tests**: Vitest component tests verify dock visibility across different modes verified.

## 🎧 Phase 15: Sound Match Ergonomics
- [x] **Feedback Button Relocation**: CONTINUE/RETRY button moved to the top header of the results box verified.
- [x] **Compact Layout**: Results box reduced in height to ensure all content fits "above the fold" on tablets verified.
- [x] **TDD Validation**: New SoundMatcher.test.jsx unit tests verify interaction and button labels verified.

## 🧩 Phase 16: Word Assembly Ergonomics & DND
- [x] **Side-by-Side Layout**: Assembly area (left) and Reference info (right) layout implemented verified.
- [x] **Pointer-Only Snapping**: `pointerWithin` collision detection prevents accidental snaps verified.
- [x] **Draggable Placed Tiles**: Tiles inside boxes remain draggable for correction verified.
- [x] **Return to Pool**: Dragging tiles out of boxes returns them to the pool verified.

## 📊 Phase 17: Progress Tracking Integrity
- [x] **Idempotent Lesson Completion**: Replaying a lesson no longer increments `currentLesson` beyond the next available one verified.
- [x] **Accurate Stats Display**: "Lessons Completed" dashboard stat now correctly reflects `lessonHistory.length` verified.
- [x] **Smoother Mastery Curve**: "Cycle Mastery" calculation now includes all items (trace, match, build) in the cycle verified.
- [x] **Unit Testing**: Added specific tests for safe `currentLesson` incrementing and cycle progress calculation verified.

## 🚀 Phase 18: Progression Accuracy & Thresholds
- [x] **Bounded Scoring**: Total score strictly tied to lesson stars (1*=100, 2*=200, 3*=300). Replaying Lesson 1 cannot exceed 300 pts verified.
- [x] **Reinforcement Queue**: Incorrect answers are automatically appended to the end of the session, forcing student to face them again verified.
- [x] **Passing Threshold (75%)**: User must earn at least 1 star (no more than 2 initial mistakes) to unlock the next lesson verified.
- [x] **Safe Lesson Pointers**: replaying Lesson 1 correctly updates Lesson 1 stats and DOES NOT unlock Lesson 3 verified.
- [x] **TDD Verification**: All backend and client tests passed 100% green verified.

## 🎓 Phase 11: Curriculum Consolidation
- [x] **Map Pacing**: Cycle 1 consolidated from 14 to 9 lessons for better content density verified.
- [x] **Character Coverage**: Added 5 missing characters (ൽ, ൂ, സ, ഷ, ഭ) with trace/match support verified.
- [x] **Vocabulary Completion**: All 100 core words now have verified `requiredCharacters` and `prerequisites` verified.
- [x] **Seeder Validation**: Database updated via `seeder.js` and all words confirmed to have correct lesson assignments verified.





## 🎨 Phase 4: Consumer-Grade UI Overhaul
- [x] **Game Background:** Vibrant, fixed-pattern sky background implemented verified (Visual Consistency).
- [x] **3D Buttons:** Chunky .btn-3d classes with physical press animations verified (UX Enhancement).
- [x] **Polished Map:** Railway/Train Map with high-quality gradients and wheels verified (Visual Consistency).
- [x] **Component Redesign:** Games (Trace, Match, Pick) use high-contrast, rounded card layouts verified (Visual Consistency).
- [x] **Badge Shelf:** Mastery Strip redesigned as a physical badge shelf with pop-in animations verified (Gamification Adherence).
- [x] **Audio Engine Safety:** Added checks for speechSynthesis to prevent test/headless environment crashes verified (Process Faultlines).


