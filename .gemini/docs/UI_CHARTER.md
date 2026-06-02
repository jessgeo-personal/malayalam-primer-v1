# UI Charter - Malayalam Prime Design Standards

This document establishes foundational UI/UX mandates to ensure consistency, pedagogical effectiveness, and "micro-joy" throughout the application.

## 1. Global Identity
*   **Header Text:** Always use **"Let's Learn Malayalam!!"** in the primary hero slot.
*   **Aesthetic:** Soft Premium Neo-Bento (Warm creamy backgrounds, hyper-rounded 32px-48px corners, dark charcoal capsules).

## 2. Gamification & Feedback (The Micro-Joy System)
Every positive pedagogical action must be met with proportional visual feedback via the `CelebrationManager`.

### 2.1 Trigger Events
*   **Standard Sparkle (`sparkle`):** Triggered on every correct answer.
*   **Redemption Starburst (`redemption`):** Triggered when a student correctly answers a word they previously failed in the same session (Reinforcement Queue).
*   **Epic Celebration (`epic`):** Triggered when completing a "Hard Word" (length > 5 chars) or finishing a lesson perfectly.

### 2.2 Audio Interaction
*   **Manual Triggering:** For grammar games (like Time Machine), prefer manual 🔊 speaker buttons over auto-play. This allows the child to control the pace of learning.

## 3. Session Summary & Mastery
The Summary screen must be transparent about the child's performance to encourage improvement.

### 3.1 Metrics
*   Always display **Total Correct** vs. **Total Errors**.
*   Calculate Stars: 0 errors = 3★, 1 error = 2★, 2 errors = 1★, 3+ errors = 0★.

### 3.2 Mastery States
*   **3 Stars:** "Perfect! Lesson Mastered!" (Primary Action: CONTINUE →)
*   **1-2 Stars:** "Good Job! Lesson Passed!" (Primary Action: CONTINUE →)
*   **0 Stars:** "Keep Practicing! Lesson Incomplete." (Primary Action: TRY AGAIN LATER)
    *   *Constraint:* Lessons with 0 stars are deemed incomplete and should be presented again in the next cycle.

## 4. Navigation & Layout
*   **Safe Zones:** Ensure a bottom padding of at least `pb-48` in the main container to prevent UI overlap with floating docks.
*   **The Dock:** The global navigation dock (Home, Refresh, Status) resides in the **Bottom Right Corner** to remain accessible but non-intrusive.
*   **Live Status:** The dock must always show a live server connection indicator (Online/Offline/Syncing).
