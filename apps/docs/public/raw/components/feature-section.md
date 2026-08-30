---
id: "feature-section"
name: "Feature Section"
category: "ui:block"
library_origin: "https://tailark.com"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "layout-block"
  - "feature"
  - "marketing"
  - "saas"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Feature Section (`feature-section`)
> Asymmetrical 4-column SaaS architectural feature grid with badge pill and structured cards.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, wai-aria-compliant, layout-block, feature, marketing, saas
- **Design Dials**: Variance 5/10 · Motion 3/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add feature-section

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/feature-section.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Tailark / Shadcn Blocks (https://tailark.com)
 * @author Tailark Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { Sparkles, Shield, Cpu, Zap } from "lucide-react";
import { cn } from "../lib/utils";

export interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag?: string;
}

export interface FeatureSectionProps {
  badgeText?: string;
  heading?: string;
  subheading?: string;
  features?: FeatureItem[];
  className?: string;
}

const defaultFeatures: FeatureItem[] = [
  {
    icon: <Cpu className="h-5 w-5 text-primary" />,
    title: "Deterministic Code Primitives",
    description: "Pre-tested, accessible components grounded in strict TypeScript interfaces and Tailwind tokens.",
    tag: "Machine-First",
  },
  {
    icon: <Shield className="h-5 w-5 text-primary" />,
    title: "21-Rule Anti-Slop Audit",
    description: "Automated quality gates blocking arbitrary pixel escapes, chained type assertions, and unshaded surfaces.",
    tag: "Zero-Slop",
  },
  {
    icon: <Sparkles className="h-5 w-5 text-primary" />,
    title: "Calibrated Taste Dials",
    description: "Mathematical 1-10 dials for Design Variance, Motion Intensity, and Visual Density.",
    tag: "Aesthetic Control",
  },
  {
    icon: <Zap className="h-5 w-5 text-primary" />,
    title: "Sub-15KB MCP Delivery",
    description: "Compact flat context payloads streamed to Claude Code, Cursor, and Codex in < 100ms.",
    tag: "Edge-Speed",
  },
];

export function FeatureSection({
  badgeText = "Architecture Blueprint",
  heading = "Engineered for Autonomous Synthesis",
  subheading = "Eliminate visual hallucination and runtime brittleness with verifiable design tokens.",
  features = defaultFeatures,
  className,
}: FeatureSectionProps) {
  return (
    <section className={cn("py-16 px-4 sm:px-6 lg:px-8", className)}>
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="max-w-2xl">
          {badgeText && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span>{badgeText}</span>
            </div>
          )}
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            {subheading}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-xs transition-colors hover:border-primary/50"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
                    {feature.icon}
                  </div>
                  {feature.tag && (
                    <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                      {feature.tag}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-base font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

```
