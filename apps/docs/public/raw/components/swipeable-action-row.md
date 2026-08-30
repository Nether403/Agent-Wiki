---
id: "swipeable-action-row"
name: "Swipeable Mobile Action Row"
category: "ui:motion"
library_origin: "https://smoothui.dev"
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
  - "motion"
  - "gesture"
  - "swipeable"
  - "mobile"
  - "smooth-ui"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 6     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Swipeable Mobile Action Row (`swipeable-action-row`)
> Mobile-first list item supporting horizontal swipe gestures to reveal delete, archive, and pin action triggers.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block, motion, gesture, swipeable, mobile, smooth-ui
- **Design Dials**: Variance 5/10 · Motion 6/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add swipeable-action-row

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/swipeable-action-row.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin SmoothUI (https://smoothui.dev)
 * @author SmoothUI Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Trash2, Archive, Pin, ChevronLeft } from "lucide-react";

export interface SwipeableActionRowProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  badge?: string;
  onDelete?: () => void;
  onArchive?: () => void;
  onPin?: () => void;
}

export function SwipeableActionRow({
  title = "Refactor components to Tailwind v4 tokens",
  subtitle = "Modified 14 files · 35 rules checked",
  badge = "Updated",
  onDelete,
  onArchive,
  onPin,
  className,
  ...props
}: SwipeableActionRowProps) {
  const [offsetX, setOffsetX] = React.useState(0);
  const startXRef = React.useRef(0);
  const isDraggingRef = React.useRef(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    if (diff < 0) {
      setOffsetX(Math.max(-160, diff));
    } else {
      setOffsetX(Math.min(60, diff));
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    if (offsetX < -80) {
      setOffsetX(-150);
    } else {
      setOffsetX(0);
    }
  };

  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xs select-none",
        className
      )}
      role="listitem"
      aria-label={`Action item: ${title}`}
      {...props}
    >
      {/* Background Action Triggers (Revealed on Swipe) */}
      <div className="absolute inset-y-0 right-0 flex items-center gap-1 px-3 bg-muted/80">
        <button
          type="button"
          onClick={() => {
            onPin?.();
            setOffsetX(0);
          }}
          aria-label="Pin Item"
          className="flex flex-col items-center justify-center h-10 w-10 rounded-xl bg-blue-500 text-white shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <Pin className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => {
            onArchive?.();
            setOffsetX(0);
          }}
          aria-label="Archive Item"
          className="flex flex-col items-center justify-center h-10 w-10 rounded-xl bg-amber-500 text-white shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <Archive className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => {
            onDelete?.();
            setOffsetX(0);
          }}
          aria-label="Delete Item"
          className="flex flex-col items-center justify-center h-10 w-10 rounded-xl bg-destructive text-destructive-foreground shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Foreground Content Card */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${offsetX}px)` }}
        className="relative z-10 flex items-center justify-between w-full p-4 bg-card border-r border-border/40 transition-transform duration-150"
      >
        <div className="flex flex-col space-y-1 min-w-0 pr-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-foreground truncate">{title}</span>
            {badge && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOffsetX((prev) => (prev === 0 ? -150 : 0))}
          aria-label="Reveal actions"
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

```
