import { useState, useEffect } from 'react';

export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cacheQuestions = async (questions) => {
    try {
      const cache = await caches.open('exam-lab-questions');
      await cache.put(
        'cached-questions',
        new Response(JSON.stringify(questions))
      );
    } catch (err) {
      console.error('Failed to cache questions:', err);
    }
  };

  const getCachedQuestions = async () => {
    try {
      const cache = await caches.open('exam-lab-questions');
      const response = await cache.match('cached-questions');
      if (response) {
        return await response.json();
      }
      return null;
    } catch (err) {
      console.error('Failed to get cached questions:', err);
      return null;
    }
  };

  return {
    isOnline,
    isOffline,
    cacheQuestions,
    getCachedQuestions
  };
}
