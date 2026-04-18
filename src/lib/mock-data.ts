export type AgentStatus = "active" | "idle" | "error" | "paused";

export interface Agent {
  id: string;
  name: string;
  role: string;
  team: string;
  status: AgentStatus;
  model: string;
  tasksCompleted: number;
  tasksActive: number;
  successRate: number; // 0-100
  costToday: number; // USD
  uptime: number; // 0-100
  lastActivity: string;
}

export const agents: Agent[] = [
  { id: "agt_001", name: "Atlas", role: "Sales Outreach Lead", team: "Revenue", status: "active", model: "gpt-5", tasksCompleted: 1284, tasksActive: 7, successRate: 94, costToday: 42.18, uptime: 99.8, lastActivity: "2s ago" },
  { id: "agt_002", name: "Nova", role: "Customer Success", team: "Revenue", status: "active", model: "gemini-3-pro", tasksCompleted: 902, tasksActive: 4, successRate: 97, costToday: 28.40, uptime: 99.9, lastActivity: "just now" },
  { id: "agt_003", name: "Orion", role: "Code Reviewer", team: "Engineering", status: "active", model: "gpt-5", tasksCompleted: 612, tasksActive: 12, successRate: 91, costToday: 88.22, uptime: 99.4, lastActivity: "11s ago" },
  { id: "agt_004", name: "Vega", role: "Data Analyst", team: "Operations", status: "idle", model: "gemini-2.5-flash", tasksCompleted: 451, tasksActive: 0, successRate: 96, costToday: 12.10, uptime: 100, lastActivity: "4m ago" },
  { id: "agt_005", name: "Lyra", role: "Recruiter", team: "People", status: "active", model: "gpt-5-mini", tasksCompleted: 230, tasksActive: 3, successRate: 89, costToday: 9.65, uptime: 99.7, lastActivity: "17s ago" },
  { id: "agt_006", name: "Helios", role: "Finance Ops", team: "Finance", status: "error", model: "gpt-5", tasksCompleted: 88, tasksActive: 1, successRate: 76, costToday: 14.30, uptime: 92.1, lastActivity: "1m ago" },
  { id: "agt_007", name: "Cygnus", role: "Content Studio", team: "Marketing", status: "active", model: "gemini-3-flash", tasksCompleted: 1740, tasksActive: 5, successRate: 93, costToday: 33.55, uptime: 99.5, lastActivity: "5s ago" },
  { id: "agt_008", name: "Pavo", role: "QA Engineer", team: "Engineering", status: "paused", model: "gpt-5-mini", tasksCompleted: 320, tasksActive: 0, successRate: 88, costToday: 0, uptime: 100, lastActivity: "27m ago" },
];

export const teams = ["Revenue", "Engineering", "Operations", "People", "Finance", "Marketing"] as const;

export const metricSeries = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  tasks: 80 + Math.round(Math.sin(i / 3) * 30 + Math.random() * 20),
  cost: 8 + Math.round(Math.cos(i / 4) * 4 + Math.random() * 3),
  errors: Math.max(0, Math.round(Math.sin(i / 2) * 2 + Math.random() * 2)),
}));

export interface Project {
  id: string;
  name: string;
  owner: string;
  agentsAssigned: number;
  progress: number;
  status: "on-track" | "at-risk" | "blocked" | "shipped";
  dueIn: string;
}

export const projects: Project[] = [
  { id: "p_01", name: "Q2 outbound experiment", owner: "Atlas", agentsAssigned: 3, progress: 72, status: "on-track", dueIn: "4d" },
  { id: "p_02", name: "Migrate billing pipeline", owner: "Helios", agentsAssigned: 2, progress: 38, status: "at-risk", dueIn: "9d" },
  { id: "p_03", name: "EU customer onboarding", owner: "Nova", agentsAssigned: 4, progress: 88, status: "on-track", dueIn: "2d" },
  { id: "p_04", name: "Refactor checkout service", owner: "Orion", agentsAssigned: 5, progress: 24, status: "blocked", dueIn: "12d" },
  { id: "p_05", name: "Brand site relaunch", owner: "Cygnus", agentsAssigned: 2, progress: 100, status: "shipped", dueIn: "—" },
  { id: "p_06", name: "Hiring sprint — eng", owner: "Lyra", agentsAssigned: 1, progress: 56, status: "on-track", dueIn: "6d" },
];

export interface InboxItem {
  id: string;
  agent: string;
  title: string;
  detail: string;
  severity: "low" | "medium" | "high";
  ts: string;
}

export const inbox: InboxItem[] = [
  { id: "i_01", agent: "Helios", title: "Approval needed: refund > $500", detail: "Customer #44219 requested refund of $812 — outside policy.", severity: "high", ts: "3m" },
  { id: "i_02", agent: "Orion", title: "Code review escalation", detail: "PR #2841 touches auth module. Manual review required.", severity: "medium", ts: "11m" },
  { id: "i_03", agent: "Atlas", title: "New enterprise lead qualified", detail: "Acme Corp — 1,200 seats, asking for SSO + MSA.", severity: "low", ts: "24m" },
  { id: "i_04", agent: "Nova", title: "Churn risk flagged", detail: "3 accounts ($28k MRR) showing usage decline > 40%.", severity: "high", ts: "1h" },
  { id: "i_05", agent: "Lyra", title: "Offer letter ready", detail: "Senior PM candidate — needs comp band approval.", severity: "medium", ts: "2h" },
];

export const kpis = {
  activeAgents: agents.filter(a => a.status === "active").length,
  totalTasks24h: metricSeries.reduce((s, m) => s + m.tasks, 0),
  spendToday: agents.reduce((s, a) => s + a.costToday, 0),
  successRate: Math.round(agents.reduce((s, a) => s + a.successRate, 0) / agents.length),
};
