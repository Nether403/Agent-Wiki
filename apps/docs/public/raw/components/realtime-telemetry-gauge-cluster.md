---
id: "realtime-telemetry-gauge-cluster"
name: "Realtime Telemetry Gauge Cluster"
category: "ui:editorial"
library_origin: "https://cloudscape.design"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "cloudscape"
  - "primer"
  - "telemetry"
  - "gauges"
  - "dashboard"
  - "metrics"
dials:
  design_variance: 4      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Realtime Telemetry Gauge Cluster (`realtime-telemetry-gauge-cluster`)
> SVG circular telemetry cluster for CPU/memory loads, edge latency percentiles, and SLA target indicators.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, wai-aria-compliant, cloudscape, primer, telemetry, gauges, dashboard, metrics
- **Design Dials**: Variance 4/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add realtime-telemetry-gauge-cluster

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/realtime-telemetry-gauge-cluster.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @origin Cloudscape Design & GitHub Primer (https://cloudscape.design, https://primer.style)
 * @license Apache-2.0
 * @author Amazon Web Services & GitHub Primer Team
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { Activity, Cpu, Server, Wifi, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TelemetryMetric {
  id: string;
  name: string;
  value: number; // 0-100 percentage
  unit: string;
  status: "normal" | "warning" | "critical";
  subtitle: string;
}

export interface RealtimeTelemetryGaugeClusterProps {
  clusterName?: string;
  metrics?: TelemetryMetric[];
  className?: string;
}

const DEFAULT_METRICS: TelemetryMetric[] = [
  { id: "cpu", name: "Host CPU Load", value: 34, unit: "%", status: "normal", subtitle: "8 Cores Active" },
  { id: "memory", name: "Memory Allocated", value: 68, unit: "%", status: "normal", subtitle: "10.8 / 16 GB" },
  { id: "latency", name: "Edge p99 Latency", value: 18, unit: "ms", status: "normal", subtitle: "Cloudflare CDN" },
  { id: "mcp-eval", name: "MCP Zero-Draft", value: 99, unit: "%", status: "normal", subtitle: "0 High Flags" },
];

export function RealtimeTelemetryGaugeCluster({
  clusterName = "Edge MCP Telemetry Cluster",
  metrics = DEFAULT_METRICS,
  className,
}: RealtimeTelemetryGaugeClusterProps) {
  return (
    <div className={cn("w-full space-y-4 rounded-xl border border-border bg-card p-5 shadow-xs select-none", className)}>
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" role="img" aria-hidden="true" />
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {clusterName}
          </h3>
        </div>
        <span className="flex items-center gap-1 text-2xs font-mono text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-3 w-3" role="img" aria-hidden="true" /> Live Monitored
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const radius = 32;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (metric.value / 100) * circumference;

          return (
            <div
              key={metric.id}
              className="flex items-center gap-3.5 rounded-lg border border-border/70 bg-background/80 p-3.5"
            >
              {/* Circular SVG Gauge */}
              <div className="relative h-16 w-16 shrink-0 flex items-center justify-center">
                <svg className="h-16 w-16 -rotate-90" viewBox="0 0 80 80" role="img" aria-label={`${metric.name}: ${metric.value}${metric.unit}`}>
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    className="stroke-muted"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    className={cn(
                      "transition-all duration-500",
                      metric.status === "normal"
                        ? "stroke-primary"
                        : metric.status === "warning"
                        ? "stroke-amber-500"
                        : "stroke-destructive"
                    )}
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-foreground">
                  {metric.value}
                  <span className="text-3xs font-normal text-muted-foreground">{metric.unit}</span>
                </div>
              </div>

              <div className="space-y-0.5 min-w-0">
                <div className="text-xs font-semibold text-foreground truncate">
                  {metric.name}
                </div>
                <div className="text-3xs font-mono text-muted-foreground truncate">
                  {metric.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

```
