import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimeMachine from '../components/games/TimeMachine';
import React from 'react';

// Mock audioEngine
vi.mock('../../utils/audioEngine', () => ({
  audioEngine: {
    speak: vi.fn(),
  },
}));

describe('TimeMachine Prototype Container', () => {
  it('renders the switcher and defaults to Option 1', () => {
    render(<TimeMachine />);
    expect(screen.getByText(/OPTION 1: SLIDER/i)).toBeInTheDocument();
    expect(screen.getByText(/Yesterday/i)).toBeInTheDocument(); // Inside Slider
  });

  it('swaps to Option 2 when clicked', async () => {
    render(<TimeMachine />);
    const option2Btn = screen.getByText(/OPTION 2: TIME ZONES/i);
    fireEvent.click(option2Btn);
    expect(screen.getByText(/Drag the tile to/i)).toBeInTheDocument(); // Inside Zones
  });
});
