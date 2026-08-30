---
id: "ai-context-token-flamegraph"
name: "A I Context Token Flamegraph"
category: "ui:ai-native"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "neon-scifi"
  - "wai-aria-compliant"
  - "ai-native"
  - "agent-ui"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# A I Context Token Flamegraph (`ai-context-token-flamegraph`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:ai-native`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, neon-scifi, wai-aria-compliant, ai-native, agent-ui
- **Design Dials**: Variance 6/10 · Motion 4/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add ai-context-token-flamegraph

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/ai-context-token-flamegraph.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki (https://design-wiki.agent)
 * @author Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useState } from "react";
import { Cpu, AlertTriangle, Layers, Info } from "lucide-react";

export interface ContextSegment {
  id: string;
  name: string;
  tokens: number;
  color: string;
  description: string;
}

export interface AIContextTokenFlamegraphProps {
  maxContextTokens?: number;
  segments?: ContextSegment[];
  modelName?: string;
  className?: string;
}

export function AIContextTokenFlamegraph({
  maxContextTokens = 128000,
  segments = [
    { id: "sys", name: "System Instructions & Rules", tokens: 8400, color: "bg-blue-500", description: "Universal agent guidelines and style rulesets" },
    { id: "rag", name: "Retrieved Documentation (RAG)", tokens: 24500, color: "bg-emerald-500", description: "Context7 and documentation payloads" },
    { id: "hist", name: "Conversation Turn History", tokens: 36200, color: "bg-amber-500", description: "Prior messages and subagent transcripts" },
    { id: "tools", name: "Tool Execution Results", tokens: 18900, color: "bg-purple-500", description: "Command outputs, AST syntax trees and file reads" },
    { id: "draft", name: "Active Draft Buffer", tokens: 4100, color: "bg-cyan-500", description: "Pending generation output token budget" },
  ],
  modelName = "Gemini 3.7 Flash",
  className = "",
}: AIContextTokenFlamegraphProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const totalUsed = segments.reduce((sum, s) => sum + s.tokens, 0);
  const percentUsed = Math.round((totalUsed / maxContextTokens) * 100);
  const activeSegment = segments.find((s) => s.id === hoveredId);

  return (
    <div className={"w-full rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm " + className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Cpu className="w-4 h-4" role="img" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">Context Window Flamegraph</h3>
            <span className="text-xs text-muted-foreground font-mono">{modelName} • {maxContextTokens.toLocaleString()} tokens max</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground">
            Used: <strong className="text-foreground font-mono">{totalUsed.toLocaleString()}</strong> ({percentUsed}%)
          </span>
          {percentUsed > 80 && (
            <span className="inline-flex items-center gap-1 text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" role="img" aria-hidden="true" />
              High Usage
            </span>
          )}
        </div>
      </div>

      {/* Flamegraph Bar */}
      <div className="my-5">
        <div 
          className="w-full h-7 rounded-lg overflow-hidden flex bg-muted/60 p-0.5 border border-border/80"
          role="meter"
          aria-valuenow={totalUsed}
          aria-valuemin={0}
          aria-valuemax={maxContextTokens}
          aria-label="Context window token allocation"
        >
          {segments.map((seg) => {
            const widthPct = (seg.tokens / maxContextTokens) * 100;
            const isHovered = seg.id === hoveredId;
            return (
              <div
                key={seg.id}
                style={{ width: `${widthPct}%` }}
                onMouseEnter={() => setHoveredId(seg.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`h-full ${seg.color} transition-opacity cursor-pointer relative ${
                  hoveredId && !isHovered ? "opacity-40" : "opacity-90 hover:opacity-100"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Segment Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
        {segments.map((seg) => {
          const isSelected = seg.id === hoveredId;
          return (
            <div
              key={seg.id}
              onMouseEnter={() => setHoveredId(seg.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={
                "p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between " +
                (isSelected ? "border-primary bg-primary/5" : "border-border/60 bg-background/50 hover:bg-muted/30")
              }
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2.5 h-2.5 rounded-full ${seg.color}`} aria-hidden="true" />
                <span className="text-xs font-medium text-foreground truncate">{seg.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>{seg.tokens.toLocaleString()} tok</span>
                <span>{Math.round((seg.tokens / totalUsed) * 100)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip detail */}
      {activeSegment && (
        <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border flex items-start gap-2 text-xs">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" role="img" aria-hidden="true" />
          <div>
            <span className="font-semibold text-foreground">{activeSegment.name}: </span>
            <span className="text-muted-foreground">{activeSegment.description}</span>
          </div>
        </div>
      )}
    </div>
  );
}

```
