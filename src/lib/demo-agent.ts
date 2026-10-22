import { type Assignment, type AssignmentDraft, ranked } from "./assignments";
export type AgentResult = {
  text: string;
  assignment?: AssignmentDraft;
  priorities?: { id: string; priority: Assignment["priority"] }[];
};
// Replace this adapter with the Python agent integration only when a backend is explicitly added.
export interface AssignmentAgent {
  respond(prompt: string, assignments: Assignment[], now: Date): AgentResult;
}
export const demoAgent: AssignmentAgent = {
  respond(prompt, assignments, now) {
    const p = prompt.toLowerCase();
    const tasks = ranked(assignments, now);
    if (/^add\b/i.test(prompt.trim())) {
      const match = prompt.match(
        /^add\s+(?:my\s+)?(.+?)\s+due\s+(today|tomorrow|\d{4}-\d{2}-\d{2})(?:\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?)?[.!]?$/i,
      );
      if (!match)
        return {
          text: "I need a title and a clear deadline. Try: **“Add my machine learning assignment due tomorrow at 5 PM.”** You can also use a date like **2026-10-20**.",
        };
      const [, title, day, hour, minute, period] = match;
      if (!title || !day) return { text: "Please include an assignment title and deadline." };
      const d = new Date(now);
      if (/^\d{4}/.test(day)) {
        const [y, m, n] = day.split("-").map(Number);
        if (y === undefined || m === undefined || n === undefined)
          return { text: "Please enter a date in YYYY-MM-DD format." };
        d.setFullYear(y, m - 1, n);
        if (d.getFullYear() !== y || d.getMonth() !== m - 1 || d.getDate() !== n)
          return { text: "That date is not valid. Please use a real date in YYYY-MM-DD format." };
      } else if (day.toLowerCase() === "tomorrow") d.setDate(d.getDate() + 1);
      let h = hour ? Number(hour) : 17;
      const min = Number(minute || 0);
      if (min > 59 || (period ? h < 1 || h > 12 : h > 23))
        return { text: "That time is not valid. Try a time such as **5 PM** or **17:30**." };
      if (period) h = (h % 12) + (period.toLowerCase() === "pm" ? 12 : 0);
      d.setHours(h, min, 0, 0);
      const course = /machine learning/i.test(title)
        ? "Machine Learning"
        : /math/i.test(title)
          ? "Mathematics"
          : /database|sql/i.test(title)
            ? "Database Systems"
            : "General Studies";
      const assignment: AssignmentDraft = {
        title: title.charAt(0).toUpperCase() + title.slice(1),
        course,
        deadline: d.toISOString(),
        effort: 2,
        priority: "High",
        status: "Not started",
      };
      return {
        assignment,
        text: `Added **${assignment.title}** for **${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}**.\n\nI set it to **high priority** with an estimated **2 hours** of effort. You can edit these in Assignments.`,
      };
    }
    if (!tasks.length)
      return {
        text: "You’re all caught up! There are no unfinished assignments. Add a new assignment when you’re ready.",
      };
    if (/prioriti[sz]/.test(p)) {
      const priorities = tasks.map((a) => {
        const hours = (new Date(a.deadline).getTime() - now.getTime()) / 3600000;
        return {
          id: a.id,
          priority: (hours < 48
            ? "High"
            : hours < 120
              ? "Medium"
              : "Low") as Assignment["priority"],
        };
      });
      return {
        priorities,
        text: `I updated priorities based on deadlines, then ranked by urgency and effort:\n\n${ranked(
          assignments.map((a) => ({
            ...a,
            priority: priorities.find((v) => v.id === a.id)?.priority || a.priority,
          })),
          now,
        )
          .slice(0, 5)
          .map(
            (a, i) =>
              `${i + 1}. **${a.title}** — ${priorities.find((v) => v.id === a.id)?.priority} priority, ${a.effort}h estimated.`,
          )
          .join("\n")}\n\nStart with the closest deadline; overdue work comes first.`,
      };
    }
    if (/plan|hours?|minutes?|available/.test(p)) {
      const m = p.match(/(\d+(?:\.\d+)?|one|two|three|four)\s*(hours?|minutes?)/);
      const words: Record<string, number> = { one: 1, two: 2, three: 3, four: 4 };
      const quantity = m?.[1];
      const amount = quantity ? words[quantity] || Number(quantity) : 2;
      const total = Math.round(amount * (m?.[2]?.startsWith("minute") ? 1 : 60));
      if (total < 10 || total > 720)
        return {
          text: "Choose a study window between **10 minutes and 12 hours**, and I’ll make a realistic plan.",
        };
      let left = total;
      let elapsed = 0;
      const lines: string[] = [];
      for (const a of tasks) {
        if (left <= 0) break;
        const duration = Math.min(left, Math.round(a.effort * 60), 50);
        lines.push(
          `- **${elapsed}–${elapsed + duration} min:** ${a.title}${duration < a.effort * 60 ? " — make a focused start" : " — finish the task"}.`,
        );
        left -= duration;
        elapsed += duration;
        if (left > 10) {
          lines.push(`- **${elapsed}–${elapsed + 10} min:** Take a break.`);
          left -= 10;
          elapsed += 10;
        }
      }
      if (left > 0)
        lines.push(`- **${elapsed}–${total} min:** Review progress and prepare your next session.`);
      return {
        text: `Here’s your **${total}-minute study plan**, based on your unfinished assignments:\n\n${lines.join("\n")}\n\nFocus on one task at a time. This is a suggestion, not a scheduled reminder.`,
      };
    }
    if (/today|focus|work|upcoming|deadline/.test(p))
      return {
        text: `Here’s where I’d focus today:\n\n${tasks
          .slice(0, 3)
          .map(
            (a, i) =>
              `${i + 1}. **${a.title}**\n   ${a.course} · ${a.effort}h estimated · due ${new Date(a.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}.`,
          )
          .join(
            "\n\n",
          )}\n\nI consider deadline proximity, priority, and effort. ${tasks.some((a) => new Date(a.deadline) < now) ? "Check overdue work first." : "Start with the first task for a focused session."}`,
      };
    return {
      text: "I use **browser-side rules**, not a live LLM. I can **add an assignment**, **recommend today’s focus**, **prioritize your tasks**, or **make a study plan**. Try “I have two hours available. Make a study plan.”",
    };
  },
};
