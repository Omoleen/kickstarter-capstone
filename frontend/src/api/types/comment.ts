// Comment-related types

export interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
  ideaId: string;
}

export interface CreateCommentResponse {
  message: string;
  comment: Comment;
}
