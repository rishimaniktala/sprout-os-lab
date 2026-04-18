import { cn } from "@/lib/utils";
import type { AgentStatus } from "@/lib/mock-data";

const map: Record<AgentStatus, { dot: string; label: string; text: string }> = {
  active:  { dot: "bg-success",     label: "Active",  text: "text-success" },
  idle:    { dot: "bg-muted-foreground", label: "Idle",    text: "text-muted-foreground" },
  error:   { dot: "bg-destructive", label: "Error",   text: "text-destructive" },
  paused:  { dot: "bg-warning",     label: "Paused",  text: "text-warning" },
};

export function StatusBadge({ status, className }: { status: AgentStatus; className?: string }) {
  const s = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] mono uppercase tracking-wider", s.text, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}
