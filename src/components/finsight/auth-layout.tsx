import { Link } from "@tanstack/react-router";
import { Activity, ShieldCheck, Sparkles, TrendingDown } from "lucide-react";
import type { ReactNode } from "react";

const proof = [
  { icon: ShieldCheck, label: "Risk scored", value: "Pre-settlement", hint: "Every payment checked before money moves" },
  { icon: TrendingDown, label: "Routing savings", value: "8.4% avg", hint: "Cheapest compliant rail, chosen automatically" },
  { icon: Activity, label: "Monitoring", value: "24/7 signals", hint: "Anomaly alerts across vendors and corridors" },
];

export function AuthLayout({
  children,
  eyebrow,
  title,
  description,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_minmax(0,0.95fr)]">
      {/* Brand / narrative panel */}
      <aside className="relative hidden overflow-hidden border-r border-border bg-sidebar lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -left-24 -top-24 size-[28rem] rounded-full bg-primary/12 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 size-[24rem] rounded-full bg-risk-low/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:56px_56px]" />

        <Link to="/" className="relative flex items-center gap-3" aria-label="FinSight AI home">
          <span className="grid size-10 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary shadow-[0_0_28px_var(--accent-glow)]">
            <Sparkles className="size-4" />
          </span>
          <span>
            <span className="block text-[15px] font-semibold">
              FinSight <span className="text-primary">AI</span>
            </span>
            <span className="block text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Payment intelligence
            </span>
          </span>
        </Link>

        <div className="relative max-w-lg">
          <h2 className="text-balance text-[40px] font-semibold leading-[1.08] tracking-[-0.02em]">
            Know the risk
            <span className="block text-muted-foreground">before the money moves.</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
            FinSight scores every outgoing payment, picks the smartest route, and flags the anomalies your
            reconciliation would only catch weeks later.
          </p>

          <dl className="mt-10 space-y-3">
            {proof.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border bg-card/70 px-4 py-3.5 backdrop-blur-sm"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <dt className="text-sm font-medium">{item.label}</dt>
                  <dd className="truncate text-xs text-muted-foreground">{item.hint}</dd>
                </div>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-primary">{item.value}</span>
              </div>
            ))}
          </dl>
        </div>

        <p className="relative text-[11px] text-muted-foreground">
          Demo environment — payments shown in FinSight are simulated.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[26rem] animate-fade-in">
          <Link to="/" className="mb-9 inline-flex items-center gap-3 lg:hidden" aria-label="FinSight AI home">
            <span className="grid size-9 place-items-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </span>
            <span className="text-[15px] font-semibold">
              FinSight <span className="text-primary">AI</span>
            </span>
          </Link>

          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
          <h1 className="mt-3 text-[27px] font-semibold tracking-[-0.01em]">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>

          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}

export function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.93l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.95H1.26v3.1A12 12 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.26a12 12 0 0 0 0 10.74l4.01-3.1Z" />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.26 6.63l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}
