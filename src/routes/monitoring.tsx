import { createFileRoute } from "@tanstack/react-router";
import { MonitoringPage } from "@/components/finsight/routes-monitoring";

export const Route = createFileRoute("/monitoring")({
  head: () => ({ meta: [
    { title: "Payment Monitor — FinSight AI" },
    { name: "description", content: "Monitor transaction progress and verified events." },
    { property: "og:title", content: "Payment Monitor — FinSight AI" },
    { property: "og:description", content: "Monitor transaction progress and verified events." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MonitoringPage,
});
