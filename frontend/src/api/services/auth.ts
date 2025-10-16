import apiClient from '../client';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

export class AuthService {
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials, false);
    
    // Store token and user data
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('current_user', JSON.stringify(response.user));
    
    return {
      user: response.user,
      token: response.token,
    };
  }

  async register(userData: RegisterRequest): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData, false);
    
    // Store token and user data
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('current_user', JSON.stringify(response.user));
    
    return {
      user: response.user,
      token: response.token,
    };
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('current_user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Export singleton instance
export const authService = new AuthService();
