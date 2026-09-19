import type { Request, Response } from 'express';
import { getVendorProfile } from '../services/paymentDNA/paymentDna.service.js';
import { AppError, ok } from '../utils/http.js';
import { Vendor } from '../models/Vendor.js';

export async function profile(req: Request, res: Response) {
  const vendor = await Vendor.findOne({ _id: req.params.id, business_id: req.user?.businessId ?? 'demo-business' }).lean();
  if (!vendor) throw new AppError(404,'NOT_FOUND','Vendor not found');
  res.json(ok({ vendor_id: vendor._id, name: vendor.name, payment_dna: vendor.behavioral_profile }));
}
