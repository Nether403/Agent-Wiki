---
id: "announcement-banner-sticky"
name: "Announcement Banner Sticky"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "glassmorphism"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Announcement Banner Sticky (`announcement-banner-sticky`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `LOW`
- **Technical Tags**: lucide-react, tailwind-v4, glassmorphism, accessible, keyboard-accessible, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add announcement-banner-sticky

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/announcement-banner-sticky.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Launch UI & Tailark (https://tailark.com)
 * @author Launch UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { ArrowRight, X, Sparkles } from "lucide-react";

export interface AnnouncementBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  badgeText?: string;
  message?: string;
  actionText?: string;
  actionHref?: string;
  onDismiss?: () => void;
}

export function AnnouncementBannerSticky({
  badgeText = "NEW RELEASE v2.0",
  message = "Machine-First Design Agent Wiki with zero-slop Model Context Protocol server.",
  actionText = "Explore Registry",
  actionHref = "#",
  onDismiss,
  className,
  ...props
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <aside
      className={cn(
        "relative w-full border-b border-border bg-card/90 px-4 py-2.5 backdrop-blur-md transition-colors",
        className
      )}
      role="complementary"
      aria-label="Product announcement banner"
      {...props}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-xs sm:text-sm">
        <div className="flex flex-1 flex-wrap items-center justify-center gap-2 sm:gap-3 text-center sm:text-left">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 font-semibold text-primary">
            <Sparkles className="h-3 w-3" />
            {badgeText}
          </span>
          <span className="text-muted-foreground font-medium">{message}</span>
          <a
            href={actionHref}
            className="inline-flex items-center gap-1 font-semibold text-foreground underline decoration-muted-foreground underline-offset-4 hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {actionText}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <button
          onClick={handleDismiss}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Dismiss announcement banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

```
