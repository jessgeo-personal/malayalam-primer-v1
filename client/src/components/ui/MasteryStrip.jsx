import React from 'react';

/**
 * MasteryStrip Component
 * UI: Neo-Bento minimalist status strip. High contrast indicators on warm canvas.
 */
export default function MasteryStrip({ characters }) {
  if (!characters || characters.length === 0) return null;

  return (
    <div className="w-full bg-white border border-slate-100 p-4 rounded-bento shadow-sm overflow-hidden animate-pop">
      <div className="flex items-center gap-6">
        <div className="flex flex-col shrink-0">
          <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest leading-none">Archive</span>
          <span className="text-prime-coral-pink font-black text-3xl tracking-tighter leading-none mt-1">{characters.length}</span>
        </div>
        
        <div className="h-10 w-px bg-slate-100 shrink-0"></div>

        <div className="flex gap-2.5 overflow-x-auto custom-scrollbar pb-1 grow">
          {characters.map((char, index) => (
            <div 
              key={`${char}-${index}`}
              className="min-w-[44px] h-[44px] bg-prime-warm-base rounded-2xl flex items-center justify-center text-xl font-black text-prime-dark-text border border-orange-100/50 shadow-sm transition-transform hover:scale-110 active:scale-95 cursor-default animate-pop"
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
