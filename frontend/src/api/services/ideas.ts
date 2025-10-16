import apiClient from '../client';
import { 
  Idea, 
  CreateIdeaRequest, 
  CreateIdeaResponse, 
  LikeResponse, 
  PledgeResponse 
} from '../types';

export class IdeasService {
  async getAllIdeas(): Promise<Idea[]> {
    return apiClient.get<Idea[]>('/ideas', true); // Send auth if available for like/pledge status
  }

  async getIdeaById(id: string): Promise<Idea> {
    return apiClient.get<Idea>(`/ideas/${id}`, true); // Send auth if available for like/pledge status
  }

  async createIdea(ideaData: CreateIdeaRequest): Promise<Idea> {
    const response = await apiClient.post<CreateIdeaResponse>('/ideas', ideaData);
    return response.idea;
  }

  async getUserIdeas(): Promise<Idea[]> {
    return apiClient.get<Idea[]>('/ideas/user/my-ideas');
  }

  async likeIdea(ideaId: string): Promise<LikeResponse> {
    return apiClient.post<LikeResponse>(`/ideas/${ideaId}/like`);
  }

  async pledgeToIdea(ideaId: string): Promise<PledgeResponse> {
    return apiClient.post<PledgeResponse>(`/ideas/${ideaId}/pledge`);
  }
}

// Export singleton instance
export const ideasService = new IdeasService();
