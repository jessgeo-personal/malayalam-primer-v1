# Plan: Fix Vite OXC Syntax Error

## Objective
Diagnose and fix the Vite OXC plugin error in `AdventureMap.jsx`.

## Scope
1.  **Root Cause Analysis:** The Vite OXC plugin is stricter about JSX syntax than Babel. The error indicates an unclosed or improperly nested tag within the `cycles.map(...)` logic of the `AdventureMap.jsx` component. My previous edit likely introduced a subtle syntax error that the Vite development server's parser is catching.

2.  **The Fix (`AdventureMap.jsx`):**
    *   I will carefully rewrite the JSX block inside the `cycles.map` function.
    *   This involves ensuring every `<div>`, `<button>`, and `<span>` has a corresponding closing tag or is correctly self-closed.
    *   I will pay special attention to the conditional rendering block `(isActive || !isLocked) ? (...) : (...)` to make sure both the "if" and "else" branches return valid, well-formed JSX.

3.  **Verification:**
    *   Run `npm run build` in the `client` directory to confirm the OXC parser successfully compiles the component without errors.
    *   Run `npm test -- --run` to ensure no component rendering logic was broken during the syntax fix.
    *   Manually test the Adventure Map to verify that all cycle states (active, completed, locked) render as expected.
    *   Update the `regression_checklist.md` to include a check for "Vite OXC Parser Compliance."
    *   Update `CHANGELOG.md` to document the bug fix.