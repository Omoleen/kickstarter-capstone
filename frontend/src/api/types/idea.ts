import { Comment } from './comment';

// Idea-related types

export interface Idea {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  likes: number;
  pledgedAmount: number;
  comments: Comment[];
  createdAt: string;
  // Additional backend fields
  isLikedByUser?: boolean;
  isPledgedByUser?: boolean;
  likesCount?: number;
  pledgesCount?: number;
  totalPledged?: number;
}

export interface CreateIdeaRequest {
  title: string;
  description: string;
}

export interface CreateIdeaResponse {
  message: string;
  idea: Idea;
}

export interface LikeResponse {
  message: string;
  likesCount: number;
  isLikedByUser: boolean;
}

export interface PledgeResponse {
  message: string;
  totalPledged: number;
  pledgesCount: number;
  isPledgedByUser: boolean;
}
