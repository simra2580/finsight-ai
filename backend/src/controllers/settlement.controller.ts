import type { Request, Response } from 'express';
import { Settlement, Transaction } from '../models/index.js';
import { settlementSchema } from '../validators/api.js';
import { AppError, ok } from '../utils/http.js';
import { env } from '../config/env.js';

export async function testnet(req: Request, res: Response) {
  const body = settlementSchema.parse(req.body);
  if (!env.TESTNET_ENABLED) throw new AppError(409, 'TESTNET_DISABLED', 'Testnet settlement adapter is disabled in this MVP environment');
  const tx = await Transaction.findOne({ _id: body.transaction_id, business_id: req.user?.businessId ?? 'demo-business' }).lean();
  if (!tx) throw new AppError(404,'NOT_FOUND','Transaction not found');
  const settlement = await Settlement.findOneAndUpdate({ transaction_id: tx._id }, { $set: { business_id: tx.business_id, network: env.TESTNET_NETWORK, status: 'SIMULATED', simulated: true } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  res.status(201).json(ok({ simulated: true, settlement }));
}
