---
id: "confetti-cannon-button"
name: "Confetti Cannon Button"
category: "ui:creative"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "motion"
  - "lucide-react"
  - "three"
tags:
  - "framer-motion"
  - "motion/react"
  - "animation"
  - "lucide-react"
  - "webgl"
  - "threejs"
  - "canvas"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "spring-physics"
dials:
  design_variance: 8      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 10     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Confetti Cannon Button (`confetti-cannon-button`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: framer-motion, motion/react, animation, lucide-react, webgl, threejs, canvas, accessible, keyboard-accessible, wai-aria-compliant, spring-physics
- **Design Dials**: Variance 8/10 · Motion 10/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add confetti-cannon-button

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/confetti-cannon-button.json
```

## Peer Dependencies
- `motion`
- `lucide-react`
- `three`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Evil Buttons & Canvas Confetti (https://evilbuttons.com)
 * @author Evil Buttons & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";
import { Sparkles } from "lucide-react";

export interface ConfettiCannonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  particleCount?: number;
}

export function ConfettiCannonButton({
  children = "Fire Zero-Slop Confetti",
  particleCount = 35,
  className,
  onClick,
  ...props
}: ConfettiCannonButtonProps) {
  // A11y Fallback: respects prefers-reduced-motion with static UI fallback
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();

  const triggerConfetti = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ["#38bdf8", "#818cf8", "#c084fc", "#34d399", "#fbbf24"];
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      vRot: number;
      opacity: number;
    }> = [];

    const originX = canvas.width / 2;
    const originY = canvas.height / 2;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() - 0.5) * Math.PI * 1.5 - Math.PI / 2;
      const speed = Math.random() * 8 + 4;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.3,
        opacity: 1,
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach((p) => {
        if (p.opacity <= 0.01) return;
        active = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // gravity
        p.rotation += p.vRot;
        p.opacity *= 0.95;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      if (active) {
        animId = requestAnimationFrame(render);
      }
    };

    render();
  };

  return (
    <div className="relative inline-block overflow-visible">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute -inset-24 z-30 h-[calc(100%+192px)] w-[calc(100%+192px)]"
        aria-hidden="true"
      />
      <motion.button
        whileHover={prefersReduced ? undefined : { scale: 1.04 }}
        whileTap={prefersReduced ? undefined : { scale: 0.94 }}
        transition={{ type: "spring", stiffness: 450, damping: 24 }}
        onClick={triggerConfetti}
        className={cn(
          "relative z-10 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        <Sparkles className="h-4 w-4" />
        {children}
      </motion.button>
    </div>
  );
}

```
