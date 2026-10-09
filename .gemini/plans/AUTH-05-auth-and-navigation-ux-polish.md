# Plan AUTH-05: Auth & Navigation UX Polish (Onboarding Name, Profile Cancel, Scroll Guard, Smart CTAs)

## 📌 Context & Purpose
Task AUTH-05 refines the user authentication and navigation loop for Malayalam Prime, focusing on tablet-first usability, smooth onboarding for fresh learner accounts, intuitive modal dismissing, reliable scroll resets between gameplay views, and intelligent context-aware calls to action on the Adventure Map.

## 🎯 Scope of Work

### Feature 1: First Learner Onboarding
- **Backend (`POST /api/auth/verify-otp`)**:
  - Detect if the authenticated account is a fresh registration or has exactly one profile with default name `'Learner 1'` and 0 progress records in MongoDB.
  - Return `isNewAccount: true` in the JSON response payload.
- **Backend (`PUT /api/auth/profiles/:profileId`)**:
  - Protected endpoint with `authMiddleware`.
  - Validates `req.body.name` as a non-empty string.
  - Updates the matching profile's name under `req.account.profiles`.
  - Saves the account and returns `{ success: true, profile: updatedProfile }`.
  - Returns `404 Not Found` if the `profileId` does not belong to `req.account`.
- **Frontend (`AuthContext.jsx`)**:
  - Implement `updateProfileName(profileId, newName)` calling `PUT /api/auth/profiles/:profileId` with the JWT Bearer token.
  - Syncs `activeProfile` and `account.profiles` state, updating localStorage.
- **Frontend (`AuthModal.jsx`)**:
  - In `handleVerifyOtp`, if `isNewAccount === true`, transitions to Step 3: "Learner Onboarding" instead of closing immediately.
  - Displays prompt: "What is your learner's name?" with an input field (placeholder: "e.g., Aarav, Diya") and a "Save & Start" button.
  - Submitting calls `updateProfileName(firstProfileId, learnerName)` and closes the modal.

### Feature 2: Cancel / Close Button on ProfileSelector
- **Frontend (`ProfileSelector.jsx`)**:
  - Accept `onClose` callback prop.
  - Add a clearly styled "Cancel" button beside the "Add Learner" / "Add Profile" button.
  - Clicking "Cancel" invokes `onClose` to dismiss the selector.
- **Frontend (`App.jsx`)**:
  - Pass `onClose={() => setShowProfiles(false)}` to `<ProfileSelector />`.

### Feature 3: Global Scroll Guard in App.jsx
- **Frontend (`App.jsx`)**:
  - Introduce a `useEffect` hook listening to `[activeView, activeLesson, currentAct]`.
  - Resets the scroll position immediately:
    ```javascript
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const mainContainer = document.querySelector('main') || document.documentElement;
    if (mainContainer) mainContainer.scrollTop = 0;
    ```
  - Prevents learners on tablets from remaining scrolled down when navigating between lessons, game types, or map views.

### Feature 4: Context-Aware Hero CTAs in AdventureMap
- **Frontend (`AdventureMap.jsx`)**:
  - Consume `currentLesson`, `activeLesson` (or `activeLessonId`), and `lessonHistory` from `ProgressContext`.
  - Render a Hero Objective card at the top of the AdventureMap view.
  - If a lesson is currently active/paused:
    - Primary CTA button displays: `▶ Resume Lesson {currentLesson}`.
  - If starting fresh or previous lesson was completed:
    - Primary CTA button displays: `🚀 Start Lesson {currentLesson}`.
  - Render secondary guidance text:
    - `"⭐ Want to improve your score? Tap any completed bogie on the train map below to replay for 3 stars!"`

## 🧪 Testing Strategy (4-Pillar Matrix)
1. **Accuracy**:
   - Backend checks profile ownership, validates names, and verifies isolation so users cannot rename profiles in alien accounts.
   - `isNewAccount` flag accurately identifies zero-progress single-profile accounts.
2. **Visual Consistency**:
   - Neo-Bento styles for the new Onboarding screen in `AuthModal`.
   - Clear high-contrast styling for the Cancel button in `ProfileSelector`.
   - Hero Objective card in `AdventureMap` conforms to tablet-first design.
3. **Functional Adherence**:
   - Onboarding flow updates name and propagates immediately to the header profile pill and dashboard.
   - Dismissing `ProfileSelector` cleanly hides the component.
   - Scroll guard executes on all view, lesson, and act changes.
   - Hero CTA triggers active lesson resumption or new lesson start correctly.
4. **Process Faultlines (Edge Cases)**:
   - Empty/whitespace name rejection in both backend and frontend.
   - 404 handling when editing invalid profileId.
   - Safe behavior when window/mainContainer scroll methods are invoked in headless environments (JSDOM/Vitest).

## 🚀 Execution Sequence
1. Create planning documents and update execution tracker & regression checklist.
2. Backend TDD: Write failing tests in `server/tests/profiles.test.js` and `server/tests/auth.test.js`.
3. Backend implementation: Update `server/routes/auth.js` (`verify-otp` and `PUT /profiles/:profileId`).
4. Frontend TDD & Implementation:
   - Add `updateProfileName` to `AuthContext.jsx`.
   - Update `AuthModal.jsx` for Step 3 Onboarding.
   - Update `ProfileSelector.jsx` with Cancel button and `onClose` handler.
   - Update `App.jsx` with scroll guard and `onClose` binding.
   - Update `AdventureMap.jsx` with context-aware Hero progress card.
   - Add frontend unit tests in `client/src/tests/AuthFlow.test.jsx` (and/or dedicated test file).
5. Full verification: Run all server tests (`npm --prefix server test`) and client tests (`npm --prefix client test -- --run`).
6. Update Execution Tracker, bump version to `2026.10.07.005`, and update CHANGELOG.
