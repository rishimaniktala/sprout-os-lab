import { OSLayout } from "@/components/os/OSLayout";
import { ModelAvatar, modelAccent } from "@/components/os/ModelAvatar";
import { meetings, agendaTemplate, meetingOutputs, meetingsTimeSaved } from "@/lib/mock-data";
import { CalendarClock, CheckCircle2, FileText, Slack, Clock, Database, ListChecks, Radio } from "lucide-react";

const statusMap = {
  done:     { label: "Completed", cls: "text-success border-success/40 bg-success/10" },
  live:     { label: "Live now",  cls: "text-violet border-violet/40 bg-violet/10" },
  upcoming: { label: "Upcoming",  cls: "text-electric border-electric/40 bg-electric/10" },
} as const;

const Meetings = () => {
  return (
    <OSLayout>
      <div className="px-6 py-8 max-w-[1400px] mx-auto animate-fade-in">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-[0.18em] text-muted-foreground">
            <CalendarClock className="h-3 w-3 text-electric" /> Meeting Automation
          </div>
          <h1 className="mt-2 text-[34px] leading-[1.05] font-semibold tracking-tight text-foreground">
            No Scrum Master Needed.
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground max-w-2xl">
            AI schedules, hosts, tracks, and summarizes every operating meeting — so your team focuses on shipping, not status.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-4">
          {/* Today's meetings */}
          <section className="col-span-12 lg:col-span-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Today's meetings</h2>
              <span className="text-[10px] mono uppercase tracking-wider text-muted-foreground">
                {meetings.length} sessions · auto-hosted
              </span>
            </div>
            <ol className="relative space-y-3">
              <span className="absolute left-[58px] top-2 bottom-2 w-px bg-border" />
              {meetings.map((m) => {
                const s = statusMap[m.status];
                return (
                  <li key={m.id} className="relative flex gap-4">
                    <div className="w-12 pt-3 text-right">
                      <div className="text-xs font-semibold text-foreground mono">{m.time}</div>
                    </div>
                    <div className="relative">
                      <span className={`absolute left-1 top-3.5 h-2 w-2 rounded-full ${m.status === "live" ? "bg-violet pulse-dot" : m.status === "done" ? "bg-success" : "bg-electric"}`} />
                    </div>
                    <div className="flex-1 glass-card rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-foreground truncate">{m.title}</h3>
                            <span className={`text-[10px] mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${s.cls}`}>{s.label}</span>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span>Hosted by</span>
                            <div className="flex -space-x-1.5">
                              {m.hosts.map((h) => (
                                <ModelAvatar key={h} name={h} accent={modelAccent(h)} size="sm" className="ring-2 ring-background" />
                              ))}
                            </div>
                            <span className="mono">{m.hosts.join(" + ")}</span>
                          </div>
                        </div>
                        {m.status === "live" && (
                          <button className="h-7 px-2.5 rounded-md gradient-accent text-[11px] font-medium text-accent-foreground flex items-center gap-1">
                            <Radio className="h-3 w-3" /> Join
                          </button>
                        )}
                      </div>
                      <ul className="mt-3 space-y-1.5">
                        {m.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-foreground/85">
                            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-success shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Side */}
          <aside className="col-span-12 lg:col-span-4 space-y-4">
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
                <ListChecks className="h-3.5 w-3.5" /> Agenda Generator
              </div>
              <ol className="mt-3 space-y-2">
                {agendaTemplate.map((a, i) => (
                  <li key={a} className="flex items-center gap-3 text-sm text-foreground/90">
                    <span className="h-5 w-5 grid place-items-center rounded-md border border-border bg-surface text-[10px] mono text-muted-foreground">{i + 1}</span>
                    {a}
                  </li>
                ))}
              </ol>
              <button className="mt-4 w-full h-9 rounded-md border border-border bg-surface hover:bg-surface-hover text-xs text-foreground transition-colors">
                Generate agenda for next meeting
              </button>
            </div>

            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
                <FileText className="h-3.5 w-3.5" /> Outputs · auto
              </div>
              <ul className="mt-3 space-y-2">
                {meetingOutputs.map((o) => {
                  const Icon = /Slack/.test(o) ? Slack : /Jira|Asana/.test(o) ? ListChecks : /memory/.test(o) ? Database : FileText;
                  return (
                    <li key={o} className="flex items-center gap-2.5 text-xs text-foreground/90">
                      <Icon className="h-3.5 w-3.5 text-electric" />
                      {o}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="glass-card-strong rounded-xl p-5 relative overflow-hidden">
              <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-violet/20 blur-3xl" />
              <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-wider text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Time Saved
              </div>
              <div className="mt-3 text-4xl font-semibold tracking-tight shimmer-text">
                {meetingsTimeSaved.hours} hrs
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                this week · {meetingsTimeSaved.automatedPct}% of PM overhead automated
              </div>
            </div>
          </aside>
        </div>
      </div>
    </OSLayout>
  );
};

export default Meetings;
