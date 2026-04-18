import { OSLayout } from "@/components/os/OSLayout";
import { ModelAvatar, modelAccent } from "@/components/os/ModelAvatar";
import { chatSuggestions, routableModels } from "@/lib/mock-data";
import { Sparkles, ArrowUp, Cpu } from "lucide-react";
import { useState } from "react";

interface Msg { role: "user" | "assistant"; content: string; model?: string }

const seed: Msg[] = [
  { role: "assistant", model: "ChatGPT-5", content: "Morning Alex — I have read access to every model, every decision and every metric in your company. Ask me anything strategic." },
];

const Chat = () => {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("Auto Route");

  const send = (text: string) => {
    if (!text.trim()) return;
    const responder = model === "Auto Route" ? "ChatGPT-5" : model;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", model: responder, content: `Routing to ${responder} — this is a prototype. Wire to Lovable AI to get real, grounded answers from your fleet data, memory and portfolio.` },
    ]);
    setInput("");
  };

  return (
    <OSLayout>
      <div className="px-6 py-8 max-w-[1200px] mx-auto animate-fade-in">
        <header className="mb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-violet" /> Founder Command
            </div>
            <h1 className="mt-2 text-[28px] leading-tight font-semibold tracking-tight text-foreground">
              Chat with your company
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-4">
          {/* Chat */}
          <div className="col-span-12 lg:col-span-8 glass-card rounded-xl flex flex-col h-[calc(100vh-3rem-10rem)] min-h-[520px]">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"} animate-slide-in-right`}>
                  {m.role === "assistant" && m.model && (
                    <ModelAvatar name={m.model} accent={modelAccent(m.model)} size="sm" />
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "gradient-accent text-accent-foreground"
                        : "bg-surface border border-border text-foreground/90"
                    }`}
                  >
                    {m.role === "assistant" && m.model && (
                      <div className="text-[10px] mono uppercase tracking-wider text-muted-foreground mb-1">{m.model}</div>
                    )}
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            {messages.length <= 1 && (
              <div className="px-5 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {chatSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left rounded-md border border-border bg-surface/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-surface-hover hover:border-border-strong transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="p-3 border-t border-border relative"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your company…"
                className="w-full h-11 pl-4 pr-12 rounded-lg border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-electric/50 focus:ring-2 focus:ring-electric/20 transition"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md gradient-accent grid place-items-center text-accent-foreground hover:opacity-90 transition-opacity"
                aria-label="Send"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Side: model picker */}
          <aside className="col-span-12 lg:col-span-4 space-y-4">
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
                <Cpu className="h-3.5 w-3.5" /> Model
              </div>
              <div className="mt-3 space-y-1.5">
                {routableModels.map((m) => {
                  const active = model === m;
                  return (
                    <button
                      key={m}
                      onClick={() => setModel(m)}
                      className={`w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs transition-colors ${
                        active ? "bg-surface-elevated border border-border-strong text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-surface"
                      }`}
                    >
                      {m === "Auto Route" ? (
                        <span className="h-6 w-6 grid place-items-center rounded-md gradient-accent">
                          <Sparkles className="h-3 w-3 text-accent-foreground" />
                        </span>
                      ) : (
                        <ModelAvatar name={m} accent={modelAccent(m)} size="sm" />
                      )}
                      <span className="flex-1 text-left">{m}</span>
                      {active && <span className="text-[9px] mono text-electric uppercase tracking-wider">selected</span>}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
                Auto Route picks the cheapest model that meets the task's quality bar. You saved <span className="text-success font-semibold">61%</span> today.
              </p>
            </div>

            <div className="glass-card rounded-xl p-5">
              <div className="text-[11px] mono uppercase tracking-wider text-muted-foreground">Context loaded</div>
              <ul className="mt-3 space-y-1.5 text-xs text-foreground/85">
                <li>• 6 AI models · 49 active tasks</li>
                <li>• 6 portfolio companies</li>
                <li>• 4 meetings today</li>
                <li>• 1,284 memory events indexed</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </OSLayout>
  );
};

export default Chat;
