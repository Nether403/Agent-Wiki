/**
 * @license MIT
 * @origin HeroUI / ReUI (https://heroui.com)
 * @author HeroUI Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Calendar, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface RichDateRangePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
}

export function RichDateRangePicker({
  value = { start: new Date(2026, 7, 1), end: new Date(2026, 7, 14) },
  onChange,
  className,
  ...props
}: RichDateRangePickerProps) {
  const [range, setRange] = React.useState<DateRange>(value);
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    value.start || new Date(2026, 7, 1)
  );

  React.useEffect(() => {
    if (value) setRange(value);
  }, [value]);

  const presets = [
    {
      label: "Today",
      getRange: () => {
        const now = new Date();
        return { start: now, end: now };
      },
    },
    {
      label: "Last 7 Days",
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 6);
        return { start, end };
      },
    },
    {
      label: "Last 30 Days",
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 29);
        return { start, end };
      },
    },
    {
      label: "Month to Date",
      getRange: () => {
        const end = new Date();
        const start = new Date(end.getFullYear(), end.getMonth(), 1);
        return { start, end };
      },
    },
  ];

  const applyPreset = (presetFn: () => DateRange) => {
    const newRange = presetFn();
    setRange(newRange);
    onChange?.(newRange);
    if (newRange.start) setCurrentMonth(newRange.start);
    setIsOpen(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (!range.start || (range.start && range.end)) {
      const nextRange = { start: clickedDate, end: null };
      setRange(nextRange);
      onChange?.(nextRange);
    } else if (range.start && !range.end) {
      if (clickedDate < range.start) {
        const nextRange = { start: clickedDate, end: range.start };
        setRange(nextRange);
        onChange?.(nextRange);
      } else {
        const nextRange = { start: range.start, end: clickedDate };
        setRange(nextRange);
        onChange?.(nextRange);
      }
      setIsOpen(false);
    }
  };

  const isSelected = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (range.start && d.toDateString() === range.start.toDateString()) return true;
    if (range.end && d.toDateString() === range.end.toDateString()) return true;
    return false;
  };

  const isInRange = (day: number) => {
    if (!range.start || !range.end) return false;
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return d > range.start && d < range.end;
  };

  const totalDays = daysInMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );
  const startOffset = firstDayOfMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      {/* Date Range Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && isOpen) setIsOpen(false);
        }}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Selected date range: ${formatDate(range.start)} to ${formatDate(range.end)}`}
        className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-input bg-background hover:bg-muted text-xs font-medium text-foreground transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
        <span>
          {formatDate(range.start)} – {formatDate(range.end)}
        </span>
      </button>

      {/* Popover Calendar Grid */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Date Range Calendar Selector"
          className="absolute top-full left-0 mt-2 flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl z-50 animate-in fade-in-50"
        >
          {/* Presets Sidebar */}
          <div className="flex flex-col gap-1 sm:border-r sm:border-border sm:pr-4 min-w-32">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">
              Quick Ranges
            </span>
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p.getRange)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-left hover:bg-accent hover:text-accent-foreground text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Month Calendar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1,
                        1
                      )
                    )
                  }
                  aria-label="Previous Month"
                  className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1,
                        1
                      )
                    )
                  }
                  aria-label="Next Month"
                  className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-muted-foreground">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="h-6 flex items-center justify-center">
                  {d}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8 w-8" />
              ))}
              {Array.from({ length: totalDays }).map((_, i) => {
                const day = i + 1;
                const sel = isSelected(day);
                const inR = isInRange(day);

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDateClick(day)}
                    aria-label={`Select ${day}`}
                    className={cn(
                      "h-8 w-8 rounded-lg text-xs font-medium transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      sel
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : inR
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent hover:text-accent-foreground text-foreground"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
