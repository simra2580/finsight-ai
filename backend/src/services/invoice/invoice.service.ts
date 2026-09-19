import { Invoice, Vendor } from '../../models/index.js';
import { AppError } from '../../utils/http.js';
import { extractInvoiceText } from './extraction.service.js';
import { storeInvoiceFile } from './storage.service.js';

export async function extractAndCreateInvoice(input: { businessId: string; text?: string; file?: { buffer: Buffer; originalname: string; mimetype: string }; vendor?: string; amount?: number; currency?: string; destination_account?: string; due_date?: string; invoice_number?: string; payment_details?: any }) {
  let extracted = input.text ? extractInvoiceText(input.text) : {};
  if (input.file) {
    const text = input.file.buffer.toString('utf8');
    const parsed = extractInvoiceText(text);
    extracted = { ...parsed, ...extracted };
  }
  extracted = { ...extracted, vendor: input.vendor ?? extracted.vendor, amount: input.amount ?? extracted.amount, currency: input.currency ?? extracted.currency, destination_account: input.destination_account ?? extracted.destination_account, due_date: input.due_date ?? extracted.due_date, invoice_number: input.invoice_number ?? extracted.invoice_number, payment_details: input.payment_details ?? extracted.payment_details };
  if (!extracted.vendor || !extracted.amount || !extracted.currency) throw new AppError(400, 'EXTRACTION_INCOMPLETE', 'Vendor, amount and currency are required after extraction');

  let vendor = await Vendor.findOne({ business_id: input.businessId, name: extracted.vendor });
  if (!vendor) vendor = await Vendor.create({ business_id: input.businessId, name: extracted.vendor, behavioral_profile: {} });
  let source_uri: string | undefined;
  if (input.file) source_uri = (await storeInvoiceFile(input.file.buffer, input.file.originalname, input.file.mimetype)).uri;
  const invoice = await Invoice.create({ business_id: input.businessId, vendor_id: vendor._id, amount: extracted.amount, currency: extracted.currency, due_date: parsedDate(extracted.due_date), extracted_data: extracted, status: 'EXTRACTED', invoice_number: extracted.invoice_number, destination_account: extracted.destination_account, payment_details: extracted.payment_details, source: input.file ? 'upload' : 'manual', source_uri });
  return { invoice, extracted, vendor };
}

function parsedDate(value?: string) { if (!value) return undefined; const d = new Date(value); return Number.isNaN(d.getTime()) ? undefined : d; }
