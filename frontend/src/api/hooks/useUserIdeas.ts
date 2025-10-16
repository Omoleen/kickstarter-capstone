import { useState, useEffect } from 'react';
import { ideasService } from '../services/ideas';
import { Idea } from '../types';
import { getErrorMessage } from '../errors';

export function useUserIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchUserIdeas = async () => {
    setLoading(true);
    setError('');
    
    try {
      const fetchedIdeas = await ideasService.getUserIdeas();
      setIdeas(fetchedIdeas);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError('');
  };

  const refreshIdeas = () => {
    fetchUserIdeas();
  };

  // Calculate stats
  const stats = {
    totalIdeas: ideas.length,
    totalLikes: ideas.reduce((sum, idea) => sum + (idea.likes || 0), 0),
    totalPledged: ideas.reduce((sum, idea) => sum + (idea.pledgedAmount || 0), 0),
    totalComments: ideas.reduce((sum, idea) => sum + (idea.comments?.length || 0), 0),
  };

  useEffect(() => {
    fetchUserIdeas();
  }, []);

  return {
    ideas,
    loading,
    error,
    stats,
    fetchUserIdeas,
    clearError,
    refreshIdeas,
  };
}
