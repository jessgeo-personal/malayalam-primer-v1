# Plan: Finalize Project Support Documents (Phase 0/1 Completion)

## Objective
Update the core `GEMINI.md` project charter to permanently encode the pedagogical and technical rules discovered and implemented during Phase 0 and Phase 1. This ensures that future agent sessions or new developers inherently understand the established architecture.

## Scope & Context
- `GEMINI.md`: Needs updates to the Educational Architect section and the Technical Debt definitions to enforce the new strict learning flow.

## Implementation Steps
1. **Update Persona Rules:** Edit the "Educational Architect" section in `GEMINI.md` to formally mandate the `lessonType` sequence: `trace` -> `match` -> `build`.
2. **Update Technical Rules:** Add a strict rule against using standard JavaScript `.split('')` for Malayalam text, referencing the new `.gemini/docs/word_splitting_protocol.md`.
3. **Closing Commit:** (To be executed via terminal) Run `git add .` and `git commit -m "Documentation: Finalized Phase 0/1 support documents and updated project instructions"`.

## Verification
- Confirm the `GEMINI.md` file reflects the exact new constraints.
- Confirm the git working directory is clean.