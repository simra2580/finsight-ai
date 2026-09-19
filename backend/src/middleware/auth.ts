import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/http.js';

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) return next(new AppError(401, 'UNAUTHORIZED', 'Bearer token required'));
  try {
    req.user = jwt.verify(header.slice(7), env.JWT_SECRET) as Express.Request['user'];
    next();
  } catch { next(new AppError(401, 'UNAUTHORIZED', 'Invalid or expired token')); }
};

export const optionalAuth: RequestHandler = (req, _res, next) => {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) return next();
  try { req.user = jwt.verify(header.slice(7), env.JWT_SECRET) as Express.Request['user']; } catch { /* demo-friendly: ignore invalid optional token */ }
  next();
};

export function signToken(userId: string, businessId: string, role = 'finance_manager') {
  return jwt.sign({ userId, businessId, role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}
