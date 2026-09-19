import { Schema, model } from 'mongoose';

const schema = new Schema({
  transaction_id: { type: Schema.Types.ObjectId, ref: 'Transaction', required: true, unique: true, index: true },
  business_id: { type: String, required: true, index: true },
  network: { type: String, required: true },
  tx_hash: { type: String },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'FAILED', 'SIMULATED'], default: 'SIMULATED' },
  simulated: { type: Boolean, default: true }
}, { timestamps: true, collection: 'settlements' });

export const Settlement = model('Settlement', schema);
