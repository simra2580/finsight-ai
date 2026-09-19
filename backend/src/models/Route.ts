import { Schema, model } from 'mongoose';

const schema = new Schema({
  business_id: { type: String, required: true, index: true },
  route_id: { type: String, required: true, index: true },
  provider: { type: String, required: true },
  cost: { type: Number, required: true, min: 0 },
  eta_minutes: { type: Number, required: true, min: 0 },
  reliability: { type: Number, required: true, min: 0, max: 100 },
  risk_score: { type: Number, required: true, min: 0, max: 100 },
  risk_attributes: { type: Schema.Types.Mixed, default: {} },
  simulated: { type: Boolean, default: true }
}, { timestamps: true, collection: 'routes' });

schema.index({ business_id: 1, route_id: 1 }, { unique: true });
export const Route = model('Route', schema);
