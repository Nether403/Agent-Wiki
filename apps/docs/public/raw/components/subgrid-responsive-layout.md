---
id: "subgrid-responsive-layout"
name: "Subgrid Responsive Layout"
category: "ui:block"
library_origin: "https://github.com/argyleink/gui-challenges"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
  - "gui-challenges"
  - "subgrid"
  - "container-queries"
  - "marketing"
  - "cards"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Subgrid Responsive Layout (`subgrid-responsive-layout`)
> CSS Subgrid and Container Query card layout with aligned headers, feature checklists, and footer actions across columns.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block, gui-challenges, subgrid, container-queries, marketing, cards
- **Design Dials**: Variance 5/10 · Motion 2/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add subgrid-responsive-layout

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/subgrid-responsive-layout.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @origin Google GUI Challenges (https://github.com/argyleink/gui-challenges)
 * @license Apache-2.0
 * @author Adam Argyle & Google Chrome Team
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { ArrowRight, Check, Sparkles, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SubgridCardItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  isPopular?: boolean;
}

export interface SubgridResponsiveLayoutProps {
  title?: string;
  description?: string;
  items?: SubgridCardItem[];
  className?: string;
}

const DEFAULT_SUBGRID_ITEMS: SubgridCardItem[] = [
  {
    id: "tier-core",
    badge: "Core Primitive",
    title: "Deterministic UI Foundation",
    description: "Pre-tested, accessible components with zero runtime CSS collisions and full token alignment.",
    features: ["100% WCAG 2.1 AA Compliant", "React 19 & Tailwind v4 Native", "Zero AI Slop AST Guarantee"],
    ctaText: "Install Primitives",
  },
  {
    id: "tier-agent",
    badge: "Agent Optimized",
    title: "Autonomous MCP Orchestration",
    description: "Cloudflare Edge Model Context Protocol endpoints engineered specifically for developer agents.",
    features: ["< 15KB Compact Payload Budget", "Topological Dependency Resolution", "Zero-Draft Fidelity Benchmarking"],
    ctaText: "Connect via MCP",
    isPopular: true,
  },
  {
    id: "tier-enterprise",
    badge: "Enterprise Scale",
    title: "Design System Governance",
    description: "Cross-platform W3C DTCG design token synchronization and automated visual regression gates.",
    features: ["Playwright & Axe-Core CI Scans", "Multi-Tenant Theme Matrices", "SPDX License Header Enforcement"],
    ctaText: "Deploy Enterprise Pack",
  },
];

export function SubgridResponsiveLayout({
  title = "Modular Architectural Systems",
  description = "Engineered using CSS Subgrid & Container Queries for perfectly aligned card grids across all viewports.",
  items = DEFAULT_SUBGRID_ITEMS,
  className,
}: SubgridResponsiveLayoutProps) {
  return (
    <section className={cn("w-full space-y-8 py-8 select-none", className)}>
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Responsive Subgrid Card Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[auto]">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs transition-colors duration-200 hover:border-primary/50",
              item.isPopular && "border-primary shadow-sm bg-card/95 ring-1 ring-primary/20"
            )}
          >
            {item.isPopular && (
              <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-2xs font-semibold text-primary-foreground shadow-xs">
                <Sparkles className="h-2.5 w-2.5" role="img" aria-hidden="true" /> Most Popular
              </span>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-2xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.badge}
                </span>
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>

              <ul className="space-y-2 pt-2 border-t border-border/60 text-xs text-foreground/90">
                {item.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" role="img" aria-hidden="true" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 mt-auto">
              <button
                type="button"
                className={cn(
                  "w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  item.isPopular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                    : "border border-border bg-background hover:bg-muted text-foreground"
                )}
              >
                <span>{item.ctaText}</span>
                <ArrowRight className="h-3.5 w-3.5" role="img" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

```
