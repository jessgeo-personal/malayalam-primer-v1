import React from 'react';

/**
 * MasteryStrip Component
 * Displays a horizontal list of characters the user has successfully traced.
 * UI: Cyber-Pop status strip.
 */
export default function MasteryStrip({ characters }) {
  if (!characters || characters.length === 0) return null;

  return (
    <div className="w-full bg-slate-900/40 backdrop-blur-md border-y border-slate-800 py-3 px-6 overflow-hidden shadow-inner mb-4">
      <div className="flex items-center gap-6">
        <div className="flex flex-col shrink-0">
          <span className="text-app-primary font-black uppercase text-[10px] tracking-[0.3em] leading-none opacity-60">Archive</span>
          <span className="text-app-success font-black text-2xl tracking-tighter leading-none font-mono">#{characters.length}</span>
        </div>
        
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
          {characters.map((char, index) => (
            <div 
              key={`${char}-${index}`}
              className="min-w-[36px] h-[36px] bg-app-surface rounded-lg flex items-center justify-center text-lg font-black text-app-primary shadow-arcade border border-slate-700 transform rotate-1 animate-pop"
              style={{ animationDelay: `${index * 0.02}s` }}
            >
              {char}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
