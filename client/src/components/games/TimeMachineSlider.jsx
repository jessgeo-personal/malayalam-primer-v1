import React, { useState, useEffect } from 'react';
import { audioEngine } from '../../utils/audioEngine';

const TimeMachineSlider = ({ mockAction }) => {
  const [sliderValue, setSliderValue] = useState(0); // -1: Past, 0: Present, 1: Future
  const [targetTense, setTargetTense] = useState('past');
  const [isSuccess, setIsSuccess] = useState(false);

  // Map slider -1, 0, 1 to Past, Present, Future
  const currentWord = sliderValue === -1 ? mockAction.past : 
                    sliderValue === 0 ? mockAction.present : 
                    mockAction.future;

  const currentEnglish = sliderValue === -1 ? mockAction.pastEnglish : 
                        sliderValue === 0 ? mockAction.presentEnglish : 
                        mockAction.futureEnglish;

  const currentPhonetic = sliderValue === -1 ? mockAction.past : 
                         sliderValue === 0 ? mockAction.present : 
                         mockAction.future;

  useEffect(() => {
    const currentTenseKey = sliderValue === -1 ? 'past' : sliderValue === 0 ? 'present' : 'future';
    if (currentTenseKey === targetTense) {
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
  }, [sliderValue, targetTense]);

  const handleNext = () => {
    setIsSuccess(false);
    setSliderValue(0);
    const tenses = ['past', 'present', 'future'];
    const nextTense = tenses[Math.floor(Math.random() * tenses.length)];
    setTargetTense(nextTense);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center gap-12 p-12 bg-white rounded-[48px] shadow-2xl border-8 border-slate-50">
      
      {/* Target Instruction */}
      <div className="text-center animate-pop">
        <span className="text-slate-400 font-black uppercase text-sm tracking-widest block mb-4">Find the word for</span>
        <h2 className="text-7xl font-black text-prime-action-dark uppercase tracking-tight">
          {targetTense === 'past' ? mockAction.pastEnglish : 
           targetTense === 'present' ? mockAction.presentEnglish : 
           mockAction.futureEnglish}
        </h2>
      </div>

      {/* Main Display: The 1400px Wide Dashboard */}
      <div className={`w-full aspect-[21/9] rounded-[40px] flex flex-col items-center justify-center relative transition-all duration-700 overflow-hidden border-8
        ${isSuccess ? 'bg-prime-teal-green border-prime-teal-green/20' : 
          sliderValue === -1 ? 'bg-blue-50 border-blue-100' : 
          sliderValue === 1 ? 'bg-prime-periwinkle/10 border-prime-periwinkle/20' : 
          'bg-prime-mango-orange/10 border-prime-mango-orange/20'}`}>
        
        {/* Tense Labels with Malayalam Anchors */}
        <div className="absolute top-10 left-12 flex flex-col items-start leading-none opacity-40">
           <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-2">Yesterday</span>
           <span className="text-4xl font-bold text-blue-800">ഇന്നലെ</span>
        </div>

        <div className="absolute top-10 flex flex-col items-center leading-none opacity-40">
           <span className="text-xs font-black uppercase tracking-[0.3em] text-prime-mango-orange mb-2">Today</span>
           <span className="text-4xl font-bold text-prime-mango-orange">ഇന്ന്</span>
        </div>

        <div className="absolute top-10 right-12 flex flex-col items-end leading-none opacity-40">
           <span className="text-xs font-black uppercase tracking-[0.3em] text-prime-periwinkle mb-2">Tomorrow</span>
           <span className="text-4xl font-bold text-prime-periwinkle">നാളെ</span>
        </div>

        {/* The Morphing Word */}
        <div className="text-center">
          <h1 className={`text-[12rem] font-black transition-all duration-500 transform
            ${isSuccess ? 'scale-110 text-white drop-shadow-2xl' : 'text-prime-dark-text'}`}>
            {currentWord}
          </h1>
          <p className={`text-3xl font-bold mt-8 uppercase tracking-[0.2em]
            ${isSuccess ? 'text-white/80' : 'text-slate-400'}`}>
            {currentEnglish}
          </p>

          {/* Manual Speaker Button - ONLY shows when word is completely morphed */}
          <button 
            onClick={() => audioEngine.speak(currentWord)}
            className={`mt-10 p-6 bg-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all
              ${isSuccess ? 'text-prime-teal-green' : 'text-prime-action-dark'}`}
          >
            <span className="text-5xl">🔊</span>
          </button>
        </div>

        {isSuccess && <div className="absolute inset-0 pointer-events-none animate-pulse bg-white/10"></div>}
      </div>

      {/* The 3-Point Time Slider */}
      <div className="w-full max-w-4xl px-12 py-10 bg-slate-50 rounded-[40px] border-4 border-slate-100 relative shadow-inner">
        <input 
          type="range"
          min="-1"
          max="1"
          step="1"
          value={sliderValue}
          onChange={(e) => setSliderValue(parseInt(e.target.value))}
          className="w-full h-6 bg-slate-200 rounded-full appearance-none cursor-pointer accent-prime-action-dark"
        />
        
        <div className="flex justify-between mt-8 px-4">
          <div className={`flex flex-col items-center gap-2 transition-all ${sliderValue === -1 ? 'scale-125 opacity-100' : 'opacity-30'}`}>
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-xs font-black text-blue-500 uppercase tracking-widest">PAST</span>
          </div>
          <div className={`flex flex-col items-center gap-2 transition-all ${sliderValue === 0 ? 'scale-125 opacity-100' : 'opacity-30'}`}>
            <div className="w-4 h-4 rounded-full bg-prime-mango-orange"></div>
            <span className="text-xs font-black text-prime-mango-orange uppercase tracking-widest">PRESENT</span>
          </div>
          <div className={`flex flex-col items-center gap-2 transition-all ${sliderValue === 1 ? 'scale-125 opacity-100' : 'opacity-30'}`}>
            <div className="w-4 h-4 rounded-full bg-prime-periwinkle"></div>
            <span className="text-xs font-black text-prime-periwinkle uppercase tracking-widest">FUTURE</span>
          </div>
        </div>
      </div>

      {/* Success Action */}
      {isSuccess && (
        <button 
          onClick={handleNext}
          className="btn-pill bg-prime-teal-green px-12 py-4 text-xl animate-bounce mt-4"
        >
          GOT IT! NEXT →
        </button>
      )}

    </div>
  );
};

export default TimeMachineSlider;
