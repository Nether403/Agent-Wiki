---
id: "radial-gradient-mask"
name: "Radial Gradient Mask"
category: "ui:creative"
library_origin: "https://ui.aceternity.com"
dependencies:
  - "clsx"
  - "tailwind-merge"
  - "motion"
tags:
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "aceternity"
  - "mask"
  - "shader-simulation"
  - "creative"
  - "interactive"
dials:
  design_variance: 7      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Radial Gradient Mask (`radial-gradient-mask`)
> Interactive radial reveal mask on dotted matrix backdrop with pointer position tracking.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `LOW`
- **Technical Tags**: tailwind-v4, wai-aria-compliant, aceternity, mask, shader-simulation, creative, interactive
- **Design Dials**: Variance 7/10 · Motion 3/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add radial-gradient-mask

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/radial-gradient-mask.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Aceternity UI (https://ui.aceternity.com)
 * @author Manu Arora & Community
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface RadialGradientMaskProps extends React.HTMLAttributes<HTMLDivElement> {
  gridSize?: number;
  maskRadius?: number;
}

export function RadialGradientMask({
  gridSize = 24,
  maskRadius = 350,
  className,
  children,
  ...props
}: RadialGradientMaskProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: -1000, y: -1000 })}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-xs",
        className
      )}
      {...props}
    >
      {/* Background Grid Pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      {/* Interactive Radial Spotlight Mask */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 motion-reduce:hidden"
        style={{
          background: `radial-gradient(${maskRadius}px circle at ${mousePos.x}px ${mousePos.y}px, hsl(var(--primary) / 0.15), transparent 80%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

```
