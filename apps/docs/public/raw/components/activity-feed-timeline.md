---
id: "activity-feed-timeline"
name: "Activity Feed Timeline"
category: "ui:media"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Activity Feed Timeline (`activity-feed-timeline`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:media`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add activity-feed-timeline

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/activity-feed-timeline.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Community Contributor
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { CheckCircle2, GitCommit, AlertCircle, ShieldAlert, Sparkles, User } from "lucide-react";

export interface ActivityFeedItem {
  id: string;
  actor: string;
  action: string;
  target?: string;
  timestamp: string;
  type?: "success" | "warning" | "error" | "ai" | "default";
  avatarInitials?: string;
}

export interface ActivityFeedTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: ActivityFeedItem[];
}

const DEFAULT_ITEMS: ActivityFeedItem[] = [
  { id: "1", actor: "Design Agent", action: "Compiled registry with", target: "100+ UI components", timestamp: "Just now", type: "ai" },
  { id: "2", actor: "Tripwire Security", action: "Neutralized prompt injection attack on", target: "search_library", timestamp: "5m ago", type: "warning" },
  { id: "3", actor: "CI Pipeline", action: "Passed 100% on WCAG 2.1 AA", target: "A11y Linter", timestamp: "18m ago", type: "success" },
  { id: "4", actor: "Alex Chen", action: "Pushed 4 new components to", target: "primitives/", timestamp: "1h ago", type: "default", avatarInitials: "AC" },
];

export function ActivityFeedTimeline({
  items = DEFAULT_ITEMS,
  className,
  ...props
}: ActivityFeedTimelineProps) {
  return (
    <div
      className={cn("flex flex-col w-full max-w-lg p-4 rounded-xl border border-border bg-card shadow-xs", className)}
      role="feed"
      aria-label="Activity Audit Timeline"
      {...props}
    >
      <header className="flex items-center justify-between pb-3 border-b border-border mb-4">
        <h4 className="text-xs font-bold text-foreground">System Activity Feed</h4>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
          Live Telemetry
        </span>
      </header>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
        {items.map((item) => {
          return (
            <article key={item.id} className="relative flex items-start gap-3 text-xs" aria-label={`Activity: ${item.actor} ${item.action}`}>
              {/* Timeline marker node */}
              <div
                className={cn(
                  "absolute -left-6 top-0.5 flex items-center justify-center h-5 w-5 rounded-full border border-background shadow-xs text-white",
                  item.type === "success" && "bg-emerald-500",
                  item.type === "warning" && "bg-amber-500",
                  item.type === "error" && "bg-destructive",
                  item.type === "ai" && "bg-primary",
                  (!item.type || item.type === "default") && "bg-muted text-foreground border-border"
                )}
                aria-hidden="true"
              >
                {item.type === "success" && <CheckCircle2 className="h-3 w-3" />}
                {item.type === "warning" && <AlertCircle className="h-3 w-3" />}
                {item.type === "error" && <ShieldAlert className="h-3 w-3" />}
                {item.type === "ai" && <Sparkles className="h-3 w-3" />}
                {(!item.type || item.type === "default") && <GitCommit className="h-3 w-3 text-muted-foreground" />}
              </div>

              <div className="flex flex-col flex-1 space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-foreground">{item.actor}</span>
                  <span className="text-[10px] text-muted-foreground font-mono shrink-0">{item.timestamp}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {item.action}{" "}
                  {item.target && <span className="font-medium text-foreground font-mono">{item.target}</span>}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

```
