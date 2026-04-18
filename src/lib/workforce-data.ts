export type AgentStatus = "active" | "running" | "live" | "processing" | "idle" | "paused";

export interface DeptAgent {
  id: string;
  name: string;        // e.g. "ChatGPT 4.2"
  baseModel: string;   // e.g. "ChatGPT", "Claude", "Gemini"
  version: string;     // e.g. "4.2", "3.5 Opus"
  vendor: string;
  role: string;
  status: AgentStatus;
  currentTask: string;
  tasksActive: number;
  successRate: number;
  costPerTask: number;
  costToday: number;
  accent: "electric" | "violet" | "emerald" | "amber" | "sky" | "rose";
}

export interface Department {
  id: string;
  name: string;
  tagline: string;
  icon: "marketing" | "research" | "engineering" | "sales" | "ops" | "finance";
  accent: "electric" | "violet" | "emerald" | "amber" | "sky" | "rose";
  agents: DeptAgent[];
}

export const departments: Department[] = [
  {
    id: "marketing",
    name: "Marketing",
    tagline: "Content, brand, and demand generation",
    icon: "marketing",
    accent: "violet",
    agents: [
      {
        id: "mk1", name: "ChatGPT 5.2", baseModel: "ChatGPT", version: "5.2", vendor: "OpenAI",
        role: "Long-form copy & campaign strategy",
        status: "active", currentTask: "Drafting Q2 launch narrative",
        tasksActive: 4, successRate: 96, costPerTask: 0.044, costToday: 6.20, accent: "emerald",
      },
      {
        id: "mk2", name: "ChatGPT 4.2", baseModel: "ChatGPT", version: "4.2", vendor: "OpenAI",
        role: "Social posts & ad variants",
        status: "running", currentTask: "Generating 12 LinkedIn ad variations",
        tasksActive: 8, successRate: 92, costPerTask: 0.012, costToday: 2.10, accent: "emerald",
      },
      {
        id: "mk3", name: "Claude 3.7 Sonnet", baseModel: "Claude", version: "3.7", vendor: "Anthropic",
        role: "Editorial polish & brand voice",
        status: "active", currentTask: "Editing investor blog post",
        tasksActive: 2, successRate: 98, costPerTask: 0.029, costToday: 3.80, accent: "violet",
      },
    ],
  },
  {
    id: "research",
    name: "Research",
    tagline: "Market intel, competitor scans, and customer insight",
    icon: "research",
    accent: "sky",
    agents: [
      {
        id: "rs1", name: "Gemini 2.5 Pro", baseModel: "Gemini", version: "2.5 Pro", vendor: "Google",
        role: "Deep market analysis",
        status: "active", currentTask: "Analyzing DACH expansion opportunity",
        tasksActive: 3, successRate: 94, costPerTask: 0.018, costToday: 4.50, accent: "sky",
      },
      {
        id: "rs2", name: "Gemini 2.5 Flash", baseModel: "Gemini", version: "2.5 Flash", vendor: "Google",
        role: "Continuous competitor monitoring",
        status: "live", currentTask: "Monitoring 14 competitors",
        tasksActive: 14, successRate: 91, costPerTask: 0.002, costToday: 1.40, accent: "sky",
      },
      {
        id: "rs3", name: "Perplexity Pro", baseModel: "Perplexity", version: "Pro", vendor: "Perplexity",
        role: "Live news & fundraising intel",
        status: "live", currentTask: "Tracking Series A activity in AI infra",
        tasksActive: 5, successRate: 93, costPerTask: 0.006, costToday: 3.80, accent: "rose",
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    tagline: "Code review, bug triage, and sprint planning",
    icon: "engineering",
    accent: "electric",
    agents: [
      {
        id: "en1", name: "Claude 3.7 Opus", baseModel: "Claude", version: "3.7 Opus", vendor: "Anthropic",
        role: "Architecture & code review",
        status: "processing", currentTask: "Reviewing payments refactor PR",
        tasksActive: 2, successRate: 97, costPerTask: 0.072, costToday: 5.20, accent: "violet",
      },
      {
        id: "en2", name: "Cursor Agent v2", baseModel: "Cursor", version: "v2", vendor: "Cursor",
        role: "Bug triage & sprint planning",
        status: "running", currentTask: "Closing 3 bugs in checkout flow",
        tasksActive: 6, successRate: 89, costPerTask: 0.040, costToday: 7.54, accent: "electric",
      },
      {
        id: "en3", name: "ChatGPT 5.2", baseModel: "ChatGPT", version: "5.2", vendor: "OpenAI",
        role: "Complex algorithmic tasks",
        status: "idle", currentTask: "—",
        tasksActive: 0, successRate: 95, costPerTask: 0.044, costToday: 0, accent: "emerald",
      },
    ],
  },
  {
    id: "sales",
    name: "Sales",
    tagline: "Outbound, lead qualification, and CRM hygiene",
    icon: "sales",
    accent: "emerald",
    agents: [
      {
        id: "sa1", name: "ChatGPT 4.2", baseModel: "ChatGPT", version: "4.2", vendor: "OpenAI",
        role: "Personalized outbound sequences",
        status: "running", currentTask: "Generating 80 outbound emails",
        tasksActive: 12, successRate: 90, costPerTask: 0.012, costToday: 4.20, accent: "emerald",
      },
      {
        id: "sa2", name: "Llama 3.3", baseModel: "Llama", version: "3.3", vendor: "Meta",
        role: "Lead scoring & CRM updates",
        status: "running", currentTask: "Scoring 44 inbound leads",
        tasksActive: 22, successRate: 91, costPerTask: 0.0002, costToday: 0.18, accent: "amber",
      },
    ],
  },
  {
    id: "ops",
    name: "Operations",
    tagline: "Internal automation, support, and workflow",
    icon: "ops",
    accent: "amber",
    agents: [
      {
        id: "op1", name: "Llama 3.3", baseModel: "Llama", version: "3.3", vendor: "Meta",
        role: "Support ticket categorization",
        status: "running", currentTask: "Routing 138 tickets to owners",
        tasksActive: 22, successRate: 91, costPerTask: 0.0002, costToday: 1.18, accent: "amber",
      },
      {
        id: "op2", name: "Gemini 2.5 Flash", baseModel: "Gemini", version: "2.5 Flash", vendor: "Google",
        role: "Document & meeting summarization",
        status: "active", currentTask: "Summarizing yesterday's standups",
        tasksActive: 3, successRate: 93, costPerTask: 0.002, costToday: 0.40, accent: "sky",
      },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    tagline: "Burn analysis, runway, and investor reporting",
    icon: "finance",
    accent: "rose",
    agents: [
      {
        id: "fi1", name: "ChatGPT 5.2", baseModel: "ChatGPT", version: "5.2", vendor: "OpenAI",
        role: "Investor memos & board summaries",
        status: "active", currentTask: "Drafting May investor update",
        tasksActive: 1, successRate: 98, costPerTask: 0.044, costToday: 1.20, accent: "emerald",
      },
      {
        id: "fi2", name: "Claude 3.7 Sonnet", baseModel: "Claude", version: "3.7", vendor: "Anthropic",
        role: "Runway & burn modeling",
        status: "idle", currentTask: "—",
        tasksActive: 0, successRate: 96, costPerTask: 0.029, costToday: 0, accent: "violet",
      },
    ],
  },
];
