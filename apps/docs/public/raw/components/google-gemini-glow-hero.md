---
id: "google-gemini-glow-hero"
name: "Google Gemini Laser Glow Hero"
category: "ui:block"
library_origin: "https://ui.aceternity.com"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "glassmorphism"
  - "neon-scifi"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
  - "block"
  - "hero"
  - "laser-glow"
  - "dark-mode"
  - "aceternity"
dials:
  design_variance: 7      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 6     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Google Gemini Laser Glow Hero (`google-gemini-glow-hero`)
> Dark-mode hero section with layered animated SVG laser paths and responsive central CTA.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, glassmorphism, neon-scifi, accessible, keyboard-accessible, wai-aria-compliant, layout-block, block, hero, laser-glow, dark-mode, aceternity
- **Design Dials**: Variance 7/10 · Motion 6/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add google-gemini-glow-hero

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/google-gemini-glow-hero.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Aceternity UI (https://ui.aceternity.com)
 * @author Manu Arora & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export interface GoogleGeminiGlowHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  badgeText?: string;
  title?: string;
  description?: string;
  primaryCta?: string;
  secondaryCta?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export function GoogleGeminiGlowHero({
  badgeText = "Antigravity Multi-Agent Orchestration",
  title = "Design Engineering for the Autonomous Era",
  description = "A unified registry of verified components, deterministic anti-slop AST linters, and headless test harnesses.",
  primaryCta = "Get Started Free",
  secondaryCta = "View MCP Reference",
  onPrimaryClick,
  onSecondaryClick,
  className,
  ...props
}: GoogleGeminiGlowHeroProps) {
  return (
    <section
      className={cn(
        "relative flex flex-col items-center justify-center min-h-[580px] w-full overflow-hidden bg-card dark:bg-black text-card-foreground py-24 px-4 select-none",
        className
      )}
      aria-label="Gemini Glow Hero Section"
      {...props}
    >
      {/* Background Multi-Layer SVG Laser Rays */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none opacity-40"
        viewBox="0 0 1000 600"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="laserGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="laserGrad2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M 100 0 Q 300 400, 500 300 T 900 600"
          fill="none"
          stroke="url(#laserGrad1)"
          strokeWidth="3"
          className="animate-pulse"
        />
        <path
          d="M 900 0 Q 700 400, 500 300 T 100 600"
          fill="none"
          stroke="url(#laserGrad2)"
          strokeWidth="3"
          className="animate-pulse"
        />
      </svg>

      {/* Hero Central Content */}
      <div className="relative z-10 max-w-3xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-card/80 backdrop-blur-md shadow-xs text-xs font-medium text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>{badgeText}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
          {title}
        </h1>

        <p className="max-w-xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={onPrimaryClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-xs shadow-lg hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span>{primaryCta}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onSecondaryClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-border bg-background hover:bg-muted text-foreground font-semibold text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>{secondaryCta}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

```
