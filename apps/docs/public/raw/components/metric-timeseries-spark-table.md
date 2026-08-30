---
id: "metric-timeseries-spark-table"
name: "Metric Timeseries Spark Table"
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

# Metric Timeseries Spark Table (`metric-timeseries-spark-table`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, wai-aria-compliant, editorial
- **Design Dials**: Variance 5/10 · Motion 1/10 · Density 10/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add metric-timeseries-spark-table

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/metric-timeseries-spark-table.json
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
import { TrendingUp, TrendingDown, Activity, ArrowUpDown } from "lucide-react";

export interface MetricRow {
  id: string;
  name: string;
  category: string;
  value: string;
  deltaPct: number;
  sparkline: number[];
  status: "nominal" | "warning" | "critical";
}

export interface MetricTimeseriesSparkTableProps {
  metrics?: MetricRow[];
  title?: string;
  className?: string;
}

export function MetricTimeseriesSparkTable({
  metrics = [
    { id: "1", name: "Inference Latency P99", category: "Performance", value: "312ms", deltaPct: -14.2, sparkline: [420, 390, 370, 340, 312], status: "nominal" },
    { id: "2", name: "Cache Hit Ratio", category: "Memory", value: "94.8%", deltaPct: 4.6, sparkline: [88, 90, 91, 93, 94.8], status: "nominal" },
    { id: "3", name: "WCAG Contrast Violations", category: "Accessibility", value: "0", deltaPct: -100, sparkline: [12, 8, 4, 1, 0], status: "nominal" },
    { id: "4", name: "Token Burn Rate", category: "Cost", value: "1.2k/min", deltaPct: 28.4, sparkline: [700, 850, 920, 1100, 1200], status: "warning" },
  ],
  title = "Telemetry & System Vitals",
  className = "",
}: MetricTimeseriesSparkTableProps) {
  return (
    <div className={"w-full rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm " + className}>
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Activity className="w-4 h-4" role="img" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">{title}</h3>
            <span className="text-xs text-muted-foreground font-mono">High-Density Telemetry Matrix</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto my-3">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="pb-2 font-medium">METRIC</th>
              <th className="pb-2 font-medium">CATEGORY</th>
              <th className="pb-2 font-medium text-right">VALUE</th>
              <th className="pb-2 font-medium text-right">TREND (24H)</th>
              <th className="pb-2 font-medium text-right">SPARKLINE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {metrics.map((m) => {
              const isPositive = m.deltaPct >= 0;
              return (
                <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 font-medium text-foreground">{m.name}</td>
                  <td className="py-2.5 text-muted-foreground">{m.category}</td>
                  <td className="py-2.5 text-right font-bold text-foreground">{m.value}</td>
                  <td className="py-2.5 text-right">
                    <span
                      className={
                        "inline-flex items-center gap-0.5 " +
                        (m.status === "warning" ? "text-amber-500" : isPositive ? "text-emerald-500" : "text-blue-500")
                      }
                    >
                      {isPositive ? <TrendingUp className="w-3 h-3" role="img" aria-hidden="true" /> : <TrendingDown className="w-3 h-3" role="img" aria-hidden="true" />}
                      {m.deltaPct > 0 ? `+${m.deltaPct}%` : `${m.deltaPct}%`}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <svg className="w-16 h-5 ml-auto overflow-visible" role="img" aria-label={`Trend sparkline for ${m.name}`}>
                      <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                        points={m.sparkline
                          .map((val, idx) => {
                            const min = Math.min(...m.sparkline);
                            const max = Math.max(...m.sparkline) || 1;
                            const x = (idx / (m.sparkline.length - 1)) * 64;
                            const y = 18 - ((val - min) / (max - min || 1)) * 16;
                            return `${x},${y}`;
                          })
                          .join(" ")}
                      />
                    </svg>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

```
