import { Schema, model } from 'mongoose';

const behavioral = new Schema({
  typical_amount_min: { type: Number, default: 0 },
  typical_amount_max: { type: Number, default: 0 },
  currencies: { type: [String], default: [] },
  destination_accounts: { type: [String], default: [] },
  frequency_per_month: { type: Number, default: 0 },
  preferred_day_of_month: { type: Number },
  preferred_hour: { type: Number },
  payment_count: { type: Number, default: 0 },
  last_payment_at: { type: Date },
  historical_behavior: { type: [Schema.Types.Mixed], default: [] }
}, { _id: false });

const schema = new Schema({
  business_id: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true },
  behavioral_profile: { type: behavioral, default: () => ({}) }
}, { timestamps: true, collection: 'vendors' });

schema.index({ business_id: 1, name: 1 });
export const Vendor = model('Vendor', schema);
