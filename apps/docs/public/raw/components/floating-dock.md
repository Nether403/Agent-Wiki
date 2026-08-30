---
id: "floating-dock"
name: "Floating Dock"
category: "ui:motion"
library_origin: "https://ui.aceternity.com"
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
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "spring-physics"
  - "micro-interaction"
  - "dock"
  - "macos-style"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 8     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 4       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Floating Dock (`floating-dock`)
> macOS-style interactive dock with mouse proximity magnification and spring physics.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: framer-motion, motion/react, animation, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, spring-physics, micro-interaction, dock, macos-style
- **Design Dials**: Variance 6/10 · Motion 8/10 · Density 4/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add floating-dock

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/floating-dock.json
```

## Peer Dependencies
- `motion`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Aceternity UI (https://ui.aceternity.com)
 * @author Manu Arora
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "../lib/utils";

export interface DockItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface FloatingDockProps {
  items: DockItem[];
  className?: string;
}

function DockIcon({
  mouseX,
  item,
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  item: DockItem;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 68, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      className="relative flex aspect-square cursor-pointer items-center justify-center rounded-full bg-secondary/80 text-secondary-foreground shadow-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={item.onClick}
      role="button"
      tabIndex={0}
      aria-label={item.title}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          item.onClick?.();
        }
      }}
    >
      <div className="flex items-center justify-center pointer-events-none">
        {item.icon}
      </div>
    </motion.div>
  );
}

export function FloatingDock({ items, className }: FloatingDockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex h-16 items-end gap-3 rounded-2xl border border-border bg-card px-4 pb-3 shadow-md",
        className
      )}
      role="toolbar"
      aria-label="Application dock"
    >
      {items.map((item, index) => (
        <DockIcon key={index} mouseX={mouseX} item={item} />
      ))}
    </div>
  );
}

```
