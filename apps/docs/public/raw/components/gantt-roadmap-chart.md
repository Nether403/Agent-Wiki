---
id: "gantt-roadmap-chart"
name: "Gantt Project Roadmap Chart"
category: "ui:editorial"
library_origin: "https://github.com/cathrynlavery/diagram-design"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "layout-block"
  - "chart"
  - "gantt"
  - "roadmap"
  - "timeline"
  - "diagram-design"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Gantt Project Roadmap Chart (`gantt-roadmap-chart`)
> Timeline schedule view with milestone bars, category grouping, and progress percentage markers.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, wai-aria-compliant, layout-block, chart, gantt, roadmap, timeline, diagram-design
- **Design Dials**: Variance 6/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add gantt-roadmap-chart

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/gantt-roadmap-chart.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin diagram-design / ReUI (https://reui.io)
 * @author cathrynlavery & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Calendar, CheckCircle2, Clock } from "lucide-react";

export interface GanttTask {
  id: string;
  name: string;
  category?: string;
  startMonth: number; // 0 to 5 (Jan to Jun)
  durationMonths: number; // e.g. 2
  progress: number; // 0 to 100
  color?: string;
}

export interface GanttRoadmapChartProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  months?: string[];
  tasks?: GanttTask[];
}

const DEFAULT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const DEFAULT_TASKS: GanttTask[] = [
  { id: "t1", name: "35 Anti-Slop Rule Matrix", category: "Core Guardrails", startMonth: 0, durationMonths: 2, progress: 100, color: "bg-primary" },
  { id: "t2", name: "AI-Native Component Primitives", category: "Component Kit", startMonth: 1, durationMonths: 3, progress: 85, color: "bg-emerald-500" },
  { id: "t3", name: "Semantic Vector Search in MCP", category: "MCP Server", startMonth: 2, durationMonths: 2, progress: 60, color: "bg-blue-500" },
  { id: "t4", name: "Headless Axe-Core Eval Runner", category: "CI Harness", startMonth: 3, durationMonths: 2, progress: 30, color: "bg-amber-500" },
  { id: "t5", name: "175+ Component Full Catalog Sync", category: "Release", startMonth: 4, durationMonths: 2, progress: 10, color: "bg-purple-500" },
];

export function GanttRoadmapChart({
  title = "Machine-First Design Agent Wiki Roadmap",
  months = DEFAULT_MONTHS,
  tasks = DEFAULT_TASKS,
  className,
  ...props
}: GanttRoadmapChartProps) {
  const [hoveredTaskId, setHoveredTaskId] = React.useState<string | null>(null);

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm space-y-4 overflow-x-auto",
        className
      )}
      role="region"
      aria-label={`Gantt Project Schedule Roadmap: ${title}`}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </h3>
          <p className="text-sm font-semibold text-foreground mt-0.5">
            Engineering & Component Sprint Horizon
          </p>
        </div>
      </div>

      {/* Gantt Matrix Grid */}
      <div className="min-w-[620px] space-y-3">
        {/* Timeline Months Header */}
        <div className="grid grid-cols-12 gap-2 text-xs font-mono font-semibold text-muted-foreground border-b border-border pb-2">
          <div className="col-span-4">Milestone / Initiative</div>
          {months.map((m) => (
            <div key={m} className="col-span-1 text-center font-medium">
              {m}
            </div>
          ))}
          <div className="col-span-2 text-right">Progress</div>
        </div>

        {/* Task Rows */}
        <div className="space-y-2">
          {tasks.map((task) => {
            const isHovered = hoveredTaskId === task.id;
            const leftCol = task.startMonth;
            const widthCol = task.durationMonths;

            return (
              <div
                key={task.id}
                onMouseEnter={() => setHoveredTaskId(task.id)}
                onMouseLeave={() => setHoveredTaskId(null)}
                className={cn(
                  "grid grid-cols-12 gap-2 items-center py-2 px-2 rounded-xl transition-colors",
                  isHovered ? "bg-muted/60" : "hover:bg-muted/30"
                )}
              >
                {/* Task Name & Category */}
                <div className="col-span-4 pr-2">
                  <span className="font-semibold text-xs text-foreground block truncate">
                    {task.name}
                  </span>
                  {task.category && (
                    <span className="text-[10px] text-muted-foreground block truncate">
                      {task.category}
                    </span>
                  )}
                </div>

                {/* Timeline Bar Range */}
                <div className="col-span-6 relative h-6 flex items-center">
                  <div
                    style={{
                      left: `${(leftCol / months.length) * 100}%`,
                      width: `${(widthCol / months.length) * 100}%`,
                    }}
                    className={cn(
                      "absolute h-5 rounded-lg text-primary-foreground text-[10px] font-mono font-semibold flex items-center px-2 shadow-xs transition-all duration-150 overflow-hidden",
                      task.color || "bg-primary"
                    )}
                  >
                    {/* Progress Fill inside Bar */}
                    <div
                      style={{ width: `${task.progress}%` }}
                      className="absolute inset-0 bg-white/20"
                    />
                    <span className="relative z-10 truncate">{task.progress}%</span>
                  </div>
                </div>

                {/* Status Column */}
                <div className="col-span-2 text-right text-xs font-mono text-muted-foreground flex items-center justify-end gap-1.5">
                  {task.progress === 100 ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                  ) : (
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  )}
                  <span>{task.progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

```
