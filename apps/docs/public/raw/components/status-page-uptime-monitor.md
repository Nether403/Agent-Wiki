---
id: "status-page-uptime-monitor"
name: "Status Page Uptime Monitor"
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

# Status Page Uptime Monitor (`status-page-uptime-monitor`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, wai-aria-compliant, editorial
- **Design Dials**: Variance 5/10 · Motion 1/10 · Density 10/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add status-page-uptime-monitor

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/status-page-uptime-monitor.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Tremor & Tailark (https://tailark.com)
 * @author Tremor & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export interface ServiceStatus {
  name: string;
  uptimeRate: number; // e.g. 99.98
  status: "operational" | "degraded" | "outage";
  history: Array<"up" | "degraded" | "down">; // 30 or 60 days
}

export interface StatusPageProps extends React.HTMLAttributes<HTMLDivElement> {
  services: ServiceStatus[];
  overallStatus?: "All Systems Operational" | "Active Incident" | "Maintenance";
}

export function StatusPageUptimeMonitor({
  services,
  overallStatus = "All Systems Operational",
  className,
  ...props
}: StatusPageProps) {
  const statusColors = {
    up: "bg-emerald-500 hover:bg-emerald-400",
    degraded: "bg-amber-500 hover:bg-amber-400",
    down: "bg-rose-500 hover:bg-rose-400",
  };

  return (
    <section className={cn("mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6", className)} {...props}>
      {/* Global System Banner */}
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">{overallStatus}</h2>
            <p className="text-xs text-muted-foreground">Updated in real-time via telemetry heartbeat</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 font-mono text-xs font-semibold text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          SLA Verified
        </span>
      </div>

      {/* Services List */}
      <div className="space-y-4" role="region" aria-label="Individual service uptime monitors">
        {services.map((svc) => (
          <div
            key={svc.name}
            className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground text-sm sm:text-base">{svc.name}</span>
                <div className="text-xs text-muted-foreground font-mono">
                  {svc.uptimeRate}% uptime in the past 60 days
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                Operational
              </span>
            </div>

            {/* Day by day mini status bars */}
            <div className="flex items-center gap-1 overflow-hidden" aria-hidden="true">
              {svc.history.map((dayStatus, idx) => (
                <div
                  key={idx}
                  className={cn("h-7 flex-1 rounded-xs transition-colors", statusColors[dayStatus])}
                  title={`Day ${idx + 1}: ${dayStatus}`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>60 days ago</span>
              <span>Today</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

```
