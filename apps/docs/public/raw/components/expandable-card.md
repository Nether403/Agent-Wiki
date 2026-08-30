---
id: "expandable-card"
name: "Expandable Card"
category: "ui:motion"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "motion"
  - "lucide-react"
tags:
  - "framer-motion"
  - "motion/react"
  - "animation"
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "spring-physics"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 8     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Expandable Card (`expandable-card`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: framer-motion, motion/react, animation, lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, spring-physics
- **Design Dials**: Variance 5/10 · Motion 8/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add expandable-card

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/expandable-card.json
```

## Peer Dependencies
- `motion`
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin ibelick / motion-primitives (https://motion-primitives.com)
 * @author ibelick & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";
import { ChevronDown } from "lucide-react";

export interface ExpandableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function ExpandableCard({
  title,
  subtitle,
  children,
  defaultExpanded = false,
  className,
  ...props
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card text-card-foreground shadow-xs overflow-hidden transition-colors",
        className
      )}
      {...props}
    >
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex items-center justify-between p-4 text-left w-full hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={isExpanded}
        aria-label={`Toggle card: ${title}`}
      >
        <div className="flex flex-col">
          <h4 className="text-xs font-bold text-foreground">{title}</h4>
          {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground"
        >
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </motion.div>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="px-4 pb-4 pt-1 border-t border-border/40 text-xs text-muted-foreground"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}

```
