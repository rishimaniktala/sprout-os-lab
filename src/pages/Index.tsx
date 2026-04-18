import { OSLayout } from "@/components/os/OSLayout";
import { StatusBadge } from "@/components/os/StatusBadge";
import { agents, kpis, metricSeries, inbox } from "@/lib/mock-data";
import { ArrowUpRight, TrendingUp, Bot, DollarSign, CheckCircle2, AlertCircle } from "lucide-react";

const formatUsd = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const Stat = ({ label, value, delta, icon: Icon, accent }: { label: string; value: string; delta: string; icon: any; accent?: boolean }) => (
  <div className="relative rounded-lg border border-border bg-surface p-4 overflow-hidden group hover:bg-surface-elevated transition-colors">
    {accent && <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />}
    <div className="flex items-center justify-between">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground mono">{label}</span>
      <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
    </div>
    <div className="mt-3 flex items-baseline gap-2">
      <span className="text-2xl font-semibold text-foreground tracking-tight">{value}</span>
      <span className="text-[11px] mono text-success flex items-center gap-0.5">
        <TrendingUp className="h-3 w-3" />{delta}
      </span>
    </div>
  </div>
);

// Inline SVG sparkline for tasks
const Sparkline = () => {
  const max = Math.max(...metricSeries.map(m => m.tasks));
  const points = metricSeries.map((m, i) => {
    const x = (i / (metricSeries.length - 1)) * 100;
    const y = 100 - (m.tasks / max) * 100;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
      <defs>
        <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,100 ${points} 100,100`} fill="url(#sg)" />
      <polyline points={points} fill="none" stroke="hsl(var(--accent))" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const Dashboard = () => {
  const topAgents = [...agents].sort((a, b) => b.tasksCompleted - a.tasksCompleted).slice(0, 5);
  const urgentInbox = inbox.filter(i => i.severity === "high");

  return (
    <OSLayout>
      <div className="scanline-bg">
        <div className="px-6 py-8 max-w-[1400px] mx-auto animate-fade-in">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">
                {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
              </div>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground text-balance">
                Good morning, Jordan.
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Your fleet of <span className="text-foreground font-medium">{agents.length} agents</span> ran{" "}
                <span className="text-foreground font-medium">{kpis.totalTasks24h.toLocaleString()} tasks</span> in the last 24h.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-8 px-3 rounded-md text-xs border border-border bg-surface hover:bg-surface-hover text-foreground transition-colors">
                Export
              </button>
              <button className="h-8 px-3 rounded-md text-xs gradient-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-1.5">
                Deploy agent <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat label="Active agents" value={String(kpis.activeAgents)} delta="+2" icon={Bot} accent />
            <Stat label="Tasks (24h)" value={kpis.totalTasks24h.toLocaleString()} delta="+12.4%" icon={CheckCircle2} />
            <Stat label="Spend today" value={formatUsd(kpis.spendToday)} delta="-3.1%" icon={DollarSign} />
            <Stat label="Success rate" value={`${kpis.successRate}%`} delta="+0.8%" icon={TrendingUp} />
          </div>

          {/* Main grid */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Activity chart */}
            <section className="lg:col-span-2 rounded-lg border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Fleet activity</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Tasks per hour · last 24h</p>
                </div>
                <div className="flex items-center gap-1 rounded-md border border-border bg-background p-0.5">
                  {["1h", "24h", "7d", "30d"].map((p, i) => (
                    <button key={p} className={`px-2 py-0.5 text-[11px] mono rounded ${i === 1 ? "bg-surface-elevated text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 h-48 -mx-1">
                <Sparkline />
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] mono text-muted-foreground">
                {metricSeries.filter((_, i) => i % 4 === 0).map(m => <span key={m.hour}>{m.hour}</span>)}
              </div>
            </section>

            {/* Inbox */}
            <section className="rounded-lg border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Decisions needed</h2>
                <span className="text-[10px] mono uppercase tracking-wider text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />{urgentInbox.length} urgent
                </span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {inbox.slice(0, 4).map(item => (
                  <li key={item.id} className="group rounded-md border border-border/60 bg-background hover:bg-surface-hover hover:border-border transition-colors p-3 cursor-pointer">
                    <div className="flex items-start gap-2">
                      <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${item.severity === "high" ? "bg-destructive" : item.severity === "medium" ? "bg-warning" : "bg-info"}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-xs font-medium text-foreground truncate">{item.title}</span>
                          <span className="text-[10px] mono text-muted-foreground shrink-0">{item.ts}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">{item.detail}</p>
                        <div className="mt-1 text-[10px] mono uppercase tracking-wider text-muted-foreground/70">from {item.agent}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Top agents table */}
          <section className="mt-6 rounded-lg border border-border bg-surface overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Top performing agents</h2>
              <a href="/agents" className="text-[11px] mono text-accent hover:text-accent-glow inline-flex items-center gap-1">
                View all <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] mono uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="text-left font-normal px-5 py-2.5">Agent</th>
                    <th className="text-left font-normal px-3 py-2.5">Status</th>
                    <th className="text-left font-normal px-3 py-2.5">Model</th>
                    <th className="text-right font-normal px-3 py-2.5">Tasks</th>
                    <th className="text-right font-normal px-3 py-2.5">Success</th>
                    <th className="text-right font-normal px-5 py-2.5">Cost / day</th>
                  </tr>
                </thead>
                <tbody>
                  {topAgents.map(a => (
                    <tr key={a.id} className="border-b border-border/50 last:border-0 hover:bg-surface-hover transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-accent/30 to-accent-glow/20 grid place-items-center text-[11px] font-semibold text-foreground">
                            {a.name[0]}
                          </div>
                          <div className="leading-tight">
                            <div className="text-xs font-medium text-foreground">{a.name}</div>
                            <div className="text-[10px] text-muted-foreground">{a.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3"><StatusBadge status={a.status} /></td>
                      <td className="px-3 py-3"><span className="text-[11px] mono text-muted-foreground">{a.model}</span></td>
                      <td className="px-3 py-3 text-right text-xs text-foreground mono">{a.tasksCompleted.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right text-xs text-foreground mono">{a.successRate}%</td>
                      <td className="px-5 py-3 text-right text-xs text-foreground mono">${a.costToday.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </OSLayout>
  );
};

export default Dashboard;
