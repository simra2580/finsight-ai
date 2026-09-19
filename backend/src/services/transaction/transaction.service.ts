import { Invoice, Route, Transaction, RiskEvent } from '../../models/index.js';
import { AppError } from '../../utils/http.js';
import { analyzeRisk } from '../risk/risk.service.js';
import { getVendorProfile } from '../paymentDNA/paymentDna.service.js';

const states = ['INITIATED','PROCESSING','RISK_CHECK','ROUTING','SETTLEMENT','COMPLETED'] as const;

export async function simulatePayment(businessId: string, invoiceId: string, routeId?: string) {
  const invoice = await Invoice.findOne({ _id: invoiceId, business_id: businessId }).lean();
  if (!invoice) throw new AppError(404, 'NOT_FOUND', 'Invoice not found');
  const vendor = await getVendorProfile(String(invoice.vendor_id));
  const risk = await analyzeRisk({ amount: invoice.amount, currency: invoice.currency, destination_account: invoice.destination_account, due_date: invoice.due_date, created_at: new Date() }, vendor?.behavioral_profile);
  const route = routeId ? await Route.findOne({ business_id: businessId, route_id: routeId }).lean() : undefined;
  if (routeId && !route) throw new AppError(404, 'ROUTE_NOT_FOUND', 'Route not found');
  const now = new Date();
  const events = states.map((status, i) => ({ status, message: status === 'RISK_CHECK' ? `Risk assessment: ${risk.risk_level}` : `Simulation state ${status}`, timestamp: new Date(now.getTime() + i * 1000), metadata: status === 'ROUTING' ? { route_id: route?.route_id ?? null, simulated: true } : {} }));
  const blocked = risk.risk_level === 'CRITICAL';
  if (blocked) events.push({ status: 'BLOCKED' as any, message: 'Simulation blocked by critical risk assessment', timestamp: new Date(now.getTime() + 6000), metadata: { simulated: true } });
  const finalStatus = blocked ? 'BLOCKED' : 'COMPLETED';
  const transaction = await Transaction.create({ business_id: businessId, invoice_id: invoice._id, route_id: route?.route_id, risk_score: risk.risk_score, risk_level: risk.risk_level, status: finalStatus, timestamps: { initiated_at: now, completed_at: finalStatus === 'COMPLETED' ? new Date(now.getTime()+5000) : undefined, updated_at: new Date() }, events, exceptions: blocked ? ['Critical risk assessment'] : [], risk_reasons: risk.reasons, risk_signals: risk.signals });
  await Invoice.updateOne({ _id: invoice._id }, { $set: { status: finalStatus === 'COMPLETED' ? 'SIMULATED' : 'BLOCKED' } });
  if (risk.signals.length) await RiskEvent.insertMany(risk.signals.map((signal, i) => ({ business_id: businessId, transaction_id: transaction._id, signal, severity: signal === 'ACCOUNT_CHANGE' || signal === 'NEW_DESTINATION' ? 'HIGH' : risk.risk_level, evidence: risk.evidence[i] ?? {} }))); 
  return { transaction, risk, route };
}

export async function getTransaction(businessId: string, id: string) {
  const tx = await Transaction.findOne({ _id: id, business_id: businessId }).lean();
  if (!tx) throw new AppError(404, 'NOT_FOUND', 'Transaction not found');
  const [invoice, route] = await Promise.all([Invoice.findById(tx.invoice_id).lean(), tx.route_id ? Route.findOne({ business_id: businessId, route_id: tx.route_id }).lean() : null]);
  return { payment: tx, invoice, route, simulated: true };
}
