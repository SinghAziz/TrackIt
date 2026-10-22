export type Priority = "High" | "Medium" | "Low";
export type Assignment = {
  id: string;
  title: string;
  course: string;
  deadline: string;
  effort: number;
  priority: Priority;
  status: "Not started" | "In progress" | "Completed";
};
export type AssignmentDraft = Omit<Assignment, "id">;
export const storageKey = "agentic-assignments-v1";
export function localInputDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
export function sampleAssignments(now = new Date()): Assignment[] {
  const deadline = (days: number, hour = 17) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };
  return [
    {
      id: "demo-1",
      title: "Neural Networks — Assignment 03",
      course: "Machine Learning",
      deadline: deadline(0, 23),
      effort: 3,
      priority: "High",
      status: "In progress",
    },
    {
      id: "demo-2",
      title: "Database Design Project",
      course: "Database Systems",
      deadline: deadline(1),
      effort: 4,
      priority: "High",
      status: "Not started",
    },
    {
      id: "demo-3",
      title: "Algorithm Analysis Problem Set",
      course: "Data Structures",
      deadline: deadline(2, 23),
      effort: 2,
      priority: "Medium",
      status: "In progress",
    },
    {
      id: "demo-4",
      title: "Research Paper Review",
      course: "Artificial Intelligence",
      deadline: deadline(3),
      effort: 1.5,
      priority: "Medium",
      status: "Not started",
    },
    {
      id: "demo-5",
      title: "Operating Systems Lab Report",
      course: "Operating Systems",
      deadline: deadline(4),
      effort: 2.5,
      priority: "Low",
      status: "Not started",
    },
    {
      id: "demo-6",
      title: "Linear Algebra Quiz Preparation",
      course: "Mathematics",
      deadline: deadline(6),
      effort: 1,
      priority: "Low",
      status: "Not started",
    },
    {
      id: "demo-7",
      title: "Python Data Analysis Notebook",
      course: "Machine Learning",
      deadline: deadline(-1),
      effort: 2,
      priority: "Medium",
      status: "Completed",
    },
    {
      id: "demo-8",
      title: "SQL Practice Exercises",
      course: "Database Systems",
      deadline: deadline(-2),
      effort: 1.5,
      priority: "Low",
      status: "Completed",
    },
    {
      id: "demo-9",
      title: "Sorting Algorithms Worksheet",
      course: "Data Structures",
      deadline: deadline(-3),
      effort: 1,
      priority: "Medium",
      status: "Completed",
    },
    {
      id: "demo-10",
      title: "Probability Problem Set",
      course: "Mathematics",
      deadline: deadline(-4),
      effort: 2,
      priority: "Low",
      status: "Completed",
    },
    {
      id: "demo-11",
      title: "Process Scheduling Exercises",
      course: "Operating Systems",
      deadline: deadline(8),
      effort: 2,
      priority: "Medium",
      status: "Not started",
    },
    {
      id: "demo-12",
      title: "AI Ethics Reflection",
      course: "Artificial Intelligence",
      deadline: deadline(-1),
      effort: 1,
      priority: "Low",
      status: "Not started",
    },
  ];
}
export function isToday(deadline: string, now: Date) {
  return new Date(deadline).toDateString() === now.toDateString();
}
export function isOverdue(a: Assignment, now: Date) {
  return a.status !== "Completed" && new Date(a.deadline) < now;
}
export function ranked(assignments: Assignment[], now: Date) {
  const score = (a: Assignment) =>
    Math.max(-72, (new Date(a.deadline).getTime() - now.getTime()) / 3600000) -
    { High: 30, Medium: 12, Low: 0 }[a.priority] -
    a.effort;
  return assignments
    .filter((a) => a.status !== "Completed")
    .sort((a, b) => {
      const overdueDifference = Number(isOverdue(b, now)) - Number(isOverdue(a, now));
      return overdueDifference || score(a) - score(b);
    });
}
export function deadlineLabel(a: Assignment, now: Date) {
  if (isOverdue(a, now)) return "Overdue";
  if (isToday(a.deadline, now)) return "Today";
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (new Date(a.deadline).toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return new Date(a.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
export function validAssignments(value: unknown): value is Assignment[] {
  return (
    Array.isArray(value) &&
    value.every(
      (a) =>
        typeof a === "object" &&
        a !== null &&
        typeof a.id === "string" &&
        typeof a.title === "string" &&
        a.title.trim() &&
        typeof a.course === "string" &&
        a.course.trim() &&
        typeof a.deadline === "string" &&
        Number.isFinite(Date.parse(a.deadline)) &&
        typeof a.effort === "number" &&
        a.effort > 0 &&
        ["High", "Medium", "Low"].includes(a.priority) &&
        ["Not started", "In progress", "Completed"].includes(a.status),
    )
  );
}
