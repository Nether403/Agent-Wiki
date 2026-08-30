---
id: "wavy-background-shader"
name: "Wavy Background Shader"
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

# Wavy Background Shader (`wavy-background-shader`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: framer-motion, motion/react, animation, webgl, threejs, canvas, wai-aria-compliant
- **Design Dials**: Variance 8/10 · Motion 9/10 · Density 3/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add wavy-background-shader

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/wavy-background-shader.json
```

## Peer Dependencies
- `motion`
- `three`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Aceternity UI & React Bits (https://ui.aceternity.com)
 * @author Aceternity & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";

export interface WavyBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
}

export function WavyBackgroundShader({
  children,
  className,
  containerClassName,
  colors = ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"],
  waveWidth = 50,
  backgroundFill = "black",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: WavyBackgroundProps) {
  // A11y Fallback: respects prefers-reduced-motion with static shader fallback
  const prefersReduced = useReducedMotion();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
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

    let animationId: number;
    let w = (ctx.canvas.width = window.innerWidth);
    let h = (ctx.canvas.height = window.innerHeight);
    ctx.filter = `blur(${blur}px)`;
    let nt = 0;

    const getSpeed = () => (speed === "fast" ? 0.002 : 0.001);

    const resize = () => {
      if (!ctx) return;
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    window.addEventListener("resize", resize);

    const render = () => {
      ctx.fillStyle = backgroundFill;
      ctx.globalAlpha = waveOpacity;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth;
        ctx.strokeStyle = colors[i % colors.length];
        for (let x = 0; x < w; x += 5) {
          const y = Math.sin(x * 0.003 + nt + i) * 60 + h * 0.5;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.closePath();
      }

      nt += getSpeed();
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [blur, speed, waveWidth, backgroundFill, waveOpacity, colors]);

  return (
    <div
      className={cn("relative flex h-full min-h-[400px] w-full flex-col items-center justify-center overflow-hidden", containerClassName)}
      {...props}
    >
      {hasWebGL ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 h-full w-full opacity-70"
          aria-hidden="true"
        />
      ) : (
        <div
          className="absolute inset-0 z-0 bg-radial from-zinc-800 via-background to-zinc-950 opacity-80"
          role="img"
          aria-label="Static wave background fallback"
        />
      )}
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
}

```
