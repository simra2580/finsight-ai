import { Schema, model } from 'mongoose';

const schema = new Schema({
  business_id: { type: String, required: true, index: true },
  role: { type: String, enum: ['admin', 'finance_manager', 'finance_user', 'viewer'], default: 'finance_user' },
  authentication_metadata: { email: { type: String, required: true, lowercase: true, trim: true }, password_hash: String }
}, { timestamps: true, collection: 'users' });

schema.index({ business_id: 1, 'authentication_metadata.email': 1 }, { unique: true });
export const User = model('User', schema);
