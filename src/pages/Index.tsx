import { OSLayout } from "@/components/os/OSLayout";
import { ModelAvatar, modelAccent } from "@/components/os/ModelAvatar";
import {
  founder, alerts, priorities, briefingChips, aiModels,
} from "@/lib/mock-data";
import {
  ArrowUp, ArrowDown, Sparkles, Activity, Wallet, Zap, Heart, AlertTriangle,
  CheckCircle2, Clock, ArrowRight, TrendingUp,
} from "lucide-react";
import { useState } from "react";

const fmtEur = (n: number) => `€${n.toLocaleString("en-GB")}`;

const toneIcon = {
  warning: AlertTriangle,
  success: TrendingUp,
  destructive: AlertTriangle,
} as const;
const toneClass = {
  warning: "text-warning",
  success: "text-success",
  destructive: "text-destructive",
} as const;

const Index = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <OSLayout>
      <div className="px-6 py-8 max-w-[1400px] mx-auto animate-fade-in">
        {/* Hero */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-electric" />
            Daily Briefing · {new Date().toLocaleDateString("en-GB", { weekday: "long", month: "short", day: "numeric" })}
          </div>
          <h1 className="mt-3 text-[34px] leading-[1.05] font-semibold tracking-tight text-foreground">
            Good morning, {founder.name}.
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground max-w-2xl">
            Your AI workforce completed{" "}
            <span className="text-foreground font-medium">{founder.briefing.completedOvernight} tasks</span>{" "}
            overnight. <span className="text-success">{founder.briefing.growthOpps} growth opportunities</span> found,{" "}
            <span className="text-destructive">{founder.briefing.churnRisks} churn risk</span> detected,{" "}
            <span className="text-foreground">{founder.briefing.meetingsPrepared} meetings</span> prepared automatically.
          </p>

          {/* Prompt */}
          <form onSubmit={(e) => e.preventDefault()} className="mt-6 relative max-w-3xl">
            <div className="glass-card-strong rounded-xl p-1.5 flex items-center gap-2">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What should the AI team research today?"
                className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              <button className="h-9 px-3 rounded-lg gradient-accent text-accent-foreground text-xs font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity">
                Dispatch <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {briefingChips.map((c) => (
                <button
                  key={c}
                  onClick={() => setPrompt(c)}
                  className="text-[11px] mono px-2.5 py-1 rounded-full border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-hover hover:border-border-strong transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>
          </form>
        </header>

        {/* KPI grid */}
        <section className="grid grid-cols-12 gap-4">
          <KPICard className="col-span-12 md:col-span-3" icon={Heart} label="Startup Health" value={`${founder.health}`} suffix="/100"
            footer={<HealthBar value={founder.health} />} />
          <KPICard className="col-span-12 md:col-span-3" icon={Activity} label="MRR" value={fmtEur(founder.mrr)}
            footer={<Delta value={founder.mrrGrowth} suffix="% MoM" />} />
          <KPICard className="col-span-6 md:col-span-3" icon={Clock} label="Runway" value={`${founder.runwayMonths}`} suffix=" months"
            footer={<span className="text-[11px] text-muted-foreground mono">at current burn · €38k/mo</span>} />
          <KPICard className="col-span-6 md:col-span-3" icon={Wallet} label="AI Spend Today" value={`€${founder.spendToday.toFixed(2)}`}
            footer={<span className="text-[11px] text-success mono">saved {founder.spendSavedPct}% via multi-model routing</span>} />

          {/* Velocity */}
          <div className="col-span-12 md:col-span-4 glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
                <Zap className="h-3.5 w-3.5" /> Execution Velocity
              </div>
              <span className="text-[10px] mono text-muted-foreground">this week</span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-3xl font-semibold tracking-tight">{founder.velocityWeek}</div>
                <div className="text-xs text-muted-foreground mt-0.5">tasks completed</div>
              </div>
              <Sparkline />
            </div>
          </div>

          {/* Alerts */}
          <div className="col-span-12 md:col-span-4 glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5" /> Alerts
              </div>
              <span className="text-[10px] mono text-muted-foreground">{alerts.length} signals</span>
            </div>
            <ul className="space-y-2.5">
              {alerts.map((a) => {
                const Icon = toneIcon[a.severity];
                return (
                  <li key={a.id} className="flex items-start gap-2.5 text-xs">
                    <Icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${toneClass[a.severity]}`} />
                    <span className="text-foreground/90 leading-relaxed">{a.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Priorities */}
          <div className="col-span-12 md:col-span-4 glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" /> Today's Priorities
              </div>
            </div>
            <ul className="space-y-2">
              {priorities.map((p) => (
                <li key={p.id} className="flex items-center gap-2.5 rounded-md border border-border/60 bg-surface/60 px-2.5 py-2">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-border bg-surface accent-electric" />
                  <span className="text-xs text-foreground flex-1 truncate">{p.text}</span>
                  <ModelAvatar name={p.owner} accent={modelAccent(p.owner)} size="sm" />
                  <span className="text-[10px] mono text-muted-foreground w-12 text-right">{p.due}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI workforce strip */}
          <div className="col-span-12 glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" /> AI Workforce · live
              </div>
              <a href="/workforce" className="text-[11px] text-electric hover:underline">Open control center →</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {aiModels.map((m) => (
                <div key={m.id} className="rounded-lg border border-border bg-surface/60 p-3 hover:bg-surface-hover transition-colors">
                  <div className="flex items-center gap-2">
                    <ModelAvatar name={m.name} accent={m.accent} size="sm" />
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-foreground truncate">{m.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate mono">{m.tasksActive} active</div>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-muted-foreground/80 line-clamp-2 leading-snug">
                    {m.tasks[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </OSLayout>
  );
};

function KPICard({
  icon: Icon, label, value, suffix, footer, className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; suffix?: string; footer?: React.ReactNode; className?: string;
}) {
  return (
    <div className={`glass-card rounded-xl p-5 ${className ?? ""}`}>
      <div className="flex items-center justify-between text-[11px] mono uppercase tracking-wider text-muted-foreground">
        <span className="flex items-center gap-2"><Icon className="h-3.5 w-3.5" /> {label}</span>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <div className="text-3xl font-semibold tracking-tight text-foreground">{value}</div>
        {suffix && <div className="text-sm text-muted-foreground">{suffix}</div>}
      </div>
      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}

function Delta({ value, suffix }: { value: number; suffix?: string }) {
  const up = value >= 0;
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <div className={`inline-flex items-center gap-1 text-[11px] mono ${up ? "text-success" : "text-destructive"}`}>
      <Icon className="h-3 w-3" />
      {Math.abs(value)}{suffix}
    </div>
  );
}

function HealthBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-surface-hover overflow-hidden">
      <div className="h-full rounded-full gradient-accent" style={{ width: `${value}%` }} />
    </div>
  );
}

function Sparkline() {
  const pts = [4, 7, 5, 9, 6, 11, 8, 12, 10, 14, 13, 17];
  const max = Math.max(...pts);
  const w = 120, h = 36;
  const d = pts.map((p, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - (p / max) * h;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id="sl" x1="0" x2="1">
          <stop offset="0%" stopColor="hsl(var(--electric))" />
          <stop offset="100%" stopColor="hsl(var(--violet))" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="url(#sl)" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

export default Index;
