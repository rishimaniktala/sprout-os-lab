import { OSLayout } from "@/components/os/OSLayout";
import { inbox } from "@/lib/mock-data";
import { Check, X, MessageSquare } from "lucide-react";
import { useState } from "react";

const sevStyles = {
  high:   "text-destructive border-destructive/30 bg-destructive/10",
  medium: "text-warning border-warning/30 bg-warning/10",
  low:    "text-info border-info/30 bg-info/10",
};

const InboxPage = () => {
  const [items, setItems] = useState(inbox);
  const [selected, setSelected] = useState(items[0]?.id);
  const current = items.find(i => i.id === selected);

  const resolve = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setSelected(prev => (prev === id ? items.find(i => i.id !== id)?.id : prev));
  };

  return (
    <OSLayout>
      <div className="px-6 py-8 max-w-[1400px] mx-auto animate-fade-in">
        <div>
          <div className="text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">Manager queue</div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Inbox</h1>
          <p className="mt-1 text-sm text-muted-foreground">{items.length} items routed to you by agents.</p>
        </div>

        <div className="mt-6 grid lg:grid-cols-[380px_1fr] gap-3 rounded-lg border border-border bg-surface overflow-hidden min-h-[520px]">
          <ul className="border-b lg:border-b-0 lg:border-r border-border divide-y divide-border max-h-[640px] overflow-y-auto">
            {items.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setSelected(item.id)}
                  className={`w-full text-left p-4 hover:bg-surface-hover transition-colors ${selected === item.id ? "bg-surface-elevated" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`rounded-full border px-1.5 py-0.5 text-[9px] mono uppercase tracking-wider ${sevStyles[item.severity]}`}>
                      {item.severity}
                    </span>
                    <span className="text-[10px] mono text-muted-foreground">{item.ts}</span>
                  </div>
                  <div className="mt-2 text-xs font-medium text-foreground line-clamp-1">{item.title}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">{item.detail}</div>
                  <div className="mt-1.5 text-[10px] mono uppercase tracking-wider text-muted-foreground/70">from {item.agent}</div>
                </button>
              </li>
            ))}
            {items.length === 0 && (
              <li className="p-8 text-center text-sm text-muted-foreground">Inbox zero. 🎉</li>
            )}
          </ul>

          <div className="p-6">
            {current ? (
              <article>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] mono uppercase tracking-wider ${sevStyles[current.severity]}`}>
                      {current.severity} priority
                    </span>
                    <h2 className="mt-3 text-xl font-semibold text-foreground tracking-tight text-balance">{current.title}</h2>
                    <div className="mt-1 text-[11px] mono text-muted-foreground">From <span className="text-foreground">{current.agent}</span> · {current.ts} ago</div>
                  </div>
                </div>

                <p className="mt-5 text-sm text-foreground/90 leading-relaxed">{current.detail}</p>

                <div className="mt-5 rounded-md border border-border bg-background p-4">
                  <div className="text-[10px] mono uppercase tracking-wider text-muted-foreground">Agent recommendation</div>
                  <p className="mt-1.5 text-xs text-foreground/80">
                    Based on prior decisions and policy, I suggest <span className="text-accent font-medium">approving with conditions</span>.
                    Confidence: 82%.
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <button onClick={() => resolve(current.id)} className="h-9 px-3 rounded-md text-xs gradient-accent text-accent-foreground font-medium inline-flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button onClick={() => resolve(current.id)} className="h-9 px-3 rounded-md text-xs border border-border bg-surface hover:bg-surface-hover text-foreground inline-flex items-center gap-1.5">
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                  <button className="h-9 px-3 rounded-md text-xs border border-border bg-surface hover:bg-surface-hover text-foreground inline-flex items-center gap-1.5 ml-auto">
                    <MessageSquare className="h-3.5 w-3.5" /> Reply to {current.agent}
                  </button>
                </div>
              </article>
            ) : (
              <div className="h-full grid place-items-center text-sm text-muted-foreground">Select an item to view details.</div>
            )}
          </div>
        </div>
      </div>
    </OSLayout>
  );
};

export default InboxPage;
