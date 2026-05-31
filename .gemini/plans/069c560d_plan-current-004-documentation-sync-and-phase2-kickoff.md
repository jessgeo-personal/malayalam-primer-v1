# Plan: 004 - Stability Fix & Documentation Sync

## Objective
Fix a critical syntax error in `AdventureMap.jsx`, synchronize all supporting development documents with the current codebase state (`2026.05.28.008`), and define the immediate roadmap for Phase 2 (Grammar Factory).

## Key Files & Context
- `client/src/components/ui/AdventureMap.jsx`: Missing closing `);`, `};`, and `export`.
- `development_roadmap.md`: Needs update to reflect Phase 1 completion.
- `future_enhancements.md`: Needs update to move implemented features to "Completed".
- `GEMINI.md`: Needs minor alignment with the Neo-Bento UI Charter.
- `regression_checklist.md`: Needs update to include latest UI components.

## Implementation Steps
### 1. Fix AdventureMap.jsx Syntax
- Add missing `);`, `};`, and `export default AdventureMap;` to the end of the file.

### 2. Update Roadmap
- Mark Phase 0 (Alphabet) and Phase 1 (Foundation) as **[COMPLETED]**.
- Detail Phase 2 (Grammar Factory) with specific milestones:
    - Milestone 2.1: Suffix Snapper (Plural & Case Markers).
    - Milestone 2.2: Tense Transformations (Past/Present/Future).
    - Milestone 2.3: Sentence Scrambler (Basic Sentence Construction).

### 3. Update Future Enhancements
- Move "Daily Revision Plan" and "Adventure Map Dashboard" to a new "Completed Features" section.
- Add "AI-Assisted Vibe Decoder" (Intent recognition) to the backlog.

### 4. Align GEMINI.md
- Update Section 4 (UI/UX) to reference the "Soft Premium Neo-Bento" style and the bottom navigation dock.
- Ensure all technical guardrails reflect the current architecture (SRS 3-Tier, Graduation).

### 5. Regression Checklist Audit
- Ensure the checklist includes the new "Neo-Bento" UI components and the Floating Nav Dock.

## Verification & Testing
- **Syntax Check:** Run `npm run dev` in the client directory to ensure the Vite parse error is resolved.
- **Manual Review:** Verify all markdown files for consistency with the implementation.
- **UI Check:** Confirm the Adventure Map renders correctly on the dashboard.
