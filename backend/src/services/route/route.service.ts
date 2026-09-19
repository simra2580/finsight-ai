import { Route } from '../../models/Route.js';

export const DEMO_ROUTES = [
  { route_id: 'DEMO-BANK-A', provider: 'Demo Bank Rail A', cost: 1250, eta_minutes: 1440, reliability: 98, risk_score: 18, risk_attributes: { coverage: 'business-hours' } },
  { route_id: 'DEMO-FINTECH-B', provider: 'Demo Fintech Rail B', cost: 850, eta_minutes: 360, reliability: 95, risk_score: 28, risk_attributes: { coverage: 'extended-hours' } },
  { route_id: 'DEMO-FAST-C', provider: 'Demo Fast Rail C', cost: 1750, eta_minutes: 90, reliability: 92, risk_score: 34, risk_attributes: { coverage: '24x7' } }
];

export async function ensureDemoRoutes(businessId: string) {
  for (const route of DEMO_ROUTES) await Route.updateOne({ business_id: businessId, route_id: route.route_id }, { $setOnInsert: { business_id: businessId, ...route, simulated: true } }, { upsert: true });
  return Route.find({ business_id: businessId }).lean();
}

export async function compareRoutes(businessId: string, riskScore = 0) {
  const routes = await ensureDemoRoutes(businessId);
  return routes.map(r => ({ ...r, suitability_score: Math.round((100 - r.risk_score) * 0.45 + r.reliability * 0.3 + Math.max(0, 100 - r.cost / 20) * 0.15 + Math.max(0, 100 - r.eta_minutes / 14.4) * 0.1 - (riskScore > 80 ? r.risk_score * 0.1 : 0)) })).sort((a,b) => b.suitability_score - a.suitability_score);
}

export async function recommendRoute(businessId: string, riskScore: number, requestedRouteId?: string) {
  const routes = await compareRoutes(businessId, riskScore);
  const selected = requestedRouteId ? routes.find(r => r.route_id === requestedRouteId) : routes[0];
  if (!selected) throw new Error('Requested route not available');
  const action = riskScore >= 80 ? 'PAUSE_AND_VERIFY' : riskScore >= 50 ? 'REVIEW_BEFORE_EXECUTION' : 'PROCEED_WITH_REVIEW';
  return { recommendation: selected, action, explanation: riskScore >= 80 ? 'The payment risk assessment is high; route selection is shown for review only and execution should wait for verification.' : `Selected the simulated route based on configurable cost, ETA, reliability and assessed route risk.` };
}
