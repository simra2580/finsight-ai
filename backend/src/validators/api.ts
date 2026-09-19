import { z } from 'zod';
import { currency, objectId } from './common.js';

export const extractBodySchema = z.object({
  text: z.string().optional(), vendor: z.string().min(1).optional(), amount: z.coerce.number().positive().optional(), currency: currency.optional(), destination_account: z.string().min(4).optional(), due_date: z.string().optional(), invoice_number: z.string().optional(), payment_details: z.record(z.string(), z.unknown()).optional()
});
export const riskSchema = z.object({ invoice_id: objectId.optional(), vendor_id: objectId.optional(), amount: z.number().positive(), currency, destination_account: z.string().optional(), due_date: z.coerce.date().optional(), created_at: z.coerce.date().optional() });
export const routeCompareSchema = z.object({ risk_score: z.number().min(0).max(100).default(0) });
export const routeRecommendSchema = z.object({ risk_score: z.number().min(0).max(100), route_id: z.string().optional() });
export const simulateSchema = z.object({ invoice_id: objectId, route_id: z.string().optional() });
export const settlementSchema = z.object({ transaction_id: objectId });
