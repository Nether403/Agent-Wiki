---
id: "pricing-table"
name: "Pricing Table"
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
  - "accessible"
  - "layout-block"
  - "brutalist"
  - "pricing"
  - "saas"
  - "marketing"
  - "interactive-toggle"
dials:
  design_variance: 4      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Pricing Table (`pricing-table`)
> Multi-tier pricing matrix with monthly/annual toggle and clear feature checkmarks.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, accessible, layout-block, brutalist, pricing, saas, marketing, interactive-toggle
- **Design Dials**: Variance 4/10 · Motion 3/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add pricing-table

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/pricing-table.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Tailark / Shadcn UI (https://tailark.com)
 * @author Tailark Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";

export interface PricingPlan {
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
}

export interface PricingTableProps {
  plans?: PricingPlan[];
  className?: string;
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    name: "Developer",
    priceMonthly: 0,
    priceAnnual: 0,
    description: "For individual builders and local agent experimentation.",
    features: [
      "Access to 25+ seed components",
      "Local MCP server stdio integration",
      "Full static /llms.txt discovery",
      "Standard MIT open-source license",
    ],
    ctaText: "Get Started Free",
  },
  {
    name: "Autonomous Team",
    priceMonthly: 49,
    priceAnnual: 39,
    description: "For engineering teams running multi-agent continuous pipelines.",
    features: [
      "Everything in Developer",
      "Streamable HTTP MCP endpoints",
      "Automated CI/CD anti-slop gatekeeper",
      "Zero-Draft Fidelity sandbox reports",
      "Priority AST ingestion requests",
    ],
    popular: true,
    ctaText: "Upgrade to Team",
  },
  {
    name: "Enterprise",
    priceMonthly: 199,
    priceAnnual: 159,
    description: "For organizations scaling private registries and custom design tokens.",
    features: [
      "Custom private registry namespaces",
      "Tailwind v4 token synchronizer",
      "Dedicated headless test harness",
      "100% WCAG 2.1 AAA accessibility pass",
      "Custom legal IP indemnity warranty",
    ],
    ctaText: "Contact Enterprise",
  },
];

export function PricingTable({ plans = DEFAULT_PLANS, className }: PricingTableProps) {
  const [isAnnual, setIsAnnual] = React.useState(true);

  return (
    <section className={cn("py-12", className)}>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 pb-10">
        <span className={cn("text-sm font-medium", !isAnnual ? "text-foreground" : "text-muted-foreground")}>
          Monthly billing
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={isAnnual}
          onClick={() => setIsAnnual(!isAnnual)}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isAnnual ? "bg-primary" : "bg-input"
          )}
        >
          <span
            className={cn(
              "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg transition-transform",
              isAnnual ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
        <span className={cn("text-sm font-medium", isAnnual ? "text-foreground" : "text-muted-foreground")}>
          Annual billing <span className="text-xs font-semibold text-primary">(Save 20%)</span>
        </span>
      </div>

      {/* Plan Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
          return (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col justify-between rounded-2xl border p-8 shadow-xs transition-all",
                plan.popular
                  ? "border-primary bg-card ring-2 ring-primary/20 shadow-md"
                  : "border-border bg-card text-card-foreground hover:border-border/80"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                  Recommended
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-foreground">
                    ${price}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">/month</span>
                </div>
                <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <button
                  type="button"
                  className={cn(
                    "w-full rounded-xl py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border bg-background text-foreground hover:bg-muted"
                  )}
                >
                  {plan.ctaText}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

```
