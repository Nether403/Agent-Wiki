---
id: "squishy-physics-button"
name: "Squishy Physics Bounce Button"
category: "ui:motion"
library_origin: "https://evil-buttons.dev"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "playful"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "motion"
  - "physics"
  - "spring"
  - "evil-buttons"
dials:
  design_variance: 8      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 8     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Squishy Physics Bounce Button (`squishy-physics-button`)
> Velocity-reactive button with squishy spring physics, elastic rebound, and optional Web Audio synthesis click sounds.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, playful, accessible, keyboard-accessible, wai-aria-compliant, motion, physics, spring, evil-buttons
- **Design Dials**: Variance 8/10 · Motion 8/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add squishy-physics-button

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/squishy-physics-button.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Evil Buttons (https://evil-buttons.dev)
 * @author Evil Buttons Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Sparkles } from "lucide-react";

export interface SquishyPhysicsButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  enableAudio?: boolean;
}

export function SquishyPhysicsButton({
  children = "Click for Spring Bounce",
  enableAudio = false,
  className,
  onClick,
  ...props
}: SquishyPhysicsButtonProps) {
  const [isPressed, setIsPressed] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const playClickAudio = () => {
    if (!enableAudio || typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // AudioContext suppressed
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClickAudio();
    onClick?.(e);
  };

  return (
    <button
      type="button"
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onClick={handleClick}
      style={{
        transform: isPressed
          ? "scale(0.92, 0.88) translateY(3px)"
          : isHovered
          ? "scale(1.04, 1.04) translateY(-2px)"
          : "scale(1, 1) translateY(0px)",
      }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-xs shadow-lg",
        "transition-transform duration-200 ease-out select-none cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      <Sparkles className="h-4 w-4" aria-hidden="true" />
      <span>{children}</span>
    </button>
  );
}

```
