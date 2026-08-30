/**
 * SPDX-License-Identifier: MIT
 * Source: Machine-First Design Agent Wiki (Inspired by argyleink/gui-challenges & primer/react)
 * Category: ui:primitive
 * Description: Accessible segmented control switch with sliding spring indicator, arrow-key roving focus, and ARIA radiogroup roles.
 */

import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SegmentedControlSliderProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SegmentedControlSlider<T extends string = string>({
  options,
  value,
  onChange,
  ariaLabel = "Segmented Options",
  size = "md",
  className,
}: SegmentedControlSliderProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({});

  const sizeClasses = {
    sm: "p-0.5 text-xs",
    md: "p-1 text-sm",
    lg: "p-1.5 text-base",
  };

  const itemPadding = {
    sm: "px-2.5 py-1",
    md: "px-3.5 py-1.5",
    lg: "px-5 py-2",
  };

  // Update active indicator pill bounding box
  React.useEffect(() => {
    if (!containerRef.current) return;
    const activeEl = containerRef.current.querySelector<HTMLButtonElement>(`[data-state="active"]`);
    if (activeEl) {
      setIndicatorStyle({
        width: `${activeEl.offsetWidth}px`,
        transform: `translateX(${activeEl.offsetLeft}px)`,
        height: `${activeEl.offsetHeight}px`,
      });
    }
  }, [value, options]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const enabledOptions = options.filter((o) => !o.disabled);
    const currentIndex = enabledOptions.findIndex((o) => o.value === value);

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % enabledOptions.length;
      onChange(enabledOptions[nextIndex].value);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + enabledOptions.length) % enabledOptions.length;
      onChange(enabledOptions[prevIndex].value);
    }
  };

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative inline-flex items-center rounded-xl bg-muted border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        sizeClasses[size],
        className
      )}
    >
      {/* Sliding active highlight background */}
      <div
        className="absolute top-1 left-0 rounded-lg bg-card shadow-sm border border-border transition-all duration-200 ease-out pointer-events-none"
        style={indicatorStyle}
        aria-hidden="true"
      />

      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={option.disabled}
            data-state={isActive ? "active" : "inactive"}
            onClick={() => !option.disabled && onChange(option.value)}
            className={cn(
              "relative z-10 flex items-center justify-center gap-2 font-medium transition-colors duration-150 rounded-lg",
              itemPadding[size],
              isActive
                ? "text-card-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground",
              option.disabled && "opacity-40 cursor-not-allowed"
            )}
          >
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
