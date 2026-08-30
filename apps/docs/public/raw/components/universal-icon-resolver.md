---
id: "universal-icon-resolver"
name: "Universal Icon Resolver"
category: "ui:utility"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "wai-aria-compliant"
  - "utility"
dials:
  design_variance: 2      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Universal Icon Resolver (`universal-icon-resolver`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:utility`
- **Structural Complexity**: `LOW`
- **Technical Tags**: lucide-react, wai-aria-compliant, utility
- **Design Dials**: Variance 2/10 · Motion 4/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add universal-icon-resolver

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/universal-icon-resolver.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki (https://design-wiki.agent)
 * @author Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React from "react";
import * as LucideIcons from "lucide-react";

export type IconSet = "lucide" | "tabler" | "iconoir";

export interface UniversalIconResolverProps {
  name: string;
  size?: number;
  className?: string;
  fallbackIcon?: string;
}

export function UniversalIconResolver({
  name,
  size = 18,
  className = "",
  fallbackIcon = "HelpCircle",
}: UniversalIconResolverProps) {
  // 1. Resolve normalized PascalCase name for Lucide registry
  const formattedName = name
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  const IconComponent =
    (LucideIcons as Record<string, React.ElementType>)[formattedName] ||
    (LucideIcons as Record<string, React.ElementType>)[fallbackIcon] ||
    LucideIcons.HelpCircle;

  return (
    <span className={"inline-flex items-center justify-center " + className} role="img" aria-label={name}>
      <IconComponent size={size} className="currentColor" role="img" aria-hidden="true" />
    </span>
  );
}

```
