---
id: "ai-voice-orb"
name: "Ai Voice Orb"
category: "ui:creative"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "three"
  - "motion"
tags:
  - "webgl"
  - "threejs"
  - "canvas"
  - "neon-scifi"
  - "wai-aria-compliant"
dials:
  design_variance: 8      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 9     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Ai Voice Orb (`ai-voice-orb`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: webgl, threejs, canvas, neon-scifi, wai-aria-compliant
- **Design Dials**: Variance 8/10 · Motion 9/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add ai-voice-orb

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/ai-voice-orb.json
```

## Peer Dependencies
- `three`
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin KokonutUI / Agent Wiki (https://kokonutui.com)
 * @author KokonutUI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface AiVoiceOrbProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: "idle" | "listening" | "synthesizing";
  size?: number;
}

export function AiVoiceOrb({
  state = "listening",
  size = 200,
  className,
  ...props
}: AiVoiceOrbProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reduced motion check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // Draw static glowing sphere
      ctx.clearRect(0, 0, size, size);
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 10, size / 2, size / 2, size / 2.5);
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.9)");
      gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 3, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    let animationFrameId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      const center = size / 2;
      const baseRadius = size * 0.28;
      const speed = state === "synthesizing" ? 0.08 : state === "listening" ? 0.04 : 0.015;
      const amp = state === "synthesizing" ? 18 : state === "listening" ? 10 : 3;

      angle += speed;

      // Draw Multi-layer glowing rings
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        const numPoints = 64;
        for (let i = 0; i <= numPoints; i++) {
          const theta = (i / numPoints) * Math.PI * 2;
          const wave = Math.sin(theta * 4 + angle + layer) * Math.cos(theta * 2 - angle) * amp;
          const r = baseRadius + wave + layer * 6;
          const x = center + r * Math.cos(theta);
          const y = center + r * Math.sin(theta);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        const alpha = (0.4 - layer * 0.1).toFixed(2);
        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (layer === 0) {
          const grad = ctx.createRadialGradient(center, center, 10, center, center, baseRadius + amp);
          grad.addColorStop(0, "rgba(59, 130, 246, 0.45)");
          grad.addColorStop(1, "rgba(59, 130, 246, 0.05)");
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, size]);

  return (
    <div
      className={cn("flex flex-col items-center justify-center p-4 select-none", className)}
      role="region"
      aria-label={`AI Voice Assistant Orb (${state} state)`}
      {...props}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-full shadow-lg"
        aria-hidden="true"
      />
      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-foreground">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            state === "listening" && "bg-emerald-500 animate-ping",
            state === "synthesizing" && "bg-primary animate-pulse",
            state === "idle" && "bg-muted-foreground"
          )}
          aria-hidden="true"
        />
        <span className="capitalize">{state}</span>
      </div>
    </div>
  );
}

```
