import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/tracker/dashboard";
export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Overview — TrackIt Intelligent Assignment Planner" },
      {
        name: "description",
        content:
          "Organize assignments, prioritize deadlines, and plan study sessions in one focused workspace.",
      },
      { property: "og:title", content: "Overview — TrackIt Intelligent Assignment Planner" },
      {
        property: "og:description",
        content:
          "Organize assignments, prioritize deadlines, and plan study sessions in one focused workspace.",
      },
      { property: "og:url", content: "https://trackit.harazizsingh.com/dashboard" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Overview — TrackIt Intelligent Assignment Planner" },
      { name: "twitter:description", content: "Organize assignments, prioritize deadlines, and plan study sessions in one focused workspace." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://trackit.harazizsingh.com/dashboard" }],
  }),
  component: Dashboard,
});
