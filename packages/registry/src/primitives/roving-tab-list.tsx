/**
 * @license MIT
 * @origin Ariakit & Radix UI (https://ariakit.org / https://radix-ui.com)
 * @author Ariakit Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface RovingTabItem {
  id: string;
  label: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface RovingTabListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: RovingTabItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  orientation?: "horizontal" | "vertical";
}

export function RovingTabList({
  items,
  selectedId,
  onSelect,
  orientation = "horizontal",
  className,
  ...props
}: RovingTabListProps) {
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    const count = items.length;

    if (orientation === "horizontal") {
      if (e.key === "ArrowRight") {
        nextIndex = (index + 1) % count;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (index - 1 + count) % count;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = count - 1;
      } else {
        return;
      }
    } else {
      if (e.key === "ArrowDown") {
        nextIndex = (index + 1) % count;
      } else if (e.key === "ArrowUp") {
        nextIndex = (index - 1 + count) % count;
      } else {
        return;
      }
    }

    e.preventDefault();
    tabRefs.current[nextIndex]?.focus();
    onSelect(items[nextIndex].id);
  };

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={cn(
        "flex rounded-lg border border-border bg-muted/30 p-1 text-muted-foreground",
        orientation === "vertical" ? "flex-col gap-1" : "flex-row gap-1 items-center",
        className
      )}
      {...props}
    >
      {items.map((item, idx) => {
        const isSelected = item.id === selectedId;
        return (
          <button
            key={item.id}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            role="tab"
            type="button"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            disabled={item.disabled}
            onClick={() => onSelect(item.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:pointer-events-none",
              isSelected
                ? "bg-card text-foreground shadow-xs border border-border/60"
                : "hover:text-foreground hover:bg-muted/50"
            )}
          >
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 font-mono text-[10px]",
                  isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
