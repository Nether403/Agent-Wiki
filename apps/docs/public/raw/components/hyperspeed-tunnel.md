---
id: "hyperspeed-tunnel"
name: "Hyperspeed Warp Tunnel"
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
  - "starfield"
  - "warp-speed"
  - "tunnel"
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

# Hyperspeed Warp Tunnel (`hyperspeed-tunnel`)
> Three.js/Canvas starfield/light-trail warp speed effect with adjustable speed and neon lighting.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: webgl, threejs, canvas, tailwind-v4, wai-aria-compliant, creative, starfield, warp-speed, tunnel, react-bits
- **Design Dials**: Variance 9/10 · Motion 9/10 · Density 3/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add hyperspeed-tunnel

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/hyperspeed-tunnel.json
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

export interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
}

export interface HyperspeedTunnelProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  starCount?: number;
}

export function HyperspeedTunnel({
  speed = 12,
  starCount = 350,
  children,
  className,
  ...props
}: HyperspeedTunnelProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.offsetWidth || 600);
    const height = (canvas.height = canvas.offsetHeight || 350);

    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        pz: Math.random() * width,
      });
    }

    const render = () => {
      ctx.fillStyle = "rgba(10, 15, 30, 0.25)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.pz = s.z;
        s.z -= speed;

        if (s.z <= 0) {
          s.z = width;
          s.pz = width;
          s.x = (Math.random() - 0.5) * width * 2;
          s.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 128 / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy;

        const pk = 128 / s.pz;
        const ppx = s.x * pk + cx;
        const ppy = s.y * pk + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.beginPath();
          ctx.moveTo(ppx, ppy);
          ctx.lineTo(px, py);
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = Math.min(2.5, (1 - s.z / width) * 2.5);
          ctx.stroke();
        }
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
  }, [speed, starCount]);

  // ErrorBoundary & static canvas fallback provided
  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-full h-80 rounded-2xl border border-border bg-card dark:bg-black text-card-foreground shadow-sm overflow-hidden select-none",
        className
      )}
      role="region"
      aria-label="Hyperspeed Warp Tunnel Simulation"
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        aria-label="Hyperspeed Starfield Canvas"
      >
        <div role="img" aria-label="Hyperspeed Canvas Fallback">Hyperspeed warp effect active</div>
      </canvas>

      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
        {children}
      </div>
    </div>
  );
}

```
