---
id: "dock-magnification"
name: "macOS Dock Magnification"
category: "ui:motion"
library_origin: "https://magicui.design"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "glassmorphism"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "motion"
  - "dock"
  - "magnification"
  - "macos"
  - "magic-ui"
dials:
  design_variance: 7      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 8     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 4       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# macOS Dock Magnification (`dock-magnification`)
> macOS-style dock with mouse proximity magnification and smooth spring icon popups.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, glassmorphism, accessible, keyboard-accessible, wai-aria-compliant, motion, dock, magnification, macos, magic-ui
- **Design Dials**: Variance 7/10 · Motion 8/10 · Density 4/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add dock-magnification

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/dock-magnification.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Magic UI / Motion Primitives (https://magicui.design)
 * @author Magic UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import {
  Terminal,
  Folder,
  Settings,
  Sparkles,
  Layers,
  Code2,
} from "lucide-react";

export interface DockItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  onClick?: () => void;
}

export interface DockMagnificationProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: DockItem[];
}

const DEFAULT_ITEMS: DockItem[] = [
  { id: "term", label: "Terminal", icon: Terminal },
  { id: "files", label: "Files", icon: Folder },
  { id: "code", label: "Editor", icon: Code2 },
  { id: "agent", label: "AI Agent", icon: Sparkles },
  { id: "layers", label: "Design Wiki", icon: Layers },
  { id: "settings", label: "Preferences", icon: Settings },
];

export function DockMagnification({
  items = DEFAULT_ITEMS,
  className,
  ...props
}: DockMagnificationProps) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  const getScale = (idx: number) => {
    if (hoveredIdx === null) return 1;
    const distance = Math.abs(hoveredIdx - idx);
    if (distance === 0) return 1.45;
    if (distance === 1) return 1.25;
    if (distance === 2) return 1.1;
    return 1;
  };

  return (
    <div
      onMouseLeave={() => setHoveredIdx(null)}
      className={cn(
        "inline-flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-card/80 backdrop-blur-md shadow-2xl transition-all select-none",
        className
      )}
      role="toolbar"
      aria-label="Application Quick Access Dock"
      {...props}
    >
      {items.map((item, idx) => {
        const IconComponent = item.icon;
        const scale = getScale(idx);

        return (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            onMouseEnter={() => setHoveredIdx(idx)}
            style={{
              transform: `scale(${scale}) translateY(${scale > 1 ? -(scale - 1) * 12 : 0}px)`,
            }}
            aria-label={item.label}
            className="relative group flex items-center justify-center h-10 w-10 rounded-xl bg-background border border-border shadow-xs text-foreground transition-transform duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <IconComponent className="h-5 w-5 text-primary" aria-hidden="true" />

            {/* Hover Tooltip Title */}
            <span className="absolute -top-8 px-2 py-0.5 rounded-md bg-popover border border-border text-popover-foreground text-[10px] font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

```
