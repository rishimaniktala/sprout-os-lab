import { OSLayout } from "@/components/os/OSLayout";
import { portfolio, vcRecommendations, portfolioThemes } from "@/lib/mock-data";
import { Briefcase, Sparkles, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";

const toneRing = {
  success: "ring-success/30",
  warning: "ring-warning/30",
  destructive: "ring-destructive/30",
  info: "ring-info/30",
} as const;
const toneText = {
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  info: "text-info",
} as const;

const Portfolio = () => {
  return (
    <OSLayout>
      <div className="px-6 py-8 max-w-[1400px] mx-auto animate-fade-in">
        <header className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">
              <Briefcase className="h-3 w-3 text-electric" /> VC Command Center
            </div>
            <h1 className="mt-2 text-[28px] leading-tight font-semibold tracking-tight text-foreground">
              Portfolio Intelligence
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              One partner. Fifty companies. Real-time health, growth, and execution velocity across the entire portfolio.
            </p>
          </div>
          <div className="flex gap-2">
            <Stat label="Companies" value={`${portfolio.length}`} />
            <Stat label="Combined MRR" value={`€${(portfolio.reduce((s, p) => s + p.mrr, 0) / 1000).toFixed(0)}k`} />
            <Stat label="Avg health" value={`${Math.round(portfolio.reduce((s, p) => s + p.health, 0) / portfolio.length)}`} />
          </div>
        </header>

        <div className="grid grid-cols-12 gap-4">
          <section className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {portfolio.map((co) => (
              <article key={co.id} className={`glass-card rounded-xl p-4 ring-1 ${toneRing[co.tone]} hover:border-strong transition-colors`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{co.name}</div>
                    <div className="text-[10px] mono uppercase tracking-wider text-muted-foreground">{co.sector}</div>
                  </div>
                  <HealthRing value={co.health} />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Mini label="MRR" value={`€${(co.mrr / 1000).toFixed(0)}k`} />
                  <Mini label="MoM" value={`${co.mrrDelta >= 0 ? "+" : ""}${co.mrrDelta}%`} accent={co.mrrDelta >= 0 ? "success" : "destructive"} />
                  <Mini label="Runway" value={`${co.runwayMonths}mo`} accent={co.runwayMonths < 9 ? "destructive" : co.runwayMonths < 12 ? "warning" : "muted"} />
                </div>
                <div className={`mt-3 flex items-center gap-2 text-[11px] ${toneText[co.tone]}`}>
                  {co.tone === "destructive" || co.tone === "warning" ? <AlertTriangle className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                  <span>{co.signal}</span>
                </div>
              </article>
            ))}
          </section>

          <aside className="col-span-12 lg:col-span-4 space-y-4">
            <div className="glass-card-strong rounded-xl p-5 relative overflow-hidden">
              <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-electric/20 blur-3xl" />
              <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-violet" /> AI Recommendations
              </div>
              <ul className="mt-3 space-y-2.5">
                {vcRecommendations.map((r) => (
                  <li key={r.id} className="group flex items-start gap-2.5 rounded-md border border-border/60 bg-surface/60 px-3 py-2.5 hover:border-strong cursor-pointer transition-colors">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-foreground leading-snug">{r.text}</div>
                      <div className="text-[10px] mono text-muted-foreground mt-0.5">{r.company}</div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors mt-1" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" /> Emerging themes
              </div>
              <ul className="mt-3 space-y-3">
                {portfolioThemes.map((t) => (
                  <li key={t.id}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground/90">{t.text}</span>
                      <span className="mono text-muted-foreground">{Math.round(t.strength * 100)}%</span>
                    </div>
                    <div className="mt-1.5 h-1 w-full rounded-full bg-surface-hover overflow-hidden">
                      <div className="h-full gradient-accent rounded-full" style={{ width: `${t.strength * 100}%` }} />
                    </div>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-1.5">
      <div className="text-[9px] mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-foreground mono">{value}</div>
    </div>
  );
}

function Mini({ label, value, accent = "muted" }: { label: string; value: string; accent?: "muted" | "success" | "warning" | "destructive" }) {
  const c = {
    muted: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  }[accent];
  return (
    <div className="rounded-md border border-border/60 bg-surface/60 px-2 py-1.5">
      <div className="text-[9px] mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-xs font-semibold mono ${c}`}>{value}</div>
    </div>
  );
}

function HealthRing({ value }: { value: number }) {
  const r = 18, c = 2 * Math.PI * r, off = c - (value / 100) * c;
  const stroke = value >= 80 ? "hsl(var(--success))" : value >= 65 ? "hsl(var(--electric))" : value >= 50 ? "hsl(var(--warning))" : "hsl(var(--destructive))";
  return (
    <div className="relative h-12 w-12">
      <svg viewBox="0 0 44 44" className="h-12 w-12 -rotate-90">
        <circle cx="22" cy="22" r={r} stroke="hsl(var(--border))" strokeWidth="3" fill="none" />
        <circle cx="22" cy="22" r={r} stroke={stroke} strokeWidth="3" fill="none"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-[11px] font-semibold mono text-foreground">{value}</div>
    </div>
  );
}

export default Portfolio;
