import { ApiError } from './types';

export class ApiErrorHandler {
  static handleError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return 'An unexpected error occurred';
  }

  static isNetworkError(error: unknown): boolean {
    return error instanceof Error && (
      error.name === 'NetworkError' ||
      error.message.includes('fetch') ||
      error.message.includes('network')
    );
  }

  static isAuthError(error: unknown): boolean {
    return error instanceof Error && (
      error.message.includes('401') ||
      error.message.includes('Unauthorized') ||
      error.message.includes('Invalid token')
    );
  }

  static isValidationError(error: unknown): boolean {
    return error instanceof Error && (
      error.message.includes('400') ||
      error.message.includes('validation') ||
      error.message.includes('required')
    );
  }

  static getErrorMessage(error: unknown): string {
    if (this.isNetworkError(error)) {
      return 'Network error. Please check your connection and try again.';
    }
    
    if (this.isAuthError(error)) {
      return 'Authentication failed. Please log in again.';
    }
    
    if (this.isValidationError(error)) {
      return 'Please check your input and try again.';
    }
    
    return this.handleError(error);
  }
}

export const handleApiError = ApiErrorHandler.handleError;
export const getErrorMessage = ApiErrorHandler.getErrorMessage;
