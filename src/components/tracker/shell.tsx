import { useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ListTodo,
  Bot,
  BookOpen,
  Github,
  ArrowUpRight,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Home,
  CircleHelp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentMark } from "./assistant";
import { useTracker } from "./store";
const links = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/assignments", label: "Assignments", icon: ListTodo },
  { to: "/assistant", label: "Study Copilot", icon: Bot },
] as const;
export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useLocation({ select: (l) => l.pathname });
  const { assignments, error } = useTracker();
  const label =
    path === "/dashboard"
      ? "Overview"
      : path === "/assignments"
        ? "Assignments"
        : path === "/assistant"
          ? "Study Copilot"
          : path === "/about"
            ? "About the project"
            : "Welcome";
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-sidebar/40 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside className={`app-sidebar ${open ? "is-open" : ""}`}>
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <AgentMark />
          TrackIt<span className="text-primary">.</span>
        </Link>
        <p className="text-[10px] px-3 mt-3 text-sidebar-foreground">A calmer way to keep up.</p>
        <Button
          variant="sidebar"
          size="icon"
          aria-label="Close navigation"
          className="absolute top-3 right-2 min-[801px]:hidden"
          onClick={() => setOpen(false)}
        >
          <X />
        </Button>
        <p className="sidebar-label">Workspace</p>
        <nav className="sidebar-nav">
          {links.map(({ to, label, icon: Icon }) => (
            <Button key={to} variant="sidebar" asChild className="sidebar-link">
              <Link to={to} onClick={() => setOpen(false)}>
                <Icon className="size-4" />
                {label}
                {to === "/assignments" && (
                  <span className="ml-auto text-[10px] bg-sidebar-accent rounded px-1.5 py-0.5">
                    {assignments.filter((a) => a.status !== "Completed").length}
                  </span>
                )}
              </Link>
            </Button>
          ))}
        </nav>
        <p className="sidebar-label">Project</p>
        <nav className="sidebar-nav">
          <Button variant="sidebar" asChild className="sidebar-link">
            <Link to="/">
              <Home />
              Project home
            </Link>
          </Button>
          <Button variant="sidebar" asChild className="sidebar-link">
            <Link to="/about">
              <BookOpen />
              About this project
            </Link>
          </Button>
          <Button variant="sidebar" asChild className="sidebar-link">
            <a
              href="https://github.com/SinghAziz/Agentic-Assignment-Deadline-Tracker"
              target="_blank"
              rel="noreferrer"
            >
              <Github />
              View on GitHub
              <ArrowUpRight className="ml-auto size-3" />
            </a>
          </Button>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-project">
            <div className="flex items-center gap-2 text-primary-foreground mb-2">
              <ShieldCheck className="size-3.5" />
              <strong>Your workspace, your data.</strong>
            </div>
            <p>
              Saved in this browser.
              <br />
              No account. No cloud. Just focus.
            </p>
          </div>
          <div className="flex items-center gap-3 border-t border-sidebar-border pt-5 px-3">
            <span className="flex size-8 items-center justify-center bg-sidebar-accent rounded-md text-primary-foreground text-xs font-semibold">
              S
            </span>
            <div className="flex-1">
              <p className="text-xs text-primary-foreground font-semibold">Student workspace</p>
              <p className="text-[10px] mt-1">Personal workspace</p>
            </div>
            <ChevronDown className="size-3" />
          </div>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <div className="flex items-center gap-3">
            <Button
              className="min-[801px]:hidden"
              variant="ghost"
              size="icon"
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </Button>
            <span className="text-muted-foreground text-xs hidden sm:block">Workspace</span>
            <span className="text-border hidden sm:block">/</span>
            <span className="text-xs font-semibold">{label}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex gap-1.5 items-center text-[10px] text-muted-foreground">
              <span className="size-1.5 bg-primary rounded-full" />
              Local workspace
            </span>
            <Button asChild variant="ghost" size="icon" title="About this project">
              <Link to="/about" aria-label="About this project">
                <CircleHelp className="size-4" />
              </Link>
            </Button>
            <span className="size-8 rounded-full bg-accent text-primary text-xs font-semibold flex items-center justify-center">
              SA
            </span>
          </div>
        </header>
        <main className="page-content">
          {error && (
            <div role="alert" className="p-3 bg-warning-soft text-warning text-xs rounded-md mb-5">
              {error}
            </div>
          )}
          {children}
          <footer className="page-footer">
            <span>
              TrackIt. An{" "}
              <Link to="/about" className="font-extrabold text-foreground">
                EMBER
              </Link>{" "}
              portfolio project.
            </span>
            <span className="flex gap-2 items-center">
              <span className="size-1.5 rounded-full bg-primary" />
              All data stays in your browser
            </span>
          </footer>
        </main>
      </div>
    </>
  );
}
