---
id: "audit-timeline-stream"
name: "Audit Timeline Stream"
category: "ui:block"
library_origin: "https://github.com/primer/react"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
  - "block"
  - "timeline"
  - "audit"
  - "stream"
  - "primer"
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

# Audit Timeline Stream (`audit-timeline-stream`)
> Dense audit log with JSON diff expandable rows and actor attribution avatars.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block, block, timeline, audit, stream, primer
- **Design Dials**: Variance 5/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add audit-timeline-stream

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/audit-timeline-stream.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Primer React / Tremor UI
 * @author GitHub Primer Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useState } from "react";
import { ShieldCheck, ChevronDown, ChevronUp, Bot, Terminal, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuditEvent {
  id: string;
  actor: string;
  actorType: "agent" | "human" | "ci";
  action: string;
  timestamp: string;
  diffSummary: string;
  detailsJson: string;
}

export interface AuditTimelineStreamProps {
  events?: AuditEvent[];
  className?: string;
}

const DEFAULT_EVENTS: AuditEvent[] = [
  {
    id: "evt-101",
    actor: "harvester-bot",
    actorType: "agent",
    action: "Harvested Magic UI Gem Components",
    timestamp: "2 mins ago",
    diffSummary: "+6 files normalized to Tailwind v4",
    detailsJson: JSON.stringify({ codemod: "magic-ui-transformer.ts", status: "success", flags: 0 }, null, 2),
  },
  {
    id: "evt-102",
    actor: "axe-runner",
    actorType: "ci",
    action: "Automated WCAG 2.1 AA Audit Passed",
    timestamp: "10 mins ago",
    diffSummary: "100% compliance across all 154 items",
    detailsJson: JSON.stringify({ suite: "axe-runner.ts", violations: 0, score: 100 }, null, 2),
  },
  {
    id: "evt-103",
    actor: "lead-engineer",
    actorType: "human",
    action: "Tagged v1.2.0 Zero-Slop Registry Release",
    timestamp: "1 hour ago",
    diffSummary: "Signed commit sha: 7f9a1c4",
    detailsJson: JSON.stringify({ release: "v1.2.0", signoff: true }, null, 2),
  },
];

export function AuditTimelineStream({
  events = DEFAULT_EVENTS,
  className,
}: AuditTimelineStreamProps) {
  const [expandedEventId, setExpandedEventId] = useState<string | null>("evt-101");

  const toggleExpand = (id: string) => {
    setExpandedEventId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card text-foreground overflow-hidden shadow-sm",
        className
      )}
      role="region"
      aria-label="Audit Timeline Stream"
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" />
          <span className="text-xs font-mono font-medium tracking-tight">
            AUDIT_STREAM // IMMUTABLE_LOG
          </span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">LIVE LEDGER</span>
      </div>

      <div className="p-4 divide-y divide-border">
        {events.map((event) => {
          const isExpanded = expandedEventId === event.id;

          return (
            <div key={event.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted/60 text-foreground">
                    {event.actorType === "agent" ? (
                      <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{event.action}</span>
                      <span className="rounded bg-muted px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground">
                        {event.actor}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{event.diffSummary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {event.timestamp}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleExpand(event.id)}
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? "Collapse audit event details" : "Expand audit event details"}
                    className="p-1 rounded-md border border-border bg-background transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-2.5 rounded-lg border border-border bg-muted/30 p-3">
                  <pre className="font-mono text-[11px] text-muted-foreground overflow-x-auto">
                    <code>{event.detailsJson}</code>
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

```
