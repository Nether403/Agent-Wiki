---
id: "cycle-loop-diagram"
name: "Cycle Loop Diagram"
category: "ui:editorial"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "editorial"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 1     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 10       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Cycle Loop Diagram (`cycle-loop-diagram`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, wai-aria-compliant, editorial
- **Design Dials**: Variance 5/10 · Motion 1/10 · Density 10/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add cycle-loop-diagram

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/cycle-loop-diagram.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin diagram-design (https://github.com/cathrynlavery/diagram-design)
 * @author Cathryn Lavery & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { RefreshCw } from "lucide-react";

export interface CycleNode {
  label: string;
  step: number;
}

export interface CycleLoopDiagramProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

const DEFAULT_NODES: CycleNode[] = [
  { step: 1, label: "Discover (MCP Search)" },
  { step: 2, label: "Install (Auto CLI)" },
  { step: 3, label: "Constrain (A11y AA)" },
  { step: 4, label: "Audit (30 Slop Rules)" },
];

export function CycleLoopDiagram({
  title = "Continuous 4-Phase Execution Loop",
  className,
  ...props
}: CycleLoopDiagramProps) {
  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Cycle Loop Diagram: ${title}`}
      {...props}
    >
      <header className="border-b border-border pb-3 mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Iterative execution lifecycle preventing regression and ensuring zero-slop delivery.
          </p>
        </div>
        <RefreshCw className="h-4 w-4 text-primary" aria-hidden="true" />
      </header>

      <div className="relative w-full overflow-x-auto py-2">
        <svg
          viewBox="0 0 500 240"
          className="w-full max-w-md mx-auto h-auto overflow-visible"
          role="img"
          aria-label="4-step cyclical feedback loop"
        >
          {/* Circular Track */}
          <circle
            cx="250"
            cy="120"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="text-muted-foreground/40"
          />

          {/* Node 1: Top (Discover) */}
          <g transform="translate(190, 10)">
            <rect width="120" height="40" rx="6" fill="currentColor" className="text-primary/10 stroke-primary/50 stroke-1" />
            <text x="60" y="24" textAnchor="middle" className="fill-primary text-[10px] font-bold">
              1. Discover
            </text>
          </g>

          {/* Node 2: Right (Install) */}
          <g transform="translate(345, 100)">
            <rect width="120" height="40" rx="6" fill="currentColor" className="text-muted/30 stroke-border stroke-1" />
            <text x="60" y="24" textAnchor="middle" className="fill-foreground text-[10px] font-bold">
              2. Install
            </text>
          </g>

          {/* Node 3: Bottom (Constrain) */}
          <g transform="translate(190, 190)">
            <rect width="120" height="40" rx="6" fill="currentColor" className="text-muted/30 stroke-border stroke-1" />
            <text x="60" y="24" textAnchor="middle" className="fill-foreground text-[10px] font-bold">
              3. Constrain
            </text>
          </g>

          {/* Node 4: Left (Audit) */}
          <g transform="translate(35, 100)">
            <rect width="120" height="40" rx="6" fill="currentColor" className="text-emerald-500/10 stroke-emerald-500/50 stroke-1" />
            <text x="60" y="24" textAnchor="middle" className="fill-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
              4. Audit Slop
            </text>
          </g>

          {/* Center Hub */}
          <circle cx="250" cy="120" r="25" fill="currentColor" className="text-primary text-primary-foreground" />
          <text x="250" y="124" textAnchor="middle" className="fill-primary-foreground text-[9px] font-black">
            WIKI
          </text>
        </svg>
      </div>
    </figure>
  );
}

```
