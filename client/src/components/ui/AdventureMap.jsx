import React, { useState, useEffect } from 'react';
import { useProgress } from '../../context';

const AdventureMap = () => {
  const { 
    userId,
    needsRevision, 
    startRevision, 
    startLesson, 
    currentLesson, 
    lessonHistory,
    currentCycle 
  } = useProgress();

  const [previewLesson, setPreviewLesson] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [lessonsPerCycle, setLessonsPerCycle] = useState({});

  useEffect(() => {
    // Fetch lesson counts for each cycle to make the UI honest
    const fetchLessonCounts = async () => {
      try {
        const counts = {};
        const cyclesToFetch = [1, 2, 3, 4];
        for (const cid of cyclesToFetch) {
           const response = await fetch(`/api/session/cycle/lessons?cycleId=${cid}`);
           if (response.ok) {
           const data = await response.json();
           counts[cid] = { start: data.startLessonId, end: data.endLessonId };
           }
           }
           setLessonsPerCycle(counts);
           } catch (e) {
           console.error("Failed to fetch lesson counts", e);
           }
           };
           fetchLessonCounts();
           }, []);

           const fetchPreview = async (lessonId) => {
           setPreviewLoading(true);
           setPreviewLesson(lessonId);
           try {
           const response = await fetch(`/api/session/lesson/preview?userId=${userId}&lessonId=${lessonId}`);
           if (!response.ok) throw new Error('Failed to fetch preview');
           const data = await response.json();
           setPreviewData(data);
           } catch (err) {
           console.error(err);
           } finally {
           setPreviewLoading(false);
           }
           };

           const cycles = [
           { id: 1, name: 'The Foundation', color: 'bg-prime-coral-pink', accent: 'border-rose-400' },
           { id: 2, name: 'Sound Blending', color: 'bg-prime-mango-orange', accent: 'border-orange-300' },
           { id: 3, name: 'Dynamic Sentences', color: 'bg-prime-teal-green', accent: 'border-emerald-300' },
           { id: 4, name: 'Fluency Mastery', color: 'bg-prime-periwinkle', accent: 'border-indigo-300' },
           ];

           return (
           <div className="w-full flex flex-col gap-6 animate-pop">

           {/* Revision Card (The Engine) */}
           <div className={`p-8 rounded-bento shadow-sm flex items-center justify-between transition-all
           ${needsRevision ? 'bg-prime-action-dark text-white' : 'bg-prime-warm-base text-prime-dark-text opacity-60'}`}>
           <div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Practice</span>
           <h3 className="text-2xl font-black italic uppercase">Daily Review</h3>
           <p className="text-xs font-medium opacity-80 mt-1">Review what you've learned today.</p>
           </div>
           <button
           onClick={startRevision}
           disabled={!needsRevision} // Disable button if needsRevision is false
           className={`btn-pill ${needsRevision ? 'bg-prime-coral-pink hover:scale-[1.02]' : 'bg-prime-action-dark border border-white/20 opacity-40 cursor-not-allowed'}`}
           >
           {needsRevision ? 'START PRACTICE' : 'DONE'}
           </button>
           </div>

           {/* Course Deck */}
           <div className="flex flex-col gap-4">
           {cycles.map((cycle) => {
           const isActive = currentCycle === cycle.id;
           const isLocked = cycle.id > currentCycle;
           const lessonRange = lessonsPerCycle[cycle.id] || { start: 0, end: 0 };
           const totalLessons = lessonRange.end > 0 ? (lessonRange.end - lessonRange.start + 1) : 0;

           return (isActive || !isLocked) ? ( // Show all past and current cycle
           /* Active Cycle Card (Expanded) */
           <div key={cycle.id} className={`${cycle.color} p-8 rounded-bento shadow-lg border-b-8 ${cycle.accent} animate-pop`}>
            <div className="flex justify-between items-start mb-10">
              <div>
                <span className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Active Lessons</span>
                <h3 className="text-white text-3xl font-black italic uppercase tracking-tight">Cycle {cycle.id}: {cycle.name}</h3>
              </div>
              <div className="bg-white/20 px-4 py-1.5 rounded-pill text-[10px] font-black text-white tracking-widest">
                {totalLessons} LESSONS READY
              </div>
            </div>

            {/* Lesson Horizontal Scroll (The Train) */}
            <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-6 px-2">
              {[...Array(totalLessons)].map((_, i) => { 
                const lessonId = lessonRange.start + i;
                const history = lessonHistory.find(h => h.lessonId === lessonId);
                const nodeStatus = lessonId < currentLesson ? 'completed' : lessonId === currentLesson ? 'active' : 'locked';
                const stars = history ? history.stars : 0;
                  return (
                    <div key={lessonId} className="flex flex-col items-center gap-3 shrink-0 group relative">
                       {nodeStatus !== 'locked' && (
                         <button
                           onClick={() => fetchPreview(lessonId)}
                           className="absolute -top-3 -right-1 w-6 h-6 bg-white text-prime-dark-text rounded-lg flex items-center justify-center text-[10px] font-black shadow-sm z-20 hover:scale-110 transition-transform"
                         >
                           ?
                         </button>
                       )}
                       <button
                        onClick={() => nodeStatus !== 'locked' && startLesson(lessonId)}
                        disabled={nodeStatus === 'locked'}
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg transition-all relative
                          ${nodeStatus === 'completed' ? 'bg-white text-prime-teal-green' : 
                            nodeStatus === 'active' ? 'bg-prime-action-dark text-white scale-110 ring-4 ring-white/20' : 
                            'bg-white/30 text-white/40 border-2 border-dashed border-white/30 grayscale'}`}
                       >
                         {nodeStatus === 'completed' ? '✓' : lessonId}
                         
                         {/* Star Rating HUD */}
                         {nodeStatus === 'completed' && (
                           <div className="absolute -bottom-2 flex gap-0.5">
                             {[...Array(3)].map((_, si) => (
                               <span key={si} className={`text-[8px] ${si < stars ? 'text-prime-mango-orange' : 'text-slate-200'}`}>★</span>
                             ))}
                           </div>
                         )}
                       </button>
                       <span className="text-[9px] font-black mt-1 uppercase text-white/40 tracking-widest">L{lessonId}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
             /* Locked Cycle Card */
             <div key={cycle.id} className="bg-slate-100 p-8 rounded-bento border-b-8 border-slate-200 opacity-40 grayscale">
                <div className="flex justify-between items-center">
                  <h3 className="text-slate-400 text-xl font-black uppercase italic">{cycle.name}</h3>
                  <div className="text-2xl">🔒</div>
                </div>
             </div>
          );
        })}
      </div>

      {/* Lesson Preview Modal */}
      {previewLesson && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-prime-action-dark/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative animate-pop">
            <button 
              onClick={() => setPreviewLesson(null)}
              className="absolute top-6 right-6 text-slate-300 hover:text-prime-dark-text"
            >
              ✕
            </button>
            <h3 className="text-2xl font-black text-prime-dark-text mb-2 uppercase italic">Lesson {previewLesson}</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6">Target Vocabulary</p>
            
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar mb-8">
              {previewData.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-prime-canvas rounded-2xl border border-slate-50">
                  <div className="text-lg font-black text-prime-teal-green bg-white w-10 h-8 flex items-center justify-center rounded-lg shadow-sm">
                    {item.malayalamText}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-black text-prime-dark-text tracking-tight uppercase">{item.englishTranslation}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.lessonType}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => { startLesson(previewLesson); setPreviewLesson(null); }} className="btn-pill bg-prime-action-dark w-full justify-center py-4 text-base">
              START LESSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdventureMap;
