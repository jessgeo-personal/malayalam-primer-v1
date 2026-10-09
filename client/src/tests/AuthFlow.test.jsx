import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';
import AuthModal from '../components/ui/AuthModal';
import ProfileSelector from '../components/ui/ProfileSelector';

// Test consumer rendering AuthModal and ProfileSelector within AuthContext
const AuthTestConsumer = () => {
  const { isAuthenticated, activeProfile, openAuthModal, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'unauthenticated'}</div>
      <div data-testid="active-profile">{activeProfile ? activeProfile.name : 'none'}</div>
      <button data-testid="login-trigger" onClick={openAuthModal}>Login / Switch Account</button>
      <button data-testid="logout-trigger" onClick={logout}>Logout</button>
      <AuthModal />
      <ProfileSelector />
    </div>
  );
};

describe('Frontend Auth Flow Integration (AUTH-04)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Default fetch mock router for auth endpoints
    global.fetch = vi.fn(async (url, options = {}) => {
      const urlStr = typeof url === 'string' ? url : url.toString();
      const method = options.method || 'GET';
      const body = options.body ? JSON.parse(options.body) : {};

      if (urlStr.includes('/api/auth/request-otp') && method === 'POST') {
        return {
          ok: true,
          status: 200,
          json: async () => ({ message: 'OTP sent successfully' })
        };
      }

      if (urlStr.includes('/api/auth/verify-otp') && method === 'POST') {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            token: 'mock_jwt_token_123',
            account: {
              email: body.email || 'parent@example.com',
              profiles: [
                { profileId: 'p1', name: 'Learner 1', avatar: 'star', isDefault: true }
              ]
            }
          })
        };
      }

      if (urlStr.includes('/api/auth/profiles/switch') && method === 'POST') {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            activeProfile: {
              profileId: body.profileId,
              name: body.profileId === 'p2' ? 'Learner 2' : 'Learner 1',
              avatar: 'rocket',
              isDefault: false
            }
          })
        };
      }

      if (urlStr.includes('/reset') && method === 'POST') {
        const match = urlStr.match(/\/profiles\/([^/]+)\/reset/);
        const profileId = match ? match[1] : 'p1';
        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            message: 'Profile progress reset successfully',
            profileId
          })
        };
      }

      if (urlStr.endsWith('/api/auth/profiles') && method === 'GET') {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            profiles: [
              { profileId: 'p1', name: 'Learner 1', avatar: 'star', isDefault: true }
            ]
          })
        };
      }

      if (urlStr.endsWith('/api/auth/profiles') && method === 'POST') {
        return {
          ok: true,
          status: 201,
          json: async () => ({
            profile: { profileId: 'p2', name: body.name, avatar: body.avatar || 'star', isDefault: false },
            profiles: [
              { profileId: 'p1', name: 'Learner 1', avatar: 'star', isDefault: true },
              { profileId: 'p2', name: body.name, avatar: body.avatar || 'star', isDefault: false }
            ]
          })
        };
      }

      return {
        ok: true,
        status: 200,
        json: async () => ({})
      };
    });
  });

  it('a) Unauthenticated initial state displays login trigger and null active user', () => {
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status').textContent).toBe('unauthenticated');
    expect(screen.getByTestId('active-profile').textContent).toBe('none');
    expect(screen.getByTestId('login-trigger')).toBeInTheDocument();
  });

  it('b) AuthModal submits email to /api/auth/request-otp and transitions to the OTP entry screen', async () => {
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    // Open Auth Modal
    fireEvent.click(screen.getByTestId('login-trigger'));

    // Verify Email Step is visible
    const emailInput = screen.getByTestId('auth-email-input');
    expect(emailInput).toBeInTheDocument();

    // Fill in Email and submit
    fireEvent.change(emailInput, { target: { value: 'parent@example.com' } });
    const sendOtpButton = screen.getByTestId('auth-send-otp-btn');
    fireEvent.click(sendOtpButton);

    // Verify /api/auth/request-otp called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/request-otp'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'parent@example.com' })
        })
      );
    });

    // Verify transition to OTP Step
    await waitFor(() => {
      expect(screen.getByTestId('auth-otp-input')).toBeInTheDocument();
    });
  });

  it('c) AuthModal submits OTP to /api/auth/verify-otp, saves token to localStorage, and populates account profiles', async () => {
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    // Open modal and move to OTP screen
    fireEvent.click(screen.getByTestId('login-trigger'));
    fireEvent.change(screen.getByTestId('auth-email-input'), { target: { value: 'parent@example.com' } });
    fireEvent.click(screen.getByTestId('auth-send-otp-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-otp-input')).toBeInTheDocument();
    });

    // Enter 6-digit OTP and submit
    fireEvent.change(screen.getByTestId('auth-otp-input'), { target: { value: '123456' } });
    fireEvent.click(screen.getByTestId('auth-verify-otp-btn'));

    // Verify API called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/verify-otp'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'parent@example.com', otp: '123456' })
        })
      );
    });

    // Verify token persisted to localStorage
    await waitFor(() => {
      expect(localStorage.getItem('mp_auth_token')).toBe('mock_jwt_token_123');
      expect(screen.getByTestId('auth-status').textContent).toBe('authenticated');
      expect(screen.getByTestId('active-profile').textContent).toBe('Learner 1');
    });
  });

  it('d) ProfileSelector switches active profile via /api/auth/profiles/switch and persists selection', async () => {
    // Pre-populate authenticated state with 2 profiles
    localStorage.setItem('mp_auth_token', 'mock_jwt_token_123');
    localStorage.setItem('mp_account', JSON.stringify({
      email: 'parent@example.com',
      profiles: [
        { profileId: 'p1', name: 'Learner 1', avatar: 'star', isDefault: true },
        { profileId: 'p2', name: 'Learner 2', avatar: 'rocket', isDefault: false }
      ]
    }));
    localStorage.setItem('mp_active_profile_id', 'p1');

    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    // Initial profile
    expect(screen.getByTestId('active-profile').textContent).toBe('Learner 1');

    // Switch to profile p2
    const profile2Btn = screen.getByTestId('profile-card-p2');
    fireEvent.click(profile2Btn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/profiles/switch'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ profileId: 'p2' })
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('active-profile').textContent).toBe('Learner 2');
      expect(localStorage.getItem('mp_active_profile_id')).toBe('p2');
    });
  });

  it('e) ProfileSelector disables adding a new profile when 3 profiles already exist', () => {
    // Pre-populate with 3 profiles
    localStorage.setItem('mp_auth_token', 'mock_jwt_token_123');
    localStorage.setItem('mp_account', JSON.stringify({
      email: 'parent@example.com',
      profiles: [
        { profileId: 'p1', name: 'Learner 1', avatar: 'star', isDefault: true },
        { profileId: 'p2', name: 'Learner 2', avatar: 'rocket', isDefault: false },
        { profileId: 'p3', name: 'Learner 3', avatar: 'sun', isDefault: false }
      ]
    }));
    localStorage.setItem('mp_active_profile_id', 'p1');

    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    // Verify Add Profile button is disabled or not allowed
    const addProfileBtn = screen.getByTestId('add-profile-btn');
    expect(addProfileBtn).toBeDisabled();
  });

  it('f) ProfileSelector triggers /api/auth/profiles/:profileId/reset upon user confirmation', async () => {
    // Mock window.confirm to return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);

    localStorage.setItem('mp_auth_token', 'mock_jwt_token_123');
    localStorage.setItem('mp_account', JSON.stringify({
      email: 'parent@example.com',
      profiles: [
        { profileId: 'p1', name: 'Learner 1', avatar: 'star', isDefault: true }
      ]
    }));
    localStorage.setItem('mp_active_profile_id', 'p1');

    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    // Click reset on profile 1
    const resetBtn = screen.getByTestId('reset-profile-p1-btn');
    fireEvent.click(resetBtn);

    expect(confirmSpy).toHaveBeenCalled();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/profiles/p1/reset'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });

    confirmSpy.mockRestore();
  });

  it('g) Clicking a lesson while unauthenticated opens AuthModal, preserves lesson ID, and auto-starts upon authentication & onboarding', async () => {
    // Render full App wrapped in AuthProvider and ProgressProvider
    const AppModule = (await import('../App')).default;
    const { ProgressProvider } = await import('../context/ProgressContext');

    render(
      <AuthProvider>
        <ProgressProvider>
          <AppModule />
        </ProgressProvider>
      </AuthProvider>
    );

    // Initial state: unauthenticated, on AdventureMap
    await waitFor(() => {
      expect(screen.getByTestId('hero-lesson-cta-btn')).toBeInTheDocument();
    });

    // 1. Click Hero Lesson Start button (starts lesson 1) while unauthenticated
    const heroBtn = screen.getByTestId('hero-lesson-cta-btn');
    fireEvent.click(heroBtn);

    // Verify AuthModal is opened and displays parent login
    await waitFor(() => {
      expect(screen.getByText(/Parent Account Login/i)).toBeInTheDocument();
      expect(screen.getByTestId('auth-email-input')).toBeInTheDocument();
    });

    // 2. Step 1: Submit email for a new learner account
    fireEvent.change(screen.getByTestId('auth-email-input'), { target: { value: 'newparent@example.com' } });
    fireEvent.click(screen.getByTestId('auth-send-otp-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-otp-input')).toBeInTheDocument();
    });

    // Intercept fetch specifically for the rest of this test flow
    const originalFetch = global.fetch;
    global.fetch = vi.fn(async (url, options = {}) => {
      const urlStr = typeof url === 'string' ? url : url.toString();
      const method = options.method || 'GET';
      const body = options.body ? JSON.parse(options.body) : {};

      if (urlStr.includes('/api/auth/verify-otp') && method === 'POST') {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            token: 'jwt_auto_launch_123',
            isNewAccount: true,
            account: {
              email: body.email,
              profiles: [
                { profileId: 'p1', name: 'Learner 1', avatar: 'star', isDefault: true }
              ]
            }
          })
        };
      }

      if (urlStr.includes('/api/auth/profiles/p1') && method === 'PUT') {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            profile: { profileId: 'p1', name: body.name, avatar: 'star', isDefault: true },
            profiles: [{ profileId: 'p1', name: body.name, avatar: 'star', isDefault: true }]
          })
        };
      }

      if (urlStr.includes('/api/session/lesson')) {
        return {
          ok: true,
          status: 200,
          json: async () => [
            { itemId: 't001', lessonType: 'trace', malayalamText: 'അ', prompt: 'Trace the letter' }
          ]
        };
      }

      return originalFetch(url, options);
    });

    // 3. Step 2: Submit OTP
    fireEvent.change(screen.getByTestId('auth-otp-input'), { target: { value: '654321' } });
    fireEvent.click(screen.getByTestId('auth-verify-otp-btn'));

    // Verify Step 3: Learner Onboarding screen is visible
    await waitFor(() => {
      expect(screen.getByText(/Learner Onboarding/i)).toBeInTheDocument();
      expect(screen.getByTestId('onboarding-learner-name-input')).toBeInTheDocument();
    });

    // 4. Step 3: Enter learner name and submit Save & Start
    fireEvent.change(screen.getByTestId('onboarding-learner-name-input'), { target: { value: 'Aarav' } });
    fireEvent.click(screen.getByTestId('onboarding-save-start-btn'));

    // 5. Verify AuthModal closes and pending lesson 1 is auto-launched
    await waitFor(() => {
      expect(screen.queryByText(/Parent Account Login/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Learner Onboarding/i)).not.toBeInTheDocument();
    });

    // Verify session lesson was fetched for lesson 1 and game screen loaded
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/session/lesson')
      );
    });
  });
});

