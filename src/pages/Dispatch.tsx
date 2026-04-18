import { OSLayout } from "@/components/os/OSLayout";
import { ModelAvatar, modelAccent } from "@/components/os/ModelAvatar";
import { StatusBadge } from "@/components/os/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { useWorkforceStore, inferDepartmentId } from "@/stores/workforce-store";
import { ArrowRight, Plus, Send, Sparkles, X, Check, Play, Loader2, Cpu, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

interface Subtask {
  id: string;
  title: string;
  description: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  /** Display name of the assigned agent ("ChatGPT 5.2"). Empty string if unassigned. */
  agent: string;
  /** Base model ("ChatGPT", "Claude", etc.) — used for the avatar. */
  model: string;
  /** Concrete agent id from the workforce store. Empty if no idle agent was available. */
  agentId: string;
  /** Department the agent lives in. */
  departmentId: string;
  state: "proposed" | "accepted" | "running" | "done" | "unassigned";
  log?: string[];
}

const priorityClass: Record<Subtask["priority"], string> = {
  Critical: "text-destructive border-destructive/40 bg-destructive/10",
  High:     "text-warning border-warning/40 bg-warning/10",
  Medium:   "text-electric border-electric/40 bg-electric/10",
  Low:      "text-muted-foreground border-border bg-surface",
};

const promptChips = [
  "Plan a Series A raise in 6 weeks",
  "Reduce churn by 20% this quarter",
  "Launch in the German market",
  "Investigate why CAC rose 12%",
];

const Dispatch = () => {
  const [params] = useSearchParams();
  const [prompt, setPrompt] = useState(params.get("q") ?? "");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const autoRan = useRef(false);

  const departments = useWorkforceStore((s) => s.departments);
  const findIdleAgent = useWorkforceStore((s) => s.findIdleAgent);
  const assignTask = useWorkforceStore((s) => s.assignTask);
  const releaseAgent = useWorkforceStore((s) => s.releaseAgent);

  /**
   * Reserve an idle agent for a proposed subtask.
   * We don't flip status to "running" yet — that happens on Execute.
   * But we *do* preview which agent will handle it.
   */
  const reserveAgentForProposal = (
    title: string,
    description: string,
    alreadyReservedIds: Set<string>,
  ) => {
    const deptHint = inferDepartmentId(`${title} ${description}`);
    // Try preferred dept first
    const tryDept = (deptId?: string) => {
      const result = findIdleAgent(deptId);
      if (result && !alreadyReservedIds.has(result.agent.id)) return result;
      // If preferred returned an already-reserved agent, walk all depts manually
      for (const d of departments) {
        if (deptId && d.id !== deptId) continue;
        const a = d.agents.find(
          (x) =>
            (x.status === "idle" || x.status === "paused") &&
            !alreadyReservedIds.has(x.id),
        );
        if (a) return { agent: a, department: d };
      }
      return null;
    };
    return tryDept(deptHint) ?? tryDept(undefined);
  };

  const breakdown = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("dispatch", {
        body: { mode: "breakdown", prompt: text },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const incoming = ((data as any)?.subtasks ?? []) as Array<{
        title: string;
        description: string;
        priority: Subtask["priority"];
        agent: string;
        model: string;
      }>;

      const reserved = new Set<string>();
      const next: Subtask[] = incoming.map((s, i) => {
        const reservation = reserveAgentForProposal(s.title, s.description, reserved);
        if (reservation) {
          reserved.add(reservation.agent.id);
          return {
            ...s,
            id: `t-${Date.now()}-${i}`,
            agent: reservation.agent.name,
            model: reservation.agent.baseModel,
            agentId: reservation.agent.id,
            departmentId: reservation.department.id,
            state: "proposed",
          };
        }
        return {
          ...s,
          id: `t-${Date.now()}-${i}`,
          agent: "—",
          model: s.model,
          agentId: "",
          departmentId: "",
          state: "unassigned",
        };
      });

      setSubtasks(next);
      if (!incoming.length) toast.message("No subtasks returned");
      const unassignedCount = next.filter((s) => s.state === "unassigned").length;
      if (unassignedCount > 0) {
        toast.warning(
          `${unassignedCount} subtask${unassignedCount === 1 ? "" : "s"} couldn't be auto-assigned — no idle agents available.`,
        );
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Dispatch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = params.get("q");
    if (q && !autoRan.current) {
      autoRan.current = true;
      breakdown(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const accept = (id: string) =>
    setSubtasks((p) => p.map((s) => (s.id === id ? { ...s, state: "accepted" } : s)));

  const cancel = (id: string) => setSubtasks((p) => p.filter((s) => s.id !== id));

  const acceptedAgentIds = useMemo(
    () =>
      new Set(
        subtasks
          .filter((s) => s.state !== "proposed" && s.state !== "unassigned")
          .map((s) => s.agentId),
      ),
    [subtasks],
  );

  const executeAll = async () => {
    if (executing) return;
    const queue = subtasks.filter((s) => s.state === "accepted" && s.agentId);
    if (!queue.length) {
      toast.message("Accept some subtasks first");
      return;
    }
    setExecuting(true);
    for (const t of queue) {
      // Flip the workforce agent to "running"
      const ok = assignTask(t.agentId, t.title);
      if (!ok) {
        setSubtasks((p) =>
          p.map((s) =>
            s.id === t.id
              ? { ...s, log: [...(s.log ?? []), `agent ${t.agent} no longer idle — skipped`] }
              : s,
          ),
        );
        continue;
      }
      setSubtasks((p) =>
        p.map((s) => (s.id === t.id ? { ...s, state: "running", log: ["dispatching…"] } : s)),
      );
      const steps = [
        `routing to ${t.agent}`,
        `model: ${t.model}`,
        `analyzing context`,
        `writing output`,
        `committing to memory`,
      ];
      for (const step of steps) {
        await new Promise((r) => setTimeout(r, 350));
        setSubtasks((p) =>
          p.map((s) => (s.id === t.id ? { ...s, log: [...(s.log ?? []), step] } : s)),
        );
      }
      // Release the agent back to idle
      releaseAgent(t.agentId);
      setSubtasks((p) => p.map((s) => (s.id === t.id ? { ...s, state: "done" } : s)));
    }
    setExecuting(false);
    toast.success("All accepted subtasks executed");
  };

  // Right-rail: flat list of all agents, sorted idle-last
  const allAgents = useMemo(
    () =>
      departments.flatMap((d) =>
        d.agents.map((a) => ({ ...a, departmentName: d.name })),
      ),
    [departments],
  );

  return (
    <OSLayout>
      <div className="px-6 py-8 max-w-[1400px] mx-auto animate-fade-in">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-electric" /> Dispatch
          </div>
          <h1 className="mt-2 text-[28px] leading-tight font-semibold tracking-tight text-foreground">
            What do you want to do today?
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your request will be broken into prioritized subtasks and routed to idle agents in your AI workforce.
          </p>
        </header>

        {/* Prompt */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            breakdown(prompt);
          }}
          className="glass-card-strong rounded-xl p-1.5 flex items-center gap-2"
        >
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Plan our Series A raise in 6 weeks"
            className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-9 px-3 rounded-lg gradient-accent text-accent-foreground text-xs font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            {loading ? "Planning…" : "Dispatch"}
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {promptChips.map((c) => (
            <button
              key={c}
              onClick={() => setPrompt(c)}
              className="text-[11px] mono px-2.5 py-1 rounded-full border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-hover hover:border-border-strong transition-colors"
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-12 gap-4">
          {/* Subtasks */}
          <section className="col-span-12 lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] mono uppercase tracking-wider text-muted-foreground">
                Task breakdown {subtasks.length > 0 && `· ${subtasks.length}`}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowManual((v) => !v)}
                  className="text-[11px] mono px-2.5 py-1 rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Add subtask manually
                </button>
                <button
                  onClick={executeAll}
                  disabled={executing || !subtasks.some((s) => s.state === "accepted")}
                  className="text-[11px] font-medium px-3 py-1.5 rounded-md gradient-accent text-accent-foreground flex items-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  {executing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                  Execute All Accepted <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {showManual && (
              <ManualForm
                onAdd={(s) => {
                  // Try to find an idle agent in the chosen department
                  const reserved = new Set(
                    subtasks.filter((x) => x.agentId).map((x) => x.agentId),
                  );
                  const reservation = reserveProposalForManual(
                    departments,
                    s.departmentId,
                    reserved,
                  );
                  setSubtasks((p) => [
                    ...p,
                    {
                      ...s,
                      id: `m-${Date.now()}`,
                      agent: reservation?.agent.name ?? "—",
                      model: reservation?.agent.baseModel ?? s.model,
                      agentId: reservation?.agent.id ?? "",
                      departmentId: reservation?.department.id ?? s.departmentId,
                      state: reservation ? "accepted" : "unassigned",
                    },
                  ]);
                  if (!reservation) {
                    toast.warning(`No idle agent in ${s.departmentId} — task left unassigned.`);
                  }
                }}
                onClose={() => setShowManual(false)}
                departments={departments}
              />
            )}

            {!loading && subtasks.length === 0 && (
              <div className="glass-card rounded-xl p-10 text-center text-sm text-muted-foreground">
                Send a request above to see it broken into subtasks for your AI workforce.
              </div>
            )}

            {loading && (
              <div className="glass-card rounded-xl p-6 flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-electric" />
                Dispatcher is decomposing your request…
              </div>
            )}

            <ul className="space-y-3">
              {subtasks.map((t) => (
                <li
                  key={t.id}
                  className={`glass-card rounded-xl p-4 transition-all ${
                    t.state === "accepted" ? "ring-1 ring-electric/30" :
                    t.state === "running" ? "ring-1 ring-violet/40" :
                    t.state === "done" ? "ring-1 ring-success/40 opacity-90" :
                    t.state === "unassigned" ? "ring-1 ring-warning/40" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <ModelAvatar
                        name={t.model || t.agent}
                        accent={modelAccent(t.model || t.agent)}
                        size="md"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${priorityClass[t.priority]}`}>
                            {t.priority}
                          </span>
                          <span className="text-[10px] mono text-muted-foreground">
                            {t.agent}
                            {t.departmentId && ` · ${t.departmentId}`}
                          </span>
                          {t.state === "running" && (
                            <span className="text-[10px] mono text-violet flex items-center gap-1">
                              <span className="pulse-dot bg-violet" /> processing
                            </span>
                          )}
                          {t.state === "done" && (
                            <span className="text-[10px] mono text-success flex items-center gap-1">
                              <Check className="h-3 w-3" /> done
                            </span>
                          )}
                          {t.state === "unassigned" && (
                            <span className="text-[10px] mono text-warning flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> no idle agent
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm font-medium text-foreground">{t.title}</div>
                        <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{t.description}</div>
                        {t.log && t.log.length > 0 && (
                          <div className="mt-3 rounded-md border border-border bg-background/40 p-2 font-mono text-[10px] text-muted-foreground space-y-0.5">
                            {t.log.map((l, i) => <div key={i}>› {l}</div>)}
                          </div>
                        )}
                      </div>
                    </div>
                    {t.state === "proposed" && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => accept(t.id)}
                          className="h-7 px-2 rounded-md text-[11px] mono border border-electric/40 bg-electric/10 text-electric hover:bg-electric/20 transition-colors flex items-center gap-1"
                        >
                          <Check className="h-3 w-3" /> Accept
                        </button>
                        <button
                          onClick={() => cancel(t.id)}
                          className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-destructive hover:bg-surface-hover transition-colors"
                          aria-label="Cancel"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                    {t.state === "unassigned" && (
                      <button
                        onClick={() => cancel(t.id)}
                        className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-destructive hover:bg-surface-hover transition-colors shrink-0"
                        aria-label="Cancel"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Right rail: live agent status from the workforce store */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="glass-card rounded-xl p-4 sticky top-16 max-h-[calc(100vh-5rem)] overflow-y-auto">
              <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground mb-3">
                <Cpu className="h-3.5 w-3.5" /> Workforce status
              </div>
              <ul className="space-y-1.5">
                {allAgents.map((m) => {
                  const assigned = acceptedAgentIds.has(m.id);
                  return (
                    <li
                      key={m.id}
                      className={`flex items-center gap-2.5 rounded-md border px-2.5 py-2 transition-all ${
                        assigned ? "border-electric/40 bg-electric/5" : "border-border bg-surface/60"
                      }`}
                    >
                      <ModelAvatar name={m.baseModel} accent={m.accent} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-foreground truncate">
                          {m.baseModel} <span className="text-muted-foreground font-normal">· {m.version}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {m.departmentName} · {m.currentTask}
                        </div>
                      </div>
                      <StatusBadge status={m.status} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </OSLayout>
  );
};

/** Manual-add helper: find an idle agent in the chosen department, ignoring already-reserved ids. */
function reserveProposalForManual(
  departments: ReturnType<typeof useWorkforceStore.getState>["departments"],
  departmentId: string,
  reservedIds: Set<string>,
) {
  const dept = departments.find((d) => d.id === departmentId);
  if (!dept) return null;
  const a = dept.agents.find(
    (x) => (x.status === "idle" || x.status === "paused") && !reservedIds.has(x.id),
  );
  return a ? { agent: a, department: dept } : null;
}

function ManualForm({
  onAdd,
  onClose,
  departments,
}: {
  onAdd: (s: {
    title: string;
    description: string;
    priority: Subtask["priority"];
    departmentId: string;
    /** fallback model label if no agent is available */
    model: string;
  }) => void;
  onClose: () => void;
  departments: ReturnType<typeof useWorkforceStore.getState>["departments"];
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Subtask["priority"]>("Medium");
  const [departmentId, setDepartmentId] = useState(departments[0]?.id ?? "marketing");

  return (
    <div className="glass-card rounded-xl p-4 space-y-3 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-electric/50"
        />
        <div className="flex gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none"
          >
            {["Critical", "High", "Medium", "Low"].map((p) => <option key={p}>{p}</option>)}
          </select>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none"
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        rows={2}
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-electric/50 resize-none"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="h-8 px-3 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (!title.trim()) return;
            onAdd({ title, description, priority, departmentId, model: "auto" });
            onClose();
          }}
          className="h-8 px-3 rounded-md text-xs gradient-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Add subtask
        </button>
      </div>
    </div>
  );
}

export default Dispatch;
