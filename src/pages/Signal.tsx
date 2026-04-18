import { OSLayout } from "@/components/os/OSLayout";
import { Radio, Construction } from "lucide-react";

const Signal = () => (
  <OSLayout>
    <div className="px-6 py-8 max-w-[1400px] mx-auto animate-fade-in">
      <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">
        <Radio className="h-3 w-3 text-violet" /> Signal Engine
      </div>
      <h1 className="mt-2 text-[28px] leading-tight font-semibold tracking-tight text-foreground">
        Raw Input → Signal → Narrative
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Phase 2 — transform memory & metrics into investor updates, growth insights, and product narratives.
      </p>

      <div className="mt-8 glass-card rounded-xl p-10 text-center">
        <Construction className="h-8 w-8 text-violet mx-auto" />
        <div className="mt-3 text-sm font-medium text-foreground">Coming in Phase 2</div>
        <div className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
          The Signal Engine will pipeline AI outputs and memory insights into narratives,
          tone-tuned for investors, builders, or technical audiences, then route them to LinkedIn, X, and email.
        </div>
      </div>
    </div>
  </OSLayout>
);

export default Signal;
