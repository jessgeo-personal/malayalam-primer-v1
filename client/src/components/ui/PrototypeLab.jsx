import React, { useState } from 'react';
import TimeMachineSlider from '../games/TimeMachineSlider';
import TimeMachineZones from '../games/TimeMachineZones';
import { TracingCanvas, LetterPicker, SuffixSnapper, SentenceScrambler } from '../games';

const PrototypeLab = () => {
  const [activeTab, setActiveTab] = useState('scramble');

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

  // Preset test items for Assembly Workbench categorized by linguistic/mathra challenge
  const ASSEMBLY_PRESETS = [
    // Left-side mathras
    {
      wordId: "preset-petti",
      malayalamText: "പെട്ടി",
      englishTranslation: "Box",
      phonetic: "petti",
      requiredCharacters: ["പ", "െ", "ട്ട", "ി"],
      category: "Left Mathra (െ)"
    },
    {
      wordId: "preset-venam",
      malayalamText: "വേണം",
      englishTranslation: "Want",
      phonetic: "venam",
      requiredCharacters: ["വ", "േ", "ണ", "ം"],
      category: "Left Mathra (േ)"
    },
    {
      wordId: "preset-cheriya",
      malayalamText: "ചെറിയ",
      englishTranslation: "Small",
      phonetic: "cheriya",
      requiredCharacters: ["ച", "െ", "റ", "ി", "യ"],
      category: "Left Mathra (െ)"
    },
    // Surround mathras
    {
      wordId: "preset-poyi",
      malayalamText: "പോയി",
      englishTranslation: "Went",
      phonetic: "poyi",
      requiredCharacters: ["പ", "ോ", "യ", "ി"],
      category: "Surround Mathra (ോ)"
    },
    {
      wordId: "preset-nokki",
      malayalamText: "നോക്കി",
      englishTranslation: "Looked",
      phonetic: "nokki",
      requiredCharacters: ["ന", "ോ", "ക്ക", "ി"],
      category: "Surround Mathra (ോ)"
    },
    {
      wordId: "preset-chodichu",
      malayalamText: "ചോദിച്ചു",
      englishTranslation: "Asked",
      phonetic: "chodichu",
      requiredCharacters: ["ച", "ോ", "ദ", "ി", "ച്ച", "ു"],
      category: "Surround Mathra (ോ)"
    },
    {
      wordId: "preset-koduthu",
      malayalamText: "കൊടുത്തു",
      englishTranslation: "Gave",
      phonetic: "koduthu",
      requiredCharacters: ["ക", "ൊ", "ട", "ു", "ത്ത", "ു"],
      category: "Surround Mathra (ൊ)"
    },
    // Base conjuncts
    {
      wordId: "preset-amma",
      malayalamText: "അമ്മ",
      englishTranslation: "Mother",
      phonetic: "amma",
      requiredCharacters: ["അ", "മ്മ"],
      category: "Base Conjunct"
    },
    {
      wordId: "preset-kutti",
      malayalamText: "കുട്ടി",
      englishTranslation: "Child",
      phonetic: "kutti",
      requiredCharacters: ["ക", "ു", "ട്ട", "ി"],
      category: "Base Conjunct"
    },
    {
      wordId: "preset-school",
      malayalamText: "സ്കൂൾ",
      englishTranslation: "School",
      phonetic: "school",
      requiredCharacters: ["സ്ക", "ൂ", "ൾ"],
      category: "Base Conjunct"
    },
    {
      wordId: "preset-aana",
      malayalamText: "ആന",
      englishTranslation: "Elephant",
      phonetic: "Aana",
      requiredCharacters: ["ആ", "ന"],
      category: "Basic"
    }
  ];

  const [selectedBuildWordId, setSelectedBuildWordId] = useState(ASSEMBLY_PRESETS[0].wordId);
  const selectedBuildWord = ASSEMBLY_PRESETS.find(w => w.wordId === selectedBuildWordId) || ASSEMBLY_PRESETS[0];

  // Mock data for Sentence Scrambler
  const mockScramble = {
    wordId: "lab-scramble-001",
    malayalamText: "ഇത് അമ്മ ആണ്",
    englishTranslation: "This is mother.",
    sentenceParts: ["ഇത്", "അമ്മ", "ആണ്"],
    lessonType: "scramble"
  };

  const tabs = [
    { id: 'scramble', label: 'SENTENCE SCRAMBLER', category: 'Experimental' },
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
            {activeTab === 'scramble' && <SentenceScrambler word={mockScramble} onComplete={() => console.log('Scrambler Done')} />}
            {activeTab === 'zones' && <TimeMachineZones mockAction={mockAction} />}
            {activeTab === 'slider' && <TimeMachineSlider mockAction={mockAction} />}
            {activeTab === 'trace' && (
              <div className="w-full flex flex-col items-center">
                 <TracingCanvas word={mockTrace} onComplete={() => console.log('Lab Trace Done')} />
                 <p className="mt-8 text-slate-400 font-bold uppercase text-[10px]">Component: TracingCanvas</p>
              </div>
            )}
            {activeTab === 'build' && (
              <div className="w-full flex flex-col items-center gap-6">
                {/* 🎛️ Interactive Word Selector Workbench Header */}
                <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-md border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Assembly Workbench
                    </span>
                    <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                      <span>🔤 Word & Mathra Audit</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-prime-action-dark/5 text-prime-action-dark font-bold">
                        {selectedBuildWord.category}
                      </span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <label htmlFor="word-assembly-select" className="text-xs font-bold text-slate-500 whitespace-nowrap">
                      Select Word:
                    </label>
                    <select
                      id="word-assembly-select"
                      aria-label="Select Word for Assembly Test"
                      value={selectedBuildWordId}
                      onChange={(e) => setSelectedBuildWordId(e.target.value)}
                      className="bg-slate-50 border-2 border-slate-200 hover:border-slate-300 text-slate-900 text-sm font-bold rounded-2xl px-4 py-2.5 focus:outline-none focus:border-prime-action-dark transition-all cursor-pointer shadow-sm w-full md:w-auto"
                    >
                      <optgroup label="Left-Side Mathras (െ, േ)">
                        {ASSEMBLY_PRESETS.filter(p => p.category.startsWith('Left')).map(preset => (
                          <option key={preset.wordId} value={preset.wordId}>
                            {preset.malayalamText} ({preset.englishTranslation})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Surround Mathras (ൊ, ോ)">
                        {ASSEMBLY_PRESETS.filter(p => p.category.startsWith('Surround')).map(preset => (
                          <option key={preset.wordId} value={preset.wordId}>
                            {preset.malayalamText} ({preset.englishTranslation})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Base Conjuncts & Others">
                        {ASSEMBLY_PRESETS.filter(p => !p.category.startsWith('Left') && !p.category.startsWith('Surround')).map(preset => (
                          <option key={preset.wordId} value={preset.wordId}>
                            {preset.malayalamText} ({preset.englishTranslation})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                {/* Mounted LetterPicker - Re-mounted via key on wordId change */}
                <div className="w-full flex justify-center" key={selectedBuildWord.wordId}>
                  <LetterPicker 
                    word={selectedBuildWord} 
                    onComplete={() => console.log('Lab Build Done:', selectedBuildWord.malayalamText)} 
                  />
                </div>
                <p className="mt-2 text-slate-400 font-bold uppercase text-[10px]">
                  Component: LetterPicker | Target: {selectedBuildWord.malayalamText} [{selectedBuildWord.requiredCharacters.join(' + ')}]
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrototypeLab;
