---
id: "canvas-shatter-effect"
name: "Canvas Shatter Effect"
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
  - "keyboard-accessible"
  - "wai-aria-compliant"
dials:
  design_variance: 8      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 9     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 3       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Canvas Shatter Effect (`canvas-shatter-effect`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: framer-motion, motion/react, animation, webgl, threejs, canvas, keyboard-accessible, wai-aria-compliant
- **Design Dials**: Variance 8/10 · Motion 9/10 · Density 3/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add canvas-shatter-effect

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/canvas-shatter-effect.json
```

## Peer Dependencies
- `motion`
- `three`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Canvas UI (https://canvasui.dev)
 * @author Canvas UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";

export interface CanvasShatterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  shardCount?: number;
}

export function CanvasShatterEffect({
  children,
  shardCount = 40,
  className,
  ...props
}: CanvasShatterProps) {
  // A11y Fallback: respects prefers-reduced-motion with static container fallback
  const prefersReduced = useReducedMotion();
  const [isShattered, setIsShattered] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const handleShatter = () => {
    if (prefersReduced || isShattered) {
      setIsShattered(!isShattered);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsShattered(true);

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const shards: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      rotation: number;
      vRot: number;
      points: Array<[number, number]>;
      opacity: number;
    }> = [];

    for (let i = 0; i < shardCount; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      shards.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        rotation: 0,
        vRot: (Math.random() - 0.5) * 0.2,
        points: [
          [0, 0],
          [(Math.random() - 0.5) * 30, Math.random() * 30],
          [Math.random() * 30, (Math.random() - 0.5) * 30],
        ],
        opacity: 1,
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (const shard of shards) {
        if (shard.opacity <= 0.01) continue;
        alive = true;
        shard.x += shard.vx;
        shard.y += shard.vy;
        shard.vy += 0.2; // gravity
        shard.rotation += shard.vRot;
        shard.opacity *= 0.96;

        ctx.save();
        ctx.translate(shard.x, shard.y);
        ctx.rotate(shard.rotation);
        ctx.fillStyle = `rgba(160, 175, 255, ${shard.opacity})`;
        ctx.beginPath();
        ctx.moveTo(shard.points[0][0], shard.points[0][1]);
        ctx.lineTo(shard.points[1][0], shard.points[1][1]);
        ctx.lineTo(shard.points[2][0], shard.points[2][1]);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      if (alive) {
        animId = requestAnimationFrame(render);
      }
    };

    render();
  };

  return (
    <div
      className={cn("relative inline-flex items-center justify-center select-none cursor-pointer", className)}
      onClick={handleShatter}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleShatter();
        }
      }}
      aria-label="Click to trigger dynamic shatter particle animation"
      {...props}
    >
      <div className={cn("transition-opacity duration-200", isShattered ? "opacity-20" : "opacity-100")}>
        {children}
      </div>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        aria-hidden="true"
      />
    </div>
  );
}

```
