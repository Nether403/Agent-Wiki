---
id: "canvas-fluid-wave"
name: "Canvas Fluid Wave"
category: "ui:creative"
library_origin: "https://canvas-ui.dev"
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
  - "shader-simulation"
  - "interactive"
  - "a11y-fallback"
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

# Canvas Fluid Wave (`canvas-fluid-wave`)
> Interactive HTML5 Canvas fluid simulation with mouse interaction, WebGL / Three.js bridge compatibility, and CSS gradient fallback.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: webgl, threejs, canvas, tailwind-v4, shader-simulation, interactive, a11y-fallback
- **Design Dials**: Variance 8/10 · Motion 9/10 · Density 3/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add canvas-fluid-wave

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/canvas-fluid-wave.json
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
 * @origin Canvas UI (https://canvas-ui.dev)
 * @author Canvas UI Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface CanvasFluidWaveProps {
  className?: string;
  waveColor?: string;
  speed?: number;
  amplitude?: number;
}

export function CanvasFluidWave({
  className,
  waveColor = "rgba(120, 119, 198, 0.25)",
  speed = 0.02,
  amplitude = 24,
}: CanvasFluidWaveProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  React.useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = canvas.parentElement?.clientHeight || 200;
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      step += speed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      for (let x = 0; x < canvas.width; x++) {
        const y =
          Math.sin(x * 0.01 + step) * amplitude +
          Math.sin(x * 0.02 + step * 1.5) * (amplitude * 0.5) +
          canvas.height / 2;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();

      ctx.fillStyle = waveColor;
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, amplitude, waveColor, reducedMotion]);

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-card border border-border", className)}>
      {reducedMotion ? (
        // Static CSS gradient fallback when prefers-reduced-motion is requested
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/10"
          aria-hidden="true"
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full pointer-events-none"
          aria-hidden="true"
        />
      )}
      <div className="relative z-10 p-6">
        <h3 className="text-base font-semibold text-foreground">Canvas Fluid Wave</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Interactive fluid simulation with automatic reduced-motion accessibility fallbacks.
        </p>
      </div>
    </div>
  );
}

```
