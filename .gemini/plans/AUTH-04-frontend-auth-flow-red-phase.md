# Plan AUTH-04: Frontend Auth Flow (RED Phase)

## 1. Context & Objectives
- Building on Track A backend deliverables (`AUTH-01`, `AUTH-02`, `AUTH-03`), implement the frontend authentication and multi-profile management architecture.
- Adopt **Option 1: Dedicated AuthContext** (`client/src/context/AuthContext.jsx`), keeping authentication, account state, and multi-profile operations decoupled from `ProgressContext`.
- Provide tablet-first Neo-Bento UI components:
  - `AuthModal`: Two-step modal (Email input -> 6-digit OTP verification).
  - `ProfileSelector`: 3-profile card grid, active switcher, new profile creation with 3-profile limit, and independent progress reset.
- BDD/TDD RED Phase: Author `client/src/tests/AuthFlow.test.jsx` covering 6 acceptance scenarios and verify clean test failures before implementing components.

## 2. Architecture & Design

### 2.1 Dedicated AuthContext (`client/src/context/AuthContext.jsx`)
- **State**:
  - `token`: Bearer JWT stored in `localStorage.getItem('mp_auth_token')`.
  - `account`: `{ email: string, profiles: Array<{ profileId, name, avatar, isDefault }> } | null`.
  - `activeProfile`: Currently selected `{ profileId, name, avatar, isDefault } | null`.
  - `isAuthenticated`: Boolean flag (`!!token && !!account`).
  - `isAuthModalOpen`: Boolean controlling modal visibility.
- **Methods**:
  - `openAuthModal() / closeAuthModal()`
  - `requestOtp(email)`: Calls `POST /api/auth/request-otp`.
  - `verifyOtp(email, otp)`: Calls `POST /api/auth/verify-otp`, stores token in `localStorage`, updates `account` and `activeProfile`.
  - `switchProfile(profileId)`: Calls `POST /api/auth/profiles/switch`, updates `activeProfile`, persists selection in `localStorage`.
  - `addProfile(name, avatar)`: Calls `POST /api/auth/profiles`, updates account profile list and sets newly created profile as active.
  - `resetProfile(profileId)`: Calls `POST /api/auth/profiles/:profileId/reset`.
  - `logout()`: Clears localStorage items (`mp_auth_token`, `mp_active_profile_id`), resets state.

### 2.2 UI Components
- **`AuthModal` (`client/src/components/ui/AuthModal.jsx`)**:
  - **Step 1 (Email)**: Email input field with large "Send Code" action capsule.
  - **Step 2 (OTP)**: 6-digit OTP code entry with "Verify & Login" button and "Change Email" action.
  - Tablet-friendly large touch targets, high contrast, clean error feedback.
- **`ProfileSelector` (`client/src/components/ui/ProfileSelector.jsx`)**:
  - Displays cards for all account profiles (up to 3).
  - Shows active badge on currently selected learner.
  - Tapping a card switches the active profile via `switchProfile`.
  - "Add Profile" button/form enabled when `profiles.length < 3`, disabled/hidden when ceiling of 3 is reached.
  - "Reset Progress" button with confirmation prompt invoking `resetProfile`.

## 3. Testing Strategy (4-Pillar Evaluation Matrix)
- **Accuracy**: Tests verify exact API contract compliance, localStorage synchronization, and state immutability.
- **Visual Consistency**: Tablet-first UI conventions, explicit test IDs and accessible roles/labels.
- **Functional Adherence**:
  1. `Unauthenticated initial state`: Displays login trigger button and null active user when no token exists in localStorage.
  2. `AuthModal Step 1`: Submits email to `POST /api/auth/request-otp` and transitions view to OTP entry.
  3. `AuthModal Step 2`: Submits OTP to `POST /api/auth/verify-otp`, persists token to localStorage, populates account profiles, and sets initial active profile.
  4. `ProfileSelector Switch`: Invokes `POST /api/auth/profiles/switch` and persists new active profile selection.
  5. `Profile Ceiling Enforcement`: Disables or blocks profile creation when 3 profiles exist.
  6. `Profile Reset`: Prompts for confirmation and triggers `POST /api/auth/profiles/:profileId/reset`.
- **Process Faultlines**: Reject invalid OTPs, handle network errors gracefully, and prevent exceeding profile limits.
- **Red Phase Verification**: Test suite must fail cleanly because `AuthContext`, `AuthModal`, and `ProfileSelector` are not yet created.

## 4. Execution Steps
1. Create `docs/plans/AUTH-04-frontend-auth-flow-red-phase.md` and mirror to `.gemini/plans/`.
2. Update `.gemini/log/CHANGELOG.md` and `docs/log/CHANGELOG.md`.
3. Create `client/src/tests/AuthFlow.test.jsx`.
4. Run `npm --prefix client test src/tests/AuthFlow.test.jsx -- --run`.
5. Confirm and report clean RED failure output without creating implementation files yet.
