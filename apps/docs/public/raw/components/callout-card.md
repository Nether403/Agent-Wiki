---
id: "callout-card"
name: "Callout Card"
category: "ui:editorial"
library_origin: "https://design-wiki.dev"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "wai-aria-compliant"
  - "callout"
  - "alert"
  - "editorial"
  - "semantic"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 1     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Callout Card (`callout-card`)
> High-contrast editorial callout with semantic state themes (info, warning, success, danger).

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: lucide-react, wai-aria-compliant, callout, alert, editorial, semantic
- **Design Dials**: Variance 3/10 · Motion 1/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add callout-card

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/callout-card.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin diagram-design / Machine-First Design Agent Wiki
 * @author diagram-design & Community
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { Info, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

export type CalloutType = "info" | "warning" | "success" | "danger";

export interface CalloutCardProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: CalloutType;
  title?: string;
}

const calloutConfig = {
  info: {
    icon: Info,
    borderColor: "border-primary/40",
    bgClass: "bg-primary/5",
    iconColor: "text-primary",
  },
  warning: {
    icon: AlertTriangle,
    borderColor: "border-amber-500/40",
    bgClass: "bg-amber-500/5",
    iconColor: "text-amber-500",
  },
  success: {
    icon: CheckCircle,
    borderColor: "border-emerald-500/40",
    bgClass: "bg-emerald-500/5",
    iconColor: "text-emerald-500",
  },
  danger: {
    icon: AlertCircle,
    borderColor: "border-destructive/40",
    bgClass: "bg-destructive/5",
    iconColor: "text-destructive",
  },
};

export function CalloutCard({
  type = "info",
  title,
  children,
  className,
  ...props
}: CalloutCardProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <aside
      role="note"
      className={cn(
        "rounded-2xl border p-5 shadow-xs transition-colors",
        config.borderColor,
        config.bgClass,
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", config.iconColor)} aria-hidden="true" />
        <div className="space-y-1">
          {title && (
            <h4 className="text-sm font-semibold text-foreground">
              {title}
            </h4>
          )}
          <div className="text-xs leading-relaxed text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}

```
