import React, { useState, useEffect } from 'react';
import { useProgress } from '../../context';
import MasteryStrip from './MasteryStrip';
import { getApiUrl } from '../../utils/api';
import { audioEngine } from '../../utils/audioEngine';

const AdventureMap = ({ characters, onSelectLesson, onStartRevision }) => {
  const { 
    userId,
    needsRevision, 
    startRevision, 
    startLesson, 
    currentLesson, 
    activeLesson,
    activeLessonId,
    lessonHistory,
    currentCycle,
    cycleProgress,
    score,
    masteredCharacters,
    sessionStatus,
    sessionMode,
    setSessionMode,
    setSessionStatus
  } = useProgress();

  const handleLessonLaunch = onSelectLesson || startLesson;
  const handleRevisionLaunch = onStartRevision || startRevision;

  const [previewLesson, setPreviewLesson] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [lessonsPerCycle, setLessonsPerCycle] = useState({});

  const charactersToDisplay = characters || masteredCharacters || [];

  const cycleMeta = {
    1: { name: 'Fact & Identity', color: 'bg-prime-coral-pink', accent: 'border-rose-400' },
    2: { name: 'Action & Inquiry', color: 'bg-prime-mango-orange', accent: 'border-orange-300' },
    3: { name: 'Directional', color: 'bg-prime-teal-green', accent: 'border-emerald-300' },
    4: { name: 'Narrative', color: 'bg-prime-periwinkle', accent: 'border-indigo-300' },
  };

  const currentCycleData = cycleMeta[currentCycle] || cycleMeta[1];
  const learnerLevel = Math.floor((score || 0) / 500) + 1;

  const currentActiveLesson = activeLesson || activeLessonId || (sessionMode === 'lesson' ? currentLesson : null);
  const isLessonActive = Boolean(currentActiveLesson && (sessionStatus === 'active' || sessionStatus === 'paused'));

  const activeLessonRange = lessonsPerCycle[currentCycle] || { start: 1, end: 9 };
  const totalCycleLessons = activeLessonRange.end > 0 ? (activeLessonRange.end - activeLessonRange.start + 1) : 9;
  const completedLessonsCount = (lessonHistory || []).length;
  const totalLessonsCount = totalCycleLessons;
  const currentScore = score || 0;

  const handleHeroAction = () => {
    if (isLessonActive && setSessionMode) {
      setSessionMode('lesson');
      setSessionStatus('active');
    } else {
      handleLessonLaunch(currentLesson);
    }
  };

  useEffect(() => {
    // Fetch lesson counts for each cycle to make the UI honest
    const fetchLessonCounts = async () => {
      try {
        const counts = {};
        const cyclesToFetch = [1, 2, 3, 4];
        for (const cid of cyclesToFetch) {
          const response = await fetch(getApiUrl(`/api/session/cycle/lessons?cycleId=${cid}`));
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
      const response = await fetch(getApiUrl(`/api/session/lesson/preview?userId=${userId}&lessonId=${lessonId}`));
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
    { id: 1, name: 'Fact & Identity', color: 'bg-prime-coral-pink', accent: 'border-rose-400' },
    { id: 2, name: 'Action & Inquiry', color: 'bg-prime-mango-orange', accent: 'border-orange-300' },
    { id: 3, name: 'Directional', color: 'bg-prime-teal-green', accent: 'border-emerald-300' },
    { id: 4, name: 'Narrative', color: 'bg-prime-periwinkle', accent: 'border-indigo-300' },
  ];

  return (
    <div className="w-full flex flex-col gap-10 animate-pop">
      {/* 1. Your Progress Card (Hero with embedded Next Up, Stacked Stats, and Full-Width Progress Bar) */}
      <div 
        data-testid="your-progress-card" 
        className="rounded-3xl p-4 sm:p-6 md:p-8 bg-emerald-600 text-white shadow-lg border border-emerald-500 flex flex-col relative overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-emerald-500/50 pb-4 mb-4 sm:mb-6">
          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Your Progress</span>
          <span className="text-emerald-100 font-semibold text-xs sm:text-sm">Cycle {currentCycle} of 4</span>
        </div>

        {/* Upper portion: Mobile-first 1-column stacking (< md) and 3-column layout (>= md) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {/* 1. Cycle & Level Information (Col 1) */}
          <div className="flex flex-col justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-emerald-700/30 border border-emerald-400/20">
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-800/60 text-white border border-emerald-400/40 font-bold rounded-full text-xs w-fit">
                <span>⭐ LEVEL {learnerLevel}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Cycle {currentCycle}: {currentCycleData.name}
              </h3>
              <p className="text-emerald-100 font-medium text-xs sm:text-sm">
                Active mastery phase for core structural vocabulary.
              </p>
            </div>

            <div className="bg-emerald-700/50 border border-emerald-400/30 text-white rounded-2xl p-3 sm:p-4 text-xs font-medium leading-relaxed">
              ⭐ Tap any completed train bogie below to replay and earn 3 stars!
            </div>
          </div>

          {/* 2. 'NEXT UP' Card (Col 2) */}
          <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-5 shadow-md flex flex-col justify-between border border-emerald-100 relative overflow-hidden">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                  NEXT UP
                </span>
                <span className="text-[11px] font-bold text-slate-400">Active Target</span>
              </div>
              <h4 className="text-slate-900 font-black text-sm sm:text-base md:text-lg mt-1">
                Lesson {currentLesson}
              </h4>
              <p className="text-xs text-slate-500">
                {isLessonActive ? 'Resume session in progress' : 'Ready to start next lesson chunk'}
              </p>
            </div>

            <button
              data-testid="hero-lesson-cta-btn"
              onClick={handleHeroAction}
              className="w-full py-3 bg-[#1A1E26] hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow flex items-center justify-center cursor-pointer mt-4"
            >
              {isLessonActive ? `▶ Resume Lesson ${currentLesson}` : `🚀 Start Lesson ${currentLesson}`}
            </button>
          </div>

          {/* 3. Stats Container: Stacks 3. 'LESSONS COMPLETED' above 4. 'TOTAL POINTS' on all screen sizes */}
          <div className="flex flex-col gap-3 sm:gap-4 justify-between h-full">
            {/* Stat Card 1: LESSONS COMPLETED */}
            <div className="flex-1 bg-emerald-700/40 border border-emerald-400/30 rounded-2xl p-4 text-white flex flex-col justify-center">
              <span className="text-emerald-100 text-xs font-bold uppercase tracking-wider">
                📚 LESSONS COMPLETED
              </span>
              <div className="text-2xl font-black text-white mt-1">
                {completedLessonsCount} / {totalLessonsCount}
              </div>
              <span className="text-[10px] text-emerald-200/70 font-medium">Verified milestones</span>
            </div>

            {/* Stat Card 2: TOTAL POINTS */}
            <div className="flex-1 bg-emerald-700/40 border border-emerald-400/30 rounded-2xl p-4 text-white flex flex-col justify-center">
              <span className="text-emerald-100 text-xs font-bold uppercase tracking-wider">
                ⭐ TOTAL POINTS
              </span>
              <div className="text-2xl font-black text-white mt-1">
                {currentScore} pts
              </div>
              <span className="text-[10px] text-emerald-200/70 font-medium">SRS learning score</span>
            </div>
          </div>
        </div>

        {/* 5. Full-Width Progress Bar (Bottom) */}
        <div className="w-full pt-4 border-t border-emerald-500/50 flex flex-col gap-2 mt-4 sm:mt-6">
          <div className="flex justify-between items-center">
            <span className="text-emerald-100 font-bold text-xs uppercase tracking-wider">
              Cycle {currentCycle} Mastery
            </span>
            <span className="text-white font-black text-sm">{cycleProgress}%</span>
          </div>
          <div className="w-full bg-emerald-950/40 border border-emerald-400/30 h-4 rounded-full overflow-hidden p-0.5">
            <div 
              className="bg-amber-400 h-full rounded-full transition-all duration-700" 
              style={{ width: `${Math.min(100, Math.max(0, cycleProgress || 0))}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Practice Section (Daily Revision engine) */}
      <div className={`p-8 rounded-bento shadow-sm flex items-center justify-between transition-all
        ${needsRevision ? 'bg-prime-action-dark text-white' : 'bg-prime-warm-base text-prime-dark-text opacity-60'}`}>
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Practice</span>
          <h3 className="text-2xl font-black italic uppercase">Daily Review</h3>
          <p className="text-xs font-medium opacity-80 mt-1">Review what you've learned today.</p>
        </div>
        <button
          onClick={handleRevisionLaunch}
          disabled={!needsRevision}
          className={`btn-pill ${needsRevision ? 'bg-prime-coral-pink hover:scale-[1.02]' : 'bg-prime-action-dark border border-white/20 opacity-40 cursor-not-allowed'}`}
        >
          {needsRevision ? 'START PRACTICE' : 'DONE'}
        </button>
      </div>

      {/* 3. Adventure Map (Train Engine and Lesson Bogeys) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Train Express</span>
            <h3 className="text-2xl font-black text-prime-dark-text tracking-tight">Adventure Map</h3>
          </div>
        </div>

        {cycles.map((cycle) => {
          const isActive = currentCycle === cycle.id;
          const isLocked = cycle.id > currentCycle;
          const lessonRange = lessonsPerCycle[cycle.id] || { start: 0, end: 0 };
          const totalLessons = lessonRange.end > 0 ? (lessonRange.end - lessonRange.start + 1) : 0;

          return (isActive || !isLocked) ? (
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
                  const history = (lessonHistory || []).find(h => h.lessonId === lessonId);
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
                        onClick={() => nodeStatus !== 'locked' && handleLessonLaunch(lessonId)}
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

      {/* 4. Fluency Master (Milestone Badges & Cycle Streaks) */}
      <div className="card-bento-surface p-6 sm:p-8 rounded-bento shadow-sm flex flex-col gap-6 bg-white border border-stone-200/80 animate-pop">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-prime-coral-pink">Milestones</span>
            <h3 className="text-2xl font-black text-[#1A1E26] tracking-tight">Fluency Master</h3>
            <p className="text-xs text-stone-500 font-medium mt-0.5">Badges & cycle streaks earned as you learn.</p>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
            <span className="text-base">🔥</span>
            <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
              {(lessonHistory || []).length > 0 ? `${(lessonHistory || []).length} Lesson Streak` : 'Cycle 1 Active'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all ${(lessonHistory || []).length > 0 ? 'bg-amber-50/60 border-amber-300' : 'bg-stone-50/50 border-stone-200 opacity-50'}`}>
            <span className="text-3xl">🎯</span>
            <span className="text-xs font-black text-[#1A1E26]">First Step</span>
            <span className="text-[10px] font-bold text-stone-400">{(lessonHistory || []).length > 0 ? 'Unlocked' : 'Lesson 1'}</span>
          </div>

          <div className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all ${(lessonHistory || []).some(h => h.stars === 3) ? 'bg-amber-50/60 border-amber-300' : 'bg-stone-50/50 border-stone-200 opacity-50'}`}>
            <span className="text-3xl">⭐</span>
            <span className="text-xs font-black text-[#1A1E26]">3-Star Master</span>
            <span className="text-[10px] font-bold text-stone-400">{(lessonHistory || []).some(h => h.stars === 3) ? 'Unlocked' : 'Earn 3 Stars'}</span>
          </div>

          <div className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all ${(lessonHistory || []).length >= 5 ? 'bg-amber-50/60 border-amber-300' : 'bg-stone-50/50 border-stone-200 opacity-50'}`}>
            <span className="text-3xl">🚀</span>
            <span className="text-xs font-black text-[#1A1E26]">Sprint Master</span>
            <span className="text-[10px] font-bold text-stone-400">{(lessonHistory || []).length >= 5 ? 'Unlocked' : '5 Lessons'}</span>
          </div>

          <div className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all ${currentCycle > 1 || cycleProgress === 100 ? 'bg-amber-50/60 border-amber-300' : 'bg-stone-50/50 border-stone-200 opacity-50'}`}>
            <span className="text-3xl">👑</span>
            <span className="text-xs font-black text-[#1A1E26]">Cycle Champ</span>
            <span className="text-[10px] font-bold text-stone-400">{currentCycle > 1 || cycleProgress === 100 ? 'Unlocked' : 'Finish Cycle 1'}</span>
          </div>
        </div>
      </div>

      {/* 5. My Letters / Mastery Strip (Learned Graphemes Shelf at the bottom) */}
      <div className="flex flex-col gap-3 animate-pop">
        <div className="flex items-center justify-between px-2">
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Learned Graphemes Shelf</span>
            <h3 className="text-2xl font-black text-prime-dark-text tracking-tight">My Letters</h3>
          </div>
          <span className="text-xs font-bold text-stone-400">
            {charactersToDisplay.length} letters mastered
          </span>
        </div>
        {charactersToDisplay.length > 0 ? (
          <MasteryStrip characters={charactersToDisplay} />
        ) : (
          <div className="w-full bg-white border border-dashed border-stone-200 p-6 rounded-bento text-center text-stone-400 text-xs font-bold">
            Complete your first tracing and matching games to add letters to your shelf!
          </div>
        )}
      </div>

      {/* Lesson Preview Modal */}
      {previewLesson && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-prime-action-dark/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative animate-pop">
            <button 
              onClick={() => setPreviewLesson(null)}
              className="absolute top-6 right-6 text-slate-300 hover:text-prime-dark-text cursor-pointer"
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
                  <button
                    type="button"
                    onClick={() => audioEngine.playWord(item)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-xs hover:scale-105 active:scale-95 text-prime-dark-text cursor-pointer border border-slate-100 shrink-0"
                    title="Play Sound"
                  >
                    🔊
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => { handleLessonLaunch(previewLesson); setPreviewLesson(null); }} className="btn-pill bg-prime-action-dark w-full justify-center py-4 text-base cursor-pointer">
              START LESSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdventureMap;
