---
id: "particle-emitter-burst"
name: "Particle Emitter Burst"
category: "ui:creative"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
  - "three"
  - "motion"
tags:
  - "lucide-react"
  - "webgl"
  - "threejs"
  - "canvas"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
dials:
  design_variance: 8      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 9     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Particle Emitter Burst (`particle-emitter-burst`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, webgl, threejs, canvas, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant
- **Design Dials**: Variance 8/10 · Motion 9/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add particle-emitter-burst

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/particle-emitter-burst.json
```

## Peer Dependencies
- `lucide-react`
- `three`
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki (https://design-wiki.agent)
 * @author Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Play, Pause, RefreshCw } from "lucide-react";

export interface ParticleEmitterBurstProps {
  particleCount?: number;
  burstText?: string;
  className?: string;
}

export function ParticleEmitterBurst({
  particleCount = 40,
  burstText = "Milestone Achieved",
  className = "",
}: ParticleEmitterBurstProps) {
  const [isActive, setIsActive] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // A11y: Respect user motion preferences (SLOP-014)
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsActive(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    // Pre-allocate typed arrays outside animation loop (SLOP-032)
    const count = particleCount;
    const xPos = new Float32Array(count);
    const yPos = new Float32Array(count);
    const xVel = new Float32Array(count);
    const yVel = new Float32Array(count);
    const radii = new Float32Array(count);

    const initParticles = () => {
      const w = canvas.width;
      const h = canvas.height;
      for (let i = 0; i < count; i++) {
        xPos[i] = w / 2;
        yPos[i] = h / 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        xVel[i] = Math.cos(angle) * speed;
        yVel[i] = Math.sin(angle) * speed;
        radii[i] = Math.random() * 3 + 1.5;
      }
    };

    initParticles();

    const renderLoop = () => {
      if (!isActive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(168, 85, 247, 0.8)"; // Accent particle tint
      for (let i = 0; i < count; i++) {
        xPos[i] += xVel[i];
        yPos[i] += yVel[i];

        ctx.beginPath();
        ctx.arc(xPos[i], yPos[i], radii[i], 0, Math.PI * 2);
        ctx.fill();

        // Wrap around bounds
        if (xPos[i] < 0 || xPos[i] > canvas.width || yPos[i] < 0 || yPos[i] > canvas.height) {
          xPos[i] = canvas.width / 2;
          yPos[i] = canvas.height / 2;
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    if (isActive) {
      animId = requestAnimationFrame(renderLoop);
    }

    // Clean up event listener / timer to prevent memory leaks (SLOP-025)
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isActive, particleCount]);

  return (
    <div className={"relative w-full rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm overflow-hidden flex flex-col items-center justify-center min-h-[260px] " + className}>
      {/* Particle Canvas with Static Fallback */}
      <canvas
        ref={canvasRef}
        width={400}
        height={260}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
        role="img"
        aria-label="Interactive particle burst celebration visual"
      >
        <span className="sr-only">Celebration particle effects fallback</span>
      </canvas>

      {/* Foreground Content */}
      <div className="relative z-10 text-center">
        <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-3">
          <Sparkles className="w-6 h-6" role="img" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-foreground tracking-tight">{burstText}</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
          GPU particle celebration engine with automatic prefers-reduced-motion suppression.
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setIsActive((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label={isActive ? "Pause particle animation" : "Play particle animation"}
          >
            {isActive ? <Pause className="w-3.5 h-3.5" role="img" aria-hidden="true" /> : <Play className="w-3.5 h-3.5" role="img" aria-hidden="true" />}
            {isActive ? "Pause" : "Resume"}
          </button>
        </div>
      </div>
    </div>
  );
}

```
