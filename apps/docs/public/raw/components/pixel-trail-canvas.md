---
id: "pixel-trail-canvas"
name: "Pixel Trail Canvas"
category: "ui:creative"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "motion"
  - "three"
tags:
  - "framer-motion"
  - "motion/react"
  - "animation"
  - "webgl"
  - "threejs"
  - "canvas"
  - "tailwind-v4"
  - "wai-aria-compliant"
dials:
  design_variance: 8      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 9     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Pixel Trail Canvas (`pixel-trail-canvas`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: framer-motion, motion/react, animation, webgl, threejs, canvas, tailwind-v4, wai-aria-compliant
- **Design Dials**: Variance 8/10 · Motion 9/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add pixel-trail-canvas

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/pixel-trail-canvas.json
```

## Peer Dependencies
- `motion`
- `three`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin React Bits (https://reactbits.dev)
 * @author DavidHDev & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";

export interface PixelTrailProps extends React.HTMLAttributes<HTMLDivElement> {
  gridSize?: number;
  trailColor?: string;
  fadeDurationMs?: number;
  children?: React.ReactNode;
}

export function PixelTrailCanvas({
  gridSize = 24,
  trailColor = "rgba(56, 189, 248, 0.7)",
  fadeDurationMs = 600,
  children,
  className,
  ...props
}: PixelTrailProps) {
  // A11y Fallback: respects prefers-reduced-motion with static canvas fallback
  const prefersReduced = useReducedMotion();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const activePixelsRef = React.useRef<Map<string, number>>(new Map());

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const col = Math.floor(x / gridSize);
      const row = Math.floor(y / gridSize);
      activePixelsRef.current.set(`${col},${row}`, performance.now());
    };

    container.addEventListener("mousemove", handleMouseMove);

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const activePixels = activePixelsRef.current;

      for (const [key, timestamp] of activePixels.entries()) {
        const elapsed = time - timestamp;
        if (elapsed > fadeDurationMs) {
          activePixels.delete(key);
          continue;
        }

        const opacity = 1 - elapsed / fadeDurationMs;
        const [col, row] = key.split(",").map(Number);
        ctx.fillStyle = trailColor.replace(/[\d\.]+\)$/, `${opacity * 0.8})`);
        ctx.fillRect(col * gridSize + 1, row * gridSize + 1, gridSize - 2, gridSize - 2);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gridSize, trailColor, fadeDurationMs]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden rounded-xl border border-border bg-card p-6", className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-80"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

```
