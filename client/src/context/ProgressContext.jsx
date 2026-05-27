import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [userId] = useState('default_user');
  const [currentCycle, setCurrentCycle] = useState(1);
  const [currentWord, setCurrentWord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      
      // Reset local state and fetch word #1
      setCurrentWord(null);
      await fetchNextWord();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextWord();
  }, [currentCycle]);

  return (
    <ProgressContext.Provider value={{
      currentWord,
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
