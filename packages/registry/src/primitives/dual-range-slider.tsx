/**
 * @license MIT
 * @origin Origin UI / HeroUI (https://originui.com)
 * @author HeroUI Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface DualRangeSliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  onChange?: (values: [number, number]) => void;
  formatValue?: (val: number) => string;
  disabled?: boolean;
}

export function DualRangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value = [20, 80],
  onChange,
  formatValue = (v) => `${v}`,
  disabled = false,
  className,
  ...props
}: DualRangeSliderProps) {
  const [range, setRange] = React.useState<[number, number]>(value);
  const [activeThumb, setActiveThumb] = React.useState<"min" | "max" | null>(null);

  React.useEffect(() => {
    if (value) setRange(value);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMin = Math.min(Number(e.target.value), range[1] - step);
    const updated: [number, number] = [nextMin, range[1]];
    setRange(updated);
    onChange?.(updated);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMax = Math.max(Number(e.target.value), range[0] + step);
    const updated: [number, number] = [range[0], nextMax];
    setRange(updated);
    onChange?.(updated);
  };

  const minPercent = ((range[0] - min) / (max - min)) * 100;
  const maxPercent = ((range[1] - min) / (max - min)) * 100;

  return (
    <div
      className={cn("relative flex flex-col w-full py-4 space-y-2 select-none", className)}
      role="group"
      aria-label="Dual Range Slider Control"
      {...props}
    >
      {/* Values Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-foreground">
        <span>Min: {formatValue(range[0])}</span>
        <span>Max: {formatValue(range[1])}</span>
      </div>

      {/* Slider Track Container */}
      <div className="relative h-6 flex items-center">
        {/* Background rail */}
        <div className="absolute h-2 w-full rounded-full bg-muted" />

        {/* Selected Range Highlight */}
        <div
          className="absolute h-2 rounded-full bg-primary"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min Input Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={range[0]}
          disabled={disabled}
          onChange={handleMinChange}
          onFocus={() => setActiveThumb("min")}
          onBlur={() => setActiveThumb(null)}
          aria-label="Minimum value thumb"
          aria-valuenow={range[0]}
          aria-valuemin={min}
          aria-valuemax={range[1]}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer focus-visible:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary"
        />

        {/* Max Input Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={range[1]}
          disabled={disabled}
          onChange={handleMaxChange}
          onFocus={() => setActiveThumb("max")}
          onBlur={() => setActiveThumb(null)}
          aria-label="Maximum value thumb"
          aria-valuenow={range[1]}
          aria-valuemin={range[0]}
          aria-valuemax={max}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer focus-visible:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary"
        />
      </div>

      {/* Min / Max bounds footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}
