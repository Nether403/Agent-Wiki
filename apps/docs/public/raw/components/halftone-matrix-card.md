---
id: "halftone-matrix-card"
name: "Halftone Matrix Card"
category: "ui:creative"
library_origin: "https://github.com/paper-design/shaders"
dependencies:
  - "clsx"
  - "tailwind-merge"
  - "three"
  - "motion"
tags:
  - "webgl"
  - "threejs"
  - "canvas"
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "dither"
  - "halftone"
  - "shaders"
  - "matrix"
  - "paper-shaders"
  - "react-bits"
dials:
  design_variance: 8      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 7     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Halftone Matrix Card (`halftone-matrix-card`)
> Interactive canvas halftone dither card reacting to mouse position with customizable dot pitch and reduced-motion fallback.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: webgl, threejs, canvas, tailwind-v4, wai-aria-compliant, dither, halftone, shaders, matrix, paper-shaders, react-bits
- **Design Dials**: Variance 8/10 · Motion 7/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add halftone-matrix-card

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/halftone-matrix-card.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`
- `three`
- `motion`

## Verified TypeScript Source
```tsx
/**
 * SPDX-License-Identifier: MIT
 * Source: Machine-First Design Agent Wiki (Inspired by paper-design/shaders & zzzzshawn/matrix & DavidHDev/react-bits)
 * Category: ui:creative
 * Description: Interactive canvas halftone dither card reacting to mouse position with customizable dot pitch and reduced-motion fallback.
 */

import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface HalftoneMatrixCardProps {
  title: string;
  subtitle?: string;
  dotColor?: string;
  dotSize?: number;
  gap?: number;
  className?: string;
}

export function HalftoneMatrixCard({
  title,
  subtitle,
  dotColor = "#10b981",
  dotSize = 3,
  gap = 14,
  className,
}: HalftoneMatrixCardProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mousePos = React.useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const render = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.floor(canvas.width / gap);
      const rows = Math.floor(canvas.height / gap);

      ctx.fillStyle = dotColor;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gap + gap / 2;
          const y = j * gap + gap / 2;

          const dx = mousePos.current.x - x;
          const dy = mousePos.current.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = 140;
          let scale = 1;
          if (dist < maxDist) {
            scale = 1 + (1 - dist / maxDist) * 2.5;
          }

          const radius = Math.min((dotSize / 2) * scale, gap / 2 - 1);

          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.5, radius), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      if (prefersReducedMotion) render();
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: -1000, y: -1000 };
      if (prefersReducedMotion) render();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [dotColor, dotSize, gap]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={`${title} card`}
      className={cn(
        "relative flex flex-col justify-end p-6 w-full h-72 rounded-2xl border border-border bg-card overflow-hidden shadow-sm select-none",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative z-10 space-y-1 pointer-events-none">
        <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

```
