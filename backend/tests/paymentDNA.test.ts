import { describe, expect, it } from 'vitest';
import { comparePaymentToProfile } from '../src/services/paymentDNA/paymentDna.service.js';

const profile = { typical_amount_min: 200000, typical_amount_max: 500000, currencies:['INR'], destination_accounts:['1234564821'], frequency_per_month:1, preferred_day_of_month:25, preferred_hour:10, payment_count:8 };

describe('Payment DNA', () => {
  it('detects amount anomaly', () => expect(comparePaymentToProfile(profile,{amount:1870000,currency:'INR'}).map(x=>x.signal)).toContain('AMOUNT_ANOMALY'));
  it('detects account change and new destination', () => { const s=comparePaymentToProfile(profile,{amount:300000,currency:'INR',destination_account:'9876549137'}).map(x=>x.signal); expect(s).toEqual(expect.arrayContaining(['ACCOUNT_CHANGE','NEW_DESTINATION'])); });
  it('detects timing anomaly', () => expect(comparePaymentToProfile(profile,{amount:300000,currency:'INR',created_at:new Date(Date.UTC(2026,8,18,22))}).map(x=>x.signal)).toContain('TIMING_ANOMALY'));
});
