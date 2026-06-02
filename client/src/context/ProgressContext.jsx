import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => localStorage.getItem('mp_userId') || 'Learner 1');
  const [currentCycle, setCurrentCycle] = useState(1);
  const [cycleProgress, setCycleProgress] = useState(0);
  const [masteredCharacters, setMasteredCharacters] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Session State
  const [sessionMode, setSessionMode] = useState('map'); // 'map', 'revision', 'lesson'
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [sessionItems, setSessionItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionErrors, setSessionErrors] = useState(0);
  const [sessionStatus, setSessionStatus] = useState('idle'); // 'idle', 'active', 'complete'
  const [lastStars, setLastStars] = useState(0);
  const [sessionStats, setSessionStats] = useState({ correct: 0, errors: 0 });
  const [completedItems, setCompletedItems] = useState(new Set()); // Track items completed in current session

  // User Progress Data
  const [needsRevision, setNeedsRevision] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(1);
  const [lessonHistory, setLessonHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(null); // null: checking, true: ok, false: fail

  const currentItem = sessionItems[currentIndex] || null;

  const fetchStats = async (id = userId) => {
    try {
      const response = await fetch(`/api/progress/stats?userId=${id}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setMasteredCharacters(data.masteredCharacters || []);
      setScore(data.score || 0);
      setNeedsRevision(data.needsRevision);
      setCurrentLesson(data.currentLesson || 1);
      setLessonHistory(data.lessonHistory || []);
      setCurrentCycle(data.currentCycle || 1);
      setCycleProgress(data.cycleProgress || 0);
      setIsConnected(true);
    } catch (err) {
      console.error(err);
      setIsConnected(false);
    }
  };

  const switchUser = (newUserId) => {
    setUserId(newUserId);
    localStorage.setItem('mp_userId', newUserId);
    
    // Clear session state
    setSessionMode('map');
    setSessionStatus('idle');
    setSessionItems([]);
    setCurrentIndex(0);
    
    // Refresh stats for new user
    fetchStats(newUserId);
  };

  const startRevision = async () => {
    setLoading(true);
    setSessionMode('revision');
    setSessionStatus('active');
    setSessionErrors(0);
    setSessionStats({ correct: 0, errors: 0 });
    setCompletedItems(new Set());
    try {
      const response = await fetch(`/api/session/revision?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch revision items');
      const data = await response.json();
      
      if (data.length === 0) {
        // Auto-complete if empty
        await completeSession(0, 'revision');
      } else {
        setSessionItems(data);
        setCurrentIndex(0);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startLesson = async (lessonId) => {
    setLoading(true);
    setSessionMode('lesson');
    setActiveLessonId(lessonId);
    setSessionStatus('active');
    setSessionErrors(0);
    setSessionStats({ correct: 0, errors: 0 });
    setCompletedItems(new Set());
    try {
      const response = await fetch(`/api/session/lesson?userId=${userId}&lessonId=${lessonId}`);
      if (!response.ok) throw new Error('Failed to fetch lesson');
      const data = await response.json();
      setSessionItems(data);
      setCurrentIndex(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (isCorrect, responseTimeMs) => {
    if (!currentItem) return;

    if (!isCorrect) {
      // TRACK ERRORS
      setSessionStats(prev => ({ ...prev, errors: prev.errors + 1 }));

      if (!currentItem.isReinforcement) {
        setSessionErrors(prev => prev + 1);
      }
      
      setSessionItems(prev => [...prev, { ...currentItem, isReinforcement: true }]);
    } else {
      // TRACK CORRECT ANSWERS
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));

      // GAMIFICATION EVENTS: Determine which type of celebration to trigger
      let celebrationType = 'sparkle';
      
      if (currentItem.isReinforcement) {
        celebrationType = 'redemption'; // Fixed a previously wrong answer
      } else if (!completedItems.has(currentItem.itemId)) {
        // Check if it's "hard" (e.g. word length > 5 or bucket is high)
        if (currentItem.malayalamText && currentItem.malayalamText.length > 5) {
          celebrationType = 'epic';
        }
      }
      
      // Update completed set
      setCompletedItems(prev => new Set(prev).add(currentItem.itemId));

      // Trigger the celebration event (Custom Event for UI listeners)
      window.dispatchEvent(new CustomEvent('mp-celebration', { detail: { type: celebrationType } }));
    }

    try {
      const response = await fetch('/api/progress/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          itemId: currentItem.itemId,
          itemType: currentItem.itemType,
          isCorrect,
          responseTimeMs
        })
      });

      if (!response.ok) throw new Error('Failed to update progress');
      const data = await response.json();
      
      setScore(data.score);
      
      // HUD Sync: Immediately update mastered list in UI state
      if (isCorrect) {
        setMasteredCharacters(data.masteredCharacters);
      }

      // Move to next item in session
      if (currentIndex < sessionItems.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // All items finished
        const finalErrors = isCorrect ? sessionErrors : sessionErrors + 1;
        await completeSession(finalErrors, sessionMode, currentLesson);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const completeSession = async (errors, mode, lessonId) => {
    setLoading(true);
    try {
      if (mode === 'revision') {
        await fetch('/api/session/revision/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        setNeedsRevision(false);
        setLastStars(3); // Revision always counts as "perfect" for visuals
      } else if (mode === 'lesson') {
        // Star Mapping: 0 initial errors=3*, 1 error=2*, 2 errors=1*, 3+ errors=0*
        const stars = Math.max(0, 3 - errors);
        setLastStars(stars);
        await fetch('/api/session/lesson/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, lessonId: activeLessonId, stars })
        });
      }
      
      setSessionStatus('complete');
      await fetchStats();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetSession = async () => {
    if (!window.confirm('Are you sure you want to restart the whole game? All progress will be lost!')) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/progress/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!response.ok) throw new Error('Failed to reset session');
      
      setScore(0);
      setMasteredCharacters([]);
      setSessionMode('map');
      setSessionStatus('idle');
      await fetchStats();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <ProgressContext.Provider value={{
      userId,
      switchUser,
      activeLessonId,
      sessionItems,
      currentItem,
      masteredCharacters,
      score,
      loading,
      error,
      sessionMode,
      sessionStatus,
      sessionStats,
      lastStars,
      needsRevision,
      currentLesson,
      lessonHistory,
      currentCycle,
      cycleProgress,
      isConnected,
      startRevision,
      startLesson,
      updateProgress,
      resetSession,
      setSessionMode,
      setSessionStatus
    }}>
      {children}
    </ProgressContext.Provider>
  );
};
