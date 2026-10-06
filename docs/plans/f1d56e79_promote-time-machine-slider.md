# Plan: Promote Time Machine Slider to Production (Milestone 2.3)

## Objective
Promote the experimental Time Slider prototype to the production game loop within the unified [TimeMachine.jsx](file:///D:/MyApps/malayalam-prime-v1/client/src/components/games/TimeMachine.jsx) component. The layout will dynamically alternate between Slider and Zones based on the word's ID.

## Proposed Changes

### 1. `client/src/components/games/TimeMachine.jsx`
- Support both `zones` and `slider` layouts.
- Dynamic selection using word ID modulo 2 (Odd = Slider, Even = Zones).
- Add support for a manual `layout` override prop.
- Refactor the slider interface using the Soft Premium Neo-Bento UI palette and tokens.
- Keep the identical standardized feedback overlay and `onComplete` callbacks for seamless state integration.
- Ensure the slider doesn't initialize at the correct answer (shifting target 'present' start to -1 or 1).

### 2. `client/src/tests/TimeMachine.test.jsx`
- Add unit tests validating both layout variations and answer actions.

### 3. `client/src/config/version.js`
- Bump version to `2026.06.05.001`.

### 4. `.gemini/log/CHANGELOG.md`
- Log the release under `[2026.06.05.001]`.

## Testing Strategy
- **Unit Tests:** Execute `npm test -- --run` in `client` directory to confirm both modes pass test specs.
- **Backend Tests:** Run `npm test` in the `server` directory to check for schema/curriculum parity.
- **Manual Verification:** Test touch slide functionality in Lesson 16 and verify correct feedback triggers.
