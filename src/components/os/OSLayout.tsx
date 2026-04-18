import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Search, Bell, Command, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

export function OSLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 h-12 flex items-center gap-3 border-b border-border bg-background/70 backdrop-blur-xl px-3">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="h-4 w-px bg-border" />

            {/* Portfolio / workspace switcher */}
            <button className="group flex items-center gap-2 rounded-md px-2 py-1 hover:bg-surface-hover transition-colors">
              <span className="h-4 w-4 rounded-sm gradient-accent shadow-sm" />
              <span className="text-xs font-medium text-foreground">Northwind AI</span>
              <span className="text-[10px] mono uppercase tracking-wider text-muted-foreground">workspace</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>

            <div className="ml-auto flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search agents, decisions, memory…"
                  className="h-8 w-72 pl-8 pr-14 bg-surface border-border text-xs placeholder:text-muted-foreground/60"
                />
                <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] mono text-muted-foreground">
                  <Command className="h-2.5 w-2.5" />K
                </kbd>
              </div>
              <button className="relative h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-electric" />
              </button>
              <div className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1">
                <span className="pulse-dot bg-success" />
                <span className="text-[10px] mono uppercase tracking-wider text-muted-foreground">All systems</span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto relative">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] gradient-mesh opacity-70" />
            <div className="relative">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
