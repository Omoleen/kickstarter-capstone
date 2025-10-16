import { formatDate } from './utils.js';

export const transformComment = (comment: any) => {
  if (!comment) {
    throw new Error('Comment object is required for transformation');
  }
  
  if (!comment.author) {
    throw new Error('Comment must have author populated for transformation');
  }

  return {
    id: comment._id?.toString() || '',
    authorName: comment.author.name || 'Unknown Author',
    content: comment.content || '',
    createdAt: formatDate(comment.createdAt),
  };
};
