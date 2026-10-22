import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Plus,
  ArrowUpRight,
  ArrowRight,
  ListTodo,
  CalendarDays,
  CircleCheck,
  Clock3,
  Code2,
  Database,
  BrainCircuit,
  Sigma,
  FileText,
  Check,
  Circle,
  ChevronRight,
  Target,
  Lightbulb,
  CheckCheck,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { deadlineLabel, isOverdue, isToday, ranked, type Assignment } from "@/lib/assignments";
import { useTracker } from "./store";
import { Assistant } from "./assistant";
import { AssignmentForm } from "./assignment-form";
export function PriorityBadge({ priority }: { priority: Assignment["priority"] }) {
  return (
    <span className={`priority priority-${priority.toLowerCase()}`}>
      <span className="size-1 rounded-full bg-current" />
      {priority}
    </span>
  );
}
export function CourseIcon({ course }: { course: string }) {
  const Icon = /Machine|Intelligence/i.test(course)
    ? BrainCircuit
    : /Database/i.test(course)
      ? Database
      : /Data Structures/i.test(course)
        ? Code2
        : /Math/i.test(course)
          ? Sigma
          : FileText;
  const color = /Machine|Intelligence/i.test(course)
    ? "bg-lilac-soft text-lilac"
    : /Database/i.test(course)
      ? "bg-info-soft text-info"
      : /Data Structures/i.test(course)
        ? "bg-warning-soft text-warning"
        : "bg-accent text-primary";
  return (
    <span className={`course-icon ${color}`}>
      <Icon className="size-[18px]" />
    </span>
  );
}
export function Dashboard() {
  const { assignments, now, ready, toggle } = useTracker();
  const [adding, setAdding] = useState(false);
  if (!ready)
    return (
      <div aria-label="Loading assignments" className="space-y-6">
        <Skeleton className="h-16 w-2/3" />
        <div className="summary-grid">
          {[1, 2, 3, 4].map((v) => (
            <Skeleton key={v} className="h-36" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  const active = assignments.filter((a) => a.status !== "Completed");
  const completed = assignments.length - active.length;
  const due = active.filter((a) => isToday(a.deadline, now)).length;
  const upcoming = active.filter(
    (a) => new Date(a.deadline) > now && !isToday(a.deadline, now),
  ).length;
  const sorted = [...active].sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline));
  const focus = ranked(assignments, now).slice(0, 3);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  weekStart.setHours(0, 0, 0, 0);
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const dayTasks = assignments.filter((a) => isToday(a.deadline, d));
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      hours: dayTasks.filter((a) => a.status !== "Completed").reduce((n, a) => n + a.effort, 0),
      completed: dayTasks.filter((a) => a.status === "Completed").reduce((n, a) => n + a.effort, 0),
    };
  });
  const workload = week.reduce((n, d) => n + d.hours, 0);
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="flex gap-2 items-center mb-2 text-[10px] text-muted-foreground">
            <CalendarDays className="size-3" />
            {now.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <h1>
            {greeting}, Aziz <span className="font-normal">☀</span>
          </h1>
          <p>Let’s make room for what matters. Here’s your academic week.</p>
        </div>
        <Button onClick={() => setAdding(true)}>
          <Plus />
          Add assignment
        </Button>
      </div>
      <div className="summary-grid">
        {[
          {
            label: "Total assignments",
            value: assignments.length,
            note: "Everything in your workspace",
            icon: ListTodo,
            color: "bg-info-soft text-info",
          },
          {
            label: "Due today",
            value: due,
            note: due ? "A little focus goes a long way" : "No deadlines today",
            icon: CalendarDays,
            color: "bg-warning-soft text-warning",
          },
          {
            label: "Upcoming",
            value: upcoming,
            note: "Stay one step ahead",
            icon: Clock3,
            color: "bg-lilac-soft text-lilac",
          },
          {
            label: "Completed",
            value: completed,
            note: "One less thing on your mind",
            icon: CircleCheck,
            color: "bg-accent text-primary",
          },
        ].map(({ label, value, note, icon: Icon, color }) => (
          <div className="panel summary-card" key={label}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
              <span className={`summary-icon ${color}`}>
                <Icon className="size-4" />
              </span>
            </div>
            <div className="summary-number">{String(value).padStart(2, "0")}</div>
            <p className="text-[9px] text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-column">
          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">
                <CalendarDays className="size-4 text-muted-foreground" />
                Upcoming deadlines
                <span className="priority bg-secondary text-muted-foreground">{active.length}</span>
              </h2>
              <Button variant="link" asChild size="sm">
                <Link to="/assignments">
                  View all
                  <ArrowUpRight className="size-3" />
                </Link>
              </Button>
            </div>
            {sorted.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs">
                <CheckCheck className="mx-auto mb-3 text-primary" />
                All caught up. Enjoy your clear schedule.
              </div>
            ) : (
              sorted.slice(0, 5).map((a) => (
                <div className="deadline-row" key={a.id}>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Complete ${a.title}`}
                    title="Mark completed"
                    className="shrink-0 text-muted-foreground"
                    onClick={() => toggle(a.id)}
                  >
                    <Circle className="size-[16px]" />
                  </Button>
                  <CourseIcon course={a.course} />
                  <div className="flex-1 min-w-0">
                    <p className="task-title truncate" title={a.title}>
                      {a.title}
                    </p>
                    <p className="task-meta">
                      {a.course} <span className="mx-1">·</span> {a.effort}h effort
                    </p>
                  </div>
                  <PriorityBadge priority={a.priority} />
                  <div className="min-w-[57px] text-right">
                    <p
                      className={`text-[10px] font-semibold ${isOverdue(a, now) ? "text-destructive" : isToday(a.deadline, now) ? "text-warning" : "text-foreground"}`}
                    >
                      {deadlineLabel(a, now)}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-1">
                      {new Date(a.deadline).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </section>
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Weekly workload</h2>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  A little perspective on the week ahead.
                </p>
              </div>
              <span className="priority bg-secondary text-muted-foreground">
                This week <ChevronRight className="size-3" />
              </span>
            </div>
            <div className="workload-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={week}
                  barSize={25}
                  margin={{ top: 10, right: 6, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 4" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    dy={6}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
                    tickFormatter={(v) => `${v}h`}
                    width={34}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--secondary)" }}
                    content={({ active, payload, label }) =>
                      active && payload?.length ? (
                        <div className="panel p-3 text-xs">
                          <p className="font-semibold mb-1">{label}</p>
                          {payload.map((p) => (
                            <p key={String(p.dataKey)}>
                              {p.name}: {p.value}h
                            </p>
                          ))}
                        </div>
                      ) : null
                    }
                  />
                  <Bar dataKey="completed" name="Completed" stackId="a" fill="var(--accent)" />
                  <Bar
                    dataKey="hours"
                    name="Upcoming"
                    stackId="a"
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-footer">
              <div className="flex gap-3 text-muted-foreground">
                <span>
                  <i className="legend-dot" />
                  Upcoming
                </span>
                <span>
                  <i className="legend-dot bg-accent" />
                  Completed
                </span>
              </div>
              <span>
                <strong>{workload}h</strong>
                <span className="text-muted-foreground"> remaining</span>
              </span>
            </div>
          </section>
        </div>
        <div className="dashboard-column">
          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">
                <Target className="text-primary size-4" />
                Today’s focus
              </h2>
              <span className="priority bg-accent text-primary">Smart picks</span>
            </div>
            <p className="px-[22px] text-[10px] text-muted-foreground pb-1">
              Your next steps, ordered by deadline, priority, and effort.
            </p>
            {focus.map((a, i) => (
              <div className="focus-task" key={a.id}>
                <span className="focus-number">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="task-title">{a.title}</p>
                  <p className="task-meta flex items-center gap-1">
                    <Clock3 className="size-3" />
                    {a.effort}h <span className="mx-1">·</span>
                    <span
                      className={
                        isOverdue(a, now) ? "text-destructive" : i === 0 ? "text-warning" : ""
                      }
                    >
                      {isOverdue(a, now)
                        ? "Overdue — tackle first"
                        : isToday(a.deadline, now)
                          ? "Due today"
                          : deadlineLabel(a, now)}
                    </span>
                  </p>
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  title="Mark completed"
                  aria-label={`Complete focus ${a.title}`}
                  onClick={() => toggle(a.id)}
                >
                  <Check className="size-3 text-muted-foreground" />
                </Button>
              </div>
            ))}
            {!focus.length && (
              <p className="px-5 py-6 text-xs text-muted-foreground">
                A clean slate. No tasks need your attention.
              </p>
            )}
            <div className="focus-note">
              <Lightbulb className="size-4 shrink-0 mt-0.5" />
              <p>
                {focus.length
                  ? "Prioritized by deadline, effort, and urgency. Start small, build momentum."
                  : "Everything is complete. Take a well-earned break."}
              </p>
            </div>
          </section>
          <Assistant />
        </div>
      </div>
      <div className="mt-7 flex gap-3 items-center text-[11px] text-muted-foreground">
        <span className="size-6 bg-accent text-primary rounded-full flex justify-center items-center">
          <Check className="size-3" />
        </span>
        <p>
          {completed
            ? `${completed} assignments behind you. You’re making progress — keep going.`
            : "Every finished assignment is a step forward. You’ve got this."}
        </p>
        <Button asChild variant="link" size="sm" className="ml-auto hidden sm:flex">
          <Link to="/about">
            About TrackIt
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </div>
      {adding && <AssignmentForm open onClose={() => setAdding(false)} />}
    </>
  );
}
