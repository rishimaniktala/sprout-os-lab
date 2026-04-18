import { OSLayout } from "@/components/os/OSLayout";
import { ModelAvatar } from "@/components/os/ModelAvatar";
import { StatusBadge } from "@/components/os/StatusBadge";
import { departments, type Department, type DeptAgent } from "@/lib/workforce-data";
import { taskPipeline } from "@/lib/mock-data";
import {
  Activity, Cpu, Megaphone, Search, Code2, Briefcase, Settings2,
  Wallet, Pause, Play, SlidersHorizontal,
} from "lucide-react";

const deptIcon = {
  marketing:   Megaphone,
  research:    Search,
  engineering: Code2,
  sales:       Briefcase,
  ops:         Settings2,
  finance:     Wallet,
} as const;

const Workforce = () => {
  const allAgents = departments.flatMap((d) => d.agents);
  const activeCount = allAgents.filter((a) =>
    ["active", "running", "live", "processing"].includes(a.status),
  ).length;
  const totalSpend = allAgents.reduce((s, a) => s + a.costToday, 0);

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
              Agents organized by department. Multiple models — and multiple versions of the same model — work side by side.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Stat label="Active agents" value={`${activeCount}/${allAgents.length}`} />
            <Stat label="Departments" value={`${departments.length}`} />
            <Stat label="Spend today" value={`€${totalSpend.toFixed(2)}`} />
          </div>
        </header>

        <div className="space-y-6">
          {departments.map((dept) => (
            <DepartmentSection key={dept.id} dept={dept} />
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

function DepartmentSection({ dept }: { dept: Department }) {
  const Icon = deptIcon[dept.icon];
  const activeAgents = dept.agents.filter((a) =>
    ["active", "running", "live", "processing"].includes(a.status),
  ).length;

  const accentStyles: Record<Department["accent"], { wrap: string; icon: string }> = {
    electric: { wrap: "bg-electric/10 ring-electric/30",       icon: "text-electric" },
    violet:   { wrap: "bg-violet/10 ring-violet/30",           icon: "text-violet" },
    emerald:  { wrap: "bg-success/10 ring-success/30",         icon: "text-success" },
    amber:    { wrap: "bg-warning/10 ring-warning/30",         icon: "text-warning" },
    sky:      { wrap: "bg-info/10 ring-info/30",               icon: "text-info" },
    rose:     { wrap: "bg-destructive/10 ring-destructive/30", icon: "text-destructive" },
  };
  const styles = accentStyles[dept.accent];

  return (
    <section className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-lg grid place-items-center ring-1 ${styles.wrap}`}>
            <Icon className={`h-4 w-4 ${styles.icon}`} />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">{dept.name}</h2>
            <p className="text-[11px] text-muted-foreground">{dept.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] mono uppercase tracking-wider text-muted-foreground">
            {activeAgents}/{dept.agents.length} active
          </span>
          <button className="h-7 px-2 grid place-items-center rounded-md hover:bg-surface-hover text-muted-foreground hover:text-foreground" title="Configure department">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {dept.agents.map((a) => (
          <AgentCard key={a.id} agent={a} />
        ))}
      </div>
    </section>
  );
}

function AgentCard({ agent: a }: { agent: DeptAgent }) {
  return (
    <div className="rounded-lg border border-border/60 bg-surface/40 p-4 hover:border-strong transition-colors group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <ModelAvatar name={a.baseModel} accent={a.accent} size="md" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground tracking-tight truncate">
              {a.baseModel} <span className="text-muted-foreground font-normal">· {a.version}</span>
            </div>
            <div className="text-[10px] text-muted-foreground mono truncate">{a.vendor}</div>
          </div>
        </div>
        <StatusBadge status={a.status} />
      </div>

      <p className="mt-2.5 text-[12px] text-muted-foreground leading-relaxed">{a.role}</p>

      <div className="mt-3 rounded-md border border-border/40 bg-surface/60 px-2.5 py-2">
        <div className="text-[9px] mono uppercase tracking-wider text-muted-foreground">Current task</div>
        <div className="text-[12px] text-foreground/90 leading-snug mt-0.5">{a.currentTask}</div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <Mini label="Active" value={a.tasksActive} />
        <Mini label="Success" value={`${a.successRate}%`} />
        <Mini label="€/task" value={a.costPerTask < 0.01 ? a.costPerTask.toFixed(4) : a.costPerTask.toFixed(3)} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] mono uppercase tracking-wider text-muted-foreground">
          €{a.costToday.toFixed(2)} today
        </span>
        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <button className="h-6 w-6 grid place-items-center rounded-md hover:bg-surface-hover text-muted-foreground hover:text-foreground" title="Pause"><Pause className="h-3 w-3" /></button>
          <button className="h-6 w-6 grid place-items-center rounded-md hover:bg-surface-hover text-muted-foreground hover:text-foreground" title="Run"><Play className="h-3 w-3" /></button>
        </div>
      </div>
    </div>
  );
}

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
    <div className="rounded-md border border-border/60 bg-surface/60 px-2 py-1">
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
