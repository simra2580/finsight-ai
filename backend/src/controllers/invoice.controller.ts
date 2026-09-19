import type { Request, Response } from 'express';
import { extractBodySchema } from '../validators/api.js';
import { extractAndCreateInvoice } from '../services/invoice/invoice.service.js';
import { ok } from '../utils/http.js';

export async function extractInvoice(req: Request, res: Response) {
  const body = extractBodySchema.parse(req.body);
  const file = (req as any).file as Express.Multer.File | undefined;
  const data = await extractAndCreateInvoice({ businessId: req.user?.businessId ?? String(body.business_id ?? 'demo-business'), ...body, file: file ? { buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype } : undefined });
  res.status(201).json(ok({ invoice: data.invoice, extracted: data.extracted, vendor: data.vendor }));
}
