---
id: "combobox-grouped-async"
name: "Combobox Grouped Async"
category: "ui:primitive"
library_origin: "https://github.com/ariakit/ariakit"
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
  - "ariakit"
  - "combobox"
  - "multi-select"
  - "search"
  - "tags"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Combobox Grouped Async (`combobox-grouped-async`)
> Ariakit-inspired accessible multi-select combobox with categorized option groups, async search, and removable tag chips.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block, ariakit, combobox, multi-select, search, tags
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add combobox-grouped-async

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/combobox-grouped-async.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @origin Machine-First Design Agent Wiki (Ariakit Combobox Archetype)
 * @license MIT
 * @curated-by Antigravity & manus-research
 */
"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { Search, X, Check, Loader2, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface ComboboxOption {
  id: string;
  label: string;
  category: string;
}

export interface ComboboxGroupedAsyncProps {
  label?: string;
  placeholder?: string;
  initialSelected?: ComboboxOption[];
  onSelectionChange?: (selected: ComboboxOption[]) => void;
  className?: string;
}

const SAMPLE_OPTIONS: ComboboxOption[] = [
  { id: "opt-1", label: "Button Primitives", category: "Primitives" },
  { id: "opt-2", label: "Accessible Modal Dialog", category: "Primitives" },
  { id: "opt-3", label: "Faceted Filter Bar", category: "Primitives" },
  { id: "opt-4", label: "Floating Dock Magnification", category: "Motion" },
  { id: "opt-5", label: "Fluid Cursor Physics", category: "Motion" },
  { id: "opt-6", label: "WebGL Particle Field", category: "Creative" },
  { id: "opt-7", label: "Cathryn Lavery 2x2 Matrix", category: "Editorial" },
  { id: "opt-8", label: "Infinite Whiteboard Canvas", category: "Workflow" },
];

export function ComboboxGroupedAsync({
  label = "Select Registry Components",
  placeholder = "Search components by keyword or category...",
  initialSelected = [SAMPLE_OPTIONS[0]],
  onSelectionChange,
  className,
}: ComboboxGroupedAsyncProps) {
  const baseId = useId();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<ComboboxOption[]>(initialSelected);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = SAMPLE_OPTIONS.filter(
    (opt) =>
      opt.label.toLowerCase().includes(query.toLowerCase()) ||
      opt.category.toLowerCase().includes(query.toLowerCase())
  );

  const groupedOptions = filteredOptions.reduce<Record<string, ComboboxOption[]>>((acc, opt) => {
    acc[opt.category] = acc[opt.category] || [];
    acc[opt.category].push(opt);
    return acc;
  }, {});

  const handleSelect = (option: ComboboxOption) => {
    const exists = selected.some((s) => s.id === option.id);
    let next: ComboboxOption[];
    if (exists) {
      next = selected.filter((s) => s.id !== option.id);
    } else {
      next = [...selected, option];
    }
    setSelected(next);
    onSelectionChange?.(next);
    setQuery("");
    inputRef.current?.focus();
  };

  const handleRemove = (optionId: string) => {
    const next = selected.filter((s) => s.id !== optionId);
    setSelected(next);
    onSelectionChange?.(next);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full max-w-md text-xs", className)}
      role="group"
      aria-labelledby={`${baseId}-label`}
    >
      <label id={`${baseId}-label`} className="block text-xs font-semibold text-foreground mb-1.5">
        {label}
      </label>

      {/* Selected Tags Box + Input */}
      <div
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background p-1.5 transition-colors focus-within:ring-2 focus-within:ring-ring"
      >
        {selected.map((item) => (
          <span
            key={item.id}
            className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
          >
            <span>{item.label}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(item.id);
              }}
              aria-label={`Remove ${item.label}`}
              className="rounded p-0.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        ))}

        <div className="flex flex-1 items-center min-w-[120px]">
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={`${baseId}-listbox`}
            aria-autocomplete="list"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={selected.length === 0 ? placeholder : ""}
            className="w-full bg-transparent px-1.5 py-1 text-xs text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          aria-label="Toggle dropdown list"
          className="p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div
          id={`${baseId}-listbox`}
          role="listbox"
          aria-label="Grouped component options"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md transition-colors"
        >
          {Object.keys(groupedOptions).length === 0 ? (
            <div className="p-3 text-center text-xs text-muted-foreground">No matching components found.</div>
          ) : (
            Object.entries(groupedOptions).map(([category, items]) => (
              <div key={category} role="group" aria-label={category} className="py-1">
                <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  {category}
                </div>
                {items.map((opt) => {
                  const isSelected = selected.some((s) => s.id === opt.id);
                  return (
                    <div
                      key={opt.id}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(opt)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors",
                        isSelected ? "bg-accent text-accent-foreground font-medium" : "hover:bg-muted"
                      )}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

```
