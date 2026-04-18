export type ModelStatus = "active" | "running" | "live" | "processing" | "idle" | "paused";

export interface AIModel {
  id: string;
  name: string;
  vendor: string;
  role: string;
  status: ModelStatus;
  tasks: string[];
  tasksCompleted: number;
  tasksActive: number;
  successRate: number;
  costToday: number;
  costPerTask: number;
  speed: "fast" | "balanced" | "deep";
  accent: "electric" | "violet" | "emerald" | "amber" | "sky" | "rose";
}

export const aiModels: AIModel[] = [
  {
    id: "gpt5", name: "ChatGPT-5", vendor: "OpenAI",
    role: "Chief of Staff · Strategy · Complex decisions",
    status: "active",
    tasks: ["Building weekly founder strategy brief", "Prioritizing roadmap items"],
    tasksCompleted: 412, tasksActive: 6, successRate: 96, costToday: 18.40, costPerTask: 0.044,
    speed: "deep", accent: "emerald",
  },
  {
    id: "gemini", name: "Gemini", vendor: "Google",
    role: "Research · Market scanning · Web intelligence",
    status: "active",
    tasks: ["Monitoring 14 competitors", "Researching new EU expansion markets"],
    tasksCompleted: 1284, tasksActive: 9, successRate: 94, costToday: 6.20, costPerTask: 0.005,
    speed: "fast", accent: "sky",
  },
  {
    id: "claude", name: "Claude", vendor: "Anthropic",
    role: "Writing · Long-form docs · Investor updates",
    status: "active",
    tasks: ["Drafting investor update memo", "Preparing board summary"],
    tasksCompleted: 318, tasksActive: 3, successRate: 98, costToday: 9.10, costPerTask: 0.029,
    speed: "balanced", accent: "violet",
  },
  {
    id: "llama", name: "Llama", vendor: "Meta",
    role: "Low-cost repetitive tasks · Internal automation",
    status: "running",
    tasks: ["Categorizing support tickets", "Updating CRM records"],
    tasksCompleted: 4820, tasksActive: 22, successRate: 91, costToday: 1.18, costPerTask: 0.0002,
    speed: "fast", accent: "amber",
  },
  {
    id: "perplexity", name: "Perplexity", vendor: "Perplexity",
    role: "Live market research · Competitor & news intel",
    status: "live",
    tasks: ["Watching industry news", "Detecting fundraising activity"],
    tasksCompleted: 642, tasksActive: 4, successRate: 93, costToday: 3.80, costPerTask: 0.006,
    speed: "fast", accent: "rose",
  },
  {
    id: "cursor", name: "Cursor Agent", vendor: "Cursor",
    role: "Engineering · Bug triage · Code planning",
    status: "processing",
    tasks: ["Reviewing bug backlog", "Generating sprint tasks"],
    tasksCompleted: 187, tasksActive: 5, successRate: 89, costToday: 7.54, costPerTask: 0.040,
    speed: "deep", accent: "electric",
  },
];

export const taskPipeline = {
  queued: 14,
  running: 9,
  awaitingApproval: 4,
  completed: 173,
};

/* ---------- Founder dashboard ---------- */
export const founder = {
  name: "Alex",
  company: "Northwind AI",
  briefing: {
    completedOvernight: 17,
    growthOpps: 2,
    churnRisks: 1,
    meetingsPrepared: 3,
  },
  health: 84,
  mrr: 42500,
  mrrGrowth: 18,
  runwayMonths: 14,
  spendToday: 5.22,
  spendSavedPct: 61,
  velocityWeek: 23,
};

export const alerts = [
  { id: "a1", text: "CAC increased 12% week-over-week", severity: "warning" as const },
  { id: "a2", text: "Germany showing breakout traction (+38% trials)", severity: "success" as const },
  { id: "a3", text: "Hiring slowdown in engineering — 3 roles open >30d", severity: "warning" as const },
  { id: "a4", text: "Competitor Acme lowered pricing by 20%", severity: "destructive" as const },
];

export const priorities = [
  { id: "p1", text: "Approve pricing test", owner: "ChatGPT-5", due: "Today" },
  { id: "p2", text: "Investor call at 2 PM", owner: "Claude", due: "14:00" },
  { id: "p3", text: "Review hiring shortlist", owner: "Llama", due: "Today" },
  { id: "p4", text: "Fix onboarding drop-off", owner: "Cursor Agent", due: "Tomorrow" },
];

export const briefingChips = [
  "Competitor pricing changes",
  "Which EU market should we enter next?",
  "Why did churn rise last week?",
  "Which portfolio company needs support?",
  "Investors active in AI infrastructure",
  "New B2B acquisition channels",
];

/* ---------- Meetings ---------- */
export interface Meeting {
  id: string;
  time: string;
  title: string;
  hosts: string[];
  bullets: string[];
  status: "upcoming" | "live" | "done";
}

export const meetings: Meeting[] = [
  { id: "m1", time: "10:00", title: "Daily Standup", hosts: ["ChatGPT-5", "Llama"],
    bullets: ["Team blockers collected automatically", "Speaking order generated", "Action items assigned instantly"], status: "done" },
  { id: "m2", time: "13:00", title: "Growth Review", hosts: ["Gemini"],
    bullets: ["Campaign metrics loaded", "Winning experiments highlighted"], status: "live" },
  { id: "m3", time: "15:00", title: "Sprint Planning", hosts: ["Cursor Agent"],
    bullets: ["Dev priorities ranked", "Engineering capacity estimated"], status: "upcoming" },
  { id: "m4", time: "17:00", title: "Founder Update", hosts: ["Claude"],
    bullets: ["Weekly memo auto-generated"], status: "upcoming" },
];

export const agendaTemplate = [
  "Yesterday progress",
  "Today priorities",
  "Risks",
  "Ownership",
  "Decisions required",
];

export const meetingOutputs = [
  "Notes auto-written",
  "Tasks synced to Jira / Asana",
  "Slack summary sent",
  "Decisions stored in memory",
];

export const meetingsTimeSaved = { hours: 13, automatedPct: 82 };

/* ---------- Portfolio ---------- */
export interface PortfolioCo {
  id: string;
  name: string;
  sector: string;
  health: number;
  mrr: number;
  mrrDelta: number;
  runwayMonths: number;
  signal: string;
  tone: "success" | "warning" | "destructive" | "info";
}

export const portfolio: PortfolioCo[] = [
  { id: "s1", name: "Northwind AI", sector: "AI infra", health: 91, mrr: 142000, mrrDelta: 22, runwayMonths: 18, signal: "Breakout growth", tone: "success" },
  { id: "s2", name: "Loom Robotics", sector: "Hardware", health: 58, mrr: 38000, mrrDelta: -4, runwayMonths: 6, signal: "Runway risk · needs hiring support", tone: "destructive" },
  { id: "s3", name: "Atlas Health", sector: "Health AI", health: 82, mrr: 96000, mrrDelta: 14, runwayMonths: 14, signal: "Strong growth in Germany", tone: "success" },
  { id: "s4", name: "Veritas Ledger", sector: "Fintech", health: 67, mrr: 54000, mrrDelta: 6, runwayMonths: 11, signal: "CAC rising sharply", tone: "warning" },
  { id: "s5", name: "Quartz Labs", sector: "Dev tools", health: 88, mrr: 71000, mrrDelta: 11, runwayMonths: 16, signal: "Enterprise pipeline forming", tone: "info" },
  { id: "s6", name: "Helix Bio", sector: "BioTech", health: 74, mrr: 22000, mrrDelta: 3, runwayMonths: 9, signal: "Reg approval pending", tone: "info" },
];

export const vcRecommendations = [
  { id: "r1", text: "Introduce Loom Robotics to growth advisor (Jenna K.)", company: "Loom Robotics" },
  { id: "r2", text: "Encourage Atlas Health to start fundraising prep", company: "Atlas Health" },
  { id: "r3", text: "Connect Veritas Ledger with pricing expert", company: "Veritas Ledger" },
  { id: "r4", text: "Investigate churn issue at Northwind AI", company: "Northwind AI" },
];

export const portfolioThemes = [
  { id: "t1", text: "AI compliance tools growing across portfolio", strength: 0.86 },
  { id: "t2", text: "B2B SaaS CAC increasing 9–18% QoQ", strength: 0.71 },
  { id: "t3", text: "Germany strongest GTM market for EU expansion", strength: 0.78 },
];

/* ---------- Memory timeline ---------- */
export interface MemoryEvent {
  id: string;
  ts: string;
  model: string;
  text: string;
  tab: "Decisions" | "Meetings" | "Customers" | "Growth" | "Product" | "Finance";
}

export const memoryTabs = ["Decisions", "Meetings", "Customers", "Growth", "Product", "Finance"] as const;

export const memoryFeed: MemoryEvent[] = [
  { id: "e1", ts: "2m", model: "Gemini", text: "Found competitor discount launch — Acme cut Pro tier by 20%", tab: "Growth" },
  { id: "e2", ts: "11m", model: "Claude", text: "Drafted investor note for Q2 — awaiting founder review", tab: "Decisions" },
  { id: "e3", ts: "24m", model: "ChatGPT-5", text: "Changed roadmap priorities — onboarding fix promoted to P0", tab: "Product" },
  { id: "e4", ts: "41m", model: "Llama", text: "Updated CRM with 44 new inbound leads from EU campaigns", tab: "Customers" },
  { id: "e5", ts: "1h", model: "Cursor Agent", text: "Closed 3 bugs in checkout flow · merged PR #2841", tab: "Product" },
  { id: "e6", ts: "2h", model: "Perplexity", text: "Detected Series A announcement from competitor Mira (€8M)", tab: "Growth" },
  { id: "e7", ts: "3h", model: "Claude", text: "Generated board summary for May ops review", tab: "Meetings" },
  { id: "e8", ts: "4h", model: "ChatGPT-5", text: "Decision logged: pause Brazil GTM, double down on DACH", tab: "Decisions" },
];

/* ---------- Chat suggestions ---------- */
export const chatSuggestions = [
  "What should we focus on this week?",
  "How do we extend runway?",
  "Which market should we enter next?",
  "Summarize all meetings today",
  "Which competitor is gaining traction?",
  "What should I tell investors?",
];

export const routableModels = ["Auto Route", "ChatGPT-5", "Gemini", "Claude", "Perplexity", "Cursor Agent"];
