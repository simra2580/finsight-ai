import { describe, expect, it } from 'vitest';
import { extractInvoiceText } from '../src/services/invoice/extraction.service.js';

describe('Invoice extraction', () => {
  it('extracts core fields from structured invoice text', () => {
    const result = extractInvoiceText(`Vendor: Acme Software Services\nInvoice Number: FS-001\nAmount: ₹18,70,000\nCurrency: INR\nAccount: 9876549137\nDue Date: 20 Sep 2026`);
    expect(result.vendor).toBe('Acme Software Services');
    expect(result.amount).toBe(1870000);
    expect(result.currency).toBe('INR');
    expect(result.destination_account).toBe('9876549137');
    expect(result.invoice_number).toBe('FS-001');
  });
});
