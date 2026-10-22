import { useState } from "react";
import { ArrowUpRight, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { demoAgent } from "@/lib/demo-agent";
import { useTracker } from "./store";
export function AgentMark() {
  return (
    <span className="brand-mark">
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 6h7M5 11h7M5 16h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="m2 5 1 1 2-2m-3 6 1 1 2-2m-3 6 1 1 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 13v3l2 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
export function Assistant({ full = false }: { full?: boolean }) {
  const { assignments, add, prioritize, ready } = useTracker();
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  async function send(text: string) {
    if (!text.trim() || busy) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    try {
      const result = demoAgent.respond(text, assignments, new Date());
      if (result.assignment) add(result.assignment);
      if (result.priorities) prioritize(result.priorities);
      setMessages((prev) => [...prev, { role: "assistant", text: result.text }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong while processing that request. Please try again.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className={`panel assistant-panel ${full ? "assistant-full" : ""}`}>
      <div className="assistant-title">
        <AgentMark />
        <div className="flex-1">
          <h2 className="text-sm font-bold">Study Copilot</h2>
          <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-primary" /> Ready to help you focus
          </p>
        </div>
      </div>
      <Conversation className="assistant-conversation">
        <ConversationContent className="gap-5 p-5">
          {messages.length === 0 && (
            <div className="assistant-welcome">
              <h3>Your next step, made clearer.</h3>
              <p>
                I’ll help you find your next task, balance your workload, and stay ahead of
                deadlines.
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <Message from={m.role} key={i}>
              <MessageContent className={m.role === "user" ? "chat-user" : ""}>
                <MessageResponse>{m.text}</MessageResponse>
              </MessageContent>
            </Message>
          ))}
          {busy && <Shimmer className="text-xs">Reviewing your assignments…</Shimmer>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      {messages.length === 0 && (
        <div className="quick-prompts">
          {[
            "What should I work on today?",
            "Prioritize my upcoming assignments.",
            "I have two hours. Make a study plan.",
          ].map((p) => (
            <Button variant="outline" key={p} disabled={busy || !ready} onClick={() => send(p)}>
              {p}
              <ArrowUpRight className="size-3" />
            </Button>
          ))}
        </div>
      )}
      <div className="assistant-composer">
        <PromptInput onSubmit={(message) => send(message.text)}>
          <PromptInputTextarea
            aria-label="Ask your study copilot"
            placeholder="Ask about your assignments…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={busy || !ready}
          />
          <PromptInputFooter className="justify-between">
            <CornerDownLeft className="size-3 text-muted-foreground" />
            <PromptInputSubmit
              aria-label="Send message"
              status={busy ? "submitted" : "ready"}
              disabled={busy || !input.trim() || !ready}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
      <p className="assistant-disclaimer">Rule-based guidance · No live LLM</p>
    </section>
  );
}
