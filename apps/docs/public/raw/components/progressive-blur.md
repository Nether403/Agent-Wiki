---
id: "progressive-blur"
name: "Progressive Blur"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "motion"
tags:
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Progressive Blur (`progressive-blur`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `LOW`
- **Technical Tags**: wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add progressive-blur

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/progressive-blur.json
```

## Peer Dependencies
- `motion`

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
import { cn } from "../lib/utils";

export interface ProgressiveBlurProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "top" | "bottom" | "left" | "right";
  blurLayers?: number;
  maxBlur?: number;
}

export function ProgressiveBlur({
  direction = "bottom",
  blurLayers = 6,
  maxBlur = 12,
  className,
  ...props
}: ProgressiveBlurProps) {
  const layers = Array.from({ length: blurLayers }, (_, i) => {
    const step = (i + 1) / blurLayers;
    const blurPx = step * maxBlur;
    return { step, blurPx };
  });

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-24 overflow-hidden",
        direction === "top" && "inset-x-0 top-0 bottom-auto",
        direction === "left" && "inset-y-0 left-0 right-auto w-24 h-full",
        direction === "right" && "inset-y-0 right-0 left-auto w-24 h-full",
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {layers.map(({ step, blurPx }, idx) => (
        <div
          key={idx}
          style={{
            backdropFilter: `blur(${blurPx.toFixed(1)}px)`,
            WebkitBackdropFilter: `blur(${blurPx.toFixed(1)}px)`,
            maskImage: `linear-gradient(to ${direction}, rgba(0,0,0,0) ${(idx / blurLayers) * 100}%, rgba(0,0,0,1) ${step * 100}%)`,
            WebkitMaskImage: `linear-gradient(to ${direction}, rgba(0,0,0,0) ${(idx / blurLayers) * 100}%, rgba(0,0,0,1) ${step * 100}%)`,
          }}
          className="absolute inset-0"
        />
      ))}
    </div>
  );
}

```
