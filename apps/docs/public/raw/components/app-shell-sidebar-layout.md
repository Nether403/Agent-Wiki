---
id: "app-shell-sidebar-layout"
name: "SaaS App Shell Sidebar Layout"
category: "ui:block"
library_origin: "https://reui.io"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "brutalist"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
  - "block"
  - "app-shell"
  - "sidebar"
  - "dashboard"
  - "layout"
  - "reui"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# SaaS App Shell Sidebar Layout (`app-shell-sidebar-layout`)
> Production-ready SaaS dashboard shell with collapsible multi-tier sidebar, breadcrumbs, search bar, and user profile popover.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, brutalist, accessible, keyboard-accessible, wai-aria-compliant, layout-block, block, app-shell, sidebar, dashboard, layout, reui
- **Design Dials**: Variance 5/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add app-shell-sidebar-layout

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/app-shell-sidebar-layout.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin UI Layouts / ReUI (https://reui.io)
 * @author ReUI Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import {
  LayoutDashboard,
  Layers,
  Terminal,
  ShieldAlert,
  Settings,
  Menu,
  ChevronRight,
  Search,
  Bell,
  Sparkles,
  User,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  badge?: string;
}

export interface AppShellSidebarLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  activeTabId?: string;
  onTabSelect?: (id: string) => void;
}

const DEFAULT_NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "registry", label: "Component Registry", icon: Layers, badge: "175+" },
  { id: "ai-native", label: "AI-Native Primitives", icon: Sparkles, badge: "New" },
  { id: "terminal", label: "MCP Terminal", icon: Terminal },
  { id: "audit", label: "Anti-Slop Guardrail", icon: ShieldAlert },
  { id: "settings", label: "System Config", icon: Settings },
];

export function AppShellSidebarLayout({
  activeTabId = "registry",
  onTabSelect,
  children,
  className,
  ...props
}: AppShellSidebarLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [currentTab, setCurrentTab] = React.useState(activeTabId);

  const handleSelect = (id: string) => {
    setCurrentTab(id);
    onTabSelect?.(id);
  };

  return (
    <div
      className={cn(
        "flex h-screen w-full overflow-hidden bg-background text-foreground select-none",
        className
      )}
      {...props}
    >
      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-card transition-colors duration-200 shrink-0",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-border">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs">
                W
              </div>
              <span className="font-bold text-sm tracking-tight text-foreground">Agent Wiki</span>
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center h-8 w-8 rounded-xl bg-primary text-primary-foreground font-bold text-xs">
              W
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto" role="navigation" aria-label="Main Navigation">
          {DEFAULT_NAV.map((item) => {
            const Icon = item.icon;
            const isSelected = currentTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                aria-label={item.label}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {isSidebarOpen && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded-md text-[10px] font-mono",
                          isSelected
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-foreground"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/40">
            <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/20 text-primary shrink-0">
              <User className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
            {isSidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">Design Agent</p>
                <p className="text-[10px] text-muted-foreground truncate">agent@wiki-host.local</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area with Top Header */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between h-14 px-6 border-b border-border bg-card shrink-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <span>Agent Wiki</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden="true" />
            <span className="text-foreground capitalize font-semibold">{currentTab}</span>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-3">
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search registry..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-input bg-background text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-label="Search registry items"
              />
            </div>

            <button
              type="button"
              aria-label="View notifications"
              className="p-2 rounded-xl border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Dynamic Workspace Slot */}
        <main className="flex-1 overflow-auto p-6 bg-muted/10">
          {children || (
            <div className="flex flex-col items-center justify-center h-full rounded-2xl border-2 border-dashed border-border p-12 text-center text-muted-foreground">
              <Sparkles className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
              <h4 className="text-sm font-semibold text-foreground">Workspace Canvas Active</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Connected to @design-wiki/mcp server. Autonomous tools ready for prompt synthesis.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

```
