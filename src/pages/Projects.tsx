import { OSLayout } from "@/components/os/OSLayout";
import { projects } from "@/lib/mock-data";
import { Plus } from "lucide-react";

const statusStyles: Record<string, string> = {
  "on-track": "text-success border-success/30 bg-success/10",
  "at-risk":  "text-warning border-warning/30 bg-warning/10",
  "blocked":  "text-destructive border-destructive/30 bg-destructive/10",
  "shipped":  "text-info border-info/30 bg-info/10",
};

const Projects = () => (
  <OSLayout>
    <div className="px-6 py-8 max-w-[1400px] mx-auto animate-fade-in">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">Execution</div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Initiatives staffed by agents and humans.</p>
        </div>
        <button className="h-8 px-3 rounded-md text-xs gradient-accent text-accent-foreground font-medium inline-flex items-center gap-1.5">
          <Plus className="h-3 w-3" /> New project
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map(p => (
          <article key={p.id} className="rounded-lg border border-border bg-surface p-5 hover:bg-surface-elevated transition-colors group">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-foreground leading-snug text-balance">{p.name}</h3>
              <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] mono uppercase tracking-wider ${statusStyles[p.status]}`}>
                {p.status}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-[10px] mono text-muted-foreground mb-1.5">
                <span>Progress</span>
                <span className="text-foreground">{p.progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${p.status === "blocked" ? "bg-destructive" : p.status === "at-risk" ? "bg-warning" : "gradient-accent"}`}
                  style={{ width: `${p.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] mono">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">Lead <span className="text-foreground">{p.owner}</span></span>
                <span className="text-muted-foreground">{p.agentsAssigned} agents</span>
              </div>
              <span className="text-muted-foreground">due {p.dueIn}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  </OSLayout>
);

export default Projects;
