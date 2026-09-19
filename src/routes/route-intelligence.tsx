import { createFileRoute } from "@tanstack/react-router";
import { RouteIntelligencePage } from "@/components/finsight/routes-monitoring";

export const Route = createFileRoute("/route-intelligence")({
  head: () => ({ meta: [
    { title: "Route Intelligence — FinSight AI" },
    { name: "description", content: "Compare cost, reliability, settlement, and assessed payment risk." },
    { property: "og:title", content: "Route Intelligence — FinSight AI" },
    { property: "og:description", content: "Compare cost, reliability, settlement, and assessed payment risk." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: RouteIntelligencePage,
});
