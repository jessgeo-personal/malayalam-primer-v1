import React, { useState, useEffect } from 'react';
import { audioEngine } from '../../utils/audioEngine';

/**
 * SoundMatcher Mini-game
 * UI: Cyber-Pop chunky picks.
 */

const DISTRACTORS = ['അ', 'ന', 'ൻ', 'ഞ', 'ാ', 'ീ', 'വ', 'ൾ', 'ർ', 'ക', 'ച', 'ട'];

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
    <div className="flex flex-col items-center gap-8 w-full max-w-md animate-pop">
      <div className="text-center">
        <h2 className="text-3xl font-black text-app-textMain tracking-tighter uppercase mb-1">Signal Match</h2>
        <p className="text-lg font-bold text-app-primary uppercase tracking-[0.3em] leading-none opacity-60">ID_{word.wordId}</p>
      </div>

      <button 
        onClick={() => audioEngine.speak(word.malayalamText)}
        className="btn-arcade btn-arcade-primary w-24 h-24 rounded-full text-4xl flex items-center justify-center animate-wiggle shadow-violet-900/50"
      >
        🔊
      </button>

      <div className="grid grid-cols-3 gap-6 w-full px-2">
        {options.map((option, index) => (
          <button
            key={`${option}-${index}`}
            disabled={!!feedback}
            onClick={() => handleChoice(option)}
            className={`btn-arcade aspect-square text-4xl flex items-center justify-center transition-all
              ${feedback ? 
                (option === word.malayalamText ? 'btn-arcade-success scale-110' : 
                 (option === feedback.choice ? 'btn-arcade-error opacity-50' : 'bg-slate-900 border-2 border-slate-800 opacity-20'))
                : 'btn-arcade-surface hover:border-app-primary'}`}
          >
            {option}
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`w-full p-8 rounded-[2rem] border-4 animate-pop shadow-[0_0_50px_rgba(0,0,0,0.5)] mt-4
          ${feedback.isCorrect ? 'bg-app-success/10 border-app-success/40' : 'bg-app-error/10 border-app-error/40'}`}>
          
          <div className="flex items-center gap-4 mb-6">
             <div className="text-5xl">{feedback.isCorrect ? '🛸' : '👽'}</div>
             <h3 className={`text-xl font-black uppercase tracking-widest ${feedback.isCorrect ? 'text-app-success' : 'text-app-error'}`}>
               {feedback.isCorrect ? 'Signal Valid' : 'Invalid Bit'}
             </h3>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl shadow-inner border border-slate-800 mb-6 text-center">
            <p className="text-xl font-black text-app-primary tracking-tighter uppercase font-mono">
              {word.malayalamText} == "{word.phonetic}"
            </p>
          </div>

          <button 
            onClick={() => onComplete(feedback.isCorrect, feedback.time)}
            className={`btn-arcade w-full py-4 text-xl ${feedback.isCorrect ? 'btn-arcade-success' : 'btn-arcade-primary'}`}
          >
            CONTINUE ➜
          </button>
        </div>
      )}
    </div>
  );
}
