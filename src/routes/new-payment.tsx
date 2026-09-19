import { createFileRoute } from "@tanstack/react-router";
import { NewPaymentPage } from "@/components/finsight/payment-flow";

export const Route = createFileRoute("/new-payment")({
  head: () => ({ meta: [
    { title: "New Payment — FinSight AI" },
    { name: "description", content: "Analyze a payment before money moves." },
    { property: "og:title", content: "New Payment — FinSight AI" },
    { property: "og:description", content: "Analyze a payment before money moves." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NewPaymentPage,
});
