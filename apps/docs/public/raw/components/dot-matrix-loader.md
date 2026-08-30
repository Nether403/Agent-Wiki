---
id: "dot-matrix-loader"
name: "Dot Matrix Loader"
category: "ui:creative"
library_origin: "https://dotmatrix.dev"
dependencies:
  - "clsx"
  - "tailwind-merge"
  - "motion"
tags:
  - "wai-aria-compliant"
  - "utility"
  - "dot-matrix"
  - "canvas-pattern"
  - "loader"
  - "status"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 5     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Dot Matrix Loader (`dot-matrix-loader`)
> Animated dot matrix with wave oscillation, customizable matrix rows, and accessible status role.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `LOW`
- **Technical Tags**: wai-aria-compliant, utility, dot-matrix, canvas-pattern, loader, status
- **Design Dials**: Variance 6/10 · Motion 5/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add dot-matrix-loader

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/dot-matrix-loader.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Dot Matrix UI (https://dotmatrix.dev)
 * @author Dot Matrix Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface DotMatrixLoaderProps {
  rows?: number;
  cols?: number;
  dotSize?: number;
  gap?: number;
  className?: string;
  label?: string;
}

export function DotMatrixLoader({
  rows = 5,
  cols = 5,
  dotSize = 6,
  gap = 6,
  className,
  label = "Loading content",
}: DotMatrixLoaderProps) {
  const [activeFrame, setActiveFrame] = React.useState(0);

  React.useEffect(() => {
    const mediaQuery = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    if (mediaQuery?.matches) return;

    const timer = setInterval(() => {
      setActiveFrame((prev) => (prev + 1) % (rows + cols));
    }, 120);
    return () => clearInterval(timer);
  }, [rows, cols]);

  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-flex flex-col items-center justify-center p-4", className)}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
          gap: `${gap}px`,
        }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const distance = r + c;
          const isLit = (distance + activeFrame) % (rows + cols) < 3;

          return (
            <div
              key={i}
              style={{ width: dotSize, height: dotSize }}
              className={cn(
                "rounded-full transition-colors duration-150",
                isLit ? "bg-primary" : "bg-muted-foreground/20"
              )}
            />
          );
        })}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}

```
