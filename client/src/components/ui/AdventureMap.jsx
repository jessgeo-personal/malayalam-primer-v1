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

  // Scaled for high visibility
  const maxLessonToShow = Math.max(currentLesson + 1, 20); 
  const lessonNodes = [];
  for (let i = 1; i <= maxLessonToShow; i++) {
    const history = lessonHistory.find(h => h.lessonId === i);
    lessonNodes.push({
      id: `lesson-${i}`,
      lessonId: i,
      status: i < currentLesson ? 'completed' : i === currentLesson ? 'active' : 'locked',
      stars: history ? history.stars : 0
    });
  }

  const fetchPreview = async (lessonId) => {
    setPreviewLoading(true);
    setPreviewLesson(lessonId);
    try {
      const response = await fetch(`/api/session/lesson/preview?userId=default_user&lessonId=${lessonId}`);
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
    <div className="w-full flex flex-col items-center select-none animate-pop">
      
      {/* Sleek Top Status Bar */}
      <div className="flex w-full justify-between items-center mb-10 px-2 sm:px-6">
        <div className="bg-app-surface/80 backdrop-blur-md p-4 rounded-2xl border-2 border-slate-700 shadow-2xl max-w-sm">
          <p className="text-app-text-muted font-black text-[10px] uppercase tracking-[0.2em] mb-1">Mission Control</p>
          <p className="text-app-text-main font-bold text-sm leading-tight italic">
            {needsRevision 
              ? "System standby. Sync local cache (Revision) to unlock tracks." 
              : "All sectors green. Proceed to next deployment node."}
          </p>
        </div>

        <div className="relative">
          <button
            onClick={startRevision}
            className={`btn-arcade w-24 h-24 rounded-2xl z-20 flex flex-col items-center justify-center
              ${needsRevision 
                ? 'btn-arcade-error animate-pulse' 
                : 'btn-arcade-surface opacity-60'}
            `}
          >
            <span className="text-4xl mb-1">{needsRevision ? '📡' : '🔋'}</span>
            <span className="text-[10px] font-black tracking-widest">{needsRevision ? 'REVISE' : 'READY'}</span>
          </button>
        </div>
      </div>
      
      {/* Cyber-Pop Railway Scroll Area */}
      <div className="relative w-full min-h-[380px] bg-slate-900 border-8 border-slate-800 rounded-[4rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-x-auto overflow-y-hidden custom-scrollbar pb-10 neon-grid">
        
        {/* Neon Tracks */}
        <div className="absolute top-[180px] left-0 w-[8000px] h-1 bg-app-primary/30 blur-[1px]"></div>
        <div className="absolute top-[200px] left-0 w-[8000px] h-1 bg-app-primary/30 blur-[1px]"></div>

        <div className="flex gap-10 items-center h-full relative z-10 py-12 px-16 min-w-max">
          {lessonNodes.map((node) => (
            <div key={node.id} className="flex flex-col items-center gap-4 relative shrink-0">
              
              {/* Info '?' Terminal */}
              {node.status !== 'locked' && (
                <button
                  onClick={() => fetchPreview(node.lessonId)}
                  className="absolute -top-5 right-0 w-8 h-8 bg-app-surface text-app-primary border-2 border-slate-700 rounded-lg flex items-center justify-center text-sm font-black shadow-arcade hover:bg-slate-700 transition-all z-30"
                >
                  ?
                </button>
              )}

              {/* Data Node (Lesson) */}
              <div className="relative">
                <button
                  onClick={() => node.status !== 'locked' && startLesson(node.lessonId)}
                  disabled={node.status === 'locked'}
                  className={`btn-arcade w-24 h-24 rounded-2xl text-4xl
                    ${node.status === 'active' 
                      ? 'btn-arcade-primary ring-4 ring-violet-500/20 animate-wiggle' 
                      : node.status === 'completed'
                      ? 'btn-arcade-success'
                      : 'bg-slate-800 border-2 border-slate-700 opacity-20 grayscale'}
                  `}
                >
                  <span className={node.status === 'locked' ? 'opacity-30' : ''}>
                    {node.status === 'completed' ? '💿' : node.status === 'active' ? '💾' : '🔒'}
                  </span>
                </button>
                
                {/* Star Bit Overlay */}
                {node.stars > 0 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-0.5 bg-app-surface px-2 py-1 rounded-lg shadow-arcade border border-slate-700">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className={`text-xs ${i < node.stars ? 'text-app-success' : 'text-slate-700'}`}>★</span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <span className={`text-xs font-black uppercase tracking-[0.2em] ${node.status === 'locked' ? 'text-slate-700' : 'text-app-text-main'}`}>
                  NODE_{node.lessonId.toString().padStart(3, '0')}
                </span>
              </div>
            </div>
          ))}
          
          <div className="w-32 h-20 border-4 border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-slate-800 font-black text-[10px] uppercase tracking-widest shrink-0 italic">
            Locked
          </div>
        </div>
      </div>

      {/* Terminal Preview Modal */}
      {previewLesson && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-app-surface rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] w-full max-w-sm p-8 relative border-4 border-slate-700 animate-pop">
            <button 
              onClick={() => setPreviewLesson(null)}
              className="absolute top-6 right-6 text-xl text-slate-500 hover:text-app-error font-black"
            >
              ESC
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-app-primary/20 rounded-xl flex items-center justify-center text-2xl border-2 border-app-primary/40 text-app-primary shadow-arcade">📂</div>
              <div>
                <h3 className="text-xl font-black text-app-text-main tracking-tighter uppercase font-mono">NODE_{previewLesson.toString().padStart(3, '0')}</h3>
                <p className="text-app-primary font-bold text-[10px] uppercase tracking-[0.3em] opacity-60">Manifest Details</p>
              </div>
            </div>

            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar mb-6">
              {previewData.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-slate-900/40 rounded-xl border border-slate-800/50">
                  <div className="text-xl font-black text-app-success font-mono bg-slate-900 w-12 h-10 flex items-center justify-center rounded-lg shadow-inner border border-slate-800">
                    {item.malayalamText}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-black text-app-text-main tracking-tight uppercase">{item.englishTranslation}</div>
                    <div className="text-[9px] font-bold text-app-text-muted uppercase tracking-widest">{item.lessonType}</div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                startLesson(previewLesson);
                setPreviewLesson(null);
              }}
              className="btn-arcade btn-arcade-primary w-full py-4 text-xl"
            >
              Initialize Node
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdventureMap;
