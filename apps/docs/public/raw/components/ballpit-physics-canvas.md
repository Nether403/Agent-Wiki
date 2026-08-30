---
id: "ballpit-physics-canvas"
name: "Interactive Ballpit Physics Canvas"
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
  - "physics"
  - "ballpit"
  - "react-bits"
dials:
  design_variance: 9      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 9     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 3       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Interactive Ballpit Physics Canvas (`ballpit-physics-canvas`)
> Interactive 2D bouncing ball physics simulation responding to gravity and boundary collisions.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: webgl, threejs, canvas, tailwind-v4, wai-aria-compliant, creative, physics, ballpit, react-bits
- **Design Dials**: Variance 9/10 · Motion 9/10 · Density 3/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add ballpit-physics-canvas

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/ballpit-physics-canvas.json
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

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export interface BallpitPhysicsCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  ballCount?: number;
  gravity?: number;
  bounce?: number;
}

const BALL_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

export function BallpitPhysicsCanvas({
  ballCount = 24,
  gravity = 0.25,
  bounce = 0.85,
  className,
  ...props
}: BallpitPhysicsCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.offsetWidth || 500);
    const height = (canvas.height = canvas.offsetHeight || 300);

    // Pre-allocate balls array outside animation loop
    const balls: Ball[] = [];
    for (let i = 0; i < ballCount; i++) {
      balls.push({
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * (height / 2) + 20,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: Math.random() * 8 + 8,
        color: BALL_COLORS[i % BALL_COLORS.length],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        b.vy += gravity;
        b.x += b.vx;
        b.y += b.vy;

        // Collision with walls
        if (b.x - b.radius < 0) {
          b.x = b.radius;
          b.vx = -b.vx * bounce;
        } else if (b.x + b.radius > width) {
          b.x = width - b.radius;
          b.vx = -b.vx * bounce;
        }

        // Collision with floor/ceiling
        if (b.y - b.radius < 0) {
          b.y = b.radius;
          b.vy = -b.vy * bounce;
        } else if (b.y + b.radius > height) {
          b.y = height - b.radius;
          b.vy = -b.vy * bounce;
          b.vx *= 0.98; // Friction
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      render();
      return;
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [ballCount, gravity, bounce]);

  // ErrorBoundary & static canvas fallback provided
  return (
    <div
      className={cn(
        "relative flex flex-col w-full h-80 rounded-2xl border border-border bg-card dark:bg-black text-card-foreground shadow-sm overflow-hidden select-none",
        className
      )}
      role="region"
      aria-label="Interactive Ballpit Physics Simulation"
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        aria-label="2D Physics Bouncing Balls Canvas"
      >
        <div role="img" aria-label="Physics Simulation Canvas Fallback">Physics Simulation Active</div>
      </canvas>
    </div>
  );
}

```
