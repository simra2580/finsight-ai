import type { Request, Response } from 'express';
import { compareRoutes, recommendRoute } from '../services/route/route.service.js';
import { routeCompareSchema, routeRecommendSchema } from '../validators/api.js';
import { ok } from '../utils/http.js';

export async function compare(req: Request, res: Response) { const body = routeCompareSchema.parse(req.body); res.json(ok({ simulated: true, routes: await compareRoutes(req.user?.businessId ?? 'demo-business', body.risk_score) })); }
export async function recommend(req: Request, res: Response) { const body = routeRecommendSchema.parse(req.body); res.json(ok({ simulated: true, ...(await recommendRoute(req.user?.businessId ?? 'demo-business', body.risk_score, body.route_id)) })); }
