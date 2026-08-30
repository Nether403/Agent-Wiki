---
id: "interactive-magnetic-cursor"
name: "Interactive Magnetic Cursor"
category: "ui:motion"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "motion"
tags:
  - "framer-motion"
  - "motion/react"
  - "animation"
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

# Interactive Magnetic Cursor (`interactive-magnetic-cursor`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: framer-motion, motion/react, animation, wai-aria-compliant, spring-physics
- **Design Dials**: Variance 5/10 · Motion 8/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add interactive-magnetic-cursor

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/interactive-magnetic-cursor.json
```

## Peer Dependencies
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Fancy Components (https://fancycomponents.dev)
 * @author Fancy Components & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { motion, useSpring, useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";

export interface MagneticCursorProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  strength?: number;
  radius?: number;
}

export function InteractiveMagneticCursor({
  children,
  strength = 0.35,
  radius = 120,
  className,
  ...props
}: MagneticCursorProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < radius) {
      x.set(distX * strength);
      y.set(distY * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("inline-block p-4", className)}
      {...props}
    >
      <motion.div style={{ x, y }} className="inline-block">
        {children}
      </motion.div>
    </div>
  );
}

```
