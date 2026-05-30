import React, { useState, useEffect } from 'react';

export default function ConceptScreen({ word, onComplete }) {
  const [step, setStep] = useState(0);

  // Automated visual explanation sequence
  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 800); // Show suffix
    const timer2 = setTimeout(() => setStep(2), 1800); // Show result
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [word]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-4xl mx-auto animate-pop h-full text-center py-12">
      
      {/* Title */}
      <div className="bg-prime-action-dark text-white px-10 py-5 rounded-[32px] shadow-xl">
        <h2 className="text-4xl font-black uppercase tracking-widest">{word.malayalamText}</h2>
      </div>
      
      {/* Rule Description */}
      <p className="text-2xl font-bold text-prime-dark-text max-w-2xl leading-relaxed">
        {word.englishTranslation}
      </p>

      {/* Visual Animation Area */}
      <div className="bg-white p-12 rounded-[40px] shadow-2xl border-[16px] border-prime-warm-base flex flex-wrap items-center justify-center gap-6 mt-4 w-full relative min-h-[200px]">
        <div className="text-6xl font-black text-prime-dark-text">
          {word.baseWord}
        </div>
        
        <div className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'} text-4xl font-black text-slate-300`}>
          +
        </div>
        
        <div className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'} text-6xl font-black text-prime-teal-green bg-prime-teal-green/10 px-6 py-2 rounded-2xl border-4 border-prime-teal-green border-dashed`}>
          {word.targetSuffix}
        </div>

        <div className={`transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'} text-4xl font-black text-slate-300`}>
          ➜
        </div>

        <div className={`transition-all duration-700 ${step >= 2 ? 'opacity-100 scale-125' : 'opacity-0 scale-90'} text-7xl font-black text-prime-coral-pink`}>
          {word.morphedBase || (word.baseWord + word.targetSuffix)}
        </div>
      </div>

      {/* Action Button (Appears after animation finishes) */}
      <div className="h-24 mt-8 flex items-center justify-center w-full">
        <button 
          onClick={() => onComplete(true, 0)}
          className={`px-16 py-6 bg-prime-teal-green text-white rounded-full font-black text-3xl shadow-[0_8px_0_0_#0f766e] active:shadow-none active:translate-y-2 transition-all duration-500
            ${step >= 2 ? 'opacity-100 scale-100 animate-bounce' : 'opacity-0 scale-90 pointer-events-none'}`}
        >
          GOT IT! ➜
        </button>
      </div>

    </div>
  );
}
