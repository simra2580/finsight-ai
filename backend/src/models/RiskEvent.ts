import { Schema, model } from 'mongoose';

const schema = new Schema({
  business_id: { type: String, required: true, index: true },
  transaction_id: { type: Schema.Types.ObjectId, ref: 'Transaction', required: true, index: true },
  signal: { type: String, required: true },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
  evidence: { type: Schema.Types.Mixed, default: {} },
  created_at: { type: Date, default: Date.now, index: true }
}, { collection: 'risk_events' });

export const RiskEvent = model('RiskEvent', schema);
