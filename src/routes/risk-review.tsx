import { createFileRoute } from "@tanstack/react-router";
import { RiskReviewPage } from "@/components/finsight/payment-flow";

export const Route = createFileRoute("/risk-review")({
  head: () => ({ meta: [
    { title: "Payment Risk Review — FinSight AI" },
    { name: "description", content: "Review explainable payment risk signals and behavioral changes." },
    { property: "og:title", content: "Payment Risk Review — FinSight AI" },
    { property: "og:description", content: "Review explainable payment risk signals and behavioral changes." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: RiskReviewPage,
});
