// Matches the backend's consistent response shape:
//   success: { success: true, message, data }
//   error:   { success: false, message, statusCode, errors? }
export interface ApiSuccess<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: boolean;
  message: string;
  statusCode: number;
  errors?: Array<{ field: string; message: string }>;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PagedResult<T> {
  items: T[];
  pagination: Pagination;
}
