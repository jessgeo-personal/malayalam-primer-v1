import React, { useState } from 'react';
import { useProgress } from '../../context';

const AdventureMap = () => {
  const { 
    needsRevision, 
    startRevision, 
    startLesson, 
    currentLesson, 
    lessonHistory 
  } = useProgress();

  const [previewLesson, setPreviewLesson] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  const maxLessonToShow = Math.max(currentLesson + 1, 5);
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

  const fetchPreview = async (lessonId) => {
    setPreviewLoading(true);
    setPreviewLesson(lessonId);
    try {
      const response = await fetch(`/api/session/lesson/preview?lessonId=${lessonId}`);
      if (!response.ok) throw new Error('Failed to fetch preview');
      const data = await response.json();
      setPreviewData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl p-4 flex flex-col items-center select-none">
      <div className="flex w-full justify-between items-start mb-16 px-8">
        <div>
          <h2 className="text-5xl font-black text-blue-900 drop-shadow-md mb-2">Malayalam Express</h2>
          <p className="text-blue-600 font-bold uppercase tracking-widest">Adventure Map</p>
        </div>
        
        {/* Revision Engine (The Train Head) */}
        <div className="flex flex-col items-center relative">
          <div className="absolute -top-12 -left-8 text-4xl animate-bounce-slow opacity-80">💨</div>
           <button
            onClick={startRevision}
            className={`w-32 h-32 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center transition-all transform active:scale-95 z-20
              ${needsRevision 
                ? 'bg-gradient-to-br from-red-500 to-red-700 border-4 border-white cursor-pointer hover:scale-110 animate-pulse' 
                : 'bg-gray-700 border-4 border-gray-600 cursor-default'}
            `}
          >
            <span className="text-5xl">{needsRevision ? '🚂' : '✅'}</span>
            <span className={`text-xs font-black mt-1 ${needsRevision ? 'text-white' : 'text-gray-400'}`}>
              {needsRevision ? 'START ENGINE' : 'ENGINE READY'}
            </span>
          </button>
          <span className="mt-3 text-sm font-black text-red-900 uppercase tracking-tighter">Daily Revision</span>
        </div>
      </div>
      
      {/* The Track & Bogeys */}
      <div className="relative w-full min-h-[550px] bg-sky-50 rounded-[60px] border-8 border-sky-100 shadow-2xl p-16 overflow-x-auto overflow-y-hidden custom-scrollbar">
        
        {/* Track Lines */}
        <div className="absolute top-[280px] left-0 w-full h-8 flex items-center gap-4 px-4 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-16 h-full bg-orange-900 rounded-sm"></div>
          ))}
        </div>
        <div className="absolute top-[270px] left-0 w-full h-2 bg-orange-900 opacity-20"></div>
        <div className="absolute top-[300px] left-0 w-full h-2 bg-orange-900 opacity-20"></div>

        <div className="flex gap-24 items-center h-full relative z-10 py-16 px-12">
          {lessonNodes.map((node, index) => (
            <div key={node.id} className="flex flex-col items-center gap-6 shrink-0 relative">
              
              {/* Info Dot */}
              {node.status !== 'locked' && (
                <button
                  onClick={() => fetchPreview(node.lessonId)}
                  className="absolute -top-6 -right-2 w-10 h-10 bg-blue-100 text-blue-600 border-2 border-white rounded-full flex items-center justify-center text-xl font-black shadow-md hover:bg-blue-200 transition-colors z-30"
                >
                  i
                </button>
              )}

              {/* The Bogey (Train Car) */}
              <div className="relative">
                <button
                  onClick={() => node.status !== 'locked' && startLesson(node.lessonId)}
                  disabled={node.status === 'locked'}
                  className={`w-36 h-36 rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center text-5xl transition-all transform active:scale-90
                    ${node.status === 'active' 
                      ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-8 border-white cursor-pointer hover:scale-110 ring-8 ring-yellow-100' 
                      : node.status === 'completed'
                      ? 'bg-gradient-to-br from-green-400 to-green-600 border-8 border-white cursor-pointer hover:scale-105'
                      : 'bg-gray-300 border-8 border-gray-200 cursor-not-allowed grayscale'}
                  `}
                >
                  <span className={node.status === 'locked' ? 'opacity-50' : ''}>
                    {node.status === 'completed' ? '📦' : node.status === 'active' ? '🎒' : '🔒'}
                  </span>
                </button>
                
                {/* Wheels */}
                <div className="absolute -bottom-4 left-4 w-8 h-8 bg-gray-800 rounded-full border-4 border-gray-600"></div>
                <div className="absolute -bottom-4 right-4 w-8 h-8 bg-gray-800 rounded-full border-4 border-gray-600"></div>
                
                {/* Star Rating Overlay */}
                {node.stars > 0 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1 bg-white px-3 py-1 rounded-full shadow-md border-2 border-yellow-400">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className={`text-xl ${i < node.stars ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <span className={`text-xl font-black uppercase tracking-widest ${node.status === 'locked' ? 'text-gray-400' : 'text-blue-900'}`}>
                  {node.label}
                </span>
                {node.status === 'completed' && (
                  <p className="text-xs font-black text-green-600 mt-1 uppercase tracking-tighter">Click to Replay</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Popup Modal */}
      {previewLesson && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-10 relative border-8 border-blue-100">
            <button 
              onClick={() => setPreviewLesson(null)}
              className="absolute top-6 right-6 text-3xl text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            
            <h3 className="text-3xl font-black text-blue-900 mb-6 flex items-center gap-3">
              <span>📋</span> Lesson {previewLesson} Contents
            </h3>

            {previewLoading ? (
              <div className="py-12 text-center animate-pulse text-blue-400 font-bold">Loading contents...</div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {previewData.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-sky-50 rounded-2xl border-2 border-sky-100">
                    <div className="text-3xl font-black text-blue-600 w-24 text-center">{item.malayalamText}</div>
                    <div>
                      <div className="font-black text-blue-900">{item.englishTranslation}</div>
                      <div className="text-xs font-bold text-sky-400 uppercase tracking-widest">{item.lessonType}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={() => {
                const node = lessonNodes.find(n => n.lessonId === previewLesson);
                if (node && node.status !== 'locked') {
                  startLesson(previewLesson);
                  setPreviewLesson(null);
                }
              }}
              className="mt-8 w-full py-5 bg-blue-600 text-white font-black text-xl rounded-2xl shadow-lg hover:bg-blue-700 transition-colors"
            >
              Start Lesson {previewLesson}
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 bg-white px-10 py-5 rounded-[2rem] shadow-xl border-4 border-sky-100 flex items-center gap-4">
        <span className="text-4xl">💡</span>
        <p className="text-xl text-blue-800 font-bold leading-tight">
          {needsRevision 
            ? "Your engine needs fuel! Complete Daily Revision to keep the train moving." 
            : "All aboard! Pick a bogey to start a new lesson."}
        </p>
      </div>
    </div>
  );
};

export default AdventureMap;
