import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ProgressProvider, useProgress } from '../context/ProgressContext';
import AuthModal from '../components/ui/AuthModal';
import ProfileSelector from '../components/ui/ProfileSelector';
import AdventureMap from '../components/ui/AdventureMap';
import App from '../App';

// Consumer component to test AuthModal onboarding
const AuthOnboardingConsumer = () => {
  const { openAuthModal, activeProfile, isAuthenticated } = useAuth();
  return (
    <div>
      <div data-testid="auth-state">{isAuthenticated ? 'logged-in' : 'logged-out'}</div>
      <div data-testid="active-profile-name">{activeProfile?.name || 'none'}</div>
      <button data-testid="open-modal-btn" onClick={openAuthModal}>Open Auth</button>
      <AuthModal />
    </div>
  );
};

describe('AUTH-05: Auth & Navigation UX Polish Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Mock fetch for all test scenarios
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
        const isNew = body.email === 'newbie@example.com';
        return {
          ok: true,
          status: 200,
          json: async () => ({
            token: 'mock_token_abc',
            isNewAccount: isNew,
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
            profile: {
              profileId: 'p1',
              name: body.name || 'Aarav',
              avatar: 'star',
              isDefault: true
            }
          })
        };
      }

      if (urlStr.includes('/api/session/cycle/lessons') && method === 'GET') {
        return {
          ok: true,
          status: 200,
          json: async () => ({ startLessonId: 1, endLessonId: 9 })
        };
      }

      if (urlStr.includes('/api/progress/stats') && method === 'GET') {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            masteredCharacters: [],
            score: 0,
            needsRevision: false,
            currentLesson: 1,
            lessonHistory: [],
            currentCycle: 1,
            cycleProgress: 0
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

  it('Feature 1: Fresh account onboarding transitions to Step 3 and updates learner name', async () => {
    render(
      <AuthProvider>
        <AuthOnboardingConsumer />
      </AuthProvider>
    );

    // 1. Open AuthModal
    fireEvent.click(screen.getByTestId('open-modal-btn'));

    // 2. Submit Email
    const emailInput = screen.getByTestId('auth-email-input');
    fireEvent.change(emailInput, { target: { value: 'newbie@example.com' } });
    fireEvent.click(screen.getByTestId('auth-send-otp-btn'));

    // 3. Submit OTP
    await waitFor(() => {
      expect(screen.getByTestId('auth-otp-input')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId('auth-otp-input'), { target: { value: '123456' } });
    fireEvent.click(screen.getByTestId('auth-verify-otp-btn'));

    // 4. Verify Advance to Step 3 Onboarding
    await waitFor(() => {
      expect(screen.getByText(/Learner Onboarding/i)).toBeInTheDocument();
      expect(screen.getByText(/What is your learner's name\?/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('onboarding-learner-name-input');
    expect(nameInput).toHaveAttribute('placeholder', 'e.g., Aarav, Diya');

    // 5. Enter name and Save & Start
    fireEvent.change(nameInput, { target: { value: 'Aarav' } });
    const saveBtn = screen.getByTestId('onboarding-save-start-btn');
    fireEvent.click(saveBtn);

    // 6. Verify PUT /api/auth/profiles/p1 was called with name Aarav
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/profiles/p1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'Aarav' })
        })
      );
    });

    // 7. Verify modal closed and active profile name updated to Aarav
    await waitFor(() => {
      expect(screen.queryByText(/Learner Onboarding/i)).not.toBeInTheDocument();
      expect(screen.getByTestId('active-profile-name').textContent).toBe('Aarav');
    });
  });

  it('Feature 2: ProfileSelector renders Cancel button beside Add Learner and triggers onClose', () => {
    const handleClose = vi.fn();
    localStorage.setItem('mp_auth_token', 'mock_token');
    localStorage.setItem('mp_account', JSON.stringify({
      email: 'parent@example.com',
      profiles: [{ profileId: 'p1', name: 'Aarav', avatar: 'star', isDefault: true }]
    }));

    render(
      <AuthProvider>
        <ProfileSelector onClose={handleClose} />
      </AuthProvider>
    );

    const cancelBtn = screen.getByTestId('cancel-profile-selector-btn');
    expect(cancelBtn).toBeInTheDocument();
    expect(cancelBtn.textContent).toBe('Cancel');

    const addLearnerBtn = screen.getByTestId('add-profile-btn');
    expect(addLearnerBtn.textContent).toMatch(/Add Learner/i);

    fireEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('Feature 3: App scroll guard triggers window.scrollTo on view and lesson changes', async () => {
    window.scrollTo = vi.fn();

    render(
      <AuthProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </AuthProvider>
    );

    // On initial mount / activeView initialization
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
  });

  it('Feature 4: AdventureMap renders Smart CTAs and secondary score guidance', async () => {
    // Render AdventureMap with ProgressContext
    render(
      <ProgressProvider>
        <AdventureMap />
      </ProgressProvider>
    );

    // 1. Starting fresh: Primary CTA button shows "🚀 Start Lesson 1"
    await waitFor(() => {
      expect(screen.getByText('🚀 Start Lesson 1')).toBeInTheDocument();
    });

    // 2. Secondary guidance renders exact text
    expect(
      screen.getByText('⭐ Tap any completed train bogie below to replay and earn 3 stars!')
    ).toBeInTheDocument();
  });

  it('Feature 4 (Resume): AdventureMap renders "▶ Resume Lesson" when lesson is active/paused', async () => {
    // Test consumer that puts session in active lesson state
    const ActiveSessionWrapper = () => {
      const { setSessionMode, setSessionStatus } = useProgress();
      return (
        <div>
          <button data-testid="set-active-btn" onClick={() => {
            setSessionMode('lesson');
            setSessionStatus('active');
          }}>
            Set Active
          </button>
          <AdventureMap />
        </div>
      );
    };

    render(
      <ProgressProvider>
        <ActiveSessionWrapper />
      </ProgressProvider>
    );

    // Trigger active lesson state
    fireEvent.click(screen.getByTestId('set-active-btn'));

    await waitFor(() => {
      // In active lesson mode with lesson 1, button shows Resume
      expect(screen.getByText(/▶ Resume Lesson 1/i)).toBeInTheDocument();
    });
  });

  it('Feature 4 (Bento Structure): AdventureMap renders 3-column hero and 5 ordered vertical sections', async () => {
    render(
      <ProgressProvider>
        <AdventureMap characters={['അ', 'ആ']} />
      </ProgressProvider>
    );

    // Column 1: Cycle Name & helper note
    expect(screen.getAllByText(/Cycle 1: Fact & Identity/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('⭐ Tap any completed train bogie below to replay and earn 3 stars!')).toBeInTheDocument();

    // Column 2: Next Up card + CTA
    expect(screen.getByText('NEXT UP')).toBeInTheDocument();
    expect(screen.getByText(/🚀 Start Lesson 1/i)).toBeInTheDocument();

    // Column 3: Stacked Stat Cards
    expect(screen.getByText('📚 LESSONS COMPLETED')).toBeInTheDocument();
    expect(screen.getByText('⭐ TOTAL POINTS')).toBeInTheDocument();

    // Section 2: Practice
    expect(screen.getByText('Practice')).toBeInTheDocument();
    expect(screen.getByText('Daily Review')).toBeInTheDocument();

    // Section 3: Adventure Map
    expect(screen.getByText('Adventure Map')).toBeInTheDocument();

    // Section 4: Fluency Master
    expect(screen.getByText('Fluency Master')).toBeInTheDocument();
    expect(screen.getByText('First Step')).toBeInTheDocument();

    // Section 5: My Letters
    expect(screen.getByText('My Letters')).toBeInTheDocument();
    expect(screen.getByText('അ')).toBeInTheDocument();
    expect(screen.getByText('ആ')).toBeInTheDocument();
  });
});

