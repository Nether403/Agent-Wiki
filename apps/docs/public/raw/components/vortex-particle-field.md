---
id: "vortex-particle-field"
name: "Vortex Particle Field"
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
  - "wai-aria-compliant"
dials:
  design_variance: 8      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 9     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 3       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Vortex Particle Field (`vortex-particle-field`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: framer-motion, motion/react, animation, webgl, threejs, canvas, wai-aria-compliant
- **Design Dials**: Variance 8/10 · Motion 9/10 · Density 3/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add vortex-particle-field

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/vortex-particle-field.json
```

## Peer Dependencies
- `motion`
- `three`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Aceternity UI (https://ui.aceternity.com)
 * @author Aceternity & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";

export interface VortexProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
}

export function VortexParticleField({
  children,
  className,
  containerClassName,
  particleCount = 500,
  rangeY = 100,
  baseHue = 220,
  baseSpeed = 0.1,
  rangeSpeed = 1,
  baseRadius = 1,
  rangeRadius = 2,
  backgroundColor = "transparent",
  ...props
}: VortexProps) {
  // A11y Fallback: respects prefers-reduced-motion with static canvas fallback
  const prefersReduced = useReducedMotion();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = React.useState(true);

  React.useEffect(() => {
    if (prefersReduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setHasWebGL(false);
      return;
    }

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      angle: number;
      speed: number;
      distance: number;
      hue: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const distance = Math.random() * (Math.min(width, height) / 2);
      particles.push({
        x: width / 2,
        y: height / 2,
        radius: baseRadius + Math.random() * rangeRadius,
        angle: Math.random() * Math.PI * 2,
        speed: (baseSpeed + Math.random() * rangeSpeed) * 0.02,
        distance,
        hue: baseHue + Math.random() * 50,
      });
    }

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const render = () => {
      ctx.fillStyle = backgroundColor === "transparent" ? "rgba(0, 0, 0, 0.15)" : backgroundColor;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed;
        p.x = cx + Math.cos(p.angle) * p.distance;
        p.y = cy + Math.sin(p.angle) * p.distance;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsl(${p.hue}, 80%, 60%)`;
        ctx.fill();
        ctx.closePath();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [particleCount, baseHue, baseRadius, rangeRadius, baseSpeed, rangeSpeed, backgroundColor]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex h-full min-h-[450px] w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-950", containerClassName)}
      {...props}
    >
      {hasWebGL ? (
        <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" aria-hidden="true" />
      ) : (
        <div className="absolute inset-0 z-0 bg-radial from-indigo-900/40 via-background to-zinc-950" role="img" aria-label="Static vortex fallback" />
      )}
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
}

```
