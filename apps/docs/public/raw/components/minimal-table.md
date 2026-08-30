---
id: "minimal-table"
name: "Minimal Table"
category: "ui:editorial"
library_origin: "https://diagram.com"
dependencies:
  - "clsx"
  - "tailwind-merge"
tags:
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "editorial"
  - "svg"
  - "zero-dependency"
  - "static"
  - "analytical"
  - "table"
  - "data-grid"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 1     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 9       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Minimal Table (`minimal-table`)
> Clean tabular data display with accessible headers, captions, and responsive overflow.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `LOW`
- **Technical Tags**: tailwind-v4, wai-aria-compliant, editorial, svg, zero-dependency, static, analytical, table, data-grid
- **Design Dials**: Variance 5/10 · Motion 1/10 · Density 9/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add minimal-table

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/minimal-table.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin diagram-design (https://diagram.com)
 * @author diagram-design team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export interface MinimalTableProps<T> {
  data: T[];
  columns: Column<T>[];
  caption?: string;
  className?: string;
}

export function MinimalTable<T extends Record<string, any>>({
  data,
  columns,
  caption,
  className,
}: MinimalTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border border-border bg-card", className)}>
      <table className="w-full text-left text-sm">
        {caption && (
          <caption className="p-4 text-xs font-medium text-muted-foreground text-left">
            {caption}
          </caption>
        )}
        <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} scope="col" className="px-6 py-3">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className="transition-colors hover:bg-muted/20 focus-within:bg-muted/30"
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-6 py-4 font-normal text-foreground">
                  {col.render ? col.render(row) : row[col.key as keyof T]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

```
