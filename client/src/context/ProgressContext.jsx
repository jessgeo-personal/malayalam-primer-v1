import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [userId] = useState('default_user');
  const [currentCycle, setCurrentCycle] = useState(1);
  const [masteredCharacters, setMasteredCharacters] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Session State
  const [sessionMode, setSessionMode] = useState('map'); // 'map', 'revision', 'lesson'
  const [sessionItems, setSessionItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionErrors, setSessionErrors] = useState(0);
  const [sessionStatus, setSessionStatus] = useState('idle'); // 'idle', 'active', 'complete'
  const [lastStars, setLastStars] = useState(0);

  // User Progress Data
  const [needsRevision, setNeedsRevision] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(1);
  const [lessonHistory, setLessonHistory] = useState([]);

  const currentItem = sessionItems[currentIndex] || null;

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/progress/stats?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setMasteredCharacters(data.masteredCharacters || []);
      setScore(data.score || 0);
      setNeedsRevision(data.needsRevision);
      setCurrentLesson(data.currentLesson || 1);
      setLessonHistory(data.lessonHistory || []);
    } catch (err) {
      console.error(err);
    }
  };

  const startRevision = async () => {
    setLoading(true);
    setSessionMode('revision');
    setSessionStatus('active');
    setSessionErrors(0);
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
    setSessionStatus('active');
    setSessionErrors(0);
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
      setSessionErrors(prev => prev + 1);
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
      setMasteredCharacters(data.masteredCharacters);

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
        const stars = Math.max(1, 3 - errors);
        setLastStars(stars);
        await fetch('/api/session/lesson/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, lessonId, stars })
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
      currentItem,
      masteredCharacters,
      score,
      loading,
      error,
      sessionMode,
      sessionStatus,
      lastStars,
      needsRevision,
      currentLesson,
      lessonHistory,
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
