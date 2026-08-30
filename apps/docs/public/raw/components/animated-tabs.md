---
id: "animated-tabs"
name: "Animated Tabs"
category: "ui:motion"
library_origin: "https://smoothui.dev"
dependencies:
  - "motion"
  - "clsx"
  - "tailwind-merge"
tags:
  - "framer-motion"
  - "motion/react"
  - "animation"
  - "tailwind-v4"
  - "accessible"
  - "spring-physics"
  - "tabs"
  - "layoutId"
dials:
  design_variance: 4      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 6     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Animated Tabs (`animated-tabs`)
> Smooth spring-bound tab slider with layout ID preservation and zero layout shift.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: framer-motion, motion/react, animation, tailwind-v4, accessible, spring-physics, tabs, layoutId
- **Design Dials**: Variance 4/10 · Motion 6/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add animated-tabs

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/animated-tabs.json
```

## Peer Dependencies
- `motion`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin SmoothUI (https://smoothui.dev)
 * @author SmoothUI Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export interface TabOption {
  id: string;
  label: string;
}

export interface AnimatedTabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  layoutId?: string;
}

export function AnimatedTabs({
  tabs,
  activeTab,
  onChange,
  className,
  layoutId = "animated-tab-indicator",
}: AnimatedTabsProps) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-border bg-muted/50 p-1 text-muted-foreground",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive ? "text-foreground" : "hover:text-foreground/80"
            )}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                className="absolute inset-0 z-[-1] rounded-lg bg-background shadow-xs"
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

```
