import { OSLayout } from "@/components/os/OSLayout";
import { ModelAvatar } from "@/components/os/ModelAvatar";
import { StatusBadge } from "@/components/os/StatusBadge";
import { aiModels, taskPipeline } from "@/lib/mock-data";
import { Activity, Cpu, Gauge, Pause, Play, Settings2, Zap } from "lucide-react";

const Workforce = () => {
  return (
    <OSLayout>
      <div className="px-6 py-8 max-w-[1400px] mx-auto animate-fade-in">
        <header className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">
              <Cpu className="h-3 w-3 text-electric" /> Control Center
            </div>
            <h1 className="mt-2 text-[28px] leading-tight font-semibold tracking-tight text-foreground">
              AI Workforce
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Real models routed by cost, speed, and capability. Multi-model orchestration is on.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Stat label="Active models" value={`${aiModels.filter(m => m.status === "active" || m.status === "running" || m.status === "live" || m.status === "processing").length}/${aiModels.length}`} />
            <Stat label="Tasks / hr" value="142" />
            <Stat label="Spend / hr" value="€2.18" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {aiModels.map((m) => (
            <div key={m.id} className="glass-card rounded-xl p-5 hover:border-strong transition-colors group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <ModelAvatar name={m.name} accent={m.accent} size="lg" />
                  <div>
                    <div className="text-sm font-semibold text-foreground tracking-tight">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground mono">{m.vendor}</div>
                  </div>
                </div>
                <StatusBadge status={m.status} />
              </div>

              <p className="mt-3 text-xs text-muted-foreground">{m.role}</p>

              <ul className="mt-4 space-y-1.5">
                {m.tasks.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-foreground/90">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-electric shrink-0" />
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <Mini label="Active" value={m.tasksActive} />
                <Mini label="Success" value={`${m.successRate}%`} />
                <Mini label="Cost / task" value={`€${m.costPerTask.toFixed(3)}`} />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] mono uppercase tracking-wider text-muted-foreground">
                  €{m.costToday.toFixed(2)} today
                </span>
                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <button className="h-7 w-7 grid place-items-center rounded-md hover:bg-surface-hover text-muted-foreground hover:text-foreground" title="Pause"><Pause className="h-3.5 w-3.5" /></button>
                  <button className="h-7 w-7 grid place-items-center rounded-md hover:bg-surface-hover text-muted-foreground hover:text-foreground" title="Run"><Play className="h-3.5 w-3.5" /></button>
                  <button className="h-7 w-7 grid place-items-center rounded-md hover:bg-surface-hover text-muted-foreground hover:text-foreground" title="Configure"><Settings2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline */}
        <section className="mt-6 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
              <Activity className="h-3.5 w-3.5" /> Task Pipeline
            </div>
            <span className="text-[10px] mono text-muted-foreground">live</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Pipe label="Queued" value={taskPipeline.queued} tone="muted" />
            <Pipe label="Running" value={taskPipeline.running} tone="electric" />
            <Pipe label="Awaiting Approval" value={taskPipeline.awaitingApproval} tone="warning" />
            <Pipe label="Completed" value={taskPipeline.completed} tone="success" />
          </div>
        </section>
      </div>
    </OSLayout>
  );
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-1.5">
      <div className="text-[9px] mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-foreground mono">{value}</div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-border/60 bg-surface/60 px-2 py-1.5">
      <div className="text-[9px] mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xs font-semibold text-foreground mono">{value}</div>
    </div>
  );
}

function Pipe({ label, value, tone }: { label: string; value: number; tone: "muted" | "electric" | "warning" | "success" }) {
  const ring = {
    muted: "ring-border",
    electric: "ring-electric/40 bg-electric/5",
    warning: "ring-warning/40 bg-warning/5",
    success: "ring-success/40 bg-success/5",
  }[tone];
  const text = {
    muted: "text-muted-foreground",
    electric: "text-electric",
    warning: "text-warning",
    success: "text-success",
  }[tone];
  return (
    <div className={`rounded-lg ring-1 ${ring} px-4 py-3`}>
      <div className={`text-[10px] mono uppercase tracking-wider ${text}`}>{label}</div>
      <div className="mt-1 text-2xl font-semibold text-foreground tracking-tight mono">{value}</div>
    </div>
  );
}

export default Workforce;
