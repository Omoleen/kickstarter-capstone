import { formatDate } from './utils.js';

export const transformIdea = (idea: any) => {
  if (!idea) {
    throw new Error('Idea object is required for transformation');
  }
  
  if (!idea.author) {
    throw new Error('Idea must have author populated for transformation');
  }

  return {
    id: idea._id?.toString() || '',
    title: idea.title || '',
    description: idea.description || '',
    authorId: idea.author._id?.toString() || '',
    authorName: idea.author.name || 'Unknown Author',
    likes: idea.likesCount || 0,
    pledgedAmount: idea.totalPledged || 0,
    comments: idea.comments || [],
    createdAt: formatDate(idea.createdAt),
    // Keep backend fields for internal use
    isLikedByUser: idea.isLikedByUser || false,
    isPledgedByUser: idea.isPledgedByUser || false,
    likesCount: idea.likesCount || 0,
    pledgesCount: idea.pledgesCount || 0,
    totalPledged: idea.totalPledged || 0,
  };
};
