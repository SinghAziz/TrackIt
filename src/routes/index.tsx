import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Github, Target, CalendarDays, BrainCircuit, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import studyDesk from "@/assets/study-desk.jpg";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrackIt — Intelligent Assignment Planner" },
      {
        name: "description",
        content:
          "Organize assignments, prioritize deadlines, and plan study sessions in one focused workspace.",
      },
      { property: "og:title", content: "TrackIt — Intelligent Assignment Planner" },
      {
        property: "og:description",
        content:
          "Organize assignments, prioritize deadlines, and plan study sessions in one focused workspace.",
      },
      { property: "og:url", content: "https://trackit.harazizsingh.com/" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "TrackIt — Intelligent Assignment Planner" },
      { name: "twitter:description", content: "Organize assignments, prioritize deadlines, and plan study sessions in one focused workspace." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://trackit.harazizsingh.com/" }],
  }),
  component: Home,
});
function Home() {
  return (
    <>
      <section className="hero">
        <img
          className="hero-image"
          src={studyDesk}
          alt="A quiet study desk with a notebook, pencil and laptop"
          width={1600}
          height={912}
        />
        <div className="hero-copy">
          <p className="eyebrow">TrackIt</p>
          <h1>
            Less overwhelm.
            <br />
            More progress.
          </h1>
          <p className="hero-tagline">Manage assignments, prioritize deadlines, and build a clearer study plan.</p>
          <p className="hero-description">
            An academic productivity workspace for students, with your tasks, deadlines, and
            study priorities in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/dashboard">
                Open dashboard
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a
                href="https://github.com/SinghAziz/Agentic-Assignment-Deadline-Tracker"
                target="_blank"
                rel="noreferrer"
              >
                <Github />
                View on GitHub
              </a>
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-5">
            No sign-up. No setup. Your data stays with you.
          </p>
        </div>
      </section>
      <section className="feature-grid">
        <div>
          <Target className="size-6 text-primary" />
          <h3>The right task, at the right time.</h3>
          <p>
            Prioritization weighs deadlines, priority, and effort so your most important
            next step is always clear.
          </p>
        </div>
        <div>
          <CalendarDays className="size-6 text-info" />
          <h3>A week you can see coming.</h3>
          <p>
            Keep deadlines together, track what’s complete, and understand your weekly workload
            before it becomes overwhelming.
          </p>
        </div>
        <div>
          <BrainCircuit className="size-6 text-lilac" />
          <h3>A thoughtful study copilot.</h3>
          <p>
            Turn your assignments into practical study plans with a rule-based Study Copilot
            that helps you decide where to start.
          </p>
        </div>
      </section>
      <section className="border-t border-border py-7 flex items-center justify-between gap-6">
        <div>
          <p className="eyebrow">An EMBER portfolio project</p>
          <h2 className="text-lg mt-2">A clearer approach to academic work.</h2>
          <p className="text-xs text-muted-foreground mt-2">
            TrackIt brings assignment planning and study priorities together, right in your browser.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/about">
            About the project
            <ArrowUpRight />
          </Link>
        </Button>
      </section>
    </>
  );
}
