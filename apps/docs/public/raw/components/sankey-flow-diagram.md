---
id: "sankey-flow-diagram"
name: "Sankey Flow Stream Diagram"
category: "ui:editorial"
library_origin: "https://github.com/cathrynlavery/diagram-design"
dependencies:
  - "clsx"
  - "tailwind-merge"
tags:
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "editorial"
  - "diagram"
  - "sankey"
  - "flow-chart"
  - "data-viz"
  - "diagram-design"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Sankey Flow Stream Diagram (`sankey-flow-diagram`)
> Node-to-node stream flow diagram illustrating distribution, funnel loss, and channel routing.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: tailwind-v4, wai-aria-compliant, editorial, diagram, sankey, flow-chart, data-viz, diagram-design
- **Design Dials**: Variance 6/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add sankey-flow-diagram

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/sankey-flow-diagram.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin diagram-design (https://github.com/cathrynlavery/diagram-design)
 * @author cathrynlavery & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface SankeyFlowDiagramProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  sourceTotal?: string;
}

export function SankeyFlowDiagram({
  title = "Agent Token & Context Distribution Flow",
  sourceTotal = "100k Input Tokens",
  className,
  ...props
}: SankeyFlowDiagramProps) {
  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm space-y-4",
        className
      )}
      role="region"
      aria-label={`Sankey Stream Flow Diagram: ${title}`}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </h3>
          <p className="text-xs font-mono text-muted-foreground mt-0.5">
            Upstream: <span className="font-semibold text-foreground">{sourceTotal}</span>
          </p>
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox="0 0 680 260"
          className="w-full h-auto overflow-visible"
          role="img"
          aria-label="Sankey flow diagram connecting input tokens to tool calls, reasoning steps, and final response tokens"
        >
          <defs>
            <linearGradient id="flowGrad1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-primary, #3b82f6)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--color-primary, #3b82f6)" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="flowGrad2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-primary, #3b82f6)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="flowGrad3" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-primary, #3b82f6)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Source Node: Master Input */}
          <rect x="20" y="40" width="14" height="180" rx="4" className="fill-primary" />
          <text x="44" y="125" className="fill-foreground text-xs font-semibold">
            Raw User & System Prompt
          </text>
          <text x="44" y="142" className="fill-muted-foreground text-[10px] font-mono">
            100,000 Tokens (100%)
          </text>

          {/* Curved Flow Streams */}
          {/* Stream 1 -> AST Parsing & Rules */}
          <path
            d="M 34 50 C 200 50, 240 40, 360 40 L 360 90 C 240 90, 200 110, 34 110 Z"
            fill="url(#flowGrad1)"
          />
          {/* Stream 2 -> MCP Tool Invocations */}
          <path
            d="M 34 115 C 200 115, 240 120, 360 120 L 360 175 C 240 175, 200 180, 34 180 Z"
            fill="url(#flowGrad2)"
          />
          {/* Stream 3 -> Code Synthesis Output */}
          <path
            d="M 34 185 C 200 185, 240 200, 360 200 L 360 230 C 240 230, 200 220, 34 220 Z"
            fill="url(#flowGrad3)"
          />

          {/* Mid Level Destination Nodes */}
          {/* Node 1 */}
          <rect x="360" y="30" width="12" height="70" rx="3" className="fill-primary/80" />
          <text x="382" y="60" className="fill-foreground text-xs font-semibold">
            Rulepack Ingestion & AST
          </text>
          <text x="382" y="76" className="fill-muted-foreground text-[10px] font-mono">
            42,000 Tokens (42%)
          </text>

          {/* Node 2 */}
          <rect x="360" y="115" width="12" height="65" rx="3" className="fill-emerald-500" />
          <text x="382" y="145" className="fill-foreground text-xs font-semibold">
            MCP Tool Context Payloads
          </text>
          <text x="382" y="161" className="fill-muted-foreground text-[10px] font-mono">
            38,000 Tokens (38%)
          </text>

          {/* Node 3 */}
          <rect x="360" y="195" width="12" height="40" rx="3" className="fill-amber-500" />
          <text x="382" y="215" className="fill-foreground text-xs font-semibold">
            Generated Code Output
          </text>
          <text x="382" y="229" className="fill-muted-foreground text-[10px] font-mono">
            20,000 Tokens (20%)
          </text>
        </svg>
      </div>
    </figure>
  );
}

```
