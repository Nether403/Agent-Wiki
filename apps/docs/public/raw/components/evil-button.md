---
id: "evil-button"
name: "Evil Button"
category: "ui:motion"
library_origin: "https://github.com/evil-buttons/evil-buttons"
dependencies:
  - "motion"
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "framer-motion"
  - "motion/react"
  - "animation"
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "spring-physics"
  - "playful"
  - "sound-physics"
  - "interactive"
  - "button"
dials:
  design_variance: 8      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 7     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Evil Button (`evil-button`)
> Playful tactile spring-physics button with synthesized audio feedback and chaotic variants.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: framer-motion, motion/react, animation, lucide-react, tailwind-v4, accessible, spring-physics, playful, sound-physics, interactive, button
- **Design Dials**: Variance 8/10 · Motion 7/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add evil-button

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/evil-button.json
```

## Peer Dependencies
- `motion`
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin https://github.com/evil-buttons/evil-buttons
 * @author Evil-Buttons Team & Community
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles, Volume2, VolumeX } from "lucide-react";
import { cn } from "../lib/utils";

export interface EvilButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  variant?: "primary" | "secondary" | "destructive" | "outline";
  enableAudioPhysics?: boolean;
  intensity?: "gentle" | "medium" | "chaotic";
}

/**
 * EvilButton: Playful, tactile spring-physics button with audio click synthesis.
 * Built for high-variance interactive actions without aesthetic slop.
 */
export function EvilButton({
  label = "Push Me",
  variant = "primary",
  enableAudioPhysics = false,
  intensity = "medium",
  className,
  children,
  onClick,
  disabled,
  ...props
}: EvilButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const [audioActive, setAudioActive] = React.useState(enableAudioPhysics);
  const [clickCount, setClickCount] = React.useState(0);

  // Playful audio-haptic feedback using Web Audio API (zero external sound file deps)
  const triggerAudioClick = React.useCallback(() => {
    if (!audioActive || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const baseFreq = 220 + (clickCount % 5) * 80;
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio context policy safe fallback
    }
  }, [audioActive, clickCount]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    setClickCount((prev) => prev + 1);
    triggerAudioClick();
    if (onClick) onClick(e);
  };

  // Dynamics calibration based on intensity setting
  const springSettings = React.useMemo(() => {
    if (shouldReduceMotion) return { scale: 1, rotate: 0 };
    switch (intensity) {
      case "chaotic":
        return { hoverScale: 1.08, tapScale: 0.88, rotateDelta: 4 };
      case "gentle":
        return { hoverScale: 1.02, tapScale: 0.96, rotateDelta: 1 };
      case "medium":
      default:
        return { hoverScale: 1.05, tapScale: 0.92, rotateDelta: 2.5 };
    }
  }, [intensity, shouldReduceMotion]);

  const variantStyles = {
    primary:
      "bg-primary text-primary-foreground border-primary shadow-sm hover:bg-primary/90",
    secondary:
      "bg-secondary text-secondary-foreground border-border shadow-sm hover:bg-secondary/80",
    destructive:
      "bg-destructive text-destructive-foreground border-destructive shadow-sm hover:bg-destructive/90",
    outline:
      "bg-card text-foreground border-border hover:bg-muted",
  };

  return (
    <div className="inline-flex items-center gap-2">
      <motion.button
        type="button"
        role="button"
        disabled={disabled}
        whileHover={
          disabled || shouldReduceMotion
            ? {}
            : {
                scale: springSettings.hoverScale,
                rotate: clickCount % 2 === 0 ? springSettings.rotateDelta : -springSettings.rotateDelta,
              }
        }
        whileTap={
          disabled || shouldReduceMotion
            ? {}
            : {
                scale: springSettings.tapScale,
                rotate: clickCount % 2 === 0 ? -springSettings.rotateDelta : springSettings.rotateDelta,
              }
        }
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
        onClick={handleClick}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl border select-none cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>{children || label}</span>
        {clickCount > 0 && (
          <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-md bg-background/20 font-mono">
            {clickCount}
          </span>
        )}
      </motion.button>

      {enableAudioPhysics && (
        <button
          type="button"
          onClick={() => setAudioActive((v) => !v)}
          aria-label={audioActive ? "Mute button sound feedback" : "Enable button sound feedback"}
          className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {audioActive ? (
            <Volume2 className="w-4 h-4" aria-hidden="true" />
          ) : (
            <VolumeX className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}

```
