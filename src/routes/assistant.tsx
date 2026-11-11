import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Assistant } from "@/components/tracker/assistant";
export const Route = createFileRoute("/assistant")({
  head: () =>
    pageHead({
      title: "Rule-Based Study Copilot | TrackIt",
      description:
        "Use TrackIt’s browser-side Study Copilot to add assignments, prioritize deadlines, and suggest study plans without a live language model.",
      path: "/assistant",
      index: false,
    }),
  component: AssistantPage,
});
function AssistantPage() {
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Your next step, made clearer.</h1>
          <p>
            Find your focus, prioritize your assignments, and plan your study
            time.
          </p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto">
        <Assistant full />
        <div className="mt-6 px-1">
          <h2 className="text-xs font-semibold mb-2">How it works</h2>
          <p className="text-xs text-muted-foreground leading-7">
            Study Copilot uses browser-side rules and your saved assignments to
            suggest priorities and study plans. It does not run a live language
            model or schedule reminders.
          </p>
        </div>
      </div>
    </>
  );
}
