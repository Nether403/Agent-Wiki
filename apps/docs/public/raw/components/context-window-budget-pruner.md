---
id: "context-window-budget-pruner"
name: "Context Window Budget Pruner"
category: "ui:ai-native"
library_origin: "https://design-wiki.dev"
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
  - "token-budget"
  - "context-window"
  - "compression"
  - "ai-native"
  - "memory-pruner"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Context Window Budget Pruner (`context-window-budget-pruner`)
> Interactive context window token pruner and compressor allowing selective pruning across system prompts, tools, and chat memory.

- **Taxonomy Category**: `ui:ai-native`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block, token-budget, context-window, compression, ai-native, memory-pruner
- **Design Dials**: Variance 5/10 · Motion 3/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add context-window-budget-pruner

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/context-window-budget-pruner.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Category: ui:ai-native
 * Name: context-window-budget-pruner
 */

import * as React from "react";
import { Cpu, Scissors, Sliders, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export interface ContextSegment {
  id: string;
  name: string;
  tokens: number;
  maxTokens: number;
  color: string;
  canPrune: boolean;
  isPruned: boolean;
  description: string;
}

export interface ContextWindowBudgetPrunerProps {
  modelMaxContext?: number;
  warningThreshold?: number;
  initialSegments?: ContextSegment[];
  onPruneSegment?: (segmentId: string, pruned: boolean) => void;
  className?: string;
}

export const ContextWindowBudgetPruner: React.FC<ContextWindowBudgetPrunerProps> = ({
  modelMaxContext = 128000,
  warningThreshold = 100000,
  initialSegments = [
    {
      id: "system-prompt",
      name: "System Prompt & Agent Rules",
      tokens: 4200,
      maxTokens: 4200,
      color: "bg-sky-500",
      canPrune: true,
      isPruned: false,
      description: "Strip non-essential markdown comments and formatting boilerplate (-35% tokens).",
    },
    {
      id: "mcp-tools",
      name: "MCP Tools Schema Definition",
      tokens: 18500,
      maxTokens: 18500,
      color: "bg-emerald-500",
      canPrune: true,
      isPruned: false,
      description: "Prune descriptions of uncalled lazy MCP tools (<15KB payload budget).",
    },
    {
      id: "agent-memory",
      name: "Knowledge Graph / Long-Term Memory",
      tokens: 24000,
      maxTokens: 24000,
      color: "bg-amber-500",
      canPrune: true,
      isPruned: false,
      description: "Filter out low-relevance knowledge nodes and expired episodic memories.",
    },
    {
      id: "chat-history",
      name: "Conversation Turn History",
      tokens: 46200,
      maxTokens: 46200,
      color: "bg-violet-500",
      canPrune: true,
      isPruned: false,
      description: "Summarize earlier user turns and collapse repetitive tool call outputs.",
    },
  ],
  onPruneSegment,
  className = "",
}) => {
  const [segments, setSegments] = React.useState<ContextSegment[]>(initialSegments);

  const togglePrune = (id: string) => {
    setSegments((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const next = !s.isPruned;
          onPruneSegment?.(id, next);
          return {
            ...s,
            isPruned: next,
            tokens: next ? Math.round(s.maxTokens * 0.5) : s.maxTokens,
          };
        }
        return s;
      })
    );
  };

  const totalTokens = segments.reduce((sum, s) => sum + s.tokens, 0);
  const totalMax = segments.reduce((sum, s) => sum + s.maxTokens, 0);
  const totalSaved = totalMax - totalTokens;
  const usagePercentage = Math.min(100, Math.round((totalTokens / modelMaxContext) * 100));

  const isOverWarning = totalTokens > warningThreshold;

  return (
    <section
      aria-label="Context Window Budget Pruner"
      className={`flex flex-col w-full max-w-3xl mx-auto p-6 rounded-2xl bg-card border border-border text-card-foreground shadow-xl ${className}`}
    >
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Cpu className="w-5 h-5" role="img" aria-label="Context CPU" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground tracking-tight">Context Window Token Pruner</h2>
            <p className="text-xs text-muted-foreground">Optimize agent context budget and avoid truncation.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOverWarning ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              High Context Pressure
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Safe Budget Margin
            </span>
          )}
        </div>
      </header>

      {/* Main Budget Bar */}
      <div className="my-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>
            Used: <strong className="text-foreground">{totalTokens.toLocaleString()}</strong> / {modelMaxContext.toLocaleString()} Tokens
          </span>
          <span className="font-semibold text-primary">{usagePercentage}% Capacity</span>
        </div>

        {/* Multi-segment progress bar */}
        <div
          role="progressbar"
          aria-valuenow={usagePercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Context Window Allocation"
          className="relative flex h-4 w-full rounded-full bg-muted/60 overflow-hidden border border-border"
        >
          {segments.map((seg) => {
            const widthPct = (seg.tokens / modelMaxContext) * 100;
            return (
              <div
                key={seg.id}
                style={{ width: `${widthPct}%` }}
                className={`h-full ${seg.color} transition-transform duration-200 relative group`}
                title={`${seg.name}: ${seg.tokens.toLocaleString()} tokens`}
              />
            );
          })}
        </div>

        {/* Savings Badge */}
        {totalSaved > 0 && (
          <div className="flex items-center justify-end gap-1.5 text-xs text-emerald-400 font-mono pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active Pruning Saved {totalSaved.toLocaleString()} Tokens (~{Math.round((totalSaved / totalMax) * 100)}%)</span>
          </div>
        )}
      </div>

      {/* Segment Controllers */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Context Segment Allocations</h3>
        <div className="divide-y divide-border rounded-xl border border-border bg-background overflow-hidden font-mono text-xs">
          {segments.map((seg) => (
            <div
              key={seg.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-muted/20 transition-colors"
            >
              <div className="space-y-1 max-w-md">
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${seg.color}`} />
                  <h4 className="font-semibold text-foreground">{seg.name}</h4>
                  <span className="text-muted-foreground">({seg.tokens.toLocaleString()} tokens)</span>
                </div>
                <p className="text-[11px] font-sans text-muted-foreground">{seg.description}</p>
              </div>

              <button
                type="button"
                onClick={() => togglePrune(seg.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  seg.isPruned
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                    : "bg-muted border-border text-foreground hover:bg-muted/80"
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                {seg.isPruned ? "Pruned (50%)" : "Prune Segment"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <footer className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-primary" role="img" aria-label="Settings" />
          <span>Dynamic compression algorithm powered by AST Token Reducer</span>
        </div>
        <span className="font-mono text-[11px]">WCAG 2.1 AA Compliant</span>
      </footer>
    </section>
  );
};
export default ContextWindowBudgetPruner;

```
