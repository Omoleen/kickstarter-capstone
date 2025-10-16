import { useState, useEffect } from 'react';
import { ideasService } from '../services/ideas';
import { commentsService } from '../services/comments';
import { Idea } from '../types';
import { getErrorMessage } from '../errors';

export function useIdea(ideaId: string | null) {
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchIdea = async (id: string) => {
    setLoading(true);
    setError('');
    
    try {
      const fetchedIdea = await ideasService.getIdeaById(id);
      setIdea(fetchedIdea);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string): Promise<boolean> => {
    if (!ideaId) return false;
    
    try {
      const newComment = await commentsService.createComment({ content, ideaId });
      setIdea(prev => prev ? {
        ...prev,
        comments: [...prev.comments, newComment]
      } : null);
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    }
  };

  const likeIdea = async (): Promise<void> => {
    if (!ideaId) return;
    
    try {
      const response = await ideasService.likeIdea(ideaId);
      setIdea(prev => prev ? {
        ...prev,
        likes: response.likesCount,
        isLikedByUser: response.isLikedByUser
      } : null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const pledgeToIdea = async (): Promise<void> => {
    if (!ideaId) return;
    
    try {
      const response = await ideasService.pledgeToIdea(ideaId);
      setIdea(prev => prev ? {
        ...prev,
        pledgedAmount: response.totalPledged,
        isPledgedByUser: response.isPledgedByUser
      } : null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const clearError = () => {
    setError('');
  };

  const refetch = () => {
    if (ideaId) {
      fetchIdea(ideaId);
    }
  };

  useEffect(() => {
    if (ideaId) {
      fetchIdea(ideaId);
    } else {
      setIdea(null);
    }
  }, [ideaId]);

  return {
    idea,
    loading,
    error,
    addComment,
    likeIdea,
    pledgeToIdea,
    clearError,
    refetch,
  };
}
