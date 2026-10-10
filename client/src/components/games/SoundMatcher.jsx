import React, { useState, useEffect } from 'react';
import { audioEngine } from '../../services/audioEngine';

/**
 * SoundMatcher Mini-game
 * UI: Neo-Bento Minimalism. Clean grid interaction and soft feedback.
 */

const DISTRACTORS = ['അ', 'ന', 'ൻ', 'ഞ', 'ാ', 'ി', 'വ', 'ൾ', 'ർ', 'ക', 'ച', 'ട'];

export default function SoundMatcher({ word, onComplete }) {
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const otherDistractors = DISTRACTORS.filter(d => d !== word.malayalamText);
    const shuffledDistractors = otherDistractors.sort(() => 0.5 - Math.random()).slice(0, 2);
    const allOptions = [word.malayalamText, ...shuffledDistractors].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setFeedback(null);
    audioEngine.speak(word.malayalamText);
  }, [word]);

  const handleChoice = (choice) => {
    if (feedback) return;
    const isCorrect = choice === word.malayalamText;
    setFeedback({ isCorrect, time: Date.now() - startTime, choice });
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full animate-pop">
      <div className="text-center">
        <h2 className="text-3xl font-black text-prime-dark-text tracking-tighter uppercase mb-1 italic">Sound Match</h2>
        <p className="text-lg font-bold text-prime-coral-pink uppercase tracking-[0.3em] leading-none opacity-60">Module_{word.wordId}</p>
      </div>


      <button 
        onClick={() => audioEngine.speak(word.malayalamText)}
        className="w-24 h-24 bg-prime-action-dark text-white rounded-full text-4xl flex items-center justify-center animate-wiggle shadow-xl border-4 border-white/10"
      >
        🔊
      </button>

      <div className="grid grid-cols-3 gap-6 w-full max-w-sm px-4">
        {options.map((option, index) => (
          <button
            key={`${option}-${index}`}
            disabled={!!feedback}
            onClick={() => handleChoice(option)}
            className={`w-full aspect-square text-4xl font-black rounded-2xl transition-all shadow-sm flex items-center justify-center
              ${feedback ? 
                (option === word.malayalamText ? 'bg-prime-teal-green text-white scale-110 shadow-lg' : 
                 (option === feedback.choice ? 'bg-prime-error text-white opacity-50' : 'bg-slate-50 border border-slate-100 opacity-20'))
                : 'bg-white border border-slate-100 text-prime-dark-text hover:border-prime-periwinkle active:scale-95'}`}
          >
            {option}
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`w-full max-w-md p-8 rounded-bento border-4 animate-pop shadow-2xl mt-4
          ${feedback.isCorrect ? 'bg-prime-teal-green/5 border-prime-teal-green/20' : 'bg-prime-error/5 border-prime-error/20'}`}>

          <div className="flex items-center justify-between gap-4 mb-8">
             <div className="flex items-center gap-4">
               <div className="text-5xl">{feedback.isCorrect ? '✅' : '❌'}</div>
               <h3 className={`text-xl font-black uppercase tracking-widest ${feedback.isCorrect ? 'text-prime-teal-green' : 'text-prime-error'}`}>
                 {feedback.isCorrect ? 'Correct!' : 'Not Quite!'}
               </h3>
             </div>

             <button 
               onClick={() => onComplete(feedback.isCorrect, feedback.time)}
               className={`btn-pill px-6 py-3 text-sm font-black shadow-lg ${feedback.isCorrect ? 'bg-prime-teal-green' : 'bg-prime-action-dark'}`}
             >
               {feedback.isCorrect ? 'CONTINUE ➜' : 'RETRY ➜'}
             </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-inner border border-slate-50 text-center font-sans">
            <p className="text-2xl font-black text-prime-dark-text tracking-tight uppercase italic">
               {word.malayalamText}
               <span className="text-slate-300 mx-2">==</span> 
               "{word.phonetic}"
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
