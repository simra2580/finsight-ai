import { describe, expect, it } from 'vitest';
import { calculateRisk, whatChanged } from '../src/services/risk/risk.service.js';

describe('Risk Guardian', () => {
  it('calculates reproducible risk score and level', () => {
    const result = calculateRisk([
      {signal:'AMOUNT_ANOMALY',severity:'HIGH',reason:'Unusual amount',evidence:{}},
      {signal:'ACCOUNT_CHANGE',severity:'HIGH',reason:'New destination account',evidence:{}},
      {signal:'TIMING_ANOMALY',severity:'MEDIUM',reason:'Urgent timing',evidence:{}}
    ]);
    expect(result.risk_score).toBe(75); expect(result.risk_level).toBe('HIGH');
  });
  it('builds What Changed response', () => {
    const out = whatChanged({typical_amount_min:200000,typical_amount_max:500000,currencies:['INR'],destination_accounts:['1234564821'],preferred_day_of_month:25},{amount:1870000,currency:'INR',destination_account:'9876549137',created_at:new Date(Date.UTC(2026,8,18))});
    expect(out.changes.some(c=>c.field==='amount')).toBe(true); expect(out.changes.some(c=>c.field==='destination')).toBe(true);
  });
});
