# Plan: 020 - Global Tablet Width Expansion

## Objective
Increase the overall width of the Malayalam Prime application to fully utilize tablet screen real estate. This will resolve the "squished" appearance in the Word Assembly and Tracing games, allowing long words to fit comfortably on a single row without requiring horizontal scrolling or wrapping.

## Key Files & Context
- `client/src/App.jsx`: Controls the global container width and the central game box width.
- `client/src/components/games/LetterPicker.jsx`: Needs adjustment to remove the forced horizontal scroll, as the wider screen makes it unnecessary.
- `client/src/components/games/TracingCanvas.jsx`: The right-hand sidebar needs a slightly wider fixed width or flexible layout to prevent example words from being cut off.

## Implementation Steps

### Step 1: Global App Container Expansion (`App.jsx`)
1. In the `App` component, locate the `<main>` tag for the application body.
2. Change its width constraint from `max-w-6xl` to `max-w-[1600px]` or `w-[95%]` to allow the app to stretch almost fully edge-to-edge on wide screens.
3. Locate the central game container (rendered when `sessionStatus !== 'idle'` and not complete): `<div className="w-full max-w-4xl ...">`.
4. Change `max-w-4xl` (896px) to `max-w-[1400px]` or `w-[90%]`. This provides a massive ~50% increase in playable width for all mini-games.

### Step 2: Revert Word Assembly Scroll (`LetterPicker.jsx`)
1. With the new 1400px width, forcing horizontal scrolling is a worse UX than simply letting items flow naturally. 
2. In `LetterPicker.jsx`, locate the Drop Zones and Tile Pool containers.
3. Revert `flex-nowrap overflow-x-auto pb-6 snap-x snap-proximity` back to `flex-wrap`. The massive new width guarantees long words (like എഴുന്നേൽക്കുക) will fit on one row naturally without scrollbars.
4. Remove the `snap-center` classes from the individual slot/tile wrappers.

### Step 3: Tracing Canvas Sidebar Adjustment (`TracingCanvas.jsx`)
1. In `TracingCanvas.jsx`, locate the right-hand column: `<div className="w-full md:w-64 flex flex-col gap-6">`.
2. The `w-64` (256px) is too narrow for longer example words. Increase this to `md:w-80` (320px) or `md:w-96` (384px) to give the examples more breathing room.
3. Ensure the left column (the drawing pad) remains flexible (`flex-[2.5]` or `flex-[3]`) so it absorbs the rest of the new massive screen width.

### Step 4: Regression Update
1. Add "Phase 22: Global Width Expansion" to the `.gemini/docs/regression_checklist.md`, checking off the specific layout changes for App, Tracing, and Word Assembly.

## Verification & Testing
- Load the app and verify the main dashboard (Adventure Map) looks cohesive at the wider resolution.
- Start a tracing lesson and ensure the right-side panel does not truncate long example words.
- Start a Word Assembly lesson with a long word and verify it fits on one horizontal line naturally without scrollbars.