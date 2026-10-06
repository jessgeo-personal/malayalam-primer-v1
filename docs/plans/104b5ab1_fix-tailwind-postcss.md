# Plan: Fix Tailwind CSS v4 PostCSS Configuration

## Objective
Resolve the Vite startup error caused by breaking changes in Tailwind CSS v4, where the PostCSS plugin has been moved to a separate package.

## Key Files & Context
- `client/package.json`
- `client/postcss.config.js`

## Implementation Steps
1. **Install Missing Package:** Add `@tailwindcss/postcss` to the `dependencies` in `client/package.json`.
2. **Update Configuration:** Modify `client/postcss.config.js` to change the `tailwindcss` plugin key to `@tailwindcss/postcss`.

## Verification & Testing
1. Navigate to the `client` directory and run `npm install`.
2. Start the Vite server using `npm run dev`.
3. Verify that the previous `[postcss]` pre-transform error is gone and the development server starts cleanly on port 3000.
4. Verify the frontend loads cleanly on both desktop (`localhost:3000`) and the tablet-friendly network IP.