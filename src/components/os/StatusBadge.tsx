import { cn } from "@/lib/utils";
import type { ModelStatus } from "@/lib/mock-data";

const map: Record<ModelStatus, { dot: string; label: string; text: string }> = {
  active:     { dot: "bg-success",          label: "Active",     text: "text-success" },
  running:    { dot: "bg-electric",         label: "Running",    text: "text-electric" },
  live:       { dot: "bg-violet",           label: "Live",       text: "text-violet" },
  processing: { dot: "bg-info",             label: "Processing", text: "text-info" },
  idle:       { dot: "bg-muted-foreground", label: "Idle",       text: "text-muted-foreground" },
  paused:     { dot: "bg-warning",          label: "Paused",     text: "text-warning" },
};

export function StatusBadge({ status, className }: { status: ModelStatus; className?: string }) {
  const s = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] mono uppercase tracking-wider", s.text, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full pulse-dot", s.dot)} />
      {s.label}
    </span>
  );
}
