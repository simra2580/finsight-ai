import type { Request, Response } from 'express';
import { Invoice, Vendor, RiskEvent, Transaction } from '../models/index.js';
import { riskSchema } from '../validators/api.js';
import { analyzeRisk, whatChanged } from '../services/risk/risk.service.js';
import { ok, AppError } from '../utils/http.js';

export async function analyze(req: Request, res: Response) {
  const body = riskSchema.parse(req.body);
  let vendor: any = null;
  if (body.vendor_id) vendor = await Vendor.findOne({ _id: body.vendor_id, business_id: req.user?.businessId ?? 'demo-business' }).lean();
  if (body.invoice_id) { const invoice = await Invoice.findOne({ _id: body.invoice_id, business_id: req.user?.businessId ?? 'demo-business' }).lean(); if (!invoice) throw new AppError(404,'NOT_FOUND','Invoice not found'); vendor = await Vendor.findById(invoice.vendor_id).lean(); }
  const result = await analyzeRisk(body, vendor?.behavioral_profile, !vendor);
  if (body.invoice_id) {
    const tx = await Transaction.findOne({ business_id: req.user?.businessId ?? 'demo-business', invoice_id: body.invoice_id }).sort({ createdAt: -1 });
    if (tx) { await Transaction.updateOne({ _id: tx._id }, { $set: { risk_score: result.risk_score, risk_level: result.risk_level, risk_reasons: result.reasons, risk_signals: result.signals } }); }
  }
  res.json(ok(result));
}

export async function changed(req: Request, res: Response) {
  const invoice = await Invoice.findOne({ _id: req.params.id, business_id: req.user?.businessId ?? 'demo-business' }).lean();
  if (!invoice) throw new AppError(404,'NOT_FOUND','Invoice not found');
  const vendor = await Vendor.findById(invoice.vendor_id).lean();
  res.json(ok(whatChanged(vendor?.behavioral_profile, { amount: invoice.amount, currency: invoice.currency, destination_account: invoice.destination_account, due_date: invoice.due_date }, !vendor || !vendor.behavioral_profile?.payment_count)));
}
