import type { Request, Response } from 'express';
import { simulateSchema } from '../validators/api.js';
import { getTransaction, simulatePayment } from '../services/transaction/transaction.service.js';
import { ok } from '../utils/http.js';

export async function simulate(req: Request, res: Response) { const body = simulateSchema.parse(req.body); const result = await simulatePayment(req.user?.businessId ?? 'demo-business', body.invoice_id, body.route_id); res.status(201).json(ok({ simulated: true, transaction: result.transaction, risk: result.risk, route: result.route })); }
export async function get(req: Request, res: Response) { res.json(ok(await getTransaction(req.user?.businessId ?? 'demo-business', req.params.id))); }
