---
id: "key-value-definition-list"
name: "Key Value Definition List"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Key Value Definition List (`key-value-definition-list`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add key-value-definition-list

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/key-value-definition-list.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Cloudscape Design & Primer (https://cloudscape.design)
 * @author Cloudscape & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Copy, Check } from "lucide-react";

export interface KeyValueItem {
  key: string;
  value: string | React.ReactNode;
  copyable?: boolean;
  copyText?: string;
}

export interface KeyValueListProps extends React.HTMLAttributes<HTMLDListElement> {
  items: KeyValueItem[];
  columns?: 1 | 2 | 3;
}

export function KeyValueDefinitionList({
  items,
  columns = 2,
  className,
  ...props
}: KeyValueListProps) {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      // Graceful fallback
    }
  };

  const colStyles = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <dl
      className={cn("grid gap-4 rounded-xl border border-border bg-card p-6 shadow-xs", colStyles[columns], className)}
      {...props}
    >
      {items.map((item) => (
        <div key={item.key} className="flex flex-col space-y-1">
          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {item.key}
          </dt>
          <dd className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="truncate">{item.value}</span>
            {item.copyable && (
              <button
                onClick={() => handleCopy(item.key, item.copyText || String(item.value))}
                className="inline-flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Copy value for ${item.key}`}
              >
                {copiedKey === item.key ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

```
