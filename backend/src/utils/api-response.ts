// Shared response helpers so every endpoint returns a predictable shape.
// Success: { success: true, message, data }
// Error:   { success: false, message, statusCode, errors? }

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export function ok<T>(message: string, data: T): ApiSuccess<T> {
  return { success: true, message, data };
}

// Custom error class used by services/controllers.
// The global error middleware maps `statusCode` to the HTTP status.
export class AppError extends Error {
  statusCode: number;
  errors?: Array<{ field: string; message: string }>;

  constructor(message: string, statusCode = 500, errors?: Array<{ field: string; message: string }>) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
