import { Invoice, RiskEvent, Transaction, Vendor } from '../../models/index.js';

export async function getInsights(businessId: string) {
  const [transactions, invoices, vendors, riskEvents] = await Promise.all([
    Transaction.find({ business_id: businessId }).lean(), Invoice.find({ business_id: businessId }).lean(), Vendor.find({ business_id: businessId }).lean(), RiskEvent.find({ business_id: businessId }).lean()
  ]);
  const highRisk = transactions.filter(t => ['HIGH','CRITICAL'].includes(t.risk_level ?? '')).length;
  const totalSimulatedValue = invoices.filter(i => ['SIMULATED','BLOCKED'].includes(i.status)).reduce((s,i)=>s+i.amount,0);
  const counts: Record<string, number> = {};
  for (const e of riskEvents) counts[e.signal] = (counts[e.signal] ?? 0) + 1;
  const recurringAnomalies = Object.entries(counts).filter(([,n]) => n >= 2).map(([signal,count])=>({signal,count}));
  const routeCosts = transactions.filter(t=>t.route_id).map(t=>({route_id:t.route_id, risk_score:t.risk_score}));
  return { merchant_id: businessId, generated_from: { transaction_count: transactions.length, invoice_count: invoices.length, vendor_count: vendors.length }, high_risk_payment_count: highRisk, total_simulated_payment_value: totalSimulatedValue, recurring_anomalies: recurringAnomalies, route_cost_observations: routeCosts, risk_trends: buildTrend(transactions), note: 'Demo insights are calculated from project database records and are not real-world fraud statistics.' };
}

function buildTrend(txs: any[]) { const buckets: Record<string,{count:number,total:number}> = {}; for (const t of txs) { const key = new Date(t.createdAt ?? Date.now()).toISOString().slice(0,10); buckets[key] ??= {count:0,total:0}; buckets[key].count++; buckets[key].total += t.risk_score ?? 0; } return Object.entries(buckets).sort(([a],[b])=>a.localeCompare(b)).map(([date,v])=>({date, transaction_count:v.count, average_risk_score: v.count ? Math.round(v.total/v.count) : 0})); }
