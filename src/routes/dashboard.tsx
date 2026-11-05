import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/tracker/dashboard";
export const Route = createFileRoute("/dashboard")({
  head: () =>
    pageHead({
      title: "Assignment Dashboard | TrackIt",
      description:
        "Review your assignments, approaching deadlines, completed tasks, and study priorities in your browser-local TrackIt dashboard.",
      path: "/dashboard",
      index: false,
    }),
  component: Dashboard,
});
