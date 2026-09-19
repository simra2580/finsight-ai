export type ExtractedInvoice = {
  vendor?: string; amount?: number; currency?: string; destination_account?: string; due_date?: string; invoice_number?: string; payment_details?: Record<string, unknown>;
};

export function extractInvoiceText(text: string): ExtractedInvoice {
  const normalized = text.replace(/\r/g, '');
  const amountMatch = normalized.match(/(?:₹|INR|Rs\.?|USD|\$|EUR|€)\s*([\d,]+(?:\.\d{1,2})?)/i) || normalized.match(/(?:amount|total|grand total)\s*[:=-]?\s*([\d,]+(?:\.\d{1,2})?)/i);
  const currencyMatch = normalized.match(/\b(INR|USD|EUR|GBP)\b|[₹$€£]/i);
  const vendorMatch = normalized.match(/(?:vendor|supplier|from|pay to)\s*[:=-]\s*([^\n]+)/i);
  const accountMatch = normalized.match(/(?:account|destination|bank account|account number)\s*[:=-]?\s*([A-Za-z0-9_-]{6,})/i);
  const dueMatch = normalized.match(/(?:due date|payment due)\s*[:=-]?\s*([^\n]+)/i);
  const invoiceMatch = normalized.match(/(?:invoice(?:\s*(?:no|number|#))?)\s*[:=-]?\s*([A-Za-z0-9_-]+)/i);
  return {
    vendor: vendorMatch?.[1]?.trim(),
    amount: amountMatch ? Number(amountMatch[1].replace(/,/g, '')) : undefined,
    currency: currencyMatch ? symbolToCurrency(currencyMatch[0]) : undefined,
    destination_account: accountMatch?.[1]?.trim(),
    due_date: dueMatch?.[1]?.trim(),
    invoice_number: invoiceMatch?.[2]?.trim(),
    payment_details: {}
  };
}

function symbolToCurrency(v: string) { const x = v.toUpperCase(); if (x === '₹' || x === 'INR' || x === 'RS') return 'INR'; if (x === '$' || x === 'USD') return 'USD'; if (x === '€' || x === 'EUR') return 'EUR'; if (x === '£' || x === 'GBP') return 'GBP'; return x; }
