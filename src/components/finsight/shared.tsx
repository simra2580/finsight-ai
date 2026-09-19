import type { LucideIcon } from "lucide-react";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, CheckCircle2, ChevronRight, CircleDollarSign, Clock3, CreditCard, IndianRupee, MoreHorizontal, ShieldAlert, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type Risk = "LOW" | "MEDIUM" | "HIGH";
export const payments = [
 { id:"PAY-1048", vendor:"ABC Software LLC", amount:"$18,700", currency:"USD", risk:"HIGH" as Risk, route:"Route C", status:"Review Required", date:"Today" },
 { id:"PAY-1047", vendor:"Cloud Services Inc.", amount:"$4,200", currency:"USD", risk:"LOW" as Risk, route:"Route A", status:"Completed", date:"Today" },
 { id:"PAY-1046", vendor:"Global Media Ltd.", amount:"€6,800", currency:"EUR", risk:"MEDIUM" as Risk, route:"Route B", status:"Processing", date:"Yesterday" },
 { id:"PAY-1045", vendor:"Design Systems Co.", amount:"₹82,400", currency:"INR", risk:"LOW" as Risk, route:"Route C", status:"Completed", date:"17 Sep" },
 { id:"PAY-1044", vendor:"Northstar Data", amount:"$12,200", currency:"USD", risk:"MEDIUM" as Risk, route:"Route B", status:"Review Required", date:"17 Sep" },
];

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) { return <Card className={cn("rounded-lg border-border bg-card shadow-panel", className)}>{children}</Card>; }
export function SectionHead({ title, detail, action }: { title: string; detail?: string; action?: React.ReactNode }) { return <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3.5 sm:px-5"><div className="min-w-0"><h3 className="truncate text-sm font-semibold">{title}</h3>{detail && <p className="mt-0.5 text-[11px] text-muted-foreground">{detail}</p>}</div>{action}</div>; }
export function RiskBadge({ risk }: { risk: Risk }) { return <span className={cn("inline-flex h-6 items-center rounded-md border px-2 text-[10px] font-semibold tracking-[0.08em]", risk === "HIGH" && "border-risk-high/25 bg-risk-high/10 text-risk-high", risk === "MEDIUM" && "border-risk-medium/25 bg-risk-medium/10 text-risk-medium", risk === "LOW" && "border-risk-low/25 bg-risk-low/10 text-risk-low")}>{risk}</span>; }
export function StatusBadge({ status }: { status: string }) { const done=status==="Completed"; const review=status.includes("Review"); return <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-xs", done ? "text-risk-low" : review ? "text-risk-high" : "text-primary")}><span className="size-1.5 rounded-full bg-current" />{status}</span>; }

export function MetricCard({ label, value, change, icon: Icon, tone="neutral" }: { label:string; value:string; change:string; icon:LucideIcon; tone?:"neutral"|"high"|"positive" }) {
 return <Panel className="group p-4 transition-transform duration-200 hover:-translate-y-0.5"><div className="flex items-start justify-between"><span className={cn("grid size-8 place-items-center rounded-md bg-secondary text-muted-foreground", tone==="high" && "bg-risk-high/10 text-risk-high", tone==="positive" && "bg-risk-low/10 text-risk-low")}><Icon className="size-4"/></span><span className={cn("flex items-center text-[10px]", change.startsWith("+") ? "text-risk-low" : "text-muted-foreground")}>{change.startsWith("+") ? <ArrowUpRight className="size-3"/> : <ArrowDownRight className="size-3"/>}{change}</span></div><p className="mt-5 text-2xl font-semibold tabular-nums">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></Panel>;
}

export function PaymentTable({ rows=payments, compact=false }: { rows?: typeof payments; compact?: boolean }) {
 return <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left"><thead><tr className="border-b border-border text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{!compact&&<th className="px-5 py-3 font-medium">Payment ID</th>}<th className="px-5 py-3 font-medium">Vendor</th><th className="px-5 py-3 font-medium">Amount</th><th className="px-5 py-3 font-medium">Currency</th><th className="px-5 py-3 font-medium">Risk</th><th className="px-5 py-3 font-medium">Route</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Created</th><th className="px-5 py-3 font-medium"></th></tr></thead><tbody>{rows.map(p=><tr key={p.id} className="group border-b border-border/70 transition-colors last:border-0 hover:bg-accent/35">{!compact&&<td className="px-5 py-3.5 text-xs font-mono text-muted-foreground">{p.id}</td>}<td className="px-5 py-3.5"><Link to="/risk-review" className="text-sm font-medium hover:text-primary">{p.vendor}</Link></td><td className="px-5 py-3.5 text-sm font-medium tabular-nums">{p.amount}</td><td className="px-5 py-3.5 text-xs text-muted-foreground">{p.currency}</td><td className="px-5 py-3.5"><RiskBadge risk={p.risk}/></td><td className="px-5 py-3.5 text-xs">{p.route}</td><td className="px-5 py-3.5"><StatusBadge status={p.status}/></td><td className="px-5 py-3.5 text-xs text-muted-foreground">{p.date}</td><td className="px-5 py-3.5"><Button variant="ghost" size="icon" aria-label={`Open ${p.id}`} asChild><Link to="/risk-review"><ChevronRight/></Link></Button></td></tr>)}</tbody></table></div>;
}

export const metricData = [
 { label:"Payments Today", value:"24", change:"+12.5%", icon:CreditCard, tone:"neutral" as const },
 { label:"Needs Review", value:"3", change:"-2 today", icon:Clock3, tone:"high" as const },
 { label:"Risk Alerts", value:"3", change:"-18.2%", icon:ShieldAlert, tone:"high" as const },
 { label:"Estimated Savings", value:"₹48,240", change:"+8.4%", icon:IndianRupee, tone:"positive" as const },
];

export function InsightCard({ label, children, link="View details" }: { label:string; children:React.ReactNode; link?:string }) { return <Panel className="p-5"><div className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary"><Sparkles className="size-3.5"/>{label}</div><p className="text-sm leading-6 text-foreground/90">{children}</p><Button variant="link" className="mt-3 h-auto p-0 text-xs">{link}<ChevronRight/></Button></Panel>; }

export function AlertRow({ risk, vendor, signal }: {risk:Risk; vendor:string; signal:string}) { return <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-4 last:border-0 sm:px-5"><span className={cn("grid size-9 shrink-0 place-items-center rounded-md",risk==="HIGH"?"bg-risk-high/10 text-risk-high":"bg-risk-medium/10 text-risk-medium")}><AlertTriangle className="size-4"/></span><div className="min-w-0"><div className="flex items-center gap-2"><p className="truncate text-sm font-medium">{vendor}</p><RiskBadge risk={risk}/></div><p className="mt-1 text-xs text-muted-foreground">{signal}</p></div><Button variant="outline" size="sm" asChild><Link to="/risk-review">Review<span className="hidden sm:inline"> Payment</span></Link></Button></div>; }

export function DemoLabel() { return <span className="inline-flex items-center gap-1.5 rounded-md border border-risk-medium/25 bg-risk-medium/10 px-2 py-1 text-[10px] font-semibold tracking-[0.1em] text-risk-medium"><CircleDollarSign className="size-3"/> DEMO / SIMULATED PAYMENT</span>; }
export function SuccessState({ title="Payment completed", description="The simulated transaction completed successfully." }: {title?:string; description?:string}) { return <div className="py-12 text-center"><CheckCircle2 className="mx-auto size-9 text-risk-low"/><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>; }
export function EmptyState() { return <div className="py-12 text-center"><CreditCard className="mx-auto size-8 text-muted-foreground"/><h3 className="mt-4 font-medium">No payments yet</h3><p className="mt-1 text-sm text-muted-foreground">Create your first payment to start analyzing risk.</p></div>; }
export function ErrorState() { return <div className="rounded-lg border border-risk-high/25 bg-risk-high/5 p-5"><div className="flex gap-3"><AlertTriangle className="size-5 shrink-0 text-risk-high"/><div><h3 className="text-sm font-medium">FinSight couldn't retrieve route data</h3><p className="mt-1 text-xs text-muted-foreground">Check your connection and try again.</p><Button variant="outline" size="sm" className="mt-3">Try again</Button></div></div></div>; }
