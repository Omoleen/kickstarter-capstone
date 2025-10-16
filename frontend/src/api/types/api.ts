// General API types

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface ApiConfig {
  baseURL: string;
  timeout: number;
}

// Generic API response wrapper
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: ApiError;
}

// Pagination types (for future use)
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
