---
id: "funnel-conversion-chart"
name: "Funnel Conversion Chart"
category: "ui:editorial"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  # No external runtime dependencies
tags:
  - "tailwind-v4"
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Funnel Conversion Chart (`funnel-conversion-chart`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: tailwind-v4, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add funnel-conversion-chart

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/funnel-conversion-chart.json
```

## Peer Dependencies
- None

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

export interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
}

export interface FunnelConversionChartProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  stages?: FunnelStage[];
}

const DEFAULT_STAGES: FunnelStage[] = [
  { name: "1. Registry Search Queries", count: 124500, percentage: 100 },
  { name: "2. AST Slop Verification", count: 118200, percentage: 95 },
  { name: "3. Direct CLI Ingestion", count: 98400, percentage: 79 },
  { name: "4. Production Zero-Slop Assembly", count: 91500, percentage: 73 },
];

export function FunnelConversionChart({
  title = "Component Discovery & Conversion Funnel",
  stages = DEFAULT_STAGES,
  className,
  ...props
}: FunnelConversionChartProps) {
  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Conversion Funnel: ${title}`}
      {...props}
    >
      <header className="border-b border-border pb-3 mb-6">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Proportional funnel diagram tracking component progression through discovery and installation gates.
        </p>
      </header>

      <div className="flex flex-col space-y-3 w-full max-w-lg mx-auto py-2">
        {stages.map((stage, idx) => {
          const widthPct = Math.max(35, stage.percentage);
          return (
            <div key={stage.name} className="flex flex-col space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{stage.name}</span>
                <span className="font-mono text-muted-foreground">
                  {stage.count.toLocaleString()} ({stage.percentage}%)
                </span>
              </div>
              <div className="flex justify-center w-full">
                <div
                  style={{ width: `${widthPct}%` }}
                  className={cn(
                    "h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-xs border",
                    idx === 0 && "bg-primary/20 text-primary border-primary/40",
                    idx === 1 && "bg-primary/30 text-primary border-primary/50",
                    idx === 2 && "bg-primary/50 text-primary-foreground border-primary/70",
                    idx === 3 && "bg-primary text-primary-foreground border-primary"
                  )}
                >
                  {stage.percentage}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

```
