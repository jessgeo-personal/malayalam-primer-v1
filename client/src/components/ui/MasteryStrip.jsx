import React from 'react';

/**
 * MasteryStrip Component
 * Displays a horizontal list of characters the user has successfully traced.
 */
export default function MasteryStrip({ characters }) {
  if (!characters || characters.length === 0) return null;

  return (
    <div className="w-full bg-orange-100 border-t-4 border-orange-200 py-4 px-6 overflow-hidden shadow-inner">
      <div className="flex items-center gap-4">
        <span className="text-orange-600 font-bold whitespace-nowrap">Your Alphabet:</span>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {characters.map((char, index) => (
            <div 
              key={`${char}-${index}`}
              className="min-w-[50px] h-[50px] bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm border-2 border-orange-300 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              {char}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
