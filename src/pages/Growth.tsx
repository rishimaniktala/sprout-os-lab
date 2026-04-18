import { OSLayout } from "@/components/os/OSLayout";
import { ModelAvatar, modelAccent } from "@/components/os/ModelAvatar";
import { TrendingUp, Target, Lightbulb, BarChart3, Brain, Loader2, Check, X, RotateCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Idea {
  id: string;
  title: string;
  hypothesis: string;
  channel: string;
  agent: string;
  results?: { views: number; replies: number; signups: number };
  best?: boolean;
}

type Step = 1 | 2 | 3 | 4;

const channels = ["LinkedIn organic", "Twitter/X thread", "Cold email", "Founder podcast tour", "Partner co-marketing"];
const agents = ["Gemini", "Claude", "ChatGPT-5", "Perplexity"];

const steps: { n: Step; label: string; icon: typeof Target }[] = [
  { n: 1, label: "Goal",     icon: Target },
  { n: 2, label: "Ideas",    icon: Lightbulb },
  { n: 3, label: "Results",  icon: BarChart3 },
  { n: 4, label: "Decision", icon: Brain },
];

const Growth = () => {
  const [step, setStep] = useState<Step>(1);
  const [goal, setGoal] = useState("Acquire 200 qualified DACH leads in 30 days");
  const [audience, setAudience] = useState("CTOs at Series A B2B SaaS companies in DACH");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [generating, setGenerating] = useState(false);
  const [decision, setDecision] = useState<"scale" | "stop" | "iterate" | null>(null);

  const generateIdeas = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("dispatch", {
        body: {
          mode: "breakdown",
          prompt: `Goal: ${goal}\nAudience: ${audience}\n\nReturn 4 concrete growth experiments. Each should have a clear hypothesis and channel. Use the title as the experiment name and the description as the hypothesis.`,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const incoming = ((data as any)?.subtasks ?? []) as { title: string; description: string; agent: string }[];
      const generated: Idea[] = (incoming.length ? incoming : fallbackIdeas).slice(0, 4).map((s, i) => ({
        id: `idea-${Date.now()}-${i}`,
        title: s.title,
        hypothesis: s.description,
        channel: channels[i % channels.length],
        agent: s.agent ?? agents[i % agents.length],
      }));
      setIdeas(generated);
      setStep(2);
    } catch (e: any) {
      toast.error(e?.message ?? "Idea generation failed — using fallback");
      setIdeas(
        fallbackIdeas.map((s, i) => ({
          id: `idea-${Date.now()}-${i}`,
          title: s.title,
          hypothesis: s.description,
          channel: channels[i % channels.length],
          agent: agents[i % agents.length],
        })),
      );
      setStep(2);
    } finally {
      setGenerating(false);
    }
  };

  const runExperiments = () => {
    const withResults: Idea[] = ideas.map((i) => {
      const views   = Math.floor(800 + Math.random() * 12000);
      const replies = Math.floor(8 + Math.random() * 240);
      const signups = Math.floor(2 + Math.random() * 60);
      return { ...i, results: { views, replies, signups } };
    });
    const bestSignups = Math.max(...withResults.map((i) => i.results!.signups));
    setIdeas(withResults.map((i) => ({ ...i, best: i.results!.signups === bestSignups })));
    setStep(3);
  };

  const decide = () => {
    const best = ideas.find((i) => i.best);
    if (!best) return;
    const score = best.results!.signups;
    setDecision(score > 35 ? "scale" : score > 18 ? "iterate" : "stop");
    setStep(4);
  };

  const reset = () => {
    setIdeas([]);
    setDecision(null);
    setStep(1);
  };

  return (
    <OSLayout>
      <div className="px-6 py-8 max-w-[1300px] mx-auto animate-fade-in">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-electric" /> Growth Engine
          </div>
          <h1 className="mt-2 text-[28px] leading-tight font-semibold tracking-tight text-foreground">
            Goal → Ideas → Results → Decision
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            Autonomous growth loop. Set a goal, your AI workforce proposes experiments, runs them, and decides whether to scale.
          </p>
        </header>

        {/* Stepper */}
        <div className="glass-card rounded-xl p-3 mb-6 flex items-center gap-2 overflow-x-auto">
          {steps.map((s, i) => {
            const active = step === s.n;
            const done = step > s.n;
            return (
              <div key={s.n} className="flex items-center gap-2 shrink-0">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all ${
                    active ? "border-electric/50 bg-electric/10 text-electric"
                    : done ? "border-success/40 bg-success/5 text-success"
                    : "border-border bg-surface text-muted-foreground"
                  }`}
                >
                  <span className={`h-5 w-5 grid place-items-center rounded-full text-[10px] mono font-semibold ${
                    active ? "bg-electric text-accent-foreground" :
                    done ? "bg-success text-success-foreground" :
                    "bg-surface-hover text-muted-foreground"
                  }`}>
                    {done ? <Check className="h-3 w-3" /> : s.n}
                  </span>
                  <s.icon className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className="h-px w-6 bg-border" />}
              </div>
            );
          })}
          <button
            onClick={reset}
            className="ml-auto flex items-center gap-1.5 text-[11px] mono px-2.5 py-1 rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            <RotateCw className="h-3 w-3" /> Reset
          </button>
        </div>

        {/* Step 1 — Goal */}
        {step === 1 && (
          <div className="glass-card rounded-xl p-6 max-w-2xl">
            <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
              <Target className="h-3.5 w-3.5" /> Goal Input
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-[11px] mono uppercase tracking-wider text-muted-foreground">Goal</label>
                <input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="mt-1.5 w-full h-11 px-3 rounded-md border border-border bg-surface text-sm text-foreground focus:outline-none focus:border-electric/50"
                />
              </div>
              <div>
                <label className="text-[11px] mono uppercase tracking-wider text-muted-foreground">Audience</label>
                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="mt-1.5 w-full h-11 px-3 rounded-md border border-border bg-surface text-sm text-foreground focus:outline-none focus:border-electric/50"
                />
              </div>
              <button
                onClick={generateIdeas}
                disabled={generating || !goal.trim() || !audience.trim()}
                className="h-10 px-4 rounded-md gradient-accent text-accent-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {generating ? "Generating ideas…" : "Generate experiments"}
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Ideas */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ideas.map((i) => (
                <div key={i.id} className="glass-card rounded-xl p-4 hover:border-strong transition-colors">
                  <div className="flex items-center justify-between">
                    <ModelAvatar name={i.agent} accent={modelAccent(i.agent)} size="sm" />
                    <span className="text-[10px] mono uppercase tracking-wider text-muted-foreground">{i.channel}</span>
                  </div>
                  <div className="mt-3 text-sm font-medium text-foreground">{i.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{i.hypothesis}</div>
                </div>
              ))}
            </div>
            <button
              onClick={runExperiments}
              className="h-10 px-4 rounded-md gradient-accent text-accent-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <BarChart3 className="h-4 w-4" /> Run experiments
            </button>
          </div>
        )}

        {/* Step 3 — Results */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ideas.map((i) => (
                <div
                  key={i.id}
                  className={`glass-card rounded-xl p-4 transition-all ${i.best ? "ring-1 ring-success/50 bg-success/5" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ModelAvatar name={i.agent} accent={modelAccent(i.agent)} size="sm" />
                      <span className="text-xs font-medium text-foreground">{i.title}</span>
                    </div>
                    {i.best && (
                      <span className="text-[10px] mono uppercase tracking-wider text-success border border-success/40 bg-success/10 px-1.5 py-0.5 rounded">
                        Winner
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-[10px] mono uppercase tracking-wider text-muted-foreground">{i.channel}</div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <Metric label="Views"   value={i.results!.views.toLocaleString()} />
                    <Metric label="Replies" value={i.results!.replies.toLocaleString()} />
                    <Metric label="Signups" value={i.results!.signups.toLocaleString()} highlight={i.best} />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={decide}
              className="h-10 px-4 rounded-md gradient-accent text-accent-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Brain className="h-4 w-4" /> AI decision
            </button>
          </div>
        )}

        {/* Step 4 — Decision */}
        {step === 4 && decision && (
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
              <Brain className="h-3.5 w-3.5" /> AI Decision
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <DecisionBadge type={decision} />
              <span className="text-sm text-foreground/90">
                {decision === "scale" && (
                  <>Strongest variant cleared the conversion bar. <span className="font-medium">ChatGPT-5</span> recommends scaling budget 3× and locking the channel for the next 14 days.</>
                )}
                {decision === "iterate" && (
                  <>Signal is real but conversion is borderline. <span className="font-medium">Claude</span> recommends generating 3 variations of the winning copy before scaling.</>
                )}
                {decision === "stop" && (
                  <>Signal is too weak to justify spend. <span className="font-medium">ChatGPT-5</span> recommends stopping all variants and re-defining the ICP.</>
                )}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button onClick={() => setStep(2)} className="h-9 px-3 rounded-md border border-border bg-surface text-xs text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" /> Try variations
              </button>
              <button onClick={reset} className="h-9 px-3 rounded-md border border-border bg-surface text-xs text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors flex items-center gap-1.5">
                <X className="h-3.5 w-3.5" /> Stop loop
              </button>
              <button className="h-9 px-3 rounded-md gradient-accent text-accent-foreground text-xs font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity">
                <Check className="h-3.5 w-3.5" /> Scale & dispatch
              </button>
            </div>
          </div>
        )}
      </div>
    </OSLayout>
  );
};

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-md border px-2 py-1.5 ${highlight ? "border-success/40 bg-success/10" : "border-border/60 bg-surface/60"}`}>
      <div className="text-[9px] mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-xs font-semibold mono ${highlight ? "text-success" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

function DecisionBadge({ type }: { type: "scale" | "iterate" | "stop" }) {
  const map = {
    scale:   { text: "SCALE",   c: "text-success border-success/40 bg-success/10" },
    iterate: { text: "ITERATE", c: "text-warning border-warning/40 bg-warning/10" },
    stop:    { text: "STOP",    c: "text-destructive border-destructive/40 bg-destructive/10" },
  } as const;
  const m = map[type];
  return (
    <span className={`text-[11px] mono uppercase tracking-[0.18em] px-2.5 py-1 rounded border ${m.c}`}>
      {m.text}
    </span>
  );
}

const fallbackIdeas = [
  { title: "DACH founder LinkedIn campaign", description: "Post 3× weekly technical breakdowns from Northwind founders, targeting CTOs in 14 DACH cities.", agent: "Claude" },
  { title: "Twitter thread sprint",           description: "Daily threads decomposing AI infra patterns; lead magnet to free architecture review.",           agent: "Gemini" },
  { title: "Personalized cold outbound",      description: "Llama enriches a list of 800 Series A B2B SaaS CTOs with company-specific hooks.",                 agent: "Llama"  },
  { title: "Co-marketing with dev tool",      description: "Partner with one dev infra company on a joint webinar + shared blog post.",                       agent: "ChatGPT-5" },
];

export default Growth;
