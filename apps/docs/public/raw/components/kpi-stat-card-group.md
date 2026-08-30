---
id: "kpi-stat-card-group"
name: "KPI Stat Card Group"
category: "ui:block"
library_origin: "https://github.com/tremorlabs/tremor"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "editorial"
  - "block"
  - "kpi"
  - "dashboard"
  - "analytics"
  - "tremor"
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

# KPI Stat Card Group (`kpi-stat-card-group`)
> Multi-metric comparison cards with inline delta percentages, target thresholds, and mini sparklines.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, wai-aria-compliant, editorial, block, kpi, dashboard, analytics, tremor
- **Design Dials**: Variance 5/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add kpi-stat-card-group

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/kpi-stat-card-group.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license Apache-2.0
 * @origin Tremor UI (https://github.com/tremorlabs/tremor)
 * @author Tremor Labs & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KpiMetric {
  id: string;
  title: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
  target: string;
  sparklineData: number[];
}

export interface KpiStatCardGroupProps {
  metrics?: KpiMetric[];
  className?: string;
}

const DEFAULT_METRICS: KpiMetric[] = [
  { id: "m1", title: "API Request Throughput", value: "2.4M", delta: "+14.2%", trend: "up", target: "2.0M target", sparklineData: [40, 55, 60, 75, 80, 95] },
  { id: "m2", title: "Mean Latency (P95)", value: "32ms", delta: "-4.8%", trend: "up", target: "< 45ms target", sparklineData: [45, 42, 38, 35, 34, 32] },
  { id: "m3", title: "Zero-Slop Health Score", value: "100%", delta: "0.0%", trend: "neutral", target: "100% threshold", sparklineData: [100, 100, 100, 100, 100, 100] },
  { id: "m4", title: "A11y Violations", value: "0", delta: "-100%", trend: "up", target: "0 max allowed", sparklineData: [4, 2, 1, 0, 0, 0] },
];

export function KpiStatCardGroup({
  metrics = DEFAULT_METRICS,
  className,
}: KpiStatCardGroupProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full", className)}>
      {metrics.map((metric) => {
        const TrendIcon =
          metric.trend === "up"
            ? TrendingUp
            : metric.trend === "down"
            ? TrendingDown
            : Minus;

        const isPositive =
          metric.trend === "up" || (metric.trend === "neutral" && metric.delta === "0.0%");

        return (
          <div
            key={metric.id}
            className="flex flex-col rounded-xl border border-border bg-card p-4 text-foreground shadow-sm transition-colors hover:border-muted-foreground/40"
          >
            <span className="text-xs font-medium text-muted-foreground">{metric.title}</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight">{metric.value}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs font-medium",
                  isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
                )}
              >
                <TrendIcon className="h-3 w-3" aria-hidden="true" />
                {metric.delta}
              </span>
            </div>

            {/* Sparkline mini-track */}
            <div className="mt-3 flex items-end gap-1 h-6 w-full pt-1" aria-hidden="true">
              {metric.sparklineData.map((val, idx) => {
                const max = Math.max(...metric.sparklineData, 1);
                const heightPct = Math.max(15, Math.round((val / max) * 100));
                return (
                  <div
                    key={idx}
                    className="flex-1 rounded-xs bg-primary/20 transition-all hover:bg-primary"
                    style={{ height: `${heightPct}%` }}
                  />
                );
              })}
            </div>

            <div className="mt-3 border-t border-border/60 pt-2 text-[11px] font-mono text-muted-foreground flex justify-between">
              <span>TARGET</span>
              <span>{metric.target}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

```
