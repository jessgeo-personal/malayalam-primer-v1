import React, { useState, useEffect, useContext } from 'react';
import { useProgress, useAuth, AuthProvider } from './context';
import AuthContext from './context/AuthContext';
import { LetterPicker, TracingCanvas, SoundMatcher, SuffixSnapper, ConceptScreen, TimeMachine, SentenceScrambler } from './components/games';
import WordAudit from './components/ui/WordAudit';
import { MasteryStrip, AdventureMap, PrototypeLab, CelebrationManager } from './components/ui';
import AuthModal from './components/ui/AuthModal';
import ProfileSelector from './components/ui/ProfileSelector';
import { APP_VERSION } from './config/version';
import './App.css';

const AppContent = () => {
  const [showAudit, setShowAudit] = useState(false);
  const [showLab, setShowLab] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const { 
    userId,
    switchUser,
    activeLessonId,
    sessionItems,
    currentIndex,
    currentItem, 
    updateProgress, 
    masteredCharacters, 
    score, 
    error,
    sessionMode,
    sessionStatus,
    lastStars,
    needsRevision,
    startRevision,
    startLesson,
    currentLesson,
    lessonHistory,
    currentCycle,
    cycleProgress,
    resetSession,
    setSessionMode,
    setSessionStatus,
    isConnected,
    sessionStats
  } = useProgress();

  const {
    isAuthenticated,
    isAuthModalOpen,
    activeProfile,
    openAuthModal,
    logout
  } = useAuth();

  const [pendingLessonId, setPendingLessonId] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const handleSelectLesson = (lessonId) => {
    if (!isAuthenticated) {
      setPendingLessonId(lessonId);
      openAuthModal();
      return;
    }
    startLesson(lessonId);
  };

  const handleStartReview = () => {
    if (!isAuthenticated) {
      setPendingAction('review');
      openAuthModal();
      return;
    }
    startRevision();
  };

  useEffect(() => {
    if (isAuthenticated && !isAuthModalOpen) {
      if (pendingLessonId != null) {
        const targetLesson = pendingLessonId;
        setPendingLessonId(null);
        startLesson(targetLesson);
      } else if (pendingAction === 'review') {
        setPendingAction(null);
        startRevision();
      }
    }
  }, [isAuthenticated, isAuthModalOpen, pendingLessonId, pendingAction, startLesson, startRevision]);

  const activeView = showAudit ? 'audit' : showLab ? 'lab' : sessionMode;
  const activeLesson = activeLessonId || currentLesson;
  const currentAct = currentItem?.act || currentItem?.lessonType || null;

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    const mainContainer = document.querySelector('main') || document.documentElement;
    if (mainContainer) mainContainer.scrollTop = 0;
  }, [activeView, activeLesson, currentAct]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-prime-warm-base p-8 text-center">
        <div className="text-7xl mb-4">🧱</div>
        <h2 className="text-2xl font-black text-prime-error mb-6 uppercase">Oops! Something went wrong</h2>
        <p className="text-slate-500 mb-8">{error}</p>
        <button onClick={resetSession} className="btn-pill bg-prime-error">Reset App</button>
      </div>
    );
  }

  const handleRestart = () => {
    if (window.confirm("Are you sure you want to restart? This will clear your current session progress.")) {
      resetSession();
    }
  };

  return (
    <div className="min-h-screen bg-prime-canvas text-prime-dark-text flex flex-col font-sans">
      <CelebrationManager />
      <AuthModal />
      
      {/* 1. Hero Header Slot (Split Canvas) */}
      {sessionMode === 'map' && (
        <div className="w-full bg-prime-coral-pink pt-12 pb-20 px-8 rounded-b-[48px] relative overflow-hidden shadow-lg">
          <div className="max-w-6xl mx-auto flex justify-between items-start relative z-10">
            <div className="animate-pop">
              <h1 className="text-white text-4xl font-black tracking-tight mb-2 italic uppercase">Let's Learn Malayalam!!</h1>
              <div className="flex items-center gap-2">
                <div className="bg-prime-action-dark text-white px-4 py-1.5 rounded-pill text-xs font-bold tracking-widest flex items-center gap-2">
                  LEVEL {Math.floor(score / 500) + 1}
                </div>
                <div className="bg-white/20 text-white px-4 py-1.5 rounded-pill text-xs font-bold tracking-widest">
                  {masteredCharacters.length} LETTERS
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              {/* Audit Toggle */}
              <button 
                onClick={() => setShowAudit(!showAudit)}
                className={`px-4 py-2 rounded-2xl font-black text-[10px] tracking-widest transition-all ${showAudit ? 'bg-white text-prime-coral-pink shadow-inner' : 'bg-white/20 text-white hover:bg-white/30 border border-white/40'}`}
              >
                {showAudit ? 'EXIT AUDIT' : 'AUDIT DICTIONARY'}
              </button>

              {/* User Selection & Auth Header Slot */}
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowProfiles(!showProfiles)}
                      className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs py-2 px-3.5 rounded-2xl border border-white/40 shadow-inner transition-all cursor-pointer"
                      title="Manage Learner Profiles"
                    >
                      <span className="text-base">
                        {activeProfile?.avatar === 'rocket' ? '🚀' : activeProfile?.avatar === 'sun' ? '☀️' : '⭐'}
                      </span>
                      <span>{activeProfile?.name || userId}</span>
                      <span className="text-[10px] text-white/70">▾</span>
                    </button>
                    <button
                      onClick={logout}
                      className="px-2.5 py-1.5 rounded-xl bg-black/20 hover:bg-black/30 text-white/80 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      title="Log out"
                    >
                      Exit
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <select 
                      value={userId} 
                      onChange={(e) => switchUser(e.target.value)}
                      className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs py-2 px-3 rounded-2xl border border-white/40 shadow-inner outline-none cursor-pointer transition-all appearance-none text-center min-w-[100px]"
                    >
                      <option value="Learner 1" className="text-prime-dark-text">Learner 1</option>
                      <option value="Learner 2" className="text-prime-dark-text">Learner 2</option>
                      <option value="Learner 3" className="text-prime-dark-text">Learner 3</option>
                    </select>
                    <button
                      onClick={openAuthModal}
                      data-testid="login-trigger"
                      className="bg-white/20 hover:bg-white/30 text-white font-black text-xs py-2 px-3.5 rounded-2xl border border-white/40 shadow-inner tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>🔐</span>
                      <span>Login</span>
                    </button>
                  </div>
                )}

                <div className="w-16 h-16 bg-white/30 rounded-3xl backdrop-blur-md border border-white/40 flex items-center justify-center text-4xl shadow-inner">
                  {activeProfile?.avatar === 'rocket' ? '🚀' : activeProfile?.avatar === 'sun' ? '☀️' : userId === 'Learner 2' ? '👧' : '👦'}
                </div>
              </div>
            </div>
          </div>
          {/* Subtle background graphic */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      )}

      <main className={`flex-1 w-full max-w-[1600px] mx-auto px-6 ${sessionMode === 'map' ? '-mt-12 pb-48' : 'py-12 pb-48'}`}>
        {showAudit ? (
          <WordAudit />
        ) : showLab ? (
          <div className="py-12">
             <PrototypeLab />
          </div>
        ) : sessionMode === 'map' ? (
          <div className="flex flex-col gap-10">
            {showProfiles && isAuthenticated && (
              <div className="animate-pop">
                <ProfileSelector onClose={() => setShowProfiles(false)} />
              </div>
            )}
            {/* 1-5. Unified Adventure Map Bento Sections */}
            <AdventureMap 
              characters={masteredCharacters} 
              onSelectLesson={handleSelectLesson}
              onStartRevision={handleStartReview}
            />
          </div>
        ) : sessionStatus === 'complete' ? (
          <div className="w-full max-w-2xl mx-auto card-bento-surface p-12 text-center animate-pop relative overflow-hidden">
            {/* Background Accent */}
            <div className={`absolute top-0 left-0 w-full h-2 ${lastStars > 0 ? 'bg-prime-teal-green' : 'bg-prime-error'}`}></div>
            
            <div className="text-8xl mb-6">
              {lastStars === 3 ? '🏆' : lastStars > 0 ? '🌟' : '🧱'}
            </div>

            <h2 className={`text-5xl font-black mb-2 uppercase italic tracking-tighter ${lastStars === 0 ? 'text-prime-error' : 'text-prime-dark-text'}`}>
              {lastStars === 3 ? 'Perfect!' : lastStars > 0 ? 'Good Job!' : 'Keep Practicing!'}
            </h2>

            <p className="text-slate-500 font-bold mb-10 text-lg uppercase tracking-widest opacity-60">
              {lastStars === 0 ? 'Lesson Incomplete' : 'Session Complete'}
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mb-12">
               <div className="bg-prime-teal-green/5 border-2 border-prime-teal-green/20 rounded-[32px] p-6 flex flex-col items-center">
                  <span className="text-[10px] font-black text-prime-teal-green uppercase tracking-widest mb-1">Total Correct</span>
                  <div className="text-5xl font-black text-prime-teal-green">{sessionStats.correct}</div>
               </div>
               <div className={`rounded-[32px] p-6 flex flex-col items-center border-2 
                  ${sessionStats.errors > 0 ? 'bg-prime-error/5 border-prime-error/20' : 'bg-slate-50 border-slate-100'}`}>
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${sessionStats.errors > 0 ? 'text-prime-error' : 'text-slate-400'}`}>
                    Total Errors
                  </span>
                  <div className={`text-5xl font-black ${sessionStats.errors > 0 ? 'text-prime-error' : 'text-slate-300'}`}>
                    {sessionStats.errors}
                  </div>
               </div>
            </div>
            
            {sessionMode === 'lesson' && (
              <div className="flex flex-col items-center gap-6 mb-12">
                <div className="flex gap-4">
                  {[...Array(3)].map((_, i) => (
                    <span key={i} className={`text-7xl transition-all duration-700 ${i < lastStars ? 'text-prime-mango-orange scale-110 drop-shadow-lg' : 'text-slate-100 scale-90'}`}>★</span>
                  ))}
                </div>
                
                <div className={`px-8 py-2 rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-sm
                  ${lastStars === 3 ? 'bg-prime-teal-green text-white' : 
                    lastStars > 0 ? 'bg-prime-mango-orange text-white' : 
                    'bg-slate-200 text-slate-400'}`}>
                  {lastStars === 3 ? 'Lesson Mastered!' : 
                   lastStars > 0 ? 'Lesson Passed!' : 
                   'Not quite there yet'}
                </div>
              </div>
            )}

            <button 
              onClick={() => { setSessionMode('map'); setSessionStatus('idle'); }}
              className={`btn-pill w-full justify-center py-5 text-xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all
                ${lastStars > 0 ? 'bg-prime-action-dark' : 'bg-slate-400'}`}
            >
              {lastStars > 0 ? 'CONTINUE →' : 'TRY AGAIN LATER'}
            </button>
          </div>
        ) : (
          <div className="w-full max-w-[1400px] mx-auto card-bento-surface p-8 min-h-[550px] flex flex-col items-center justify-center relative animate-pop shadow-2xl border-orange-100">
            {/* Header within game: Consolidated Controls */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-center pointer-events-none">
              <div className="flex items-center gap-3 pointer-events-auto bg-prime-action-dark px-4 py-2 rounded-2xl shadow-lg border border-white/10 backdrop-blur-sm">
                <button 
                  onClick={() => { setSessionMode('map'); setSessionStatus('idle'); }}
                  className="text-xl hover:scale-110 transition-transform cursor-pointer"
                  title="Home"
                >
                  🏠
                </button>
                <button 
                  onClick={handleRestart}
                  className="text-xl hover:scale-110 transition-transform cursor-pointer opacity-50 hover:opacity-100"
                  title="Restart Session"
                >
                  🔄
                </button>
                <div className="h-6 w-px bg-white/20 mx-1"></div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[7px] font-black text-white/40 uppercase tracking-widest mb-0.5">Status</span>
                  <span className="text-prime-teal-green font-bold text-[10px] tracking-tighter uppercase">Active</span>
                </div>
                <button 
                  onClick={() => { setSessionMode('map'); setSessionStatus('idle'); }}
                  className="ml-4 text-[9px] font-black text-white/60 hover:text-white uppercase tracking-widest border-l border-white/10 pl-4 py-1"
                >
                  EXIT
                </button>
              </div>

              <div className="flex items-center gap-4 pointer-events-auto">
                <div className="flex flex-col items-end mr-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">My Progress</span>
                  <div className="flex gap-1 mt-1">
                    {masteredCharacters.length > 0 ? (
                      masteredCharacters.slice(-6).map((char, i) => (
                        <span key={i} className="w-6 h-6 bg-prime-canvas border border-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-prime-teal-green shadow-sm">
                          {char}
                        </span>
                      ))
                    ) : (
                      <span className="text-[9px] font-bold text-slate-300 italic">No letters yet</span>
                    )}
                    {masteredCharacters.length > 6 && <span className="text-[10px] font-black text-slate-300 flex items-center">+</span>}
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-pill text-[10px] font-black uppercase tracking-widest text-white shadow-sm
                  ${sessionMode === 'revision' ? 'bg-prime-periwinkle' : 'bg-prime-teal-green'}`}>
                  {sessionMode === 'revision' ? `Daily Practice: Cycle ${currentCycle}` : `Active Lesson: ${activeLessonId}`}
                </span>
              </div>
            </div>

            <div className="w-full flex flex-col items-center mt-12">
              {currentItem ? (
                currentItem.lessonType === 'concept' ? (
                  <ConceptScreen key={`game-${currentIndex}`} word={currentItem} onComplete={updateProgress} />
                ) : currentItem.lessonType === 'trace' ? (
                  <TracingCanvas key={`game-${currentIndex}`} word={currentItem} onComplete={updateProgress} />
                ) : currentItem.lessonType === 'match' ? (
                  <SoundMatcher key={`game-${currentIndex}`} word={currentItem} onComplete={updateProgress} />
                ) : currentItem.lessonType === 'suffix' ? (
                  <SuffixSnapper key={`game-${currentIndex}`} word={currentItem} onComplete={updateProgress} />
                ) : currentItem.lessonType === 'tense' ? (
                  <TimeMachine key={`game-${currentIndex}`} word={currentItem} onComplete={updateProgress} />
                ) : currentItem.lessonType === 'scramble' ? (
                  <SentenceScrambler key={`game-${currentIndex}`} word={currentItem} onComplete={updateProgress} />
                ) : (
                  <LetterPicker key={`game-${currentIndex}`} word={currentItem} onComplete={updateProgress} />
                )
              ) : null}
            </div>
          </div>
        )}
      </main>

      {/* 5. Global Navigation Dock (Bottom Right) */}
      {sessionMode === 'map' && (
        <nav className="fixed bottom-8 right-8 z-[100] animate-pop">
          <div className="bg-prime-action-dark rounded-3xl px-6 py-4 flex items-center gap-6 text-white shadow-2xl border border-white/10 backdrop-blur-lg">
            <button onClick={() => { setSessionMode('map'); setSessionStatus('idle'); setShowLab(false); setShowAudit(false); }} className="text-2xl hover:scale-110 transition-transform cursor-pointer" title="Home">🏠</button>
            <button onClick={handleRestart} className="text-2xl hover:scale-110 transition-transform cursor-pointer opacity-40 hover:opacity-100" title="Restart Progress">🔄</button>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex flex-col items-end min-w-[80px]">
              <span className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Server Status</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${isConnected === true ? 'bg-prime-teal-green' : isConnected === false ? 'bg-prime-error' : 'bg-prime-mango-orange'}`}></div>
                <span className={`font-bold text-[10px] tracking-widest uppercase ${isConnected === true ? 'text-prime-teal-green' : isConnected === false ? 'text-prime-error' : 'text-prime-mango-orange'}`}>
                  {isConnected === true ? 'Online' : isConnected === false ? 'Offline' : 'Syncing'}
                </span>
              </div>
            </div>
          </div>
        </nav>
      )}

      <footer className="py-20 text-center text-slate-300 font-bold text-[9px] tracking-[0.4em] uppercase flex flex-col items-center gap-4 relative z-10">
        <div className="w-12 h-1 bg-slate-100 rounded-full mb-4"></div>
        <span>Malayalam_Prime_v{APP_VERSION}</span>
        <div className="flex gap-4">
          <button 
            onClick={() => { setShowAudit(!showAudit); setShowLab(false); }}
            className={`transition-all border px-6 py-2 rounded-full font-black tracking-widest text-[10px]
              ${showAudit ? 'bg-prime-coral-pink text-white border-prime-coral-pink shadow-lg' : 'hover:text-prime-coral-pink border-slate-200 text-slate-400'}`}
          >
            {showAudit ? 'EXIT AUDIT' : 'DICTIONARY AUDIT'}
          </button>
          <button 
            onClick={() => { setShowLab(!showLab); setShowAudit(false); }}
            className={`transition-all border px-6 py-2 rounded-full font-black tracking-widest text-[10px]
              ${showLab ? 'bg-prime-mango-orange text-white border-prime-mango-orange shadow-lg' : 'hover:text-prime-mango-orange border-slate-200 text-slate-400'}`}
          >
            {showLab ? 'EXIT LAB' : 'PROTOTYPE LAB'}
          </button>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  const existingAuth = useContext(AuthContext);
  if (!existingAuth) {
    return (
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    );
  }
  return <AppContent />;
};

export default App;
