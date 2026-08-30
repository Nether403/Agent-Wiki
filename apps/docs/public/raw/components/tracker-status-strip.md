---
id: "tracker-status-strip"
name: "Tracker Status Strip"
category: "ui:editorial"
library_origin: "https://github.com/tremorlabs/tremor"
dependencies:
  - "clsx"
  - "tailwind-merge"
tags:
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "editorial"
  - "status"
  - "uptime"
  - "kpi"
  - "tremor"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Tracker Status Strip (`tracker-status-strip`)
> Segmented uptime and agent activity status strip with colored state blocks and tooltips.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `LOW`
- **Technical Tags**: tailwind-v4, wai-aria-compliant, editorial, status, uptime, kpi, tremor
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add tracker-status-strip

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/tracker-status-strip.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @origin Tremor (https://github.com/tremorlabs/tremor)
 * @license Apache-2.0
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface StatusTrackerItem {
  color?: "emerald" | "amber" | "rose" | "zinc";
  tooltip?: string;
}

export interface TrackerStatusStripProps extends React.HTMLAttributes<HTMLDivElement> {
  data: StatusTrackerItem[];
  label?: string;
  uptimePercentage?: string;
}

const colorMap = {
  emerald: "bg-emerald-500 hover:bg-emerald-400",
  amber: "bg-amber-500 hover:bg-amber-400",
  rose: "bg-rose-500 hover:bg-rose-400",
  zinc: "bg-zinc-700 hover:bg-zinc-600",
};

export function TrackerStatusStrip({
  data,
  label = "Agent Execution Uptime",
  uptimePercentage = "99.95%",
  className,
  ...props
}: TrackerStatusStripProps) {
  return (
    <div
      className={cn("w-full space-y-2 p-4 rounded-xl border border-border bg-card", className)}
      role="region"
      aria-label={label}
      {...props}
    >
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-mono text-muted-foreground font-semibold">{uptimePercentage}</span>
      </div>

      <div className="flex items-center gap-1 h-8 w-full overflow-hidden" role="list">
        {data.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "flex-1 h-full rounded-sm transition-colors cursor-pointer",
              colorMap[item.color || "emerald"]
            )}
            title={item.tooltip || `Day ${idx + 1}: Operational`}
            role="listitem"
          />
        ))}
      </div>
    </div>
  );
}

```
