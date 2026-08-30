---
id: "auth-card-split-screen"
name: "Auth Card Split Screen"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "glassmorphism"
  - "neon-scifi"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Auth Card Split Screen (`auth-card-split-screen`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, glassmorphism, neon-scifi, accessible, keyboard-accessible, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add auth-card-split-screen

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/auth-card-split-screen.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Kairo UI & Tailark (https://kairoui.online)
 * @author Kairo UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";

export interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  onSubmit?: (email: string) => void;
  brandName?: string;
  tagline?: string;
}

export function AuthCardSplitScreen({
  onSubmit,
  brandName = "Agent Wiki Studio",
  tagline = "Deterministic, zero-slop component orchestration for autonomous coding agents.",
  className,
  ...props
}: AuthCardProps) {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    if (onSubmit) onSubmit(email);
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  return (
    <div
      className={cn(
        "grid min-h-[500px] w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl lg:grid-cols-2",
        className
      )}
      {...props}
    >
      {/* Visual / Brand Side Panel */}
      <div className="relative flex flex-col justify-between bg-zinc-950 p-8 sm:p-10 text-white overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-mono font-medium text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Zero-Slop Verified
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{brandName}</h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{tagline}</p>
        </div>

        <div className="relative z-10 mt-8 space-y-4">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 backdrop-blur-xs">
            <p className="font-mono text-xs text-zinc-300">
              &ldquo;The fastest way to ground LLMs in verified design tokens and WCAG AA accessible components.&rdquo;
            </p>
          </div>
        </div>

        {/* Ambient Subtle Glow */}
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
      </div>

      {/* Authentication Form Side */}
      <div className="flex flex-col justify-center p-8 sm:p-10">
        <div className="space-y-2 text-left">
          <h3 className="text-xl font-bold tracking-tight text-foreground">Welcome back</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Sign in or connect your developer workspace token.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5 text-left">
            <label htmlFor="auth-email" className="text-xs font-semibold text-foreground">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isSubmitting ? "Connecting..." : "Continue with Email"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you accept the machine-first architectural license and terms of service.
        </div>
      </div>
    </div>
  );
}

```
