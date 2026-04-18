import { OSLayout } from "@/components/os/OSLayout";
import { StatusBadge } from "@/components/os/StatusBadge";
import { agents, teams } from "@/lib/mock-data";
import { Plus, Filter } from "lucide-react";
import { useState } from "react";

const Agents = () => {
  const [team, setTeam] = useState<string>("all");
  const filtered = team === "all" ? agents : agents.filter(a => a.team === team);

  return (
    <OSLayout>
      <div className="px-6 py-8 max-w-[1400px] mx-auto animate-fade-in">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">Workforce</div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Agents</h1>
            <p className="mt-1 text-sm text-muted-foreground">{agents.length} agents across {teams.length} teams.</p>
          </div>
          <button className="h-8 px-3 rounded-md text-xs gradient-accent text-accent-foreground font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity">
            <Plus className="h-3 w-3" /> New agent
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] mono uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
            <Filter className="h-3 w-3" /> Team
          </span>
          {["all", ...teams].map(t => (
            <button
              key={t}
              onClick={() => setTeam(t)}
              className={`h-7 px-2.5 rounded-md text-[11px] mono border transition-colors ${
                team === t
                  ? "border-accent/50 bg-accent/10 text-foreground"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(a => (
            <article key={a.id} className="group relative rounded-lg border border-border bg-surface p-4 hover:bg-surface-elevated hover:border-border-strong transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-md bg-gradient-to-br from-accent/30 to-accent-glow/20 grid place-items-center text-sm font-semibold text-foreground">
                    {a.name[0]}
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-medium text-foreground">{a.name}</div>
                    <div className="text-[11px] text-muted-foreground">{a.role}</div>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
                <div>
                  <dt className="mono uppercase tracking-wider text-muted-foreground/70">Model</dt>
                  <dd className="mt-0.5 mono text-foreground">{a.model}</dd>
                </div>
                <div>
                  <dt className="mono uppercase tracking-wider text-muted-foreground/70">Team</dt>
                  <dd className="mt-0.5 text-foreground">{a.team}</dd>
                </div>
                <div>
                  <dt className="mono uppercase tracking-wider text-muted-foreground/70">Tasks</dt>
                  <dd className="mt-0.5 mono text-foreground">{a.tasksCompleted.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="mono uppercase tracking-wider text-muted-foreground/70">Success</dt>
                  <dd className="mt-0.5 mono text-foreground">{a.successRate}%</dd>
                </div>
              </dl>

              <div className="mt-4">
                <div className="flex justify-between text-[10px] mono text-muted-foreground mb-1">
                  <span>Uptime</span>
                  <span>{a.uptime}%</span>
                </div>
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full gradient-accent" style={{ width: `${a.uptime}%` }} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[10px] mono">
                <span className="text-muted-foreground">{a.tasksActive} active · {a.lastActivity}</span>
                <span className="text-foreground">${a.costToday.toFixed(2)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </OSLayout>
  );
};

export default Agents;
