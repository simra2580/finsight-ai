import { z } from 'zod';

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB id');
export const currency = z.string().length(3).transform(v => v.toUpperCase());
export const riskLevel = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
