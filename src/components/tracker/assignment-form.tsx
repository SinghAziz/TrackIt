import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { localInputDate, type Assignment, type AssignmentDraft } from "@/lib/assignments";
import { useTracker } from "./store";
export function AssignmentForm({
  open,
  onClose,
  assignment,
}: {
  open: boolean;
  onClose: () => void;
  assignment?: Assignment | undefined;
}) {
  const { add, update } = useTracker();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(17, 0, 0, 0);
  const [draft, setDraft] = useState<AssignmentDraft>(
    assignment
      ? { ...assignment, deadline: localInputDate(new Date(assignment.deadline)) }
      : {
          title: "",
          course: "",
          deadline: localInputDate(tomorrow),
          effort: 2,
          priority: "Medium",
          status: "Not started",
        },
  );
  const [error, setError] = useState("");
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-[calc(100%-32px)] sm:max-w-lg">
        <DialogTitle>{assignment ? "Edit assignment" : "Add assignment"}</DialogTitle>
        <DialogDescription>A clear deadline is the first step to a calmer week.</DialogDescription>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const d = new Date(draft.deadline);
            if (
              !draft.title.trim() ||
              !draft.course.trim() ||
              !Number.isFinite(d.getTime()) ||
              draft.effort <= 0 ||
              draft.effort > 1000
            ) {
              setError(
                "Enter a title, course, valid deadline, and effort between 0.25 and 1,000 hours.",
              );
              return;
            }
            const result = {
              ...draft,
              title: draft.title.trim(),
              course: draft.course.trim(),
              deadline: d.toISOString(),
            };
            if (assignment) update({ ...result, id: assignment.id });
            else add(result);
            onClose();
          }}
        >
          <div className="form-grid">
            <label className="col-span-2">
              Assignment title
              <Input
                required
                maxLength={150}
                placeholder="e.g. Neural Networks — Assignment 04"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </label>
            <label className="col-span-2">
              Course
              <Input
                required
                maxLength={80}
                placeholder="e.g. Machine Learning"
                value={draft.course}
                onChange={(e) => setDraft({ ...draft, course: e.target.value })}
              />
            </label>
            <label className="col-span-2">
              Deadline
              <Input
                aria-label="Deadline"
                required
                type="datetime-local"
                value={draft.deadline}
                onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
              />
            </label>
            <label>
              Estimated effort (hours)
              <Input
                required
                type="number"
                min="0.25"
                max="1000"
                step="0.25"
                value={draft.effort}
                onChange={(e) => setDraft({ ...draft, effort: Number(e.target.value) })}
              />
            </label>
            <label>
              Priority
              <select
                className="form-select"
                value={draft.priority}
                onChange={(e) =>
                  setDraft({ ...draft, priority: e.target.value as Assignment["priority"] })
                }
              >
                {["High", "Medium", "Low"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label className="col-span-2">
              Status
              <select
                className="form-select"
                value={draft.status}
                onChange={(e) =>
                  setDraft({ ...draft, status: e.target.value as Assignment["status"] })
                }
              >
                {["Not started", "In progress", "Completed"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
          </div>
          {error && (
            <p role="alert" className="text-destructive text-xs mt-4">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{assignment ? "Save changes" : "Add assignment"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
