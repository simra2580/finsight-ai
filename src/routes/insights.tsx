import { createFileRoute } from "@tanstack/react-router";
import { InsightsPage } from "@/components/finsight/data-pages";

export const Route = createFileRoute("/insights")({
  head: () => ({ meta: [
    { title: "Payment Insights — FinSight AI" },
    { name: "description", content: "Understand payment risk, cost, and business behavior." },
    { property: "og:title", content: "Payment Insights — FinSight AI" },
    { property: "og:description", content: "Understand payment risk, cost, and business behavior." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: InsightsPage,
});
