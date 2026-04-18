import { OSLayout } from "@/components/os/OSLayout";
import { Sparkles, ArrowUp } from "lucide-react";
import { useState } from "react";

interface Msg { role: "user" | "assistant"; content: string }

const seed: Msg[] = [
  { role: "assistant", content: "Hi Jordan — I have full read access to the company. Ask me about agents, projects, spend, or KPIs." },
];

const suggestions = [
  "Which agents are underperforming this week?",
  "Why is the billing pipeline at risk?",
  "Summarise spend by team for the last 7 days",
  "Draft a status update for the board",
];

const Copilot = () => {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: "This is a prototype — wire me to Lovable AI to get real answers grounded in your fleet data." },
    ]);
    setInput("");
  };

  return (
    <OSLayout>
      <div className="px-6 py-8 max-w-[900px] mx-auto animate-fade-in flex flex-col h-[calc(100vh-3rem-4rem)] min-h-[520px]">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md gradient-accent grid place-items-center">
            <Sparkles className="h-3.5 w-3.5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">Copilot</h1>
            <p className="text-[11px] text-muted-foreground mono">grounded on your AgentOS workspace</p>
          </div>
        </div>

        <div className="mt-6 flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-slide-in-right`}>
              <div
                className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-accent/15 border border-accent/30 text-foreground"
                    : "bg-surface border border-border text-foreground/90"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {messages.length <= 1 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-left rounded-md border border-border bg-surface px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-surface-hover hover:border-border-strong transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="mt-4 relative"
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything about your company…"
            className="w-full h-12 pl-4 pr-12 rounded-lg border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-md gradient-accent grid place-items-center text-accent-foreground hover:opacity-90 transition-opacity"
            aria-label="Send"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>
      </div>
    </OSLayout>
  );
};

export default Copilot;
