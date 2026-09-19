import { Schema, model } from 'mongoose';

const event = new Schema({
  status: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  metadata: { type: Schema.Types.Mixed, default: {} }
}, { _id: false });

const schema = new Schema({
  business_id: { type: String, required: true, index: true },
  invoice_id: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true, index: true },
  route_id: { type: String, index: true },
  risk_score: { type: Number, min: 0, max: 100 },
  risk_level: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
  status: { type: String, enum: ['INITIATED', 'PROCESSING', 'RISK_CHECK', 'ROUTING', 'SETTLEMENT', 'COMPLETED', 'FAILED', 'BLOCKED'], default: 'INITIATED', index: true },
  timestamps: { initiated_at: Date, completed_at: Date, updated_at: Date },
  events: { type: [event], default: [] },
  exceptions: { type: [String], default: [] },
  risk_reasons: { type: [String], default: [] },
  risk_signals: { type: [String], default: [] }
}, { timestamps: true, collection: 'transactions' });

export const Transaction = model('Transaction', schema);
