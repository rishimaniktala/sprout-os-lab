import { create } from "zustand";
import { departments as seedDepartments, type Department, type DeptAgent } from "@/lib/workforce-data";

export type AgentStatus = DeptAgent["status"];

export interface AssignmentResult {
  agent: DeptAgent;
  department: Department;
}

interface WorkforceState {
  departments: Department[];

  /** Find best idle agent. Prefers the given departmentId, otherwise any idle agent. */
  findIdleAgent: (preferredDepartmentId?: string) => AssignmentResult | null;

  /** Mark an agent as running with a current task. Returns true if it succeeded. */
  assignTask: (agentId: string, task: string) => boolean;

  /** Mark an agent as idle and clear its current task. */
  releaseAgent: (agentId: string) => void;
}

const isIdle = (a: DeptAgent) => a.status === "idle" || a.status === "paused";

const updateAgent = (
  depts: Department[],
  agentId: string,
  patch: Partial<DeptAgent>,
): Department[] =>
  depts.map((d) => ({
    ...d,
    agents: d.agents.map((a) => (a.id === agentId ? { ...a, ...patch } : a)),
  }));

export const useWorkforceStore = create<WorkforceState>((set, get) => ({
  departments: seedDepartments,

  findIdleAgent: (preferredDepartmentId) => {
    const depts = get().departments;
    if (preferredDepartmentId) {
      const dept = depts.find((d) => d.id === preferredDepartmentId);
      const idle = dept?.agents.find(isIdle);
      if (dept && idle) return { agent: idle, department: dept };
    }
    for (const dept of depts) {
      const idle = dept.agents.find(isIdle);
      if (idle) return { agent: idle, department: dept };
    }
    return null;
  },

  assignTask: (agentId, task) => {
    const depts = get().departments;
    let found = false;
    for (const d of depts) {
      const a = d.agents.find((x) => x.id === agentId);
      if (a && isIdle(a)) {
        found = true;
        break;
      }
    }
    if (!found) return false;
    set({
      departments: updateAgent(depts, agentId, {
        status: "running",
        currentTask: task,
        tasksActive: 1,
      }),
    });
    return true;
  },

  releaseAgent: (agentId) => {
    set({
      departments: updateAgent(get().departments, agentId, {
        status: "idle",
        currentTask: "—",
        tasksActive: 0,
      }),
    });
  },
}));

/** Map a free-text subtask/agent hint to a likely department. */
export function inferDepartmentId(text: string): string | undefined {
  const t = text.toLowerCase();
  if (/\b(market|brand|content|copy|campaign|ad|seo|social|launch|pr)\b/.test(t)) return "marketing";
  if (/\b(research|competitor|market scan|intel|insight|news|fundrais)\b/.test(t)) return "research";
  if (/\b(code|bug|engineer|sprint|pr |refactor|deploy|api|backend|frontend)\b/.test(t)) return "engineering";
  if (/\b(sales|outbound|lead|crm|pipeline|deal|prospect)\b/.test(t)) return "sales";
  if (/\b(support|ticket|ops|operation|workflow|automation|summar)\b/.test(t)) return "ops";
  if (/\b(finance|burn|runway|investor|board|budget|revenue|mrr|arr)\b/.test(t)) return "finance";
  return undefined;
}
