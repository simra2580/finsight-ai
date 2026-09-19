import { createFileRoute } from "@tanstack/react-router";
import { OverviewPage } from "@/components/finsight/overview";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Overview — FinSight AI" },
    { name: "description", content: "Monitor payment risk, anomalies, routes, and transaction activity with FinSight AI." },
    { property: "og:title", content: "FinSight AI Payment Intelligence" },
    { property: "og:description", content: "Intelligent payment risk and route control before money moves." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: OverviewPage,
});
