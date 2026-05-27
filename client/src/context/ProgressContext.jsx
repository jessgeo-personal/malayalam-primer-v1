import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [userId] = useState('default_user');
  const [currentCycle, setCurrentCycle] = useState(1);
  const [currentWord, setCurrentWord] = useState(null);
  const [masteredCharacters, setMasteredCharacters] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/progress/stats?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setMasteredCharacters(data.masteredCharacters || []);
      setScore(data.score || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNextWord = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/words/next?userId=${userId}&cycle=${currentCycle}`);
      if (!response.ok) throw new Error('Failed to fetch next word');
      const data = await response.json();
      setCurrentWord(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (isCorrect, responseTimeMs) => {
    if (!currentWord) return;

    try {
      const response = await fetch('/api/progress/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          wordId: currentWord.wordId,
          isCorrect,
          responseTimeMs
        })
      });

      if (!response.ok) throw new Error('Failed to update progress');
      const data = await response.json();
      
      // Update local stats from response
      setScore(data.score);
      setMasteredCharacters(data.masteredCharacters);

      // Fetch next word after update
      await fetchNextWord();
    } catch (err) {
      setError(err.message);
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
      
      // Reset local state
      setScore(0);
      setMasteredCharacters([]);
      setCurrentWord(null);
      await fetchNextWord();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchNextWord();
  }, [currentCycle]);

  return (
    <ProgressContext.Provider value={{
      currentWord,
      masteredCharacters,
      score,
      loading,
      error,
      currentCycle,
      setCurrentCycle,
      fetchNextWord,
      updateProgress,
      resetSession
    }}>
      {children}
    </ProgressContext.Provider>
  );
};
