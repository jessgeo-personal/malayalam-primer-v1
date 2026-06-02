import React, { useState } from 'react';
import TimeMachineSlider from './TimeMachineSlider';
import TimeMachineZones from './TimeMachineZones';

const TimeMachine = () => {
  const [option, setOption] = useState(1); // 1: Slider, 2: Zones

  // Shared mock data for both prototypes
  const mockAction = {
    base: "പോ",
    past: "പോയി",
    present: "പോകുന്നു",
    future: "പോകും",
    pastEnglish: "Went",
    presentEnglish: "Going",
    futureEnglish: "Will go",
    pastPhonetic: "poyi",
    presentPhonetic: "pokunnu",
    futurePhonetic: "pokum"
  };

  return (
    <div className="w-full flex flex-col items-center gap-8">
      {/* Prototype Switcher */}
      <div className="flex bg-slate-100 p-2 rounded-full shadow-inner border-2 border-slate-200">
        <button 
          onClick={() => setOption(1)}
          className={`px-8 py-3 rounded-full font-black text-xs tracking-widest transition-all
            ${option === 1 ? 'bg-white text-prime-action-dark shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}
        >
          OPTION 1: SLIDER
        </button>
        <button 
          onClick={() => setOption(2)}
          className={`px-8 py-3 rounded-full font-black text-xs tracking-widest transition-all
            ${option === 2 ? 'bg-white text-prime-action-dark shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}
        >
          OPTION 2: TIME ZONES
        </button>
      </div>

      {/* Instructional Note */}
      <div className="bg-prime-mango-orange/10 border border-prime-mango-orange/20 px-6 py-2 rounded-full">
        <span className="text-prime-mango-orange font-bold text-[10px] tracking-widest uppercase italic">
          Prototype Mode: Manual Speaker Button Required for Audio
        </span>
      </div>

      {/* Prototype Rendering */}
      <div className="w-full animate-fade-in" key={option}>
        {option === 1 ? (
          <TimeMachineSlider mockAction={mockAction} />
        ) : (
          <TimeMachineZones mockAction={mockAction} />
        )}
      </div>

      <p className="text-slate-300 font-medium text-xs max-w-lg text-center leading-relaxed px-8">
        This is a standalone prototype environment. Interaction models and dimensions are being tested for Milestone 2.3. No database progress will be saved.
      </p>
    </div>
  );
};

export default TimeMachine;
