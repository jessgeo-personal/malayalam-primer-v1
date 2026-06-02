import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock audioEngine
vi.mock('../../utils/audioEngine', () => ({
  audioEngine: {
    speak: vi.fn(),
  },
}));

// Mock game components that cause canvas errors in jsdom
vi.mock('../components/games/TracingCanvas', () => ({
  default: ({ word }) => <div data-testid="mock-trace">Tracing Sandbox: {word.malayalamText}</div>
}));
vi.mock('../components/games/LetterPicker', () => ({
  default: ({ word }) => <div data-testid="mock-build">Assembly Sandbox: {word.malayalamText}</div>
}));
vi.mock('../components/games/SoundMatcher', () => ({ default: () => <div>Match</div> }));
vi.mock('../components/games/SuffixSnapper', () => ({ default: () => <div>Suffix</div> }));
vi.mock('../components/games/ConceptScreen', () => ({ default: () => <div>Concept</div> }));

import PrototypeLab from '../components/ui/PrototypeLab';

describe('PrototypeLab Screen', () => {
  it('renders correctly and shows the default tab (Time Zones)', () => {
    render(<PrototypeLab />);
    expect(screen.getByText(/Prototype Lab/i)).toBeInTheDocument();
    expect(screen.getByText(/Drag the tile to/i)).toBeInTheDocument(); // Inside TimeMachineZones
  });

  it('switches between experimental and sandbox tabs', () => {
    render(<PrototypeLab />);
    
    // Switch to Slider
    fireEvent.click(screen.getByText(/TIME SLIDER \(V1\)/i));
    expect(screen.getByText(/Yesterday/i)).toBeInTheDocument();
    
    // Switch to Tracing Sandbox
    fireEvent.click(screen.getByText(/TRACING BOX/i));
    expect(screen.getByTestId('mock-trace')).toBeInTheDocument();
    
    // Switch to Assembly Sandbox
    fireEvent.click(screen.getByText(/ASSEMBLY BOX/i));
    expect(screen.getByTestId('mock-build')).toBeInTheDocument();
  });
});
