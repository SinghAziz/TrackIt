import { describe, expect, it } from "vitest";
import { sampleAssignments, ranked, isToday, isOverdue, validAssignments } from "@/lib/assignments";
import { demoAgent } from "@/lib/demo-agent";
const now = new Date(2026, 9, 9, 12, 0, 0);
describe("assignment demo", () => {
  it("uses dates relative to today and handles overdue tasks", () => {
    const rows = sampleAssignments(now);
    expect(rows.filter((a) => isToday(a.deadline, now))).toHaveLength(1);
    expect(rows.filter((a) => isOverdue(a, now))).toHaveLength(1);
    expect(ranked(rows, now)[0]?.title).toBe("AI Ethics Reflection");
  });
  it("validates saved data and permits an empty workspace", () => {
    expect(validAssignments(sampleAssignments(now))).toBe(true);
    expect(validAssignments([])).toBe(true);
    expect(validAssignments([{ id: "broken", deadline: "invalid" }])).toBe(false);
  });
  it("adds an assignment due tomorrow at 5 PM", () => {
    const result = demoAgent.respond(
      "Add my machine learning assignment due tomorrow at 5 PM.",
      [],
      now,
    );
    expect(result.assignment?.course).toBe("Machine Learning");
    const d = new Date(result.assignment?.deadline || "");
    expect(d.getDate()).toBe(10);
    expect(d.getHours()).toBe(17);
  });
  it("rejects invalid dates and invalid times", () => {
    expect(demoAgent.respond("Add my essay due 2026-02-30", [], now).assignment).toBeUndefined();
    expect(
      demoAgent.respond("Add my essay due tomorrow at 27 PM", [], now).assignment,
    ).toBeUndefined();
  });
  it("makes a two-hour plan from actual tasks", () => {
    const result = demoAgent.respond(
      "I have two hours available. Make a study plan.",
      sampleAssignments(now),
      now,
    );
    expect(result.text).toContain("120-minute study plan");
    expect(result.text).toContain("AI Ethics Reflection");
    expect(result.text).toContain("110–120");
  });
  it("updates priorities without touching completed assignments", () => {
    const rows = sampleAssignments(now);
    const result = demoAgent.respond("Prioritize my upcoming assignments.", rows, now);
    expect(result.priorities).toHaveLength(8);
    expect(result.priorities?.some((p) => p.id === "demo-7")).toBe(false);
    expect(result.priorities?.find((p) => p.id === "demo-12")?.priority).toBe("High");
  });
  it("handles an empty workspace", () => {
    expect(demoAgent.respond("What should I work on today?", [], now).text).toContain(
      "all caught up",
    );
  });
});
