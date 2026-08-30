---
id: "faceted-filter-bar"
name: "Faceted Filter Bar"
category: "ui:primitive"
library_origin: "https://github.com/keenthemes/reui"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
  - "filter"
  - "facets"
  - "toolbar"
  - "chips"
  - "reui"
  - "shark-ui"
  - "cloudscape"
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

# Faceted Filter Bar (`faceted-filter-bar`)
> Multi-select filter chips with active tag count, clear all action, popover dropdowns, and keyboard navigation.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block, filter, facets, toolbar, chips, reui, shark-ui, cloudscape
- **Design Dials**: Variance 4/10 · Motion 3/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add faceted-filter-bar

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/faceted-filter-bar.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin https://github.com/cloudscape-design/components
 * @author AWS Cloudscape Team & Community
 * @curated-by Machine-First Design Agent Wiki
 * Category: ui:primitive
 * Description: Multi-select filter chips with active tag count, clear all action, popover dropdowns, and keyboard navigation.
 */

import * as React from "react";
import { PlusCircle, Check, X, SlidersHorizontal } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface FacetOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface FacetGroup {
  id: string;
  title: string;
  options: FacetOption[];
}

interface FacetedFilterBarProps {
  facets: FacetGroup[];
  selectedFacets: Record<string, string[]>;
  onSelectFacet: (groupId: string, values: string[]) => void;
  onClearAll?: () => void;
  className?: string;
}

export function FacetedFilterBar({
  facets,
  selectedFacets,
  onSelectFacet,
  onClearAll,
  className,
}: FacetedFilterBarProps) {
  const [openGroupId, setOpenGroupId] = React.useState<string | null>(null);

  const totalSelectedCount = Object.values(selectedFacets).reduce(
    (acc, vals) => acc + vals.length,
    0
  );

  const toggleOption = (groupId: string, val: string) => {
    const current = selectedFacets[groupId] || [];
    const next = current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val];
    onSelectFacet(groupId, next);
  };

  return (
    <div
      role="toolbar"
      aria-label="Faceted Filters Toolbar"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {facets.map((group) => {
        const selectedValues = selectedFacets[group.id] || [];
        const isOpen = openGroupId === group.id;

        return (
          <div key={group.id} className="relative">
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={isOpen}
              onClick={() => setOpenGroupId(isOpen ? null : group.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                selectedValues.length > 0
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card border-border hover:bg-muted text-card-foreground"
              )}
            >
              <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{group.title}</span>
              {selectedValues.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-mono font-bold">
                  {selectedValues.length}
                </span>
              )}
            </button>

            {/* Dropdown Popover */}
            {isOpen && (
              <div
                role="menu"
                aria-label={`${group.title} filter options`}
                className="absolute left-0 top-full mt-2 w-52 rounded-xl border border-border bg-card p-2 text-card-foreground shadow-xl z-30 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="text-[11px] font-semibold text-muted-foreground uppercase px-2 py-1">
                  {group.title}
                </div>
                <div className="mt-1 space-y-0.5">
                  {group.options.map((opt) => {
                    const isChecked = selectedValues.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="menuitemcheckbox"
                        aria-checked={isChecked}
                        onClick={() => toggleOption(group.id, opt.value)}
                        className={cn(
                          "w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors",
                          "focus-visible:outline-none focus-visible:bg-muted",
                          isChecked ? "bg-muted font-medium text-foreground" : "hover:bg-muted/50 text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                              isChecked
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-border bg-background"
                            )}
                          >
                            {isChecked && <Check className="w-3 h-3" aria-hidden="true" />}
                          </div>
                          <span>{opt.label}</span>
                        </div>
                        {opt.count !== undefined && (
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {opt.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {totalSelectedCount > 0 && onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset Filters ({totalSelectedCount})</span>
        </button>
      )}
    </div>
  );
}

```
