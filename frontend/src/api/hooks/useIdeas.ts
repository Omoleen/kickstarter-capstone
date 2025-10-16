import { useState, useEffect } from 'react';
import { ideasService } from '../services/ideas';
import { Idea } from '../types';
import { getErrorMessage } from '../errors';

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchIdeas = async () => {
    setLoading(true);
    setError('');
    
    try {
      const fetchedIdeas = await ideasService.getAllIdeas();
      setIdeas(fetchedIdeas);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const createIdea = async (title: string, description: string): Promise<boolean> => {
    setLoading(true);
    setError('');
    
    try {
      const newIdea = await ideasService.createIdea({ title, description });
      setIdeas(prev => [newIdea, ...prev]);
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const likeIdea = async (ideaId: string): Promise<void> => {
    try {
      const response = await ideasService.likeIdea(ideaId);
      setIdeas(prev => prev.map(idea => 
        idea.id === ideaId 
          ? { ...idea, likes: response.likesCount, isLikedByUser: response.isLikedByUser }
          : idea
      ));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const pledgeToIdea = async (ideaId: string): Promise<void> => {
    try {
      const response = await ideasService.pledgeToIdea(ideaId);
      setIdeas(prev => prev.map(idea => 
        idea.id === ideaId 
          ? { ...idea, pledgedAmount: response.totalPledged, isPledgedByUser: response.isPledgedByUser }
          : idea
      ));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const clearError = () => {
    setError('');
  };

  const refreshIdeas = () => {
    fetchIdeas();
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  return {
    ideas,
    loading,
    error,
    fetchIdeas,
    createIdea,
    likeIdea,
    pledgeToIdea,
    clearError,
    refreshIdeas,
  };
}
