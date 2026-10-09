# Plan AUTH-04: Frontend Auth Flow (GREEN Phase)

## 1. Context & Objectives
- Building on Track A backend deliverables (`AUTH-01`, `AUTH-02`, `AUTH-03`), implement the complete frontend authentication and multi-profile management architecture.
- Adopt **Option 1: Dedicated AuthContext** (`client/src/context/AuthContext.jsx`), keeping token handling, account state, and multi-profile operations decoupled from `ProgressContext`.
- Provide tablet-first Neo-Bento UI components:
  - `AuthModal`: Two-step modal (Email input -> 6-digit OTP verification).
  - `ProfileSelector`: 3-profile card grid, active switcher, new profile creation with 3-profile limit, and independent progress reset.
- Integrate `AuthContext` into `App.jsx` and sync `activeProfile.profileId` into `ProgressContext.jsx` with safe fallback to existing unauthenticated state.
- Transition from RED to 100% GREEN across targeted Vitest tests, client test suite, and server test suite.

## 2. Implementation Architecture & State Model

### 2.1 Dedicated AuthContext (`client/src/context/AuthContext.jsx`)
- **State**:
  - `token`: Initialized from `localStorage.getItem('mp_auth_token') || localStorage.getItem('auth_token') || null`.
  - `account`: Initialized from `localStorage.getItem('mp_account') || localStorage.getItem('account') || null`.
  - `activeProfile`: Initialized from `localStorage.getItem('mp_active_profile_id') || localStorage.getItem('active_profile_id') || account?.profiles?.[0] || null`.
  - `loading`: Boolean indicating async operations.
  - `error`: Error message string or null.
  - `isAuthModalOpen`: Boolean controlling modal visibility.
- **Methods**:
  - `openAuthModal()`: Sets `isAuthModalOpen = true`.
  - `closeAuthModal()`: Sets `isAuthModalOpen = false`.
  - `requestOtp(email)`: POST `/api/auth/request-otp` with `{ email }`.
  - `verifyOtp(email, otp)`: POST `/api/auth/verify-otp` with `{ email, otp }`. Persists token, account, and active profile to localStorage.
  - `fetchProfiles()`: GET `/api/auth/profiles` with Bearer token.
  - `createProfile(name, avatar)`: POST `/api/auth/profiles` with Bearer token. Updates account profiles and switches active profile.
  - `switchProfile(profileId)`: POST `/api/auth/profiles/switch` with Bearer token. Updates `activeProfile` in state and localStorage.
  - `resetProfile(profileId)`: POST `/api/auth/profiles/:profileId/reset` with Bearer token.
  - `logout()`: Clears localStorage auth keys and resets state.
- **Hook Fallback**:
  - `useAuth()` returns safe default no-op handlers and null state when invoked outside `AuthProvider`, preventing test breakages.

### 2.2 UI Components
- **`AuthModal` (`client/src/components/ui/AuthModal.jsx`)**:
  - Step 1: Email entry with `data-testid="auth-email-input"` and submit button `data-testid="auth-send-otp-btn"`.
  - Step 2: 6-digit OTP code entry with `data-testid="auth-otp-input"` and `data-testid="auth-verify-otp-btn"`.
  - Close button ('✕') and backdrop click handler.
  - Styled with Soft Premium Neo-Bento aesthetic (`#FFFDF6`, dark charcoal `#1A1E26` action pills, hyper-rounded corners).
- **`ProfileSelector` (`client/src/components/ui/ProfileSelector.jsx`)**:
  - Profile cards grid displaying names and active indicators with `data-testid={`profile-card-${profileId}`}`.
  - Tapping a card switches the active profile.
  - Add profile input and button with `data-testid="add-profile-btn"`, disabled when profile count is >= 3.
  - Per-profile Reset Progress button with `data-testid={`reset-profile-${profileId}-btn`}`, triggering `window.confirm` before invoking `resetProfile`.

### 2.3 ProgressContext & App Integration
- In `ProgressContext.jsx`:
  - Consume `useAuth` safely.
  - Sync `userId` to `activeProfile.profileId` when authenticated; fallback to `localStorage.getItem('mp_userId') || 'Learner 1'` when unauthenticated.
- In `App.jsx`:
  - Wrap top-level structure with `<AuthProvider>`.
  - In header, display Active Profile badge / Parent Login trigger, opening `AuthModal` or `ProfileSelector`.

## 3. Testing & Verification Gates (4-Pillar Evaluation Matrix)
- **Accuracy**: Exact synchronization of JWT token, accounts, profiles, and localStorage items.
- **Visual Consistency**: Tablet-first Neo-Bento cards, accessible test IDs (`auth-email-input`, `auth-otp-input`, `profile-card-p2`, `add-profile-btn`, `reset-profile-p1-btn`).
- **Functional Adherence**: All 6 tests in `AuthFlow.test.jsx` pass (100% green).
- **Process Faultlines**: Rejection of invalid OTPs, graceful handling of offline/network errors, profile ceiling enforcement at 3.
- **Zero-Regression Mandate**:
  - `npm --prefix client test src/tests/AuthFlow.test.jsx -- --run` -> PASS (6/6).
  - `npm --prefix client test -- --run` -> PASS (all 12 suites, 40 tests).
  - `npm --prefix server test` -> PASS (all 10 suites, 49 tests).

## 4. Execution Steps
1. Create plan files in `docs/plans/` and `.gemini/plans/`.
2. Implement `client/src/context/AuthContext.jsx` and update `client/src/context/index.js`.
3. Implement `client/src/components/ui/AuthModal.jsx` and `client/src/components/ui/ProfileSelector.jsx`, updating `client/src/components/ui/index.js`.
4. Integrate into `client/src/context/ProgressContext.jsx` and `client/src/App.jsx`.
5. Run targeted and regression tests.
6. Update version to `2026.10.07.004` in `client/src/config/version.js`.
7. Update `docs/EXECUTION_TRACKER.md`, `docs/log/CHANGELOG.md`, and `.gemini/log/CHANGELOG.md`.
