import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { ProgressProvider, useProgress } from '../context/ProgressContext';

// Mock fetch
global.fetch = vi.fn();

const TestComponent = () => {
  const { userId, switchUser, sessionMode, sessionItems } = useProgress();
  return (
    <div>
      <div data-testid="user-id">{userId}</div>
      <div data-testid="session-mode">{sessionMode}</div>
      <div data-testid="items-count">{sessionItems.length}</div>
      <button onClick={() => switchUser('Learner 2')}>Switch to Learner 2</button>
    </div>
  );
};

describe('ProgressContext Multi-User Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ masteredCharacters: [], score: 0, currentLesson: 1 })
    });
  });

  it('should initialize with default user from localStorage or Learner 1', () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );
    expect(screen.getByTestId('user-id').textContent).toBe('Learner 1');
  });

  it('should update userId and clear session when switchUser is called', async () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    // Initial state
    expect(screen.getByTestId('user-id').textContent).toBe('Learner 1');

    // Trigger switch
    await act(async () => {
      fireEvent.click(screen.getByText('Switch to Learner 2'));
    });

    expect(screen.getByTestId('user-id').textContent).toBe('Learner 2');
    expect(screen.getByTestId('session-mode').textContent).toBe('map');
    expect(screen.getByTestId('items-count').textContent).toBe('0');
    expect(localStorage.getItem('mp_userId')).toBe('Learner 2');
  });
});
