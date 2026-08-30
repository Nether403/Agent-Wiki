---
id: "dynamic-island-telemetry"
name: "Dynamic Island Telemetry"
category: "ui:motion"
library_origin: "https://smoothui.dev"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
  - "motion"
tags:
  - "lucide-react"
  - "bento-grid"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
  - "motion"
  - "telemetry"
  - "dynamic-island"
  - "smoothui"
  - "hud"
  - "status-pill"
dials:
  design_variance: 7      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 5     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Dynamic Island Telemetry (`dynamic-island-telemetry`)
> Morphing floating status pill that expands from a compact badge into a full agent token and latency HUD.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, keyboard-accessible, wai-aria-compliant, layout-block, motion, telemetry, dynamic-island, smoothui, hud, status-pill
- **Design Dials**: Variance 7/10 · Motion 5/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add dynamic-island-telemetry

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/dynamic-island-telemetry.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin SmoothUI (https://smoothui.dev)
 * @author SmoothUI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Sparkles, Terminal, Activity, ChevronDown, ChevronUp, Zap, Cpu } from "lucide-react";

export type TelemetryState = "idle" | "reasoning" | "executing" | "verified" | "error";

export interface DynamicIslandTelemetryProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: TelemetryState;
  modelName?: string;
  tokensConsumed?: number;
  latencyMs?: number;
  activeSubagents?: number;
  currentAction?: string;
}

export function DynamicIslandTelemetry({
  state = "executing",
  modelName = "claude-3-7-sonnet",
  tokensConsumed = 14280,
  latencyMs = 412,
  activeSubagents = 2,
  currentAction = "AST Dial Classification & Slop Linting",
  className,
  ...props
}: DynamicIslandTelemetryProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const stateColors: Record<TelemetryState, { dot: string; text: string; bg: string }> = {
    idle: { dot: "bg-muted-foreground", text: "text-muted-foreground", bg: "bg-muted/40" },
    reasoning: { dot: "bg-amber-500", text: "text-amber-500", bg: "bg-amber-500/10" },
    executing: { dot: "bg-primary", text: "text-primary", bg: "bg-primary/10" },
    verified: { dot: "bg-emerald-500", text: "text-emerald-500", bg: "bg-emerald-500/10" },
    error: { dot: "bg-destructive", text: "text-destructive", bg: "bg-destructive/10" },
  };

  const currentTheme = stateColors[state] || stateColors.executing;

  return (
    <div className="relative inline-flex flex-col items-center select-none" {...props}>
      {/* Dynamic Island Capsule Container */}
      <div
        className={cn(
          "rounded-3xl bg-zinc-950 text-white border border-zinc-800/80 shadow-2xl transition-[width,padding,colors] motion-reduce:transition-none duration-200 overflow-hidden flex flex-col cursor-pointer",
          isExpanded ? "w-[340px] sm:w-[400px] p-4.5 rounded-2xl" : "w-auto px-4 py-2 hover:border-zinc-700",
          className
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        role="region"
        aria-expanded={isExpanded}
        aria-label="Agent Dynamic Island Telemetry"
      >
        {/* Compact View Pill */}
        <div className="flex items-center justify-between gap-3 w-full">
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <span className={cn("h-2.5 w-2.5 rounded-full animate-pulse", currentTheme.dot)} aria-hidden="true" />
            <span className="text-xs font-bold tracking-tight capitalize text-white">
              {state}
            </span>
          </div>

          {/* Middle Action / Token Summary */}
          {!isExpanded ? (
            <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
              <span className="truncate max-w-[140px]">{currentAction}</span>
              <span className="text-zinc-500">|</span>
              <span className="text-primary font-semibold">{tokensConsumed.toLocaleString()} tkn</span>
            </div>
          ) : (
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
              {modelName}
            </span>
          )}

          {/* Expand / Collapse Icon */}
          <button
            type="button"
            aria-label={isExpanded ? "Collapse telemetry" : "Expand telemetry"}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Expanded Telemetry HUD Body */}
        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-col gap-3 text-xs animate-in fade-in duration-200">
            {/* Current Action Banner */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800">
              <Terminal className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-zinc-500 font-mono block">ACTIVE INSTRUCTION</span>
                <p className="text-xs text-zinc-200 font-medium truncate">{currentAction}</p>
              </div>
            </div>

            {/* Metrics Telemetry Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col">
                <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                  <Zap className="h-2.5 w-2.5 text-amber-400" aria-hidden="true" /> TOKENS
                </span>
                <span className="text-xs font-bold text-white font-mono mt-0.5">
                  {tokensConsumed.toLocaleString()}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col">
                <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                  <Activity className="h-2.5 w-2.5 text-emerald-400" aria-hidden="true" /> LATENCY
                </span>
                <span className="text-xs font-bold text-white font-mono mt-0.5">
                  {latencyMs}ms
                </span>
              </div>

              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col">
                <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                  <Cpu className="h-2.5 w-2.5 text-primary" aria-hidden="true" /> AGENTS
                </span>
                <span className="text-xs font-bold text-white font-mono mt-0.5">
                  {activeSubagents} Active
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

```
