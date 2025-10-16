import { useState } from 'react';
import { authService } from '../services/auth';
import { User } from '../types';
import { getErrorMessage } from '../errors';

export function useAuth() {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError('');
    
    try {
      const result = await authService.login({ email, password });
      setUser(result.user);
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError('');
    
    try {
      const result = await authService.register({ name, email, password });
      setUser(result.user);
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const clearError = () => {
    setError('');
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  };
}
