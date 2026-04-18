import { OSLayout } from "@/components/os/OSLayout";
import { ModelAvatar, modelAccent } from "@/components/os/ModelAvatar";
import { chatSuggestions } from "@/lib/mock-data";
import { Sparkles, ArrowUp, Cpu, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Msg { role: "user" | "assistant"; content: string }

const seed: Msg[] = [
  {
    role: "assistant",
    content:
      "Morning Alex — I have read access to every model, every decision and every metric in your company. Ask me anything strategic.",
  },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dispatch`;

const Command = () => {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const send = async (text: string) => {
    if (!text.trim() || streaming) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ mode: "chat", messages: next }),
        signal: controller.signal,
      });

      if (resp.status === 429) { toast.error("Rate limit hit — try again shortly."); setStreaming(false); return; }
      if (resp.status === 402) { toast.error("AI credits exhausted. Add funds in Settings → Workspace → Usage."); setStreaming(false); return; }
      if (!resp.ok || !resp.body) { toast.error("Command Center failed to respond."); setStreaming(false); return; }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) upsert(delta);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw || raw.startsWith(":") || !raw.startsWith("data: ")) continue;
          const json = raw.slice(6).trim();
          if (json === "[DONE]") continue;
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) upsert(delta);
          } catch { /* ignore */ }
        }
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") toast.error(e?.message ?? "Stream error");
    } finally {
      setStreaming(false);
    }
  };

  return (
    <OSLayout>
      <div className="px-6 py-8 max-w-[1200px] mx-auto animate-fade-in">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-violet" /> Command Center
          </div>
          <h1 className="mt-2 text-[28px] leading-tight font-semibold tracking-tight text-foreground">
            Chat with your company
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask anything about strategy, agents, metrics, or memory. Powered by AgentOS.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8 glass-card rounded-xl flex flex-col h-[calc(100vh-3rem-12rem)] min-h-[520px]">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"} animate-slide-in-right`}
                >
                  {m.role === "assistant" && (
                    <ModelAvatar name="ChatGPT-5" accent={modelAccent("ChatGPT-5")} size="sm" />
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "gradient-accent text-accent-foreground"
                        : "bg-surface border border-border text-foreground/90"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}
              {streaming && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3 animate-slide-in-right">
                  <ModelAvatar name="ChatGPT-5" accent={modelAccent("ChatGPT-5")} size="sm" />
                  <div className="bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-muted-foreground flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" /> thinking…
                  </div>
                </div>
              )}
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
                disabled={streaming}
                className="w-full h-11 pl-4 pr-12 rounded-lg border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-electric/50 focus:ring-2 focus:ring-electric/20 transition disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={streaming || !input.trim()}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md gradient-accent grid place-items-center text-accent-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
                aria-label="Send"
              >
                {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
              </button>
            </form>
          </div>

          <aside className="col-span-12 lg:col-span-4 space-y-4">
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
                <Cpu className="h-3.5 w-3.5" /> Context loaded
              </div>
              <ul className="mt-3 space-y-1.5 text-xs text-foreground/85">
                <li>• 6 AI agents · 49 active tasks</li>
                <li>• Memory across decisions, growth, product</li>
                <li>• Real-time metrics · MRR, runway, health</li>
                <li>• Live signals from competitor monitoring</li>
              </ul>
              <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
                Auto-routed via Lovable AI. The dispatcher picks the cheapest model that meets the task's quality bar.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </OSLayout>
  );
};

export default Command;
