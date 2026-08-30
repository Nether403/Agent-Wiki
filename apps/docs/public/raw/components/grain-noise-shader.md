---
id: "grain-noise-shader"
name: "Grain Noise Shader"
category: "ui:creative"
library_origin: "https://github.com/paper-design/shaders"
dependencies:
  - "motion"
  - "three"
  - "clsx"
  - "tailwind-merge"
tags:
  - "framer-motion"
  - "motion/react"
  - "animation"
  - "webgl"
  - "threejs"
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "canvas"
  - "creative"
  - "noise"
  - "shader"
  - "svg"
  - "paper-shaders"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Grain Noise Shader (`grain-noise-shader`)
> Ultra-low-overhead SVG simplex noise backdrop for texture and editorial polish.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: framer-motion, motion/react, animation, webgl, threejs, tailwind-v4, wai-aria-compliant, canvas, creative, noise, shader, svg, paper-shaders
- **Design Dials**: Variance 6/10 · Motion 2/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add grain-noise-shader

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/grain-noise-shader.json
```

## Peer Dependencies
- `motion`
- `three`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license Apache-2.0
 * @origin Paper Shaders (https://github.com/paper-design/shaders)
 * @author Paper Design & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useId } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface GrainNoiseShaderProps {
  opacity?: number;
  className?: string;
  children?: React.ReactNode;
}

export function GrainNoiseShader({
  opacity = 0.05,
  className,
  children,
}: GrainNoiseShaderProps) {
  const filterId = useId();
  const shouldReduceMotion = useReducedMotion();

  // Respect user prefers-reduced-motion setting
  if (shouldReduceMotion) {
    return (
      <div className={cn("relative w-full rounded-xl border border-border bg-card text-foreground p-6", className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-border bg-card text-foreground",
        className
      )}
    >
      {/* Ultra-low-overhead SVG procedural simplex noise texture */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ opacity }}
        aria-hidden="true"
      >
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>

      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
}

```
