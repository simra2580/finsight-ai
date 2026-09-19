import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/finsight/profile-settings";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — FinSight AI" },
      { name: "description", content: "Manage your FinSight profile, security, and payment controls." },
      { property: "og:title", content: "Settings — FinSight AI" },
      { property: "og:description", content: "Manage your FinSight profile, security, and payment controls." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});
