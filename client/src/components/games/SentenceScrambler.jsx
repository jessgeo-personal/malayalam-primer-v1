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
  const [timeTaken, setTimeTaken] = useState(0);

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
    setTimeTaken(0);
  }, [word]);

  const handleTapBank = (item) => {
    const newShuffled = shuffledWords.filter(w => w.id !== item.id);
    const newPlaced = [...placedWords, item];
    
    setShuffledWords(newShuffled);
    setPlacedWords(newPlaced);
    
    // Auto-trigger check if all words are placed
    if (newPlaced.length === word.sentenceParts.length) {
      const currentSentence = newPlaced.map(w => w.text);
      const correct = JSON.stringify(currentSentence) === JSON.stringify(word.sentenceParts);
      
      // Capture time exactly at the moment of validation
      setTimeTaken(Date.now() - startTime);
      setIsCorrect(correct);
    } else {
      setIsCorrect(null);
    }
  };

  const handleTapPlaced = (item) => {
    if (isCorrect !== null) return; // Lock during feedback
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
    <div className="flex flex-col items-center gap-12 w-full max-w-[1400px] mx-auto p-8 bg-white rounded-[48px] shadow-2xl border-[12px] border-prime-warm-base animate-pop relative overflow-hidden min-h-[600px]">
      
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
      <div className="w-full flex flex-col items-center gap-12 flex-1 justify-center">
        
        {/* Placed Area (Sentence Line) */}
        <div className="w-full flex flex-wrap justify-center gap-4 p-10 bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-200 min-h-[160px] items-center relative">
          {placedWords.length === 0 && (
            <span className="text-slate-300 font-black uppercase tracking-widest">Tap words below to start...</span>
          )}
          {placedWords.map((item) => (
            <button
              key={`placed-${item.id}`}
              onClick={() => handleTapPlaced(item)}
              className="px-10 py-5 bg-prime-teal-green text-white rounded-3xl font-black text-3xl shadow-xl border-b-4 border-black/30 animate-pop hover:scale-105 active:translate-y-1 transition-transform"
            >
              {item.text}
            </button>
          ))}
          {placedWords.length > 0 && isCorrect === null && (
            <button 
              onClick={clearPlaced} 
              className="absolute -top-4 -right-4 bg-prime-error text-white w-12 h-12 rounded-full font-black shadow-lg hover:rotate-90 transition-transform flex items-center justify-center text-2xl"
            >
              ×
            </button>
          )}
        </div>

        {/* Word Bank */}
        <div className="flex flex-wrap justify-center gap-6">
          {shuffledWords.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTapBank(item)}
              className="px-10 py-5 bg-prime-action-dark text-white rounded-3xl font-black text-3xl shadow-xl border-b-4 border-black/30 active:scale-95 transition-transform hover:bg-slate-700 disabled:opacity-50"
              disabled={isCorrect !== null}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>

      {/* 🏁 High-Contrast Feedback Overlay */}
      {isCorrect !== null && (
        <div className={`absolute inset-0 z-50 p-8 flex flex-col items-center justify-center text-center animate-fade-in backdrop-blur-md
          ${isCorrect ? 'bg-prime-teal-green/95' : 'bg-[#1A1E26]/95'}`}>
          
          <div className="text-8xl mb-6 drop-shadow-xl">{isCorrect ? '✅' : '❌'}</div>
          
          {!isCorrect && (
            <div className="mb-8 animate-pop bg-white/10 p-8 rounded-[40px] border border-white/20 w-full max-w-4xl shadow-2xl">
              <p className="text-white/60 font-black mb-2 uppercase tracking-widest text-xs">Correct sentence:</p>
              <div className="text-5xl font-black text-white mb-6 leading-relaxed tracking-wide">
                {word.sentenceParts.join(' ')}
              </div>
              <div className="text-sm font-black text-white/80 bg-white/10 px-8 py-3 rounded-full inline-block uppercase tracking-[0.2em]">
                {word.phonetic}
              </div>
            </div>
          )}

          <h3 className={`text-4xl font-black text-white uppercase mb-8 tracking-tight ${!isCorrect ? 'text-prime-error drop-shadow-md' : 'drop-shadow-md'}`}>
            {isCorrect ? 'Perfect!' : 'Try Again!'}
          </h3>
          
          <button 
             onClick={() => onComplete(isCorrect, timeTaken)}
             className="btn-pill bg-white text-prime-dark-text px-16 py-6 text-3xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all min-w-[300px]"
           >
             {isCorrect ? 'CONTINUE ➜' : 'RETRY ➜'}
           </button>
        </div>
      )}
    </div>
  );
};

export default SentenceScrambler;
