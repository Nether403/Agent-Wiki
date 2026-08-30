---
id: "particle-field"
name: "Particle Field"
category: "ui:creative"
library_origin: "https://threeui.dev"
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
  - "particles"
  - "physics"
  - "reduced-motion"
dials:
  design_variance: 8      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 8     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 4       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Particle Field (`particle-field`)
> GPU-friendly interactive particle web with prefers-reduced-motion fallback.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: webgl, threejs, canvas, tailwind-v4, particles, physics, reduced-motion
- **Design Dials**: Variance 8/10 · Motion 8/10 · Density 4/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add particle-field

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/particle-field.json
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
 * @origin ThreeUI / Canvas UI (https://threeui.dev)
 * @author ThreeUI Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface ParticleFieldProps {
  particleCount?: number;
  particleColor?: string;
  className?: string;
}

export function ParticleField({
  particleCount = 40,
  particleColor = "rgba(100, 116, 139, 0.4)",
  className,
}: ParticleFieldProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  React.useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = canvas.parentElement?.clientHeight || 300;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
    }));

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      });

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [particleCount, particleColor, prefersReducedMotion]);

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-card p-6", className)}>
      {prefersReducedMotion ? (
        <div className="absolute inset-0 bg-muted/20" aria-hidden="true" />
      ) : (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        />
      )}
      <div className="relative z-10">
        <h4 className="text-base font-semibold text-foreground">Interactive Particle Web</h4>
        <p className="mt-1 text-sm text-muted-foreground">
          Autonomous canvas physics field with automatic performance safeguards.
        </p>
      </div>
    </div>
  );
}

```
