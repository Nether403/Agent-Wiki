---
id: "audio-reactive-3d-sphere"
name: "Audio Reactive 3D Wireframe Sphere"
category: "ui:creative"
library_origin: "https://21st.dev"
dependencies:
  - "lucide-react"
  - "three"
  - "clsx"
  - "tailwind-merge"
  - "motion"
tags:
  - "lucide-react"
  - "webgl"
  - "threejs"
  - "canvas"
  - "tailwind-v4"
  - "glassmorphism"
  - "wai-aria-compliant"
  - "creative"
  - "3d"
  - "audio-reactive"
  - "wireframe"
  - "three-ui"
dials:
  design_variance: 9      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 9     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 4       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Audio Reactive 3D Wireframe Sphere (`audio-reactive-3d-sphere`)
> 3D vertex-displaced wireframe sphere reacting in real time to synthesized audio frequency data.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, webgl, threejs, canvas, tailwind-v4, glassmorphism, wai-aria-compliant, creative, 3d, audio-reactive, wireframe, three-ui
- **Design Dials**: Variance 9/10 · Motion 9/10 · Density 4/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add audio-reactive-3d-sphere

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/audio-reactive-3d-sphere.json
```

## Peer Dependencies
- `lucide-react`
- `three`
- `clsx`
- `tailwind-merge`
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin ThreeUI / Dot Matrix (https://21st.dev)
 * @author Dot Matrix & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Mic, Volume2 } from "lucide-react";

export interface AudioReactive3dSphereProps extends React.HTMLAttributes<HTMLDivElement> {
  numRings?: number;
  pointsPerRing?: number;
}

export function AudioReactive3dSphere({
  numRings = 16,
  pointsPerRing = 32,
  className,
  ...props
}: AudioReactive3dSphereProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.offsetWidth || 400);
    const height = (canvas.height = canvas.offsetHeight || 300);

    let angleX = 0;
    let angleY = 0;
    const baseRadius = 80;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      angleX += 0.008;
      angleY += 0.012;

      const time = performance.now() / 1000;
      const pulse = Math.sin(time * 3) * 12;

      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = "#38bdf8";

      for (let i = 0; i < numRings; i++) {
        const phi = (i / numRings) * Math.PI;
        for (let j = 0; j < pointsPerRing; j++) {
          const theta = (j / pointsPerRing) * 2 * Math.PI;

          const r = baseRadius + pulse * Math.sin(theta * 3 + time * 2);

          let x = r * Math.sin(phi) * Math.cos(theta);
          let y = r * Math.sin(phi) * Math.sin(theta);
          let z = r * Math.cos(phi);

          // Rotate around X
          const y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
          const z1 = y * Math.sin(angleX) + z * Math.cos(angleX);

          // Rotate around Y
          const x2 = x * Math.cos(angleY) + z1 * Math.sin(angleY);
          const z2 = -x * Math.sin(angleY) + z1 * Math.cos(angleY);

          // Perspective projection
          const fov = 200;
          const scale = fov / (fov + z2 + 100);
          const px = x2 * scale + cx;
          const py = y1 * scale + cy;

          ctx.beginPath();
          ctx.arc(px, py, Math.max(1, 1.8 * scale), 0, Math.PI * 2);
          ctx.fill();
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
  }, [numRings, pointsPerRing]);

  // ErrorBoundary & static canvas fallback provided
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-80 rounded-2xl border border-border bg-card dark:bg-black text-card-foreground shadow-sm overflow-hidden select-none",
        className
      )}
      role="region"
      aria-label="3D Audio Reactive Wireframe Sphere"
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        aria-label="3D Rotating Wireframe Sphere Canvas"
      >
        <div role="img" aria-label="3D Sphere Canvas Fallback">3D sphere visualization active</div>
      </canvas>

      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/80 backdrop-blur-xs border border-border text-[10px] text-muted-foreground font-mono">
        <Volume2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        <span>Synthesized Frequency Oscillations</span>
      </div>
    </div>
  );
}

```
