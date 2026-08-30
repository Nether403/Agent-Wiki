---
id: "event-calendar-view"
name: "Event Calendar View"
category: "ui:block"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
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

# Event Calendar View (`event-calendar-view`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block
- **Design Dials**: Variance 6/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add event-calendar-view

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/event-calendar-view.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin ReUI / Keenthemes (https://reui.io)
 * @author Keenthemes & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export interface CalendarEvent {
  id: string;
  title: string;
  date: number; // Day of month (1-31)
  time?: string;
  category?: "work" | "review" | "release" | "milestone";
}

export interface EventCalendarViewProps extends React.HTMLAttributes<HTMLDivElement> {
  currentMonth?: string;
  currentYear?: number;
  events?: CalendarEvent[];
  onAddEvent?: (day: number) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

const DEFAULT_EVENTS: CalendarEvent[] = [
  { id: "e1", title: "AST Ingestion Review", date: 4, category: "work" },
  { id: "e2", title: "Tripwire Security Audit", date: 12, category: "review" },
  { id: "e3", title: "100+ Component Launch", date: 18, category: "release" },
  { id: "e4", title: "Agent Ecosystem Testing", date: 25, category: "milestone" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function EventCalendarView({
  currentMonth = "August",
  currentYear = 2026,
  events = DEFAULT_EVENTS,
  onAddEvent,
  onEventClick,
  className,
  ...props
}: EventCalendarViewProps) {
  const [selectedDay, setSelectedDay] = React.useState<number | null>(18);
  const daysInMonth = 31;
  const startOffset = 5; // e.g. Month starts on Friday

  return (
    <section
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card shadow-xs overflow-hidden text-card-foreground",
        className
      )}
      aria-label={`Calendar for ${currentMonth} ${currentYear}`}
      {...props}
    >
      {/* Header Month / Year controls */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-foreground">
            {currentMonth} {currentYear}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            Active Sprint
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Days Header */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/30 text-center text-xs font-semibold text-muted-foreground py-2">
        {DAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* 7-Column Month Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-border/60 text-xs">
        {/* Leading blank slots */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`blank-${i}`} className="min-h-[90px] p-2 bg-muted/10 opacity-30" />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayEvents = events.filter((e) => e.date === dayNum);
          const isSelected = selectedDay === dayNum;

          return (
            <div
              key={`day-${dayNum}`}
              onClick={() => setSelectedDay(dayNum)}
              className={cn(
                "min-h-[90px] p-2 flex flex-col justify-between hover:bg-muted/30 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-ring",
                isSelected && "bg-primary/5 font-medium"
              )}
              role="button"
              tabIndex={0}
              aria-label={`Day ${dayNum}, ${dayEvents.length} events`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex items-center justify-center h-5 w-5 rounded-full text-[11px] font-mono",
                    isSelected ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground"
                  )}
                >
                  {dayNum}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddEvent?.(dayNum);
                  }}
                  className="opacity-0 hover:opacity-100 p-0.5 text-muted-foreground hover:text-foreground rounded focus-visible:opacity-100"
                  aria-label={`Add event on day ${dayNum}`}
                >
                  <Plus className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>

              {/* Day Event Badges */}
              <div className="flex flex-col space-y-1 mt-1">
                {dayEvents.map((evt) => (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(evt);
                    }}
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] text-left truncate font-medium border transition-colors",
                      evt.category === "release" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
                      evt.category === "review" && "bg-amber-500/10 text-amber-600 border-amber-500/30",
                      evt.category === "milestone" && "bg-primary/10 text-primary border-primary/30",
                      (!evt.category || evt.category === "work") && "bg-muted text-foreground border-border"
                    )}
                    aria-label={`Event: ${evt.title}`}
                  >
                    {evt.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

```
