import React, { useState, useEffect } from 'react';
import { audioEngine } from '../../utils/audioEngine';
import { useProgress } from '../../context';

export default function ConceptScreen({ word, onComplete }) {
  const { userId, activeLessonId } = useProgress();
  const [step, setStep] = useState(0);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [summaryItems, setSummaryItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const hasExamples = word.examples && word.examples.length > 0;
  const currentExample = hasExamples ? word.examples[exampleIndex] : null;

  // Automated visual explanation sequence (For Grammar Concepts)
  useEffect(() => {
    if (!word.isSummary) {
      setStep(0);
      const timer1 = setTimeout(() => setStep(1), 800); // Show suffix
      const timer2 = setTimeout(() => setStep(2), 1800); // Show result
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }
  }, [word, exampleIndex]);

  const handleNextExample = () => {
    if (exampleIndex < word.examples.length - 1) {
      setExampleIndex(prev => prev + 1);
    } else {
      onComplete(true, 0);
    }
  };

  // Fetch lesson summary items (For Lesson Intro Summaries)
  useEffect(() => {
    if (word.isSummary) {
      const fetchSummary = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/session/lesson/preview?lessonId=${activeLessonId || word.lessonId}&userId=${userId}&conceptId=${word.wordId}`);
          if (response.ok) {
            const data = await response.json();
            // Filter out duplicate concepts if any, and only show unique Malayalam words
            const unique = [];
            const seen = new Set();
            data.forEach(item => {
              if (item.lessonType !== 'concept' && !seen.has(item.malayalamText)) {
                unique.push(item);
                seen.add(item.malayalamText);
              }
            });
            setSummaryItems(unique);
          }
        } catch (err) {
          console.error("Failed to fetch summary items", err);
        } finally {
          setLoading(false);
        }
      };
      fetchSummary();
    }
  }, [word, userId]);

  if (word.isSummary) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 w-full max-w-5xl mx-auto animate-pop h-full text-center py-6">
        {/* Title */}
        <div className="bg-prime-action-dark text-white px-10 py-4 rounded-[32px] shadow-xl">
          <h2 className="text-3xl font-black uppercase tracking-widest">{word.malayalamText}</h2>
        </div>
        
        {/* Instructions */}
        <p className="text-xl font-bold text-prime-dark-text max-w-2xl leading-relaxed">
          {word.englishTranslation}
        </p>

        {/* Summary Grid */}
        <div className="w-full bg-white/50 p-8 rounded-[40px] border-4 border-white shadow-inner min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-48 animate-pulse text-prime-teal-green font-black">PREPARING LESSON...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {summaryItems.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center gap-2 group hover:shadow-md transition-all">
                  <div className="text-3xl font-black text-prime-dark-text">{item.malayalamText}</div>
                  <div className="text-[10px] font-black text-prime-teal-green bg-prime-teal-green/10 px-2 py-0.5 rounded-md uppercase tracking-tighter mb-1">{item.phonetic}</div>
                  <div className="text-sm font-medium text-slate-500">{item.englishTranslation}</div>
                  <button 
                    onClick={() => audioEngine.speak(item.malayalamText)}
                    className="mt-2 w-10 h-10 bg-prime-warm-base rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-sm"
                  >
                    🔊
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="h-24 flex items-center justify-center w-full">
          <button 
            onClick={() => onComplete(true, 0)}
            className="px-16 py-5 bg-prime-teal-green text-white rounded-full font-black text-2xl shadow-[0_8px_0_0_#0f766e] active:shadow-none active:translate-y-2 transition-all duration-500 animate-bounce"
          >
            START LESSON! ➜
          </button>
        </div>
      </div>
    );
  }

  // Original Grammar Rule layout for Cycle 2
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-4xl mx-auto animate-pop h-full text-center py-12">
      <div className="bg-prime-action-dark text-white px-10 py-5 rounded-[32px] shadow-xl">
        <h2 className="text-4xl font-black uppercase tracking-widest">{word.malayalamText}</h2>
      </div>
      
      <p className="text-2xl font-bold text-prime-dark-text max-w-2xl leading-relaxed">
        {word.englishTranslation}
      </p>

      {/* Progress Dots for Examples */}
      {hasExamples && (
        <div className="flex gap-2">
          {word.examples.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full transition-all ${i === exampleIndex ? 'bg-prime-mango-orange w-8' : 'bg-slate-200'}`}></div>
          ))}
        </div>
      )}

      <div className="bg-white p-12 rounded-[40px] shadow-2xl border-[16px] border-prime-warm-base flex flex-col items-center justify-center gap-8 mt-4 w-full relative min-h-[350px]">
        {currentExample && currentExample.rule && (
          <div className="bg-prime-mango-orange/10 border-2 border-prime-mango-orange/20 px-6 py-2 rounded-2xl animate-fade-in">
            <span className="text-prime-mango-orange font-black uppercase text-xs tracking-widest italic">{currentExample.rule}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="text-6xl font-black text-prime-dark-text">
            {currentExample ? currentExample.base : (word.baseWord || '')}
          </div>
          
          <div className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'} text-4xl font-black text-slate-300`}>
            +
          </div>
          
          <div className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'} text-6xl font-black text-prime-teal-green bg-prime-teal-green/10 px-6 py-2 rounded-2xl border-4 border-prime-teal-green border-dashed`}>
            {currentExample ? currentExample.suffix : (word.targetSuffix || '')}
          </div>

          <div className={`transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'} text-4xl font-black text-slate-300`}>
            ➜
          </div>

          <div className={`transition-all duration-700 ${step >= 2 ? 'opacity-100 scale-125' : 'opacity-0 scale-90'} text-7xl font-black text-prime-coral-pink`}>
            {currentExample ? currentExample.result : (word.morphedBase || (word.baseWord && word.targetSuffix ? word.baseWord + word.targetSuffix : ''))}
          </div>
        </div>
      </div>

      <div className="h-24 mt-8 flex items-center justify-center w-full">
        <button 
          onClick={hasExamples ? handleNextExample : () => onComplete(true, 0)}
          className={`px-16 py-6 bg-prime-teal-green text-white rounded-full font-black text-3xl shadow-[0_8px_0_0_#0f766e] active:shadow-none active:translate-y-2 transition-all duration-500
            ${step >= 2 ? 'opacity-100 scale-100 animate-bounce' : 'opacity-0 scale-90 pointer-events-none'}`}
        >
          {hasExamples && exampleIndex < word.examples.length - 1 ? 'NEXT RULE! ➜' : 'GOT IT! ➜'}
        </button>
      </div>
    </div>
  );
}
