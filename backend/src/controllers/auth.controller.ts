import type { Request, Response } from 'express';
import { User } from '../models/User.js';
import { signToken } from '../middleware/auth.js';
import { ok, AppError } from '../utils/http.js';

export async function demoLogin(req: Request, res: Response) {
  const email = String(req.body?.email ?? 'demo@finsight.local').toLowerCase();
  const businessId = String(req.body?.business_id ?? 'demo-business');
  let user = await User.findOne({ business_id: businessId, 'authentication_metadata.email': email });
  if (!user) user = await User.create({ business_id: businessId, role: 'finance_manager', authentication_metadata: { email } });
  res.json(ok({ token: signToken(String(user._id), businessId, user.role), user: { id: user._id, business_id: businessId, role: user.role, email } }));
}
