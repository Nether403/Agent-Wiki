---
id: "cta-banner-geometric"
name: "Cta Banner Geometric"
category: "ui:editorial"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "editorial"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 1     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 10       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Cta Banner Geometric (`cta-banner-geometric`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, editorial
- **Design Dials**: Variance 5/10 · Motion 1/10 · Density 10/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add cta-banner-geometric

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/cta-banner-geometric.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Tailark / 21st.dev (https://tailark.com)
 * @author Tailark & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";

export interface CtaBannerGeometricProps extends React.HTMLAttributes<HTMLDivElement> {
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  onCtaClick?: () => void;
}

export function CtaBannerGeometric({
  headline = "Ready to Eliminate AI Slop in Your Next Project?",
  subheadline = "Deploy the Machine-First Design Agent Wiki MCP server and audit your codebase with 30 production anti-slop rules.",
  buttonText = "Install Design Wiki CLI",
  onCtaClick,
  className,
  ...props
}: CtaBannerGeometricProps) {
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCtaClick?.();
  };

  return (
    <section
      className={cn(
        "relative flex flex-col items-center justify-center p-8 md:p-12 rounded-3xl border border-border bg-card shadow-xl overflow-hidden text-center text-card-foreground",
        className
      )}
      aria-label="Call to Action Banner"
      {...props}
    >
      {/* Background geometric grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Zero Configuration Setup</span>
        </div>

        <h3 className="text-2xl md:text-4xl font-black text-foreground tracking-tight leading-snug">
          {headline}
        </h3>

        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
          {subheadline}
        </p>

        {/* Action input form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
          <div className="relative w-full">
            <input
              type="email"
              placeholder="developer@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-4 rounded-xl border border-border bg-background text-foreground text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Email address for updates"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 h-10 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shrink-0 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span>{buttonText}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </form>

        <p className="text-[11px] font-mono text-muted-foreground">
          $ npx design-wiki add &lt;component-name&gt;
        </p>
      </div>
    </section>
  );
}

```
