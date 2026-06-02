import React, { useState } from 'react';
import TimeMachineSlider from '../games/TimeMachineSlider';
import TimeMachineZones from '../games/TimeMachineZones';
import { TracingCanvas, LetterPicker } from '../games';

const PrototypeLab = () => {
  const [activeTab, setActiveTab] = useState('zones');

  // Shared mock data for Time Machine
  const mockAction = {
    base: "പോ",
    past: "പോയി",
    present: "പോകുന്നു",
    future: "പോകും",
    pastEnglish: "Went",
    presentEnglish: "Going",
    futureEnglish: "Will go"
  };

  // Mock data for Tracing Sandbox
  const mockTrace = {
    wordId: "lab-trace-001",
    malayalamText: "അ",
    englishTranslation: "A (Vowel)",
    phonetic: "A",
    lessonType: "trace"
  };

  // Mock data for Word Assembly Sandbox
  const mockBuild = {
    wordId: "lab-build-001",
    malayalamText: "ആന",
    englishTranslation: "Elephant",
    phonetic: "Aana",
    requiredCharacters: ["ആ", "ന"],
    lessonType: "build"
  };

  const tabs = [
    { id: 'zones', label: 'TIME ZONES (V2)', category: 'Experimental' },
    { id: 'slider', label: 'TIME SLIDER (V1)', category: 'Experimental' },
    { id: 'trace', label: 'TRACING BOX', category: 'Sandbox' },
    { id: 'build', label: 'ASSEMBLY BOX', category: 'Sandbox' },
  ];

  return (
    <div className="w-full flex flex-col items-center min-h-[800px] animate-fade-in">
      
      {/* 🧪 Lab Header */}
      <div className="w-full bg-prime-action-dark py-6 px-12 rounded-[32px] mb-12 flex justify-between items-center shadow-xl border border-white/10">
        <div className="flex items-center gap-4">
           <div className="bg-prime-mango-orange w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🧪</div>
           <div>
             <h2 className="text-white text-2xl font-black tracking-tight leading-none uppercase italic">Prototype Lab</h2>
             <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Experimental Sandbox</p>
           </div>
        </div>

        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
          <span className="text-prime-mango-orange animate-pulse text-xl">⚠️</span>
          <span className="text-white/60 text-[10px] font-black uppercase tracking-widest leading-none">
            Lab Mode Active: Progress is NOT saved
          </span>
        </div>
      </div>

      <div className="w-full flex gap-12 items-start">
        
        {/* 🗺️ Sidebar Navigation */}
        <div className="w-80 flex flex-col gap-4">
          {['Experimental', 'Sandbox'].map(category => (
            <div key={category} className="mb-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-4">{category}</h3>
              <div className="flex flex-col gap-2">
                {tabs.filter(t => t.category === category).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-6 py-4 rounded-3xl font-black text-xs tracking-widest transition-all
                      ${activeTab === tab.id 
                        ? 'bg-white text-prime-action-dark shadow-lg scale-105 border-2 border-prime-mango-orange/20' 
                        : 'text-slate-400 hover:bg-white/50 hover:text-slate-600'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-8 p-6 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
             <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
               This screen is for testing interaction models on users before they are promoted to live lessons.
             </p>
          </div>
        </div>

        {/* 🔬 Main Viewer Area */}
        <div className="flex-1 bg-prime-canvas rounded-[48px] border-4 border-dashed border-slate-200 min-h-[700px] flex items-center justify-center p-8 relative overflow-hidden">
          {/* Blueprint Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#1A1E26 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="w-full relative z-10" key={activeTab}>
            {activeTab === 'zones' && <TimeMachineZones mockAction={mockAction} />}
            {activeTab === 'slider' && <TimeMachineSlider mockAction={mockAction} />}
            {activeTab === 'trace' && (
              <div className="w-full flex flex-col items-center">
                 <TracingCanvas word={mockTrace} onComplete={() => console.log('Lab Trace Done')} />
                 <p className="mt-8 text-slate-400 font-bold uppercase text-[10px]">Component: TracingCanvas</p>
              </div>
            )}
            {activeTab === 'build' && (
              <div className="w-full flex flex-col items-center">
                 <LetterPicker word={mockBuild} onComplete={() => console.log('Lab Build Done')} />
                 <p className="mt-8 text-slate-400 font-bold uppercase text-[10px]">Component: LetterPicker</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrototypeLab;
