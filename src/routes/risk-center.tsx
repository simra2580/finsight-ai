import { createFileRoute } from "@tanstack/react-router";
import { RiskCenterPage } from "@/components/finsight/data-pages";

export const Route = createFileRoute("/risk-center")({
  head: () => ({ meta: [
    { title: "Risk Center — FinSight AI" },
    { name: "description", content: "Investigate payment alerts and resolve reviews." },
    { property: "og:title", content: "Risk Center — FinSight AI" },
    { property: "og:description", content: "Investigate payment alerts and resolve reviews." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: RiskCenterPage,
});
