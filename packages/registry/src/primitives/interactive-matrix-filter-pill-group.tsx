/**
 * @origin GitHub Primer & HeroUI (https://primer.style, https://heroui.com)
 * @license MIT
 * @author GitHub Primer Team & HeroUI Team
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { Filter, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterPillOption {
  id: string;
  label: string;
  count?: number;
  category?: string;
}

export interface InteractiveMatrixFilterPillGroupProps {
  options?: FilterPillOption[];
  selectedIds?: string[];
  onChange?: (selected: string[]) => void;
  title?: string;
  className?: string;
}

const DEFAULT_FILTER_OPTIONS: FilterPillOption[] = [
  { id: "ai-native", label: "AI Native", count: 24, category: "Domain" },
  { id: "workflow", label: "Workflow Graph", count: 12, category: "Domain" },
  { id: "motion", label: "Spring Motion", count: 42, category: "Interaction" },
  { id: "wcag-aaa", label: "WCAG AAA", count: 18, category: "A11y" },
  { id: "tailwind-v4", label: "Tailwind v4", count: 280, category: "Tech" },
];

export function InteractiveMatrixFilterPillGroup({
  options = DEFAULT_FILTER_OPTIONS,
  selectedIds: controlledSelected,
  onChange,
  title = "Faceted Taxonomy Filters",
  className,
}: InteractiveMatrixFilterPillGroupProps) {
  const [internalSelected, setInternalSelected] = React.useState<string[]>(["ai-native", "tailwind-v4"]);
  const selected = controlledSelected !== undefined ? controlledSelected : internalSelected;

  const toggleOption = (id: string) => {
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    if (controlledSelected === undefined) setInternalSelected(next);
    onChange?.(next);
  };

  const clearAll = () => {
    if (controlledSelected === undefined) setInternalSelected([]);
    onChange?.([]);
  };

  return (
    <div className={cn("w-full space-y-3 rounded-xl border border-border bg-card p-4 shadow-xs select-none", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-primary" role="img" aria-hidden="true" />
          <span className="text-xs font-semibold text-foreground tracking-tight">{title}</span>
        </div>

        {selected.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-2xs text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
          >
            Clear Selected ({selected.length})
          </button>
        )}
      </div>

      {/* Pill Group */}
      <div className="flex flex-wrap items-center gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleOption(opt.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              aria-pressed={isSelected}
            >
              {isSelected && <Check className="h-3 w-3" role="img" aria-hidden="true" />}
              <span>{opt.label}</span>
              {opt.count !== undefined && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-3xs font-mono font-semibold",
                    isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  {opt.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
