import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Check, Circle, ListTodo, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useTracker } from "@/components/tracker/store";
import { AssignmentForm } from "@/components/tracker/assignment-form";
import { PriorityBadge, CourseIcon } from "@/components/tracker/dashboard";
import { deadlineLabel, isOverdue, type Assignment } from "@/lib/assignments";
export const Route = createFileRoute("/assignments")({
  head: () => ({
    meta: [
      { title: "Assignments — TrackIt Intelligent Assignment Planner" },
      {
        name: "description",
        content:
          "Organize assignments, prioritize deadlines, and plan study sessions in one focused workspace.",
      },
      { property: "og:title", content: "Assignments — TrackIt Intelligent Assignment Planner" },
      {
        property: "og:description",
        content: "Organize assignments, prioritize deadlines, and plan study sessions in one focused workspace.",
      },
      { property: "og:url", content: "https://trackit.harazizsingh.com/assignments" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Assignments — TrackIt Intelligent Assignment Planner" },
      { name: "twitter:description", content: "Organize assignments, prioritize deadlines, and plan study sessions in one focused workspace." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://trackit.harazizsingh.com/assignments" }],
  }),
  component: AssignmentsPage,
});
function AssignmentsPage() {
  const { assignments, ready, now, toggle, remove, reset } = useTracker();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<Assignment | "new" | null>(null);
  const [deleting, setDeleting] = useState<Assignment | null>(null);
  const [resetting, setResetting] = useState(false);
  const rows = assignments
    .filter(
      (a) =>
        (filter === "All" ||
          (filter === "Completed" && a.status === "Completed") ||
          (filter === "Overdue" && isOverdue(a, now)) ||
          (filter === "Upcoming" && a.status !== "Completed" && new Date(a.deadline) >= now)) &&
        `${a.title} ${a.course}`.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline));
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Assignments</h1>
          <p>Every deadline, in one place. A little less on your mind.</p>
        </div>
        <Button onClick={() => setForm("new")}>
          <Plus />
          Add assignment
        </Button>
      </div>
      <div className="filter-bar">
        <div className="filter-tabs">
          {["All", "Upcoming", "Overdue", "Completed"].map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "outline" : "ghost"}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
          <Input
            aria-label="Search assignments"
            placeholder="Search assignments…"
            className="pl-9 bg-card h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <section className="panel overflow-hidden">
        {!ready ? (
          <Skeleton className="h-64" />
        ) : rows.length === 0 ? (
          <div className="p-14 text-center">
            <ListTodo className="size-8 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-sm">
              {search
                ? "No matching assignments"
                : filter === "All"
                  ? "A fresh start"
                  : "Nothing here right now"}
            </h2>
            <p className="text-xs text-muted-foreground mt-2 mb-5">
              {search
                ? "Try a different title or course."
                : filter === "All"
                  ? "Add your first assignment to get started."
                  : `No ${filter.toLowerCase()} assignments. You’re in control.`}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                if (search) setSearch("");
                else if (filter !== "All") setFilter("All");
                else setForm("new");
              }}
            >
              {search
                ? "Clear search"
                : filter !== "All"
                  ? "View all assignments"
                  : "Add assignment"}
            </Button>
          </div>
        ) : (
          <table className="assignment-table">
            <thead>
              <tr>
                <th>Assignment</th>
                <th className="course-column">Course</th>
                <th>Deadline</th>
                <th className="hide-mobile">Effort</th>
                <th className="hide-mobile">Priority</th>
                <th className="hide-mobile">Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className={`shrink-0 ${a.status === "Completed" ? "text-primary" : "text-muted-foreground"}`}
                        title={a.status === "Completed" ? "Mark incomplete" : "Mark completed"}
                        aria-label={`${a.status === "Completed" ? "Reopen" : "Complete"} ${a.title}`}
                        onClick={() => toggle(a.id)}
                      >
                        {a.status === "Completed" ? <Check /> : <Circle className="size-4" />}
                      </Button>
                      <span
                        className={`task-title ${a.status === "Completed" ? "line-through text-muted-foreground" : ""}`}
                      >
                        {a.title}
                      </span>
                    </div>
                  </td>
                  <td className="course-column">
                    <div className="flex items-center gap-2">
                      <CourseIcon course={a.course} />
                      <span>{a.course}</span>
                    </div>
                  </td>
                  <td>
                    <p className={isOverdue(a, now) ? "text-destructive font-semibold" : ""}>
                      {a.status === "Completed"
                        ? new Date(a.deadline).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : deadlineLabel(a, now)}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-1">
                      {new Date(a.deadline).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>
                  <td className="hide-mobile text-muted-foreground">{a.effort}h</td>
                  <td className="hide-mobile">
                    <PriorityBadge priority={a.priority} />
                  </td>
                  <td className="hide-mobile">
                    <span
                      className={`text-[10px] ${a.status === "Completed" ? "text-primary" : a.status === "In progress" ? "text-info" : "text-muted-foreground"}`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${a.title}`}
                        title="Edit assignment"
                        onClick={() => setForm(a)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Delete ${a.title}`}
                        title="Delete assignment"
                        onClick={() => setDeleting(a)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <div className="flex justify-between items-center mt-5">
        <span className="text-xs text-muted-foreground">
          {rows.length} of {assignments.length} assignments
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => setResetting(true)}
        >
          <RotateCcw className="size-3" />
          Restore sample assignments
        </Button>
      </div>
      {form && (
        <AssignmentForm
          key={typeof form === "string" ? form : form.id}
          open
          assignment={typeof form === "string" ? undefined : form}
          onClose={() => setForm(null)}
        />
      )}
      <Dialog
        open={!!deleting || resetting}
        onOpenChange={(v) => {
          if (!v) {
            setDeleting(null);
            setResetting(false);
          }
        }}
      >
        <DialogContent className="max-w-[calc(100%-32px)] sm:max-w-md">
          <DialogTitle>{resetting ? "Restore sample assignments?" : "Delete this assignment?"}</DialogTitle>
          <DialogDescription>
            {resetting
              ? "This replaces all your assignments with a fresh set of sample assignments. This cannot be undone."
              : `“${deleting?.title}” will be permanently removed from this browser.`}
          </DialogDescription>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleting(null);
                setResetting(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (resetting) reset();
                else if (deleting) remove(deleting.id);
                setDeleting(null);
                setResetting(false);
              }}
            >
              {resetting ? "Restore sample assignments" : "Delete assignment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
