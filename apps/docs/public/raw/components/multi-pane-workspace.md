---
id: "multi-pane-workspace"
name: "Multi-Pane Workspace"
category: "ui:block"
library_origin: "https://github.com/microsoft/fluentui"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
  - "cloudscape"
  - "fluent"
  - "ide"
  - "workspace"
  - "multi-pane"
  - "layout"
  - "dock"
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

# Multi-Pane Workspace (`multi-pane-workspace`)
> Enterprise 3-pane responsive IDE workbench layout with collapsible tree explorer, central editor, and live telemetry drawer.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block, cloudscape, fluent, ide, workspace, multi-pane, layout, dock
- **Design Dials**: Variance 5/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add multi-pane-workspace

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/multi-pane-workspace.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @origin Machine-First Design Agent Wiki (Cloudscape / Fluent Workspace Archetype)
 * @license MIT
 * @curated-by Antigravity & manus-research
 */
"use client";

import React, { useState } from "react";
import {
  Sidebar,
  PanelRightClose,
  PanelRightOpen,
  FolderTree,
  Terminal,
  Code2,
  Settings,
  Activity,
  Layers,
  FileCode,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface MultiPaneWorkspaceProps {
  title?: string;
  initialLeftOpen?: boolean;
  initialRightOpen?: boolean;
  className?: string;
}

export function MultiPaneWorkspace({
  title = "Agent IDE Studio",
  initialLeftOpen = true,
  initialRightOpen = true,
  className,
}: MultiPaneWorkspaceProps) {
  const [leftOpen, setLeftOpen] = useState(initialLeftOpen);
  const [rightOpen, setRightOpen] = useState(initialRightOpen);
  const [activeTab, setActiveTab] = useState<"editor" | "terminal">("editor");

  return (
    <div
      className={cn(
        "flex h-[560px] w-full flex-col overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-sm transition-colors",
        className
      )}
      role="region"
      aria-label="Multi-Pane Workspace Workbench"
    >
      {/* Top Application Header */}
      <header className="flex h-11 items-center justify-between border-b border-border bg-card px-4 text-card-foreground">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLeftOpen(!leftOpen)}
            aria-label={leftOpen ? "Collapse navigation sidebar" : "Expand navigation sidebar"}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Sidebar className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-tight text-foreground">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border border-border bg-background p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("editor")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeTab === "editor" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Code2 className="h-3 w-3" aria-hidden="true" />
              Source Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("terminal")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeTab === "terminal" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Terminal className="h-3 w-3" aria-hidden="true" />
              Agent Console
            </button>
          </div>

          <button
            type="button"
            onClick={() => setRightOpen(!rightOpen)}
            aria-label={rightOpen ? "Collapse telemetry drawer" : "Expand telemetry drawer"}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {rightOpen ? <PanelRightClose className="h-4 w-4" aria-hidden="true" /> : <PanelRightOpen className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </header>

      {/* Main 3-Pane Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Explorer Pane */}
        {leftOpen && (
          <aside
            className="w-56 border-r border-border bg-card/60 p-3 text-xs transition-colors"
            role="complementary"
            aria-label="File Tree Explorer"
          >
            <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
              <FolderTree className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Project Navigation</span>
            </div>
            <ul className="mt-3 space-y-1" role="tree">
              <li className="flex items-center gap-2 rounded-md bg-accent/60 px-2.5 py-1.5 text-accent-foreground font-medium">
                <FileCode className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>page.tsx</span>
              </li>
              <li className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
                <FileCode className="h-3.5 w-3.5" aria-hidden="true" />
                <span>layout.tsx</span>
              </li>
              <li className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
                <Settings className="h-3.5 w-3.5" aria-hidden="true" />
                <span>tokens.json</span>
              </li>
            </ul>
          </aside>
        )}

        {/* Center Main Stage */}
        <main className="flex flex-1 flex-col overflow-hidden bg-background p-4" role="main">
          {activeTab === "editor" ? (
            <div className="flex h-full flex-col rounded-lg border border-border bg-card p-4 font-mono text-xs text-foreground">
              <div className="flex items-center justify-between border-b border-border pb-2 text-muted-foreground">
                <span>src/app/page.tsx</span>
                <span className="text-[10px] text-emerald-500 font-semibold">● Live Sync</span>
              </div>
              <pre className="mt-3 flex-1 overflow-auto text-xs text-foreground leading-relaxed">
{`export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border p-4">
        <h1 className="text-xl font-bold tracking-tight">Zero-Slop Dashboard</h1>
      </header>
      <main className="p-6">
        <FacetedQueryBuilder />
      </main>
    </div>
  );
}`}
              </pre>
            </div>
          ) : (
            <div className="flex h-full flex-col rounded-lg border border-border bg-zinc-950 p-4 font-mono text-xs text-zinc-200">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-zinc-400">
                <span>Agent Execution Terminal (PID: 4082)</span>
                <span className="text-[10px] text-emerald-400">Connected</span>
              </div>
              <div className="mt-3 space-y-1 text-xs text-zinc-300">
                <p className="text-zinc-500">[02:03:12] Agent MCP Server connected via stdio.</p>
                <p className="text-emerald-400">[02:03:14] ✓ Zero-Slop Health Check: 100/100 (S-Grade).</p>
                <p className="text-zinc-300">[02:03:15] Synthesizing multi-pane workspace layout...</p>
                <p className="text-blue-400">[02:03:16] Ready for agent tool invocations.</p>
              </div>
            </div>
          )}
        </main>

        {/* Right Telemetry Drawer */}
        {rightOpen && (
          <aside
            className="w-64 border-l border-border bg-card/60 p-4 text-xs transition-colors"
            role="complementary"
            aria-label="Agent Telemetry & Properties"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Activity className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>Session Metrics</span>
              </div>
              <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Active
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground">Token Context Window</span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-foreground">4,280 / 128k</span>
                  <span className="text-[11px] font-semibold text-emerald-500">3.3%</span>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background p-3">
                <span className="text-[11px] text-muted-foreground">Active Taste Dials</span>
                <div className="mt-2 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Variance:</span>
                    <span className="font-semibold text-foreground">5 / 10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Motion:</span>
                    <span className="font-semibold text-foreground">4 / 10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Density:</span>
                    <span className="font-semibold text-foreground">8 / 10</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

```
