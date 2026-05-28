import React from 'react';
import { useProgress } from '../../context';

const AdventureMap = () => {
  const { 
    needsRevision, 
    startRevision, 
    startLesson, 
    currentLesson, 
    lessonHistory 
  } = useProgress();

  // Define a visible range of lessons (e.g., up to current + 1)
  const maxLessonToShow = Math.max(currentLesson + 1, 3);
  const lessonNodes = [];
  for (let i = 1; i <= maxLessonToShow; i++) {
    const history = lessonHistory.find(h => h.lessonId === i);
    lessonNodes.push({
      id: `lesson-${i}`,
      label: `Lesson ${i}`,
      lessonId: i,
      status: i < currentLesson ? 'completed' : i === currentLesson ? 'active' : 'locked',
      stars: history ? history.stars : 0
    });
  }

  return (
    <div className="w-full max-w-5xl p-4 flex flex-col items-center">
      <div className="flex w-full justify-between items-start mb-12">
        <h2 className="text-4xl font-black text-blue-900 drop-shadow-sm">Adventure Map</h2>
        
        {/* Daily Revision Sidebar/Node */}
        <div className="flex flex-col items-center">
           <button
            onClick={startRevision}
            className={`w-28 h-28 rounded-3xl shadow-xl flex flex-col items-center justify-center transition-all transform active:scale-95
              ${needsRevision 
                ? 'bg-gradient-to-br from-purple-400 to-purple-600 border-4 border-white cursor-pointer hover:scale-110 animate-pulse' 
                : 'bg-gray-100 border-4 border-gray-200 cursor-default opacity-80'}
            `}
          >
            <span className="text-4xl">{needsRevision ? '📚' : '✅'}</span>
            <span className={`text-xs font-bold mt-1 ${needsRevision ? 'text-white' : 'text-gray-400'}`}>
              {needsRevision ? 'REVISE' : 'DONE'}
            </span>
          </button>
          <span className="mt-2 text-sm font-bold text-purple-800 uppercase tracking-tighter">Daily Revision</span>
        </div>
      </div>
      
      <div className="relative w-full min-h-[500px] bg-green-50 rounded-[40px] border-8 border-green-200 shadow-2xl p-12 overflow-x-auto overflow-y-hidden">
        {/* Winding Path SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: '800px' }}>
          <path 
            d="M 50 250 C 150 150, 250 350, 400 250 S 650 150, 750 250" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="12" 
            strokeDasharray="24 12" 
            strokeLinecap="round"
            className="opacity-40"
          />
        </svg>

        <div className="flex gap-20 items-center h-full relative z-10 min-w-[800px] py-20">
          {lessonNodes.map((node, index) => (
            <div key={node.id} className="flex flex-col items-center gap-6 group">
              <div className="relative">
                <button
                  onClick={() => node.status !== 'locked' && startLesson(node.lessonId)}
                  disabled={node.status === 'locked'}
                  className={`w-32 h-32 rounded-full shadow-2xl flex items-center justify-center text-5xl transition-all transform active:scale-90
                    ${node.status === 'active' 
                      ? 'bg-yellow-400 border-8 border-white cursor-pointer hover:scale-110 ring-8 ring-yellow-200 animate-bounce' 
                      : node.status === 'completed'
                      ? 'bg-green-400 border-8 border-white cursor-pointer hover:scale-105'
                      : 'bg-gray-300 border-8 border-gray-200 cursor-not-allowed grayscale'}
                  `}
                >
                  {node.status === 'locked' ? '🔒' : '⭐'}
                </button>
                
                {/* Star Rating Overlay */}
                {node.stars > 0 && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1 bg-white px-3 py-1 rounded-full shadow-md border-2 border-yellow-400">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < node.stars ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <span className={`text-xl font-black uppercase tracking-widest ${node.status === 'locked' ? 'text-gray-400' : 'text-green-900 text-shadow-sm'}`}>
                  {node.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 bg-white px-8 py-4 rounded-full shadow-lg border-4 border-blue-100 animate-bounce-slow">
        <p className="text-xl text-blue-800 font-bold">
          {needsRevision 
            ? "👋 Ready for your daily practice? Click the Books!" 
            : "🚀 You're doing great! Keep going on your adventure!"}
        </p>
      </div>
    </div>
  );
};

export default AdventureMap;
