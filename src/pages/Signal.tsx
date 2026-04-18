import { OSLayout } from "@/components/os/OSLayout";
import { ModelAvatar, modelAccent } from "@/components/os/ModelAvatar";
import {
  Radio, ArrowRight, Linkedin, Twitter, Mail, TrendingUp, Sparkles,
  Activity, Database, Brain, Loader2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Tone = "Investor" | "Builder" | "Technical";

interface RawInput {
  id: string;
  source: "AI output" | "Memory insight" | "Growth change";
  agent: string;
  text: string;
  selected: boolean;
}

interface Narrative {
  id: string;
  type: "investor" | "growth" | "product";
  title: string;
  body: string;
  confidence: number;
}

const seedInputs: RawInput[] = [
  { id: "i1", source: "AI output",      agent: "Gemini",      text: "Acme cut Pro pricing 20% — competitive response to our DACH push", selected: true },
  { id: "i2", source: "Memory insight", agent: "ChatGPT-5",   text: "Onboarding drop-off concentrated at step 3 — fix queued for sprint", selected: true },
  { id: "i3", source: "Growth change",  agent: "Llama",       text: "DACH inbound leads up 3.2× MoM after technical content sprint", selected: true },
  { id: "i4", source: "AI output",      agent: "Perplexity",  text: "Series A pace in AI infra +18% QoQ — 7 fundraises in last 30 days", selected: false },
  { id: "i5", source: "Memory insight", agent: "Claude",      text: "Founder voice consistency improved across 14 published pieces",     selected: false },
  { id: "i6", source: "Growth change",  agent: "Cursor Agent",text: "Checkout flow conversion +9% after PR #2841 ship",                   selected: true },
];

const channels = [
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, reach: "12.4k", engagement: "4.8%", strength: 88 },
  { id: "twitter",  label: "Twitter / X", icon: Twitter, reach: "8.1k",  engagement: "2.1%", strength: 71 },
  { id: "email",    label: "Email",    icon: Mail,     reach: "1.2k",  engagement: "32%",  strength: 94 },
];

const Signal = () => {
  const [inputs, setInputs] = useState<RawInput[]>(seedInputs);
  const [tone, setTone] = useState<Tone>("Investor");
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [generating, setGenerating] = useState(false);

  const selectedInputs = useMemo(() => inputs.filter((i) => i.selected), [inputs]);

  const toggle = (id: string) =>
    setInputs((prev) => prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)));

  const generate = async () => {
    if (!selectedInputs.length) {
      toast.message("Select at least one signal");
      return;
    }
    setGenerating(true);
    try {
      const bullets = selectedInputs.map((s) => `- (${s.agent}) ${s.text}`).join("\n");
      const { data, error } = await supabase.functions.invoke("dispatch", {
        body: {
          mode: "breakdown",
          prompt: `Tone: ${tone}.\n\nRaw signals from the company:\n${bullets}\n\nProduce 3 narratives: one investor update, one growth insight, one product milestone. Use the title as the narrative headline and the description as the narrative body (2-3 sentences).`,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const incoming = ((data as any)?.subtasks ?? []) as { title: string; description: string }[];
      const items = (incoming.length ? incoming : fallback).slice(0, 3);
      const types: Narrative["type"][] = ["investor", "growth", "product"];
      setNarratives(
        items.map((s, i) => ({
          id: `n-${Date.now()}-${i}`,
          type: types[i] ?? "growth",
          title: s.title,
          body: s.description,
          confidence: 70 + Math.floor(Math.random() * 25),
        })),
      );
    } catch (e: any) {
      toast.error(e?.message ?? "Narrative generation failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <OSLayout>
      <div className="px-6 py-8 max-w-[1500px] mx-auto animate-fade-in">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">
            <Radio className="h-3 w-3 text-violet" /> Signal Engine
          </div>
          <h1 className="mt-2 text-[28px] leading-tight font-semibold tracking-tight text-foreground">
            Raw Input → Signal → Narrative
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            Compress noise into stories worth telling. Pick signals, choose a tone, distribute to the right channels.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-4">
          {/* LEFT — Inputs */}
          <section className="col-span-12 lg:col-span-3">
            <div className="glass-card rounded-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
                  <Activity className="h-3.5 w-3.5" /> Inputs
                </div>
                <span className="text-[10px] mono text-muted-foreground">{selectedInputs.length}/{inputs.length}</span>
              </div>
              <ul className="divide-y divide-border max-h-[70vh] overflow-y-auto">
                {inputs.map((i) => (
                  <li key={i.id}>
                    <button
                      onClick={() => toggle(i.id)}
                      className={`w-full text-left px-4 py-3 flex gap-2.5 transition-colors hover:bg-surface-hover/40 ${
                        i.selected ? "bg-electric/5" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={i.selected}
                        readOnly
                        className="mt-1 h-3.5 w-3.5 rounded border-border bg-surface accent-electric"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <ModelAvatar name={i.agent} accent={modelAccent(i.agent)} size="sm" />
                          <span className="text-[10px] mono uppercase tracking-wider text-muted-foreground/80">{i.source}</span>
                        </div>
                        <p className="mt-1.5 text-xs text-foreground/90 leading-relaxed">{i.text}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* CENTER — Narrative Engine */}
          <section className="col-span-12 lg:col-span-6 space-y-4">
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-violet" /> Narrative Engine
                </div>
                <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-0.5">
                  {(["Investor", "Builder", "Technical"] as Tone[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-2.5 py-1 rounded text-[11px] mono transition-colors ${
                        tone === t ? "bg-surface-elevated text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pipeline visualization */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <PipelineNode icon={Activity} label="Raw input" sub={`${selectedInputs.length} signals`} tone="text-electric border-electric/30 bg-electric/5" />
                <PipelineArrow />
                <PipelineNode icon={Database} label="Signal" sub={`tone: ${tone}`} tone="text-info border-info/30 bg-info/5" />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div />
                <PipelineArrow vertical />
                <div />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div />
                <PipelineNode icon={Brain} label="Narrative" sub={`${narratives.length} drafted`} tone="text-violet border-violet/30 bg-violet/5" />
                <div />
              </div>

              <button
                onClick={generate}
                disabled={generating}
                className="mt-4 h-10 w-full rounded-md gradient-accent text-accent-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {generating ? "Composing narratives…" : "Generate narratives"}
              </button>
            </div>

            {narratives.length > 0 && (
              <div className="space-y-3">
                {narratives.map((n) => (
                  <div key={n.id} className="glass-card rounded-xl p-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] mono uppercase tracking-wider text-muted-foreground">
                        {n.type === "investor" && "Investor update"}
                        {n.type === "growth" && "Growth insight"}
                        {n.type === "product" && "Product milestone"}
                      </span>
                      <span className="text-[10px] mono text-electric">conf {n.confidence}%</span>
                    </div>
                    <div className="mt-2 text-sm font-medium text-foreground">{n.title}</div>
                    <p className="mt-1.5 text-xs text-foreground/85 leading-relaxed">{n.body}</p>
                    <div className="mt-3 h-1 rounded-full bg-surface-hover overflow-hidden">
                      <div className="h-full gradient-accent" style={{ width: `${n.confidence}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* RIGHT — Distribution */}
          <section className="col-span-12 lg:col-span-3 space-y-4">
            <div className="glass-card rounded-xl">
              <div className="px-4 py-3 border-b border-border flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" /> Distribution
              </div>
              <ul className="divide-y divide-border">
                {channels.map((c) => (
                  <li key={c.id} className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-7 w-7 grid place-items-center rounded-md border border-border bg-surface text-foreground">
                        <c.icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-xs font-medium text-foreground flex-1">{c.label}</span>
                      <span className="text-[10px] mono text-success">{c.strength}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Mini label="Reach"      value={c.reach} />
                      <Mini label="Engagement" value={c.engagement} />
                    </div>
                    <div className="mt-2 h-1 rounded-full bg-surface-hover overflow-hidden">
                      <div className="h-full gradient-accent" style={{ width: `${c.strength}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-xl p-4">
              <div className="text-[11px] mono uppercase tracking-wider text-muted-foreground">Feedback loop</div>
              <ul className="mt-3 space-y-2 text-xs">
                <Loop label="Investor interest" delta="+24%" tone="success" />
                <Loop label="User growth"       delta="+11%" tone="success" />
                <Loop label="Engagement rise"   delta="+18%" tone="success" />
              </ul>
              <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
                Signals → low memory · Insights → medium · Narratives → high. The loop closes itself.
              </p>
            </div>
          </section>
        </div>
      </div>
    </OSLayout>
  );
};

function PipelineNode({
  icon: Icon, label, sub, tone,
}: { icon: typeof Activity; label: string; sub: string; tone: string }) {
  return (
    <div className={`rounded-lg ring-1 px-3 py-2.5 ${tone}`}>
      <Icon className="h-3.5 w-3.5 mx-auto" />
      <div className="mt-1 text-[11px] mono uppercase tracking-wider">{label}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}

function PipelineArrow({ vertical }: { vertical?: boolean }) {
  return (
    <div className="flex items-center justify-center text-muted-foreground">
      <ArrowRight className={`h-4 w-4 ${vertical ? "rotate-90" : ""}`} />
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/60 bg-surface/60 px-2 py-1">
      <div className="text-[9px] mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-[11px] font-semibold text-foreground mono">{value}</div>
    </div>
  );
}

function Loop({ label, delta, tone }: { label: string; delta: string; tone: "success" | "warning" }) {
  const c = tone === "success" ? "text-success" : "text-warning";
  return (
    <li className="flex items-center justify-between">
      <span className="text-foreground/85">{label}</span>
      <span className={`mono ${c}`}>{delta}</span>
    </li>
  );
}

const fallback = [
  { title: "Q2 update: DACH breakout, sharper focus", description: "Inbound DACH leads grew 3.2× MoM after a focused content sprint. We paused Brazil GTM to compound the win." },
  { title: "Why technical content compounded for us",  description: "Builder-first writing on AI infra patterns drove 88-strength LinkedIn engagement and 32% email open-through." },
  { title: "Onboarding fix shipped — conversion +9%",  description: "PR #2841 unblocked step 3 verification; checkout conversion lifted 9% within 48h of ship." },
];

export default Signal;
