import { Schema, model } from 'mongoose';

const schema = new Schema({
  business_id: { type: String, required: true, index: true },
  vendor_id: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, uppercase: true, minlength: 3, maxlength: 3, match: /^[A-Z]{3}$/ },
  due_date: { type: Date },
  extracted_data: { type: Schema.Types.Mixed, default: {} },
  status: { type: String, enum: ['DRAFT', 'EXTRACTED', 'REVIEW', 'APPROVED', 'SIMULATED', 'PAID', 'BLOCKED'], default: 'DRAFT', index: true },
  invoice_number: { type: String },
  destination_account: { type: String },
  payment_details: { type: Schema.Types.Mixed, default: {} },
  source: { type: String, enum: ['manual', 'upload', 'seed'], default: 'manual' },
  source_uri: { type: String }
}, { timestamps: true, collection: 'invoices' });

export const Invoice = model('Invoice', schema);
