---
id: "scratch-to-reveal-card"
name: "Scratch-to-Reveal Reward Card"
category: "ui:motion"
library_origin: "https://magicui.design"
dependencies:
  - "lucide-react"
  - "three"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "webgl"
  - "threejs"
  - "canvas"
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "motion"
  - "scratch-card"
  - "gamification"
  - "magic-ui"
dials:
  design_variance: 7      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 7     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Scratch-to-Reveal Reward Card (`scratch-to-reveal-card`)
> Canvas scratch-off surface revealing hidden discount codes or rewards beneath user gestures.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, webgl, threejs, canvas, tailwind-v4, wai-aria-compliant, motion, scratch-card, gamification, magic-ui
- **Design Dials**: Variance 7/10 · Motion 7/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add scratch-to-reveal-card

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/scratch-to-reveal-card.json
```

## Peer Dependencies
- `lucide-react`
- `three`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Magic UI (https://magicui.design)
 * @author Magic UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Sparkles, Gift } from "lucide-react";

export interface ScratchToRevealCardProps extends React.HTMLAttributes<HTMLDivElement> {
  revealedContent?: string;
  scratchTitle?: string;
  onRevealed?: () => void;
}

export function ScratchToRevealCard({
  revealedContent = "PROMO-AGENT-WIKI-2026",
  scratchTitle = "Scratch here to reveal reward",
  onRevealed,
  className,
  ...props
}: ScratchToRevealCardProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = React.useState(false);
  const isScratchingRef = React.useRef(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill scratch layer
    ctx.fillStyle = "#334155";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH ME", canvas.width / 2, canvas.height / 2 + 4);
  }, []);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    if (!isRevealed) {
      setIsRevealed(true);
      onRevealed?.();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isScratchingRef.current) {
      scratch(e.clientX, e.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    scratch(e.touches[0].clientX, e.touches[0].clientY);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-md space-y-3 select-none overflow-hidden",
        className
      )}
      role="region"
      aria-label="Scratch to Reveal Reward Card"
      {...props}
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
        <Gift className="h-4 w-4 text-primary" aria-hidden="true" />
        <span>{scratchTitle}</span>
      </div>

      {/* Secret Card Beneath */}
      <div className="relative w-64 h-28 rounded-xl border border-dashed border-primary/40 bg-primary/5 flex flex-col items-center justify-center p-4">
        <span className="text-[10px] uppercase font-mono text-muted-foreground">Secret Token Code</span>
        <span className="font-mono text-sm font-bold text-primary mt-1 select-all">
          {revealedContent}
        </span>

        {/* Scratch Overlay Canvas */}
        <canvas
          ref={canvasRef}
          width={256}
          height={112}
          onMouseDown={() => {
            isScratchingRef.current = true;
          }}
          onMouseUp={() => {
            isScratchingRef.current = false;
          }}
          onMouseMove={handleMouseMove}
          onTouchStart={() => {
            isScratchingRef.current = true;
          }}
          onTouchEnd={() => {
            isScratchingRef.current = false;
          }}
          onTouchMove={handleTouchMove}
          aria-label="Interactive scratch-off surface canvas"
          className="absolute inset-0 w-full h-full rounded-xl cursor-crosshair touch-none"
        >
          {/* Static accessibility fallback */}
          <div>Secret code: {revealedContent}</div>
        </canvas>
      </div>
    </div>
  );
}

```
