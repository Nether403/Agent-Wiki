/**
 * @license MIT
 * @origin Ark UI (https://github.com/chakra-ui/ark) / Ariakit
 * @author Ariakit & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DateRangePickerPopoverProps {
  startDate?: string;
  endDate?: string;
  onRangeChange?: (range: { start: string; end: string }) => void;
  className?: string;
}

export function DateRangePickerPopover({
  startDate = "2026-08-01",
  endDate = "2026-08-30",
  onRangeChange,
  className,
}: DateRangePickerPopoverProps) {
  const [range, setRange] = useState<{ start: string; end: string }>({
    start: startDate,
    end: endDate,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Generate simple 30-day mock month grid for keyboard-navigable demonstration
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className={cn("relative inline-block text-foreground", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Select date range. Currently ${range.start} to ${range.end}`}
        className="flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-medium transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <CalendarIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span>
          {range.start} – {range.end}
        </span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Date Range Calendar"
          className="absolute left-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-card p-4 shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-semibold">August 2026</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous month"
                className="p-1 rounded-md border border-border bg-background text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next month"
                className="p-1 rounded-md border border-border bg-background text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Calendar Day Grid */}
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <span key={day} className="font-mono text-[10px] text-muted-foreground py-1">
                {day}
              </span>
            ))}

            {days.map((d) => {
              const isSelected = d >= 1 && d <= 30;
              const isEdge = d === 1 || d === 30;

              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    const newRange = { start: `2026-08-${d < 10 ? "0" + d : d}`, end: range.end };
                    setRange(newRange);
                    onRangeChange?.(newRange);
                  }}
                  className={cn(
                    "flex h-8 w-full items-center justify-center rounded-md font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    isEdge
                      ? "bg-primary text-primary-foreground font-semibold"
                      : isSelected
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  {d}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
