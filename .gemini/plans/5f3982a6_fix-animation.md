# Plan: Fix Suffix Snapper Morphing Animation

## Objective
Ensure the user can clearly see the base word transforming into its `morphedBase` (e.g. വീട് -> വീടു) before the "Excellent" success overlay covers the screen.

## Root Cause
Currently, the `feedback` state is set immediately when the user drops the correct suffix into the drop zone. Setting the `feedback` state instantly renders a full-screen semi-transparent overlay (`fixed inset-0 z-[100]`), which visually obscures the underlying DropZone exactly as the morphing animation begins.

## Proposed Fix
1. **Delay the Overlay:** We will separate the "correct answer evaluation" state from the "show overlay" state.
2. In `client/src/components/games/SuffixSnapper.jsx`, when the answer is correct:
   - Immediately update `placedSuffix` and a new `isMorphingActive` state to trigger the visual transformation and pulse on the base word.
   - Use `setTimeout` (e.g., 1200ms) to delay setting the full `feedback` state (which triggers the overlay).
3. For incorrect answers, the feedback overlay can appear immediately or with a much shorter delay, as there is no morphing animation to watch.
4. Clean up timeouts in `useEffect` if the component unmounts.