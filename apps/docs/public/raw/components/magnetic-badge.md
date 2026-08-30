---
id: "magnetic-badge"
name: "Magnetic Badge"
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
  - "wai-aria-compliant"
  - "spring-physics"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 8     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Magnetic Badge (`magnetic-badge`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: framer-motion, motion/react, animation, lucide-react, wai-aria-compliant, spring-physics
- **Design Dials**: Variance 5/10 · Motion 8/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add magnetic-badge

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/magnetic-badge.json
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
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "../lib/utils";
import { Sparkles } from "lucide-react";

export interface MagneticBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  range?: number;
}

export function MagneticBadge({
  children,
  range = 25,
  className,
  ...props
}: MagneticBadgeProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    mouseX.set(distanceX * 0.3);
    mouseY.set(distanceY * 0.3);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border border-primary/40 bg-primary/10 text-primary shadow-xs cursor-pointer select-none focus-within:ring-2 focus-within:ring-ring",
        className
      )}
      tabIndex={0}
      role="status"
      {...props}
    >
      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{children}</span>
    </motion.div>
  );
}

```
