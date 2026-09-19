import { createFileRoute } from "@tanstack/react-router";
import { PaymentsPage } from "@/components/finsight/data-pages";

export const Route = createFileRoute("/payments")({
  head: () => ({ meta: [
    { title: "Payments — FinSight AI" },
    { name: "description", content: "Review and search business payments." },
    { property: "og:title", content: "Payments — FinSight AI" },
    { property: "og:description", content: "Review and search business payments." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: PaymentsPage,
});
