import React, { useState, useEffect } from 'react';

/**
 * SentenceScrambler (Tap-to-Build Variant)
 * A tablet-optimized mini-game for an 8-year-old child.
 * Words are presented in a scrambled bank. 
 * Tapping a word flies it into the sentence line.
 * Tapping a placed word returns it to the bank.
 */
const SentenceScrambler = ({ word, onComplete }) => {
  const [shuffledWords, setShuffledWords] = useState([]);
  const [placedWords, setPlacedWords] = useState([]); 
  const [isCorrect, setIsCorrect] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    // Initial Fisher-Yates shuffle
    const parts = word.sentenceParts.map((text, i) => ({ id: `word-${i}`, text }));
    for (let i = parts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [parts[i], parts[j]] = [parts[j], parts[i]];
    }
    setShuffledWords(parts);
    setPlacedWords([]);
    setIsCorrect(null);
    setStartTime(Date.now());
  }, [word]);

  const handleCheck = () => {
    if (isCorrect === true) return; // Prevent double-trigger during timeout

    const currentSentence = placedWords.map(w => w.text);
    const correct = JSON.stringify(currentSentence) === JSON.stringify(word.sentenceParts);
    setIsCorrect(correct);

    if (correct) {
      const timeTaken = Date.now() - startTime;
      setTimeout(() => onComplete && onComplete(true, timeTaken), 1500);
    }
  };

  const handleTapBank = (item) => {
    setShuffledWords(prev => prev.filter(w => w.id !== item.id));
    setPlacedWords(prev => [...prev, item]);
    setIsCorrect(null); // Reset feedback when they keep building
  };

  const handleTapPlaced = (item) => {
    setPlacedWords(prev => prev.filter(w => w.id !== item.id));
    setShuffledWords(prev => [...prev, item]);
    setIsCorrect(null);
  };

  const clearPlaced = () => {
    setPlacedWords([]);
    setShuffledWords(word.sentenceParts.map((text, i) => ({ id: `word-${i}`, text })));
    setIsCorrect(null);
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-5xl mx-auto p-8 bg-white rounded-[48px] shadow-2xl border-[12px] border-prime-warm-base animate-pop relative overflow-hidden">
      
      {/* 📝 Header & Instruction */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-prime-dark-text italic tracking-tighter uppercase">Sentence Scrambler</h2>
        <div className="bg-prime-action-dark/5 px-8 py-3 rounded-2xl border border-prime-action-dark/10">
          <p className="text-prime-action-dark font-black text-lg">
            Tap the words in the right order to build the sentence.
          </p>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1 italic">
            English: {word.englishTranslation}
          </p>
        </div>
      </div>

      {/* 🎮 Game Area */}
      <div className="w-full flex flex-col items-center gap-12 min-h-[300px] justify-center">
        
        {/* Placed Area (Sentence Line) */}
        <div className="w-full flex flex-wrap justify-center gap-4 p-8 bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-200 min-h-[140px] items-center relative">
          {placedWords.length === 0 && (
            <span className="text-slate-300 font-black uppercase tracking-widest">Tap words below to start...</span>
          )}
          {placedWords.map((item) => (
            <button
              key={`placed-${item.id}`}
              onClick={() => handleTapPlaced(item)}
              className="px-8 py-4 bg-prime-teal-green text-white rounded-3xl font-black text-2xl shadow-xl border-b-4 border-black/30 animate-pop hover:scale-105 active:translate-y-1 transition-transform"
            >
              {item.text}
            </button>
          ))}
          {placedWords.length > 0 && (
            <button 
              onClick={clearPlaced} 
              className="absolute -top-4 -right-4 bg-prime-error text-white w-10 h-10 rounded-full font-black shadow-lg hover:rotate-90 transition-transform flex items-center justify-center text-xl"
            >
              ×
            </button>
          )}
        </div>

        {/* Word Bank */}
        <div className="flex flex-wrap justify-center gap-4">
          {shuffledWords.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTapBank(item)}
              className="px-8 py-4 bg-prime-action-dark text-white rounded-3xl font-black text-2xl shadow-xl border-b-4 border-black/30 active:scale-95 transition-transform hover:bg-slate-700"
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>

      {/* 🏁 Footer Actions */}
      <div className="flex gap-4 w-full justify-center pt-8 border-t border-slate-100">
        <button
          onClick={handleCheck}
          disabled={placedWords.length === 0}
          className={`px-12 py-5 rounded-[32px] font-black text-2xl uppercase tracking-tighter transition-all shadow-xl border-b-8
            ${placedWords.length === 0 ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-50' :
              isCorrect === null ? 'bg-prime-action-dark text-white border-black/40 hover:scale-105 active:translate-y-2 active:border-b-0' :
              isCorrect ? 'bg-prime-teal-green text-white border-green-900/40' :
              'bg-prime-error text-white border-red-900/40 animate-shake'}`}
        >
          {isCorrect === null ? 'Check Answer' : isCorrect ? 'Correct!' : 'Try Again!'}
        </button>
      </div>

      {/* ✨ Success/Fail Indicator */}
      {isCorrect === false && (
        <div className="absolute top-8 right-8 bg-prime-error text-white px-6 py-3 rounded-2xl font-black shadow-lg animate-bounce">
          TIP: Put "{word.sentenceParts[word.sentenceParts.length - 1]}" at the end!
        </div>
      )}
    </div>
  );
};

export default SentenceScrambler;
