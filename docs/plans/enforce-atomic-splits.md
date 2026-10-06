# Plan: Enforce Atomic Phonetic Splits (No Shortcuts)

## Objective
Ensure that the `ുക` (uka) shortcut, or any similar multi-character suffix block, is never used by the AI or developers when splitting words in the future. We must mandate absolute atomic phonetic splitting.

## Key Files
- `.gemini/docs/word_splitting_protocol.md`

## Implementation Steps
I will update the core prompt template in `word_splitting_protocol.md` to include a strict, explicit rule forbidding shortcut blocks.

**Rule to Add:**
`5. **No Shortcut Suffixes**: Never group multiple phonetic units into a single block (e.g., NEVER use 'ുക' as a single unit). You must split them into their atomic phonetic components (e.g., 'ു', 'ക').`

Because I (the AI) strictly read and follow this `word_splitting_protocol.md` file whenever I am asked to generate or refactor word data, embedding this rule directly into the protocol guarantees it will be respected going forward.

## Verification
- Confirm the rule is present in the `word_splitting_protocol.md` file.