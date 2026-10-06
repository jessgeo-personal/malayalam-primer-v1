# Plan: Permanent Audit Tool & Curriculum Investigation

## Objective
1.  **Permanent Audit Tool**: Re-integrate the `WordAudit` component into `App.jsx` permanently, accessible via a discrete link in the global footer.
2.  **Curriculum Investigation**: Address the user's concern regarding the total word count falling short of the 300-word goal despite the presence of three seed files.

## Investigation Findings (The 300-Word Gap)
I have reviewed the `development_roadmap.md`, `regression_checklist.md`, and the seed data files. Here is why the database currently does not hold 300 fully configured words:

*   **Progressive Seeding**: The "300 core words" is the *final product goal* (as stated in `GEMINI.md`). The project is currently being built in phased Milestones.
*   **Current State (Phase 2)**: 
    *   `seed-100.json` (Cycle 1) contains foundational letters (traces/matches) and the first ~43 core words.
    *   `seed-200.json` (Cycle 2) contains ~50 items focused specifically on grammatical suffixes (Plurals, Locative cases).
    *   `seed-300.json` (Cycles 3 & 4) contains placeholders for 100+ advanced words (w201-w300). However, as discovered during the last audit, most of these currently have empty `requiredCharacters` arrays because their specific interactive lessons haven't been designed yet.
*   **Conclusion**: The gap exists because the data is being ingested progressively alongside feature development. The lists are not "lost" or failing to ingest; they are intentionally sparse placeholders waiting for future milestone sprints to define their pedagogical splits.

## Implementation Steps

### 1. Update `App.jsx` State
- Re-introduce the `showAudit` state: `const [showAudit, setShowAudit] = useState(false);`
- Re-import the component: `import WordAudit from './components/ui/WordAudit';`

### 2. Update Footer UI
- Locate the `<footer className="...">` at the bottom of `App.jsx`.
- Add an interactive, subtle toggle button that flips the `showAudit` state.
```jsx
<footer className="py-12 text-center text-slate-300 font-bold text-[9px] tracking-[0.4em] uppercase flex flex-col items-center gap-4">
  <span>Malayalam_Prime_v{APP_VERSION}</span>
  <button 
    onClick={() => setShowAudit(!showAudit)}
    className="hover:text-prime-coral-pink transition-colors border border-slate-200 px-4 py-1 rounded-full"
  >
    {showAudit ? 'RETURN TO GAME' : 'DATABASE AUDIT'}
  </button>
</footer>
```

### 3. Update Main Render
- Modify the `<main>` block to conditionally render `<WordAudit />` if `showAudit` is true.

## Verification
- Click the "DATABASE AUDIT" link in the footer.
- Verify the Audit screen loads and displays the dictionary.
- Click "RETURN TO GAME" and verify the normal map/lesson UI is restored.