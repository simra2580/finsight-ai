import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError, fail } from '../utils/http.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json(fail('VALIDATION_ERROR', 'Request validation failed', err.issues));
  }
  if (err instanceof AppError) return res.status(err.statusCode).json(fail(err.code, err.message, err.details));
  if (err?.code === 'LIMIT_FILE_SIZE') return res.status(413).json(fail('FILE_TOO_LARGE', 'Uploaded file exceeds the configured size limit'));
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, err);
  return res.status(500).json(fail('INTERNAL_ERROR', 'An unexpected error occurred'));
};
