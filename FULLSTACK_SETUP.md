# FinSight AI — Full-stack submission setup

This repository keeps the existing TanStack Start/Lovable frontend as the UI source of truth and adds the Express/MongoDB backend under `backend/`.

## One Vercel deployment
- Frontend: TanStack Start
- Backend: Vercel Node function at `/api`
- Database: MongoDB Atlas
- AI: `AI_PROVIDER=mock` for the deterministic demo; switch to Bedrock only when AWS credentials/model access are configured.

Required Vercel environment variables are documented in `.env.example`.

## Local
```bash
npm install
npm run dev
```

Backend can be exercised separately with:
```bash
npm run backend:dev
```

For demo data against MongoDB Atlas:
```bash
npm run backend:seed
```

The backend exposes:
`/api/auth/demo-login`, `/api/invoices/*`, `/api/risk/analyze`, `/api/risk/what-changed/:id`, `/api/routes/compare`, `/api/routes/recommend`, `/api/payments/simulate`, `/api/payments/:id`, `/api/insights/:merchantId`, `/api/settlement/testnet`.
