import { Vendor } from '../../models/Vendor.js';

export type PaymentInput = {
  amount: number; currency: string; destination_account?: string; due_date?: Date | string; created_at?: Date | string;
};

export type Anomaly = { signal: string; severity: 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'; reason: string; evidence: Record<string, unknown> };

function dayOfMonth(date: Date) { return date.getUTCDate(); }
function hourOfDay(date: Date) { return date.getUTCHours(); }

export function comparePaymentToProfile(profile: any, payment: PaymentInput): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const amountMin = Number(profile?.typical_amount_min ?? 0);
  const amountMax = Number(profile?.typical_amount_max ?? 0);
  if (amountMin > 0 && amountMax > 0 && (payment.amount < amountMin || payment.amount > amountMax)) {
    anomalies.push({ signal: 'AMOUNT_ANOMALY', severity: payment.amount > amountMax * 2 ? 'HIGH' : 'MEDIUM', reason: 'Payment amount is outside the vendor’s normal range', evidence: { historical: [amountMin, amountMax], current: payment.amount } });
  }
  const currencies: string[] = profile?.currencies ?? [];
  if (currencies.length && !currencies.includes(payment.currency.toUpperCase())) {
    anomalies.push({ signal: 'CURRENCY_CHANGE', severity: 'HIGH', reason: 'Payment currency differs from historical vendor behavior', evidence: { historical: currencies, current: payment.currency } });
  }
  const accounts: string[] = profile?.destination_accounts ?? [];
  if (payment.destination_account && accounts.length && !accounts.includes(payment.destination_account)) {
    anomalies.push({ signal: 'ACCOUNT_CHANGE', severity: 'HIGH', reason: 'Destination account differs from known vendor accounts', evidence: { historical: accounts.map(maskAccount), current: maskAccount(payment.destination_account) } });
    anomalies.push({ signal: 'NEW_DESTINATION', severity: 'HIGH', reason: 'Destination account has not been seen in the vendor history', evidence: { current: maskAccount(payment.destination_account) } });
  }
  const date = new Date(payment.created_at ?? new Date());
  if (payment.due_date) {
    const due = new Date(payment.due_date);
    const hoursToDue = (due.getTime() - date.getTime()) / 3600000;
    if (hoursToDue >= 0 && hoursToDue <= 48) anomalies.push({ signal: 'TIMING_ANOMALY', severity: 'MEDIUM', reason: 'Payment request has unusually urgent timing', evidence: { hours_to_due: Math.round(hoursToDue) } });
  }
  const preferredDay = Number(profile?.preferred_day_of_month ?? 0);
  if (preferredDay > 0 && Math.abs(dayOfMonth(date) - preferredDay) > 5) {
    anomalies.push({ signal: 'TIMING_ANOMALY', severity: 'MEDIUM', reason: 'Payment timing differs from the vendor’s usual schedule', evidence: { historical_day: preferredDay, current_day: dayOfMonth(date) } });
  }
  const preferredHour = Number(profile?.preferred_hour);
  if (Number.isFinite(preferredHour) && Math.abs(hourOfDay(date) - preferredHour) > 6) {
    if (!anomalies.some(a => a.signal === 'TIMING_ANOMALY')) anomalies.push({ signal: 'TIMING_ANOMALY', severity: 'MEDIUM', reason: 'Payment time differs from the vendor’s usual timing pattern', evidence: { historical_hour: preferredHour, current_hour: hourOfDay(date) } });
  }
  const frequency = Number(profile?.frequency_per_month ?? 0);
  if (frequency > 0 && Number(profile?.payment_count ?? 0) > frequency * 1.5) {
    anomalies.push({ signal: 'FREQUENCY_ANOMALY', severity: 'MEDIUM', reason: 'Payment frequency is higher than the established pattern', evidence: { expected_per_month: frequency, payment_count: profile.payment_count } });
  }
  return anomalies;
}

export function buildPaymentDna(vendor: any) {
  return vendor?.behavioral_profile ?? {};
}

export async function getVendorProfile(vendorId: string) {
  return Vendor.findById(vendorId).lean();
}

function maskAccount(value: string) { return value.length <= 4 ? value : `XXXX${value.slice(-4)}`; }
