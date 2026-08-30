---
id: "hacker-decrypt"
name: "Hacker Decrypt"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  # No external runtime dependencies
tags:
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Hacker Decrypt (`hacker-decrypt`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `LOW`
- **Technical Tags**: wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add hacker-decrypt

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/hacker-decrypt.json
```

## Peer Dependencies
- None

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Community Contributor
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface HackerDecryptProps extends React.HTMLAttributes<HTMLSpanElement> {
  targetText: string;
  speed?: number;
}

const HEX_CHARS = "0123456789ABCDEF!@#$%^&*";

export function HackerDecrypt({
  targetText,
  speed = 40,
  className,
  ...props
}: HackerDecryptProps) {
  const [displayText, setDisplayText] = React.useState(targetText);

  React.useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split("")
          .map((char, index) => {
            if (index < iteration) return targetText[index];
            return HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
          })
          .join("")
      );

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, speed);

    return () => clearInterval(interval);
  }, [targetText, speed]);

  return (
    <span
      className={cn("font-mono font-bold text-primary tracking-wider select-none", className)}
      role="status"
      aria-label={targetText}
      {...props}
    >
      {displayText}
    </span>
  );
}

```
