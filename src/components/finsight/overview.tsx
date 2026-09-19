import { Link } from "@tanstack/react-router";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, NewPaymentButton, PageIntro } from "./app-shell";
import { AlertRow, metricData, MetricCard, Panel, PaymentTable, SectionHead } from "./shared";
import { PaymentActivityChart, RiskDistribution } from "./charts";

export function OverviewPage() { return <AppShell title="Overview"><PageIntro title="Good morning, Finance Team" description="Monitor payment risk, anomalies, routes and transaction activity from one place." action={<NewPaymentButton/>}/>
 <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metricData.map(x=><MetricCard key={x.label} {...x}/>)}</div>
 <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,.7fr)]"><Panel><SectionHead title="Payment Activity" detail="Volume, successful payments and risk events" action={<div className="flex rounded-md bg-secondary p-0.5">{["7D","30D","90D"].map((x,i)=><button key={x} className={`rounded px-2.5 py-1 text-[10px] ${i===0?"bg-card text-foreground shadow-sm":"text-muted-foreground"}`}>{x}</button>)}</div>}/><div className="p-3 sm:p-5"><div className="mb-2 flex gap-4 text-[10px] text-muted-foreground"><span><i className="mr-1.5 inline-block size-1.5 rounded-full bg-primary"/>Volume</span><span><i className="mr-1.5 inline-block size-1.5 rounded-full bg-risk-low"/>Success</span><span><i className="mr-1.5 inline-block size-1.5 rounded-full bg-risk-high"/>Risk</span></div><PaymentActivityChart/></div></Panel><Panel><SectionHead title="Risk Overview" detail="Current payment distribution"/><RiskDistribution/></Panel></div>
 <div className="mt-5 grid gap-5 2xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,.7fr)]"><Panel><SectionHead title="Recent Payments" detail="Latest activity across all accounts" action={<Button variant="ghost" size="sm" asChild><Link to="/payments">View all</Link></Button>}/><PaymentTable compact/></Panel><Panel><SectionHead title="Recent Risk Alerts" detail="Items requiring attention" action={<Button variant="ghost" size="icon"><MoreHorizontal/></Button>}/><AlertRow risk="HIGH" vendor="ABC Software LLC" signal="3 anomalies detected"/><AlertRow risk="MEDIUM" vendor="Global Media Ltd." signal="Unusual payment timing"/></Panel></div>
 </AppShell>; }
