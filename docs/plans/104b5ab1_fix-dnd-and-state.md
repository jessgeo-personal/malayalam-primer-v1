# Plan: Fix UX Interactions & Backend State

## Objective
1. **Fix Touch UX:** Improve the drag-and-drop experience on Android tablets by explicitly defining Touch/Mouse sensors and adding active hover highlighting for the drop zones.
2. **Apply Backend Fixes:** The gamification endpoints (Score & Mastery Strip) were implemented in code but the local Node.js server process was not restarted to apply them. We need to restart the backend to activate the API.

## Scope & Context
- `client/src/components/games/LetterPicker.jsx`: Import `@dnd-kit/core` sensors (`TouchSensor`, `MouseSensor`, `useSensor`, `useSensors`, `closestCenter`) to ensure mobile compatibility and smooth snapping.
- `server/server.js`: Restart the process.

## Implementation Steps
1. **DND UX Enhancements (`LetterPicker.jsx`):**
   - Add `const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }));`
   - Pass `sensors={sensors}` and `collisionDetection={closestCenter}` to `<DndContext>`.
   - Update `DroppableSlot` to use the `isOver` boolean. When `isOver` is true, change the border/background color to highlight that the tile is ready to snap in.
2. **Backend Restart:**
   - Since the backend runs via `node server.js`, any changes made to `api.js` (like the stats and score updates) require a manual process restart. I will kill the node process and restart it.
3. **Guardrails:**
   - Update `client/src/config/version.js` to `.014`.
   - Update `CHANGELOG.md`.
   - Commit changes to the `dev` branch.

## Verification
- Run tests (`npm test`).
- Start backend and frontend.
- Open Chrome DevTools with Mobile simulation (Touch enabled) and verify dragging is smooth, snaps to `closestCenter`, and the drop zone turns blue when hovered.
- Verify the Mastered Letters strip and Score successfully load now that the backend API is active.