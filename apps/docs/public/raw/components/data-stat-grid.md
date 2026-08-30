---
id: "data-stat-grid"
name: "Data Stat Grid"
category: "ui:editorial"
library_origin: "https://diagram.com"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "layout-block"
  - "analytical"
  - "metrics"
  - "grid"
  - "saas-dashboard"
dials:
  design_variance: 4      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 1     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 9       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Data Stat Grid (`data-stat-grid`)
> Asymmetrical metric showcase for SaaS analytics with high visual density and clean type.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, layout-block, analytical, metrics, grid, saas-dashboard
- **Design Dials**: Variance 4/10 · Motion 1/10 · Density 9/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add data-stat-grid

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/data-stat-grid.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin diagram-design (https://diagram.com)
 * @author diagram-design team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { TrendingUp, Activity, ShieldCheck, Zap } from "lucide-react";
import { cn } from "../lib/utils";

export interface StatItem {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  description: string;
}

export interface DataStatGridProps {
  stats?: StatItem[];
  className?: string;
}

const DEFAULT_STATS: StatItem[] = [
  {
    label: "Zero-Draft Fidelity",
    value: "94.8%",
    change: "+4.2%",
    isPositive: true,
    description: "First-run compile rate across AI agents",
  },
  {
    label: "Avg Payload Size",
    value: "11.2 KB",
    change: "-2.1 KB",
    isPositive: true,
    description: "Token footprint per component recipe",
  },
  {
    label: "Slop Conformance",
    value: "100/100",
    change: "Flawless",
    isPositive: true,
    description: "Anti-slop AST linter health index",
  },
  {
    label: "Resolver Latency",
    value: "0.82s",
    change: "-0.4s",
    isPositive: true,
    description: "CLI registry retrieval over CDN edge",
  },
];

export function DataStatGrid({ stats = DEFAULT_STATS, className }: DataStatGridProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {stats.map((stat, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                stat.isPositive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              {stat.change}
            </span>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {stat.value}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
        </div>
      ))}
    </div>
  );
}

```
