import { createFileRoute, Link } from "@tanstack/react-router";
import { Github, ArrowUpRight, ArrowRight, FlaskConical, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — TrackIt Intelligent Assignment Planner" },
      {
        name: "description",
        content:
          "Organize assignments, prioritize deadlines, and plan study sessions in one focused workspace.",
      },
      { property: "og:title", content: "About — TrackIt Intelligent Assignment Planner" },
      {
        property: "og:description",
        content:
          "Organize assignments, prioritize deadlines, and plan study sessions in one focused workspace.",
      },
      { property: "og:url", content: "https://trackit.harazizsingh.com/about" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "About — TrackIt Intelligent Assignment Planner" },
      { name: "twitter:description", content: "Organize assignments, prioritize deadlines, and plan study sessions in one focused workspace." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://trackit.harazizsingh.com/about" }],
  }),
  component: About,
});
function About() {
  return (
    <div className="about-copy">
      <div className="page-heading">
        <div>
          <p className="eyebrow mb-3">An EMBER portfolio project</p>
          <h1>Plan smarter. Stay ahead.</h1>
          <p>An academic productivity workspace for students.</p>
        </div>
      </div>
      <h2>TrackIt</h2>
      <p>
        Academic work is rarely just about doing the assignment. It’s remembering what’s due,
        choosing where to start, and fitting everything into the time you actually have. This
        workspace helps you turn those everyday decisions into clearer priorities and study plans.
      </p>
      <p>
        TrackIt brings assignment tracking, deadline prioritization, and study planning together
        in one workspace. Built as an EMBER portfolio project, it works without an account
        or paid API.
      </p>
      <Button asChild variant="outline">
        <a
          href="https://github.com/SinghAziz/Agentic-Assignment-Deadline-Tracker"
          target="_blank"
          rel="noreferrer"
        >
          <Github />
          Explore the repository
          <ArrowUpRight />
        </a>
      </Button>
      <h2 className="flex items-center gap-3">
        <FlaskConical className="size-5 text-primary" />
        The companion Python project
      </h2>
      <div className="about-stack">
        {["Python", "Microsoft Foundry Local", "Qwen3-8B", "LLM function calling"].map((v) => (
          <span key={v}>{v}</span>
        ))}
      </div>
      <p>
        The companion Python repository uses LLM function calling to add and list assignments.
        Python, Microsoft Foundry Local, and Qwen3-8B belong to that separate project;
        they are not running on this website.
      </p>
      <h2 className="flex items-center gap-3">
        <ShieldCheck className="size-5 text-info" />
        How it works
      </h2>
      <p>
        Study Copilot uses browser-side, rule-based logic to add assignments, suggest priorities,
        and create study plans—not live LLM inference. Assignments are saved in this browser’s
        local storage, with no cloud sync or server storage. Clearing browser data removes your
        assignments; other browsers keep separate workspaces. Study plans are suggestions,
        not scheduled notifications.
      </p>
      <div className="border-t border-border pt-6 mt-8">
        <Button asChild>
          <Link to="/dashboard">
            Open dashboard
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}
