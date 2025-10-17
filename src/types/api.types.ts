// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
  path: string;
}

// Pagination Meta
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}