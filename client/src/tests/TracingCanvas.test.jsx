import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TracingCanvas from '../components/games/TracingCanvas';
import { audioEngine } from '../services/audioEngine';

// Mock audioEngine
vi.mock('../services/audioEngine', () => ({
  audioEngine: {
    speak: vi.fn(),
  },
}));

// Mock HTMLCanvasElement.prototype.getContext
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(),
  fillText: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  closePath: vi.fn(),
  lineCap: 'round',
  lineJoin: 'round',
  strokeStyle: '#000',
  lineWidth: 1,
  font: '',
  textAlign: '',
  textBaseline: '',
  fillStyle: '',
}));

describe('TracingCanvas', () => {
  const mockWord = {
    wordId: 't1',
    malayalamText: 'അ',
    englishTranslation: 'A (Vowel)',
    phonetic: 'A',
    exampleWords: [
      { malayalamText: 'അവൻ', englishTranslation: 'He' },
      { malayalamText: 'അമ്മ', englishTranslation: 'Mother' }
    ]
  };

  it('renders the drawing pad and instructions', () => {
    render(<TracingCanvas word={mockWord} onComplete={() => {}} />);
    expect(screen.getByText(/Trace the Letter/i)).toBeInTheDocument();
    expect(screen.getByText(/Trace the line/i)).toBeInTheDocument();
  });

  it('renders example words if provided', () => {
    render(<TracingCanvas word={mockWord} onComplete={() => {}} />);
    expect(screen.getByText(/Words with this letter/i)).toBeInTheDocument();
    expect(screen.getByText('അവൻ')).toBeInTheDocument();
    expect(screen.getByText('He')).toBeInTheDocument();
    expect(screen.getByText('അമ്മ')).toBeInTheDocument();
    expect(screen.getByText('Mother')).toBeInTheDocument();
  });

  it('plays audio when example word speaker button is clicked', () => {
    render(<TracingCanvas word={mockWord} onComplete={() => {}} />);
    const speakerButtons = screen.getAllByText('🔊');
    // First button is the main character audio, second is first example word
    fireEvent.click(speakerButtons[1]); 
    expect(audioEngine.speak).toHaveBeenCalledWith('അവൻ');
  });

  it('does not render example words section if none provided', () => {
    const wordNoExamples = { ...mockWord, exampleWords: [] };
    render(<TracingCanvas word={wordNoExamples} onComplete={() => {}} />);
    expect(screen.queryByText(/Words with this letter/i)).not.toBeInTheDocument();
  });
});
