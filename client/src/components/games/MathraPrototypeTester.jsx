import React, { useState } from 'react';
import LetterPickerPrototype from './LetterPickerPrototype';

const TEST_WORDS = [
  {
    wordId: 'test-1',
    malayalamText: 'അമ്മ',
    englishTranslation: 'Mother',
    phonetic: 'amma',
    requiredCharacters: ['അ', 'മ്മ']
  },
  {
    wordId: 'test-2',
    malayalamText: 'അതെ',
    englishTranslation: 'Yes',
    phonetic: 'athe',
    requiredCharacters: ['അ', 'ത', 'െ'] // LEFT MATHRA
  },
  {
    wordId: 'test-3',
    malayalamText: 'പോകുക',
    englishTranslation: 'Go',
    phonetic: 'poguka',
    requiredCharacters: ['പ', 'ോ', 'ക', 'ുക'] // SURROUND MATHRA
  },
  {
    wordId: 'test-4',
    malayalamText: 'വേണം',
    englishTranslation: 'Want',
    phonetic: 'venam',
    requiredCharacters: ['വ', 'േ', 'ണ', 'ം'] // LEFT MATHRA
  }
];

export default function MathraPrototypeTester() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState([]);

  const handleComplete = (isCorrect, time) => {
    setResults(prev => [...prev, { word: TEST_WORDS[currentIndex].malayalamText, isCorrect, time }]);
    if (currentIndex < TEST_WORDS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("All test words completed!");
      setCurrentIndex(0);
      setResults([]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-12 p-8 bg-prime-canvas min-h-screen">
      <div className="flex gap-4">
        {TEST_WORDS.map((w, i) => (
          <button 
            key={w.wordId}
            onClick={() => setCurrentIndex(i)}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${currentIndex === i ? 'bg-prime-action-dark text-white scale-110' : 'bg-white text-slate-400'}`}
          >
            {w.englishTranslation}
          </button>
        ))}
      </div>

      <LetterPickerPrototype 
        word={TEST_WORDS[currentIndex]} 
        onComplete={handleComplete} 
      />

      <div className="w-full max-w-md bg-white p-6 rounded-bento shadow-lg border border-slate-100">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Test Log</h3>
        <div className="flex flex-col gap-2">
          {results.length === 0 && <p className="text-xs text-slate-300 italic">No results yet...</p>}
          {results.map((r, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="font-bold">{r.word}</span>
              <span className={r.isCorrect ? 'text-prime-teal-green' : 'text-prime-error'}>
                {r.isCorrect ? '✓ PASS' : '✗ FAIL'} ({Math.round(r.time / 1000)}s)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
