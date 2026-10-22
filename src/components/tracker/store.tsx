import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  sampleAssignments,
  storageKey,
  validAssignments,
  type Assignment,
  type AssignmentDraft,
} from "@/lib/assignments";
type Store = {
  assignments: Assignment[];
  ready: boolean;
  error: string;
  now: Date;
  add: (a: AssignmentDraft) => void;
  update: (a: Assignment) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  prioritize: (p: { id: string; priority: Assignment["priority"] }[]) => void;
  reset: () => void;
};
// Keep one context instance across hot reloads so provider and consumers always match.
const globalKey = "__agenticTrackerContext" as const;
const g = globalThis as typeof globalThis & { [globalKey]?: React.Context<Store | null> };
const Context = (g[globalKey] ??= createContext<Store | null>(null));
export function TrackerProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (!validAssignments(parsed)) throw new Error("Invalid saved data");
        setAssignments(parsed);
      } else {
        const initial = sampleAssignments();
        setAssignments(initial);
        try {
          localStorage.setItem(storageKey, JSON.stringify(initial));
        } catch {
          setError("Your browser could not save assignments. Changes may be lost after refresh.");
        }
      }
    } catch {
      setError(
        "Saved assignments could not be read. Sample assignments are shown; your existing saved data has not been replaced.",
      );
      setAssignments(sampleAssignments());
    }
    setNow(new Date());
    setReady(true);
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);
  const save = (next: Assignment[]) => {
    setAssignments(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setError("");
    } catch {
      setError(
        "Your browser could not save changes. They will be lost when this page is refreshed.",
      );
    }
  };
  const add = (draft: AssignmentDraft) =>
    save([...assignments, { ...draft, id: crypto.randomUUID() }]);
  return (
    <Context.Provider
      value={{
        assignments,
        ready,
        error,
        now,
        add,
        update: (a) => save(assignments.map((t) => (t.id === a.id ? a : t))),
        remove: (id) => save(assignments.filter((a) => a.id !== id)),
        toggle: (id) =>
          save(
            assignments.map((a) =>
              a.id === id
                ? { ...a, status: a.status === "Completed" ? "Not started" : "Completed" }
                : a,
            ),
          ),
        prioritize: (p) =>
          save(
            assignments.map((a) => ({
              ...a,
              priority: p.find((v) => v.id === a.id)?.priority || a.priority,
            })),
          ),
        reset: () => save(sampleAssignments()),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useTracker() {
  const store = useContext(Context);
  if (!store) throw new Error("Tracker provider is missing");
  return store;
}
