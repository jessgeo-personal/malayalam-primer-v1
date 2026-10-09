# Plan History: 003 - UI Overhaul: Neo-Bento System

## Objective
Rebuild the entire frontend aesthetic to match the "Soft Premium Neo-Bento" charter, prioritizing tablet usability and professional polish.

## Context
The previous "Arcade" and "Cyber-Pop" styles were functional but lacked the premium feel required for the final product.

## Implementation Steps
### 1. Tailwind v4 Migration & Theme
- Migrate theme configurations to the `@theme` directive in `index.css`.
- Add the "Soft Premium" palette: Canvas (`#FFFDF6`), ActionDark (`#1A1E26`), CoralPink, TealGreen, and MangoOrange.
- Standardize `rounded-bento` (32px) and `rounded-pill` (100px).

### 2. Dashboard & Navigation
- Re-implement the Home screen as a Bento Grid with card-stack layouts.
- Create a "Hero Stat" block (extrabold, 7xl font) for primary progress metrics.
- Add the "Floating Navigation Dock"—a dark charcoal capsule at the bottom of the screen.

### 3. Game Component Refinement
- **Tracing Canvas:** Center-align and enlarge the tracing matrix. Fix ghost letter scaling.
- **Action Pills:** Replace all "arcade" buttons with sleek dark charcoal capsules.
- **Course Deck:** Refactor the Adventure Map into a horizontal "Cycle Card" stack with alternating accents.

## Verification & Testing
- **Visual Audit:** Cross-reference all components against the `UI_CHARTER.md` and original style sheets.
- **Accessibility Check:** Verify WCAG AA contrast compliance for obsidian text on pastel backgrounds.
- **Tablet Responsiveness:** Test touch targets and layout spacing on Android tablet simulation.
