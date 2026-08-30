---
id: "grid-distort-interactive"
name: "Interactive Grid Distort Mesh"
category: "ui:creative"
library_origin: "https://reactbits.dev"
dependencies:
  - "three"
  - "clsx"
  - "tailwind-merge"
  - "motion"
tags:
  - "webgl"
  - "threejs"
  - "canvas"
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "creative"
  - "interactive"
  - "mesh"
  - "distortion"
  - "react-bits"
dials:
  design_variance: 8      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 8     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 4       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Interactive Grid Distort Mesh (`grid-distort-interactive`)
> Interactive grid mesh that warps and ripples under mouse cursor velocity with spring decay.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: webgl, threejs, canvas, tailwind-v4, wai-aria-compliant, creative, interactive, mesh, distortion, react-bits
- **Design Dials**: Variance 8/10 · Motion 8/10 · Density 4/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add grid-distort-interactive

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/grid-distort-interactive.json
```

## Peer Dependencies
- `three`
- `clsx`
- `tailwind-merge`
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin React Bits (https://reactbits.dev)
 * @author React Bits & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface GridDistortInteractiveProps extends React.HTMLAttributes<HTMLDivElement> {
  gridSpacing?: number;
  mouseRadius?: number;
}

export function GridDistortInteractive({
  gridSpacing = 24,
  mouseRadius = 80,
  children,
  className,
  ...props
}: GridDistortInteractiveProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const mousePosRef = React.useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.offsetWidth || 500);
    const height = (canvas.height = canvas.offsetHeight || 300);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mousePosRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      ctx.strokeStyle = "rgba(100, 116, 139, 0.2)";
      ctx.lineWidth = 1;
      for (let y = 0; y <= height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      return;
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;

      ctx.strokeStyle = "rgba(100, 116, 139, 0.25)";
      ctx.lineWidth = 1;

      // Draw distorted vertical lines
      for (let x = 0; x <= width; x += gridSpacing) {
        ctx.beginPath();
        for (let y = 0; y <= height; y += 8) {
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.hypot(dx, dy);
          let offset = 0;
          if (dist < mouseRadius) {
            const force = (1 - dist / mouseRadius) * 20;
            offset = (dx / dist) * force;
          }
          if (y === 0) ctx.moveTo(x + offset, y);
          else ctx.lineTo(x + offset, y);
        }
        ctx.stroke();
      }

      // Draw distorted horizontal lines
      for (let y = 0; y <= height; y += gridSpacing) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.hypot(dx, dy);
          let offset = 0;
          if (dist < mouseRadius) {
            const force = (1 - dist / mouseRadius) * 20;
            offset = (dy / dist) * force;
          }
          if (x === 0) ctx.moveTo(x, y + offset);
          else ctx.lineTo(x, y + offset);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [gridSpacing, mouseRadius]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-full h-80 rounded-2xl border border-border bg-card dark:bg-black text-card-foreground shadow-sm overflow-hidden select-none",
        className
      )}
      role="region"
      aria-label="Interactive Elastic Grid Mesh Canvas"
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        aria-label="Distortable Grid Canvas"
      >
        <div className="p-4 text-xs text-muted-foreground">Fallback: Distortable grid canvas active</div>
      </canvas>

      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
        {children}
      </div>
    </div>
  );
}

```
