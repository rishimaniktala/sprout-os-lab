import { OSLayout } from "@/components/os/OSLayout";
import { TrendingUp, Construction } from "lucide-react";

const Growth = () => (
  <OSLayout>
    <div className="px-6 py-8 max-w-[1400px] mx-auto animate-fade-in">
      <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">
        <TrendingUp className="h-3 w-3 text-electric" /> Growth Engine
      </div>
      <h1 className="mt-2 text-[28px] leading-tight font-semibold tracking-tight text-foreground">
        Goal → Ideas → Results → Decision
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Phase 2 — autonomous growth experimentation pipeline.
      </p>

      <div className="mt-8 glass-card rounded-xl p-10 text-center">
        <Construction className="h-8 w-8 text-electric mx-auto" />
        <div className="mt-3 text-sm font-medium text-foreground">Coming in Phase 2</div>
        <div className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
          The Growth Engine will run a 4-step loop: input a goal & audience, generate ideas,
          measure results, and let the AI decide whether to scale, stop, or iterate.
        </div>
      </div>
    </div>
  </OSLayout>
);

export default Growth;
