import type { Request, Response } from 'express';
import { getInsights } from '../services/insights/insights.service.js';
import { ok, AppError } from '../utils/http.js';
export async function insights(req: Request, res: Response) { const businessId = req.user?.businessId ?? 'demo-business'; if (req.params.merchantId !== businessId) throw new AppError(403, 'FORBIDDEN', 'Cannot access another business insight set'); res.json(ok(await getInsights(businessId))); }
