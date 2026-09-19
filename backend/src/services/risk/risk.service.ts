import { env } from '../../config/env.js';
import { comparePaymentToProfile, type PaymentInput } from '../paymentDNA/paymentDna.service.js';
import { getAiExplanation } from '../ai/ai.service.js';

export type RiskResult = {
  risk_score: number;
  risk_level: 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL';
  reasons: string[];
  signals: string[];
  recommended_action: string;
  evidence: Record<string, unknown>[];
  ai_explanation?: string;
};

const thresholds = { LOW: Number(process.env.RISK_LOW_MAX ?? 24), MEDIUM: Number(process.env.RISK_MEDIUM_MAX ?? 49), HIGH: Number(process.env.RISK_HIGH_MAX ?? 79) };

const weights: Record<string, number> = { ACCOUNT_CHANGE: 35, NEW_DESTINATION: 15, AMOUNT_ANOMALY: 25, TIMING_ANOMALY: 15, CURRENCY_CHANGE: 20, FREQUENCY_ANOMALY: 15, NEW_VENDOR: 35 };

export function calculateRisk(anomalies: ReturnType<typeof comparePaymentToProfile>, isNewVendor = false): RiskResult {
  const all = [...anomalies];
  if (isNewVendor) all.push({ signal: 'NEW_VENDOR', severity: 'HIGH', reason: 'Vendor has no established payment history', evidence: {} });
  const raw = all.reduce((sum, a) => sum + (weights[a.signal] ?? 10), 0);
  const risk_score = Math.min(100, raw);
  const risk_level = risk_score <= thresholds.LOW ? 'LOW' : risk_score <= thresholds.MEDIUM ? 'MEDIUM' : risk_score <= thresholds.HIGH ? 'HIGH' : 'CRITICAL';
  const reasons = all.map(a => a.reason);
  const signals = all.map(a => a.signal);
  let recommended_action = 'Proceed with normal review';
  if (risk_level === 'MEDIUM') recommended_action = 'Review payment details before approval';
  if (risk_level === 'HIGH') recommended_action = 'Pause and verify vendor details';
  if (risk_level === 'CRITICAL') recommended_action = 'Block simulation and require manual verification';
  return { risk_score, risk_level, reasons, signals, recommended_action, evidence: all.map(a => a.evidence) };
}

export async function analyzeRisk(payment: PaymentInput, profile: any, isNewVendor = false): Promise<RiskResult> {
  const anomalies = comparePaymentToProfile(profile, payment);
  const result = calculateRisk(anomalies, isNewVendor);
  if (env.AI_PROVIDER !== 'mock') {
    try { result.ai_explanation = await getAiExplanation({ payment, profile, risk: result }); } catch (err) { console.warn('AI explanation unavailable; deterministic result retained', err); }
  }
  return result;
}

export function whatChanged(profile: any, payment: PaymentInput, isNewVendor = false) {
  const anomalies = comparePaymentToProfile(profile, payment);
  const changes = anomalies.map(a => ({ field: signalToField(a.signal), historical: historicalValue(a.signal, profile), current: currentValue(a.signal, payment), severity: a.severity, signal: a.signal, evidence: a.evidence }));
  if (isNewVendor) changes.push({ field: 'vendor', historical: 'No established history', current: 'New vendor', severity: 'HIGH', signal: 'NEW_VENDOR', evidence: {} });
  return { changes };
}

function signalToField(s: string) { return ({ AMOUNT_ANOMALY:'amount', ACCOUNT_CHANGE:'destination', NEW_DESTINATION:'destination', TIMING_ANOMALY:'timing', CURRENCY_CHANGE:'currency', FREQUENCY_ANOMALY:'frequency' } as Record<string,string>)[s] ?? s.toLowerCase(); }
function historicalValue(s: string, p: any) { if (s === 'AMOUNT_ANOMALY') return `${p?.typical_amount_min ?? 0}-${p?.typical_amount_max ?? 0}`; if (s === 'ACCOUNT_CHANGE' || s === 'NEW_DESTINATION') return (p?.destination_accounts ?? []).map((x:string)=>`XXXX${x.slice(-4)}`).join(', ') || 'No known destination'; if (s === 'CURRENCY_CHANGE') return (p?.currencies ?? []).join(', ') || 'No historical currency'; if (s === 'TIMING_ANOMALY') return p?.preferred_day_of_month ? `Day ${p.preferred_day_of_month}` : 'Historical schedule'; return p?.frequency_per_month ? `${p.frequency_per_month}/month` : 'Historical frequency'; }
function currentValue(s: string, p: PaymentInput) { if (s === 'AMOUNT_ANOMALY') return p.amount; if (s === 'ACCOUNT_CHANGE' || s === 'NEW_DESTINATION') return p.destination_account ? `XXXX${p.destination_account.slice(-4)}` : 'Unavailable'; if (s === 'CURRENCY_CHANGE') return p.currency; if (s === 'TIMING_ANOMALY') return new Date(p.created_at ?? Date.now()).toISOString(); return 'Current request'; }
