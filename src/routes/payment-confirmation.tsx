import { createFileRoute } from "@tanstack/react-router";
import { ConfirmationPage } from "@/components/finsight/routes-monitoring";

export const Route = createFileRoute("/payment-confirmation")({
  head: () => ({ meta: [
    { title: "Review Payment — FinSight AI" },
    { name: "description", content: "Confirm a reviewed payment before simulation." },
    { property: "og:title", content: "Review Payment — FinSight AI" },
    { property: "og:description", content: "Confirm a reviewed payment before simulation." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ConfirmationPage,
});
