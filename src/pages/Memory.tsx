import { OSLayout } from "@/components/os/OSLayout";
import { ModelAvatar, modelAccent } from "@/components/os/ModelAvatar";
import { memoryFeed, memoryTabs } from "@/lib/mock-data";
import { Brain, Search } from "lucide-react";
import { useState } from "react";

type Tab = (typeof memoryTabs)[number] | "All";

const Memory = () => {
  const [tab, setTab] = useState<Tab>("All");
  const [q, setQ] = useState("");

  const filtered = memoryFeed.filter((e) => {
    if (tab !== "All" && e.tab !== tab) return false;
    if (q && !e.text.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <OSLayout>
      <div className="px-6 py-8 max-w-[1100px] mx-auto animate-fade-in">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">
            <Brain className="h-3 w-3 text-electric" /> Shared Intelligence Layer
          </div>
          <h1 className="mt-2 text-[28px] leading-tight font-semibold tracking-tight text-foreground">
            Company Memory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            Every model writes to the same memory graph. Decisions, customers, growth, finance — searchable forever.
          </p>
        </header>

        <div className="glass-card rounded-xl p-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Ask the memory…  e.g. "What caused churn in March?"'
              className="w-full h-11 pl-9 pr-4 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-electric/50 focus:ring-2 focus:ring-electric/20 transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 mb-4 overflow-x-auto">
          {(["All", ...memoryTabs] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 h-7 rounded-md text-xs transition-colors whitespace-nowrap ${
                tab === t ? "bg-surface-elevated text-foreground border border-border-strong" : "text-muted-foreground hover:text-foreground hover:bg-surface"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <ol className="relative space-y-3">
          <span className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
          {filtered.map((e) => (
            <li key={e.id} className="relative flex gap-4">
              <div className="relative pt-3">
                <span className="absolute left-3 top-3 h-2 w-2 rounded-full bg-electric ring-4 ring-background" />
                <div className="w-10" />
              </div>
              <div className="flex-1 glass-card rounded-lg p-3.5">
                <div className="flex items-center gap-2.5">
                  <ModelAvatar name={e.model} accent={modelAccent(e.model)} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">{e.model}</span>
                      <span className="text-[10px] mono uppercase tracking-wider text-muted-foreground/80 px-1.5 py-0.5 rounded border border-border">{e.tab}</span>
                    </div>
                  </div>
                  <span className="text-[10px] mono text-muted-foreground shrink-0">{e.ts} ago</span>
                </div>
                <p className="mt-2 text-sm text-foreground/90 leading-relaxed">{e.text}</p>
              </div>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="text-center text-sm text-muted-foreground py-12">No memories match.</li>
          )}
        </ol>
      </div>
    </OSLayout>
  );
};

export default Memory;
