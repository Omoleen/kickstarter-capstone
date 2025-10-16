import apiClient from '../client';
import { 
  Comment, 
  CreateCommentRequest, 
  CreateCommentResponse 
} from '../types';

export class CommentsService {
  async getCommentsForIdea(ideaId: string): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`/comments/idea/${ideaId}`, false); // Public endpoint
  }

  async createComment(commentData: CreateCommentRequest): Promise<Comment> {
    const response = await apiClient.post<CreateCommentResponse>('/comments', commentData);
    return response.comment;
  }

  async updateComment(commentId: string, content: string): Promise<Comment> {
    const response = await apiClient.put<CreateCommentResponse>(`/comments/${commentId}`, { content });
    return response.comment;
  }

  async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete(`/comments/${commentId}`);
  }
}

// Export singleton instance
export const commentsService = new CommentsService();
