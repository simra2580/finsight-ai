# FinSight AI — Quick API Flow

Assume `http://localhost:5000` and a JWT from `/api/auth/demo-login`.

1. `POST /api/auth/demo-login`
2. `POST /api/invoices/extract`
3. `POST /api/risk/analyze`
4. `GET /api/risk/what-changed/:invoiceId`
5. `GET /api/vendors/:vendorId/profile`
6. `POST /api/routes/compare`
7. `POST /api/routes/recommend`
8. `POST /api/payments/simulate`
9. `GET /api/payments/:transactionId`
10. `GET /api/insights/:merchantId`
11. Optional: `POST /api/settlement/testnet`

Every protected request needs:
`Authorization: Bearer <token>`

The demo scenario should surface a high internal risk assessment because the current payment is materially different from the seeded Payment DNA. The backend never sends a real payment.
