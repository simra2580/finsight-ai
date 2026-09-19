export class AppError extends Error {
  constructor(public statusCode: number, public code: string, message: string, public details?: unknown) {
    super(message);
    this.name = 'AppError';
  }
}

export function ok<T>(data: T) { return { success: true, data }; }
export function fail(code: string, message: string, details?: unknown) {
  return { success: false, error: { code, message, ...(details === undefined ? {} : { details }) } };
}
