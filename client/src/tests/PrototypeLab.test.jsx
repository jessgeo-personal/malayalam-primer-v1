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
    expect(screen.getByText(/Tap the words in the right order/i)).toBeInTheDocument();
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
    expect(screen.getByText(/Assembly Sandbox: പെട്ടി/i)).toBeInTheDocument();
  });

  it('allows selecting different words in the Assembly Sandbox workbench', () => {
    render(<PrototypeLab />);
    
    // Switch to Assembly Box
    fireEvent.click(screen.getByText(/ASSEMBLY BOX/i));

    // Verify word selector is rendered
    const select = screen.getByLabelText(/Select Word for Assembly Test/i);
    expect(select).toBeInTheDocument();
    expect(screen.getByText(/Assembly Sandbox: പെട്ടി/i)).toBeInTheDocument();

    // Select a surround mathra word
    fireEvent.change(select, { target: { value: 'preset-poyi' } });
    expect(screen.getByText(/Assembly Sandbox: പോയി/i)).toBeInTheDocument();

    // Select a base conjunct word
    fireEvent.change(select, { target: { value: 'preset-amma' } });
    expect(screen.getByText(/Assembly Sandbox: അമ്മ/i)).toBeInTheDocument();
  });
});
