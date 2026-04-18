import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, Bot, Send, Brain, Radio, Terminal, Settings,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const nav = [
  { title: "Dashboard",      url: "/",          icon: LayoutDashboard },
  { title: "AI Workforce",   url: "/workforce", icon: Bot },
  { title: "Dispatch",       url: "/dispatch",  icon: Send },
  { title: "Memory",         url: "/memory",    icon: Brain },
  
  { title: "Signal Engine",  url: "/signal",    icon: Radio },
  { title: "Command Center", url: "/command",   icon: Terminal },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 shrink-0 rounded-lg gradient-accent grid place-items-center shadow-md">
            <span className="text-[15px] font-bold text-accent-foreground leading-none tracking-tighter">A</span>
            <span className="absolute -inset-px rounded-lg ring-1 ring-white/10" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold text-foreground tracking-tight">AgentOS</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mono">v1.0 · founder</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70 mono">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-9">
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-2.5 rounded-md px-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-9">
              <Settings className="h-4 w-4" />
              {!collapsed && <span className="text-sm">Settings</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {!collapsed && (
          <div className="mt-2 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-2.5 py-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full gradient-accent grid place-items-center text-[11px] font-semibold text-accent-foreground">
                AK
              </div>
              <div className="leading-tight min-w-0">
                <div className="text-xs font-medium text-foreground truncate">Alex Kim</div>
                <div className="text-[10px] text-muted-foreground truncate">Founder · Northwind AI</div>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
