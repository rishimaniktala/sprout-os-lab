import { OSLayout } from "@/components/os/OSLayout";
import { ModelAvatar, modelAccent } from "@/components/os/ModelAvatar";
import { Brain, Search, Database, Layers, Sparkles, ArrowUp, Activity } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Layer = "low" | "medium" | "high";
type Tab = "All" | "Decisions" | "Meetings" | "Customers" | "Growth" | "Product" | "Finance";

interface MemoryItem {
  id: string;
  layer: Layer;
  content: string;
  source: string;     // agent name
  timestamp: string;  // relative
  priority: "low" | "medium" | "high" | "critical";
  tab: Tab;
}

const seedMemory: MemoryItem[] = [
  // LOW — raw logs / short-term
  { id: "l1", layer: "low",  content: "Stripe webhook: 14 new MRR events processed", source: "Llama",       timestamp: "12s",  priority: "low",      tab: "Finance" },
  { id: "l2", layer: "low",  content: "Crawled 38 competitor pages from Gemini batch", source: "Gemini",    timestamp: "47s",  priority: "low",      tab: "Growth" },
  { id: "l3", layer: "low",  content: "Support ticket #4821 categorized: billing", source: "Llama",         timestamp: "1m",   priority: "low",      tab: "Customers" },
  { id: "l4", layer: "low",  content: "PR #2841 merged — checkout flow fix", source: "Cursor Agent",        timestamp: "2m",   priority: "medium",   tab: "Product" },
  { id: "l5", layer: "low",  content: "Indexed 6 inbound investor emails", source: "Claude",                timestamp: "3m",   priority: "low",      tab: "Decisions" },
  // MEDIUM — summarized insights
  { id: "m1", layer: "medium", content: "Acme cut Pro pricing 20% — likely competitive response to our DACH push", source: "Gemini",     timestamp: "8m",  priority: "high",     tab: "Growth" },
  { id: "m2", layer: "medium", content: "Onboarding drop-off concentrated at step 3 (account verification)",        source: "Cursor Agent", timestamp: "22m", priority: "high",     tab: "Product" },
  { id: "m3", layer: "medium", content: "44 inbound EU leads this week — 3.2× last month's pace",                    source: "Llama",        timestamp: "41m", priority: "medium",   tab: "Growth" },
  { id: "m4", layer: "medium", content: "Investor sentiment around AI infra remains strong (Series A pace +18%)",   source: "Perplexity",   timestamp: "1h",  priority: "medium",   tab: "Decisions" },
  // HIGH — long-term knowledge
  { id: "h1", layer: "high", content: "Strategy: pause Brazil GTM, double down on DACH for next two quarters",      source: "ChatGPT-5", timestamp: "4h",  priority: "critical", tab: "Decisions" },
  { id: "h2", layer: "high", content: "Northwind voice & narrative: builder-first, technically credible, low hype", source: "Claude",    timestamp: "1d",  priority: "high",     tab: "Decisions" },
  { id: "h3", layer: "high", content: "Best-converting growth channel: technical content + LinkedIn distribution",  source: "ChatGPT-5", timestamp: "2d",  priority: "high",     tab: "Growth" },
];

const layers: { id: Layer; label: string; sub: string; icon: typeof Layers; tone: string }[] = [
  { id: "low",    label: "Low Memory",    sub: "Raw logs · Short-term",    icon: Activity, tone: "text-electric border-electric/30 bg-electric/5" },
  { id: "medium", label: "Medium Memory", sub: "Summarized insights",      icon: Layers,   tone: "text-info border-info/30 bg-info/5" },
  { id: "high",   label: "High Memory",   sub: "Long-term knowledge",      icon: Database, tone: "text-violet border-violet/30 bg-violet/5" },
];

const priorityClass: Record<MemoryItem["priority"], string> = {
  critical: "text-destructive border-destructive/40 bg-destructive/10",
  high:     "text-warning border-warning/40 bg-warning/10",
  medium:   "text-electric border-electric/40 bg-electric/10",
  low:      "text-muted-foreground border-border bg-surface",
};

const liveTemplates = [
  { agent: "Gemini",      verb: "logged insight",      target: "Growth" as Tab,    layer: "low" as Layer,    text: "New competitor blog post from Acme detected" },
  { agent: "Claude",      verb: "summarized data",     target: "Decisions" as Tab, layer: "medium" as Layer, text: "Compressed 12 investor notes into Q2 narrative" },
  { agent: "ChatGPT-5",   verb: "promoted insight",    target: "Product" as Tab,   layer: "high" as Layer,   text: "Onboarding fix promoted from medium → high memory" },
  { agent: "Llama",       verb: "indexed records",     target: "Customers" as Tab, layer: "low" as Layer,    text: "27 CRM records refreshed from inbound forms" },
  { agent: "Cursor Agent",verb: "committed log",       target: "Product" as Tab,   layer: "low" as Layer,    text: "Build #482 green · 0 regressions" },
  { agent: "Perplexity",  verb: "logged signal",       target: "Growth" as Tab,    layer: "low" as Layer,    text: "Detected funding rumor for competitor Mira" },
];

const tabs: Tab[] = ["All", "Decisions", "Meetings", "Customers", "Growth", "Product", "Finance"];

const Memory = () => {
  const [items, setItems] = useState<MemoryItem[]>(seedMemory);
  const [tab, setTab] = useState<Tab>("All");
  const [q, setQ] = useState("");
  const [feed, setFeed] = useState<{ id: string; agent: string; verb: string; text: string; ts: number }[]>([]);

  // simulate live writes every ~3s
  useEffect(() => {
    const t = setInterval(() => {
      const tpl = liveTemplates[Math.floor(Math.random() * liveTemplates.length)];
      const id = `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setFeed((prev) => [{ id, agent: tpl.agent, verb: tpl.verb, text: tpl.text, ts: Date.now() }, ...prev].slice(0, 10));
      setItems((prev) => [
        {
          id,
          layer: tpl.layer,
          content: tpl.text,
          source: tpl.agent,
          timestamp: "now",
          priority: tpl.layer === "high" ? "high" : tpl.layer === "medium" ? "medium" : "low",
          tab: tpl.target,
        },
        ...prev,
      ].slice(0, 60));
    }, 3200);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((e) => {
        if (tab !== "All" && e.tab !== tab) return false;
        if (q && !e.content.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [items, tab, q],
  );

  const counts = useMemo(
    () => ({
      low:    items.filter((i) => i.layer === "low").length,
      medium: items.filter((i) => i.layer === "medium").length,
      high:   items.filter((i) => i.layer === "high").length,
    }),
    [items],
  );

  return (
    <OSLayout>
      <div className="px-6 py-8 max-w-[1400px] mx-auto animate-fade-in">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">
            <Brain className="h-3 w-3 text-electric" /> Shared Intelligence Layer
          </div>
          <h1 className="mt-2 text-[28px] leading-tight font-semibold tracking-tight text-foreground">
            Memory System
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            Three layers — raw signal flows in, gets summarized, then promoted to long-term knowledge. Every agent reads & writes here.
          </p>
        </header>

        {/* Search */}
        <div className="glass-card rounded-xl p-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Ask the memory…  e.g. "What caused churn last month?"'
              className="w-full h-11 pl-9 pr-4 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-electric/50 focus:ring-2 focus:ring-electric/20 transition"
            />
          </div>
        </div>

        {/* Layers strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {layers.map((L) => (
            <div key={L.id} className={`glass-card rounded-xl p-4 ring-1 ${L.tone}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider">
                  <L.icon className="h-3.5 w-3.5" /> {L.label}
                </div>
                <span className="text-[10px] mono text-muted-foreground">{counts[L.id]} items</span>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">{L.sub}</div>
              <div className="mt-3 flex items-center gap-1.5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 flex-1 rounded-sm ${i < Math.min(16, counts[L.id]) ? "bg-current opacity-80" : "bg-current opacity-15"}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Memory by layer */}
          <section className="col-span-12 lg:col-span-8 space-y-4">
            <div className="flex items-center gap-1 overflow-x-auto -mx-1 px-1">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 h-7 rounded-md text-xs transition-colors whitespace-nowrap ${
                    tab === t
                      ? "bg-surface-elevated text-foreground border border-border-strong"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {layers.map((L) => {
              const layerItems = filtered.filter((i) => i.layer === L.id);
              return (
                <div key={L.id} className="glass-card rounded-xl">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
                      <L.icon className="h-3.5 w-3.5" /> {L.label}
                    </div>
                    <span className="text-[10px] mono text-muted-foreground">{layerItems.length} shown</span>
                  </div>
                  <ul className="divide-y divide-border">
                    {layerItems.length === 0 && (
                      <li className="px-4 py-6 text-center text-xs text-muted-foreground">No memories in this layer match.</li>
                    )}
                    {layerItems.map((m) => (
                      <li key={m.id} className="px-4 py-3 flex items-start gap-3 hover:bg-surface-hover/40 transition-colors animate-fade-in">
                        <ModelAvatar name={m.source} accent={modelAccent(m.source)} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium text-foreground">{m.source}</span>
                            <span className="text-[10px] mono uppercase tracking-wider text-muted-foreground/80 px-1.5 py-0.5 rounded border border-border">
                              {m.tab}
                            </span>
                            <span className={`text-[10px] mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${priorityClass[m.priority]}`}>
                              {m.priority}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-foreground/90 leading-relaxed">{m.content}</p>
                        </div>
                        <span className="text-[10px] mono text-muted-foreground shrink-0 pt-0.5">{m.timestamp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>

          {/* Live feed */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="glass-card rounded-xl sticky top-16 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-violet" /> Live writes
                </div>
                <span className="flex items-center gap-1 text-[10px] mono text-success">
                  <span className="pulse-dot bg-success" /> streaming
                </span>
              </div>
              <ul className="max-h-[60vh] overflow-y-auto">
                {feed.length === 0 && (
                  <li className="px-4 py-8 text-center text-xs text-muted-foreground">
                    Waiting for agents to write to memory…
                  </li>
                )}
                {feed.map((f) => (
                  <li key={f.id} className="px-4 py-3 border-b border-border/60 animate-slide-in-right">
                    <div className="flex items-center gap-2">
                      <ModelAvatar name={f.agent} accent={modelAccent(f.agent)} size="sm" />
                      <div className="text-xs text-foreground/90">
                        <span className="font-medium">{f.agent}</span>{" "}
                        <span className="text-muted-foreground">{f.verb}</span>
                      </div>
                      <ArrowUp className="ml-auto h-3 w-3 text-electric rotate-45" />
                    </div>
                    <div className="mt-1.5 text-[11px] text-muted-foreground leading-snug">{f.text}</div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </OSLayout>
  );
};

export default Memory;
