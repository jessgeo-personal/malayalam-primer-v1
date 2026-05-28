import React, { useState, useEffect } from 'react';
import { audioEngine } from '../../utils/audioEngine';

/**
 * SoundMatcher Mini-game
 * Teaching: Phonetic recognition and Character identification (Phase 0+)
 * The student hears a sound and picks the correct Malayalam character from 3 choices.
 */

const DISTRACTORS = ['അ', 'ന', 'ൻ', 'ഞ', 'ാ', 'ീ', 'വ', 'ൾ', 'ർ', 'ക', 'ച', 'ട'];

export default function SoundMatcher({ word, onComplete }) {
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // Generate 2 random distractors that aren't the correct character
    const otherDistractors = DISTRACTORS.filter(d => d !== word.malayalamText);
    const shuffledDistractors = otherDistractors.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    // Combine with correct answer and shuffle
    const allOptions = [word.malayalamText, ...shuffledDistractors]
      .sort(() => 0.5 - Math.random());
    
    setOptions(allOptions);
    setFeedback(null);
    
    // Play initial sound
    audioEngine.speak(word.malayalamText);
  }, [word]);

  const handleChoice = (choice) => {
    if (feedback) return;

    const isCorrect = choice === word.malayalamText;
    const endTime = Date.now();
    
    setFeedback({
      isCorrect,
      time: endTime - startTime,
      choice
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 w-full max-w-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Listen and Pick!</h2>
        <p className="text-xl text-blue-600 font-semibold mb-2">"{word.phonetic}"</p>
        <p className="text-gray-500 italic">Which character makes this sound?</p>
      </div>

      <button 
        onClick={() => audioEngine.speak(word.malayalamText)}
        className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-4xl shadow-lg active:scale-90 transition-transform mb-4"
      >
        🔊
      </button>

      <div className="grid grid-cols-3 gap-4 w-full">
        {options.map((option, index) => (
          <button
            key={`${option}-${index}`}
            disabled={!!feedback}
            onClick={() => handleChoice(option)}
            className={`aspect-square flex items-center justify-center text-4xl rounded-3xl border-4 transition-all shadow-md active:scale-95
              ${feedback ? 
                (option === word.malayalamText ? 'bg-green-100 border-green-500 scale-105' : 
                 (option === feedback.choice ? 'bg-red-100 border-red-500 opacity-50' : 'bg-gray-50 border-gray-200 opacity-30'))
                : 'bg-white border-blue-200 hover:border-blue-400'}`}
          >
            {option}
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`w-full p-6 rounded-2xl border-4 animate-in fade-in zoom-in duration-300
          ${feedback.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
          <div className="text-2xl font-bold mb-4">
            {feedback.isCorrect ? '🌟 Spot on!' : '💡 Not that one!'}
          </div>
          <p className="text-lg text-gray-700 mb-6">
            The character <span className="text-3xl font-bold text-blue-600 mx-1">{word.malayalamText}</span> makes the sound <span className="font-bold italic">"{word.phonetic}"</span>.
          </p>
          <button 
            onClick={() => onComplete(feedback.isCorrect, feedback.time)}
            className={`w-full py-4 rounded-xl text-white font-extrabold text-xl shadow-lg
              ${feedback.isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            Next ➜
          </button>
        </div>
      )}
    </div>
  );
}
