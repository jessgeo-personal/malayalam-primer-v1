# Plan UI-01: AdventureMap Bento Structure & Section Layout Refactor

## 📌 Context & Purpose
Refactor `client/src/components/ui/AdventureMap.jsx` and `client/src/App.jsx` according to the approved Soft Premium Neo-Bento design. Consolidate redundant stats, nest objective and stats into a unified "Your Progress" Hero Card, and enforce the exact vertical section order.

## 🎯 Scope of Work

### 1. Restructure 'Your Progress' Card (`AdventureMap.jsx`)
- **Upper Portion (3-column grid `grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch`)**:
  - **Column 1 (Left)**:
    - Cycle Name (`Cycle ${currentCycle}: ${cycleName}` matching PRD: Fact & Identity, Action & Inquiry, Directional, Narrative).
    - Learner Level badge (`LEVEL {Math.floor(score / 500) + 1}`).
    - Helper note (`⭐ Tap any completed train bogie below to replay and earn 3 stars!`).
  - **Column 2 (Center)**:
    - 'NEXT UP' card containing target lesson title (`Lesson ${currentLesson}`) and dynamic CTA (`▶ Resume Lesson ${currentLesson}` if active/paused, `🚀 Start Lesson ${currentLesson}` otherwise).
  - **Column 3 (Right)**:
    - Stack of 2 compact stat cards:
      * `📚 LESSONS COMPLETED` displaying `{completed} / {total}`.
      * `⭐ TOTAL POINTS` displaying `{points} pts`.
- **Bottom Portion**:
  - Full-width cycle progress bar spanning 100% (`w-full`) with percentage label (`Cycle ${currentCycle} Mastery: {cycleProgress}%`).

### 2. Remove Redundant Sections
- In `client/src/App.jsx`:
  - Completely remove the old `{/* 2. Learning Plan Bento Grid */}` standalone stats row (which duplicated cycle progress and points/completed lessons).
  - Remove extra standalone `<h2>Lessons</h2>` header and wrap directly into `<AdventureMap />`.

### 3. Enforce Exact Vertical Page Ordering
Render sections in this exact order:
1. **'Your Progress' Card** (Hero with embedded Next Up, Stacked Stats, and Full-Width Progress Bar)
2. **'Practice' Section** (Daily Revision engine)
3. **'Adventure Map'** (Train Engine and Lesson Bogeys)
4. **'Fluency Master'** (Milestone Badges & Cycle Streaks)
5. **'My Letters' / Mastery Strip** (Learned Graphemes Shelf at the bottom)

### 4. Verification & Testing Strategy
- Update test assertions in `client/src/tests/AuthAndNavigationUX.test.jsx` for helper text match (`⭐ Tap any completed train bogie below to replay and earn 3 stars!`).
- Add tests verifying the 3-column layout, stat cards (`📚 LESSONS COMPLETED`, `⭐ TOTAL POINTS`), Fluency Master badges, and Mastery Strip placement.
- Run `npm --prefix client test -- --run` and `npm --prefix server test` ensuring 100% green pass.
- Bump version to `2026.10.08.001` in `client/src/config/version.js` and record changelog.
