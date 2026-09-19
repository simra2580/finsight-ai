# FinSight AI

**AI Payment Intelligence & Control Layer** — _"Before money moves, FinSight thinks."_

FinSight AI analyzes a payment before money moves: it compares the request against
historical vendor behavior, detects anomalies, explains what changed, recommends a
safer payment route, and monitors the transaction after initiation.

Full-stack app built with **TanStack Start** (React 19, file-based routing, server
functions), **Tailwind CSS v4**, **shadcn/ui**, **Recharts**, and **Lucide** icons,
with **Lovable Cloud** (Supabase) as the backend.

---

## Getting started

Requirements: Node.js 20+ (or Bun) and npm.

```sh
git clone <this-repository-url>
cd finsight-ai
npm install
npm run dev
```

The dev server starts at `http://localhost:8080`.

### Environment

The `.env` file ships with publishable (non-secret) keys for the demo backend:

- `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` — browser client
- `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` — server functions

Only publishable keys are included — no service-role or database credentials.
If you connect your own backend, replace these values.

---

## Project structure

```
src/
├── routes/                  # File-based routes (one file per screen)
│   ├── __root.tsx           # Root shell, fonts, head metadata, error boundary
│   ├── index.tsx            # Dashboard (Overview)
│   ├── new-payment.tsx      # Invoice upload → AI extraction → Analyze Payment
│   ├── risk-review.tsx      # Risk score, factors, What Changed, Payment DNA
│   ├── route-intelligence.tsx  # Route comparison + AI recommendation
│   ├── payment-confirmation.tsx # Review + simulated execution
│   ├── monitoring.tsx       # Transaction timeline & event feed
│   ├── payments.tsx         # Full payments table with filters
│   ├── risk-center.tsx      # Risk alerts with severity filters
│   ├── insights.tsx         # Trends, route performance, AI insights
│   └── settings.tsx, help.tsx
├── components/
│   ├── finsight/            # Feature components
│   │   ├── app-shell.tsx    # Sidebar, top bar, mobile bottom nav
│   │   ├── shared.tsx       # Sample data, badges, tables, metric/insight cards
│   │   ├── charts.tsx       # Activity, risk distribution, trend charts
│   │   ├── overview.tsx     # Dashboard screen
│   │   ├── payment-flow.tsx # New Payment + Risk Review + Payment DNA
│   │   ├── routes-monitoring.tsx  # Routes, confirmation, monitoring
│   │   └── data-pages.tsx   # Payments, Risk Center, Insights
│   └── ui/                  # shadcn/ui primitives
├── integrations/supabase/   # Auto-generated clients & auth middleware (do not edit)
├── lib/                     # Utilities
└── styles.css               # Design tokens (colors, typography, radii, motion)
```

## Design system

Tokens live in `src/styles.css` and are themed through shadcn variants:

- **Background**: near-black dark theme; slightly lighter cards; subtle borders
- **Accent**: a single sophisticated teal-cyan primary; risk colors reserved for
  risk information only (LOW → green, MEDIUM → amber, HIGH → red)
- **Typography**: Geist / Geist Mono, large page titles, compact financial data
- **Spacing/Radius**: 8px rhythm, 8–12px radii, restrained glow and motion

## Demo flow

Dashboard → **+ New Payment** → upload invoice → AI extraction → **Risk Review**
(82/100 HIGH, 3 anomalies, What Changed, Payment DNA) → **Route Intelligence**
(3 routes compared, Route C recommended) → **Payment Confirmation** (clearly
labeled *DEMO / SIMULATED PAYMENT*) → **Monitoring** (live timeline) → **Insights**.

All payments are simulated — no real money moves.

## Build & scripts

```sh
npm run dev      # local dev server
npm run build    # production build
npm run preview  # preview the production build
```

## Roadmap

See `roadmap.md` for planned work (authentication pages, user profiles, protected
routes). The backend auth infrastructure (clients, token middleware) is already
wired in `src/start.ts` and `src/integrations/supabase/`.
