# Plan: AUTH-06 — Multi-Profile Progression Isolation, Safe Legacy Migration, & Profile Renaming

## 1. Objective & Problem Statement
- **Issue 1:** Progression for second learner (`p2`, `p_...`) does not persist. Completing Lesson 1 results in a backend 500 error when querying `User`, causing the frontend catch block to flag the server status as "Offline".
- **Issue 2:** When Learner 1 (`p1`) is queried by `profileId`, it must seamlessly inherit any existing progress from `default_user` so the child does not lose progress and get reset to Lesson 1.
- **Issue 3:** Parents cannot rename "Learner 1" or any profile after onboarding within `ProfileSelector.jsx`.

## 2. Production Safety Directives
- Zero destructive queries (`deleteMany`, `dropCollection`, `remove`) against production `User` or `Progress`.
- Preserve existing progress for `default_user` and `p1`.
- Tests run against ephemeral databases (`NODE_ENV=test`).
- Zero SRS algorithm regressions.

## 3. Implementation Steps

### Step 1: Safe Progression Lookup & Legacy Migration (`server/services/srsEngine.js` & `server/routes/api.js`)
- Implement `getOrCreateUserProfile(userId, account)` in `server/services/srsEngine.js`.
- Checks if user exists with progress; if so, returns user.
- If primary profile (`p1` or account's default) and has no progress, check if `default_user` has completed lessons (`currentLesson > 1` or `lessonHistory.length > 0`). If found, clone to `p1` and re-associate `Progress` records.
- Safely initialize new profile using `User.findOneAndUpdate` with `$setOnInsert` and `upsert: true` to prevent concurrent E11000 duplicate key race conditions.
- Apply `getOrCreateUserProfile(userId)` across:
  - `GET /api/progress/stats`
  - `POST /api/session/lesson/complete`
  - `POST /api/progress/update`
  - `POST /api/session/revision/complete`
  - `POST /api/user/log` (new route for user interaction/heartbeat logging)

### Step 2: Auto-Init on Profile Creation (`server/routes/auth.js`)
- In `POST /api/auth/profiles`, auto-init `User` collection record with `$setOnInsert` upon creating a profile.
- In `POST /api/auth/profiles/:profileId/reset`, reset `User` progression (level, cycle, lesson, history) in addition to `Progress`.

### Step 3: Frontend Progression Sync & Token Persistence (`client/src/utils/api.js` & `client/src/context/ProgressContext.jsx`)
- In `client/src/utils/api.js`:
  - Export `getAuthToken`, `getAuthHeaders`, and `authFetch` attaching `Authorization: Bearer ${token}` from localStorage (`mp_auth_token`, `auth_token`, `mp_token`, `token`).
- In `client/src/context/ProgressContext.jsx`:
  - Watch `activeProfile?.profileId` and synchronize `userId`.
  - Fetch stats on profile switch using `activeProfile.profileId`.
  - Pass `userId: activeProfile.profileId` in all session payloads (`/api/session/lesson/complete`, `/api/user/log`, etc.).
  - Ensure all fetch calls include auth headers.

### Step 4: Editable Profile Name in `client/src/components/ui/ProfileSelector.jsx`
- Add edit button (✏️) with `data-testid="edit-profile-${profileId}-btn"`.
- Toggle inline edit mode with input `data-testid="profile-name-input-${profileId}"`.
- Provide "Save" (✓, `data-testid="save-profile-name-${profileId}-btn"`) and "Cancel" (✕, `data-testid="cancel-edit-profile-${profileId}-btn"`).
- Call `updateProfileName(profileId, newName)` from `useAuth()`.
- Add stopPropagation to prevent switching profiles on edit clicks.
- Support Enter to save and Escape to cancel.

## 4. Testing Strategy (4-Pillar Evaluation Matrix)
- **Accuracy:** Test that `default_user` progress is cloned to `p1`, while `p2` starts fresh at Lesson 1 with isolated progress.
- **Visual Consistency:** Test that `ProfileSelector.jsx` renders inline editing, respects dark charcoal / Bento pill styles, and cancels without saving.
- **Functional Adherence:** Test that completing Lesson 1 on Profile 2 does not throw 500, saves stars/lessonHistory, and maintains isolated scores.
- **Faultlines & Process Edge Cases:** Test concurrent profile initialization, empty name submission in rename, and missing userId fallback.
- **Regression Suites:** Run all backend Jest suites (`server`) and frontend Vitest suites (`client`).
