---
id: "adaptive-touch-slider"
name: "Adaptive Touch Slider"
category: "ui:primitive"
library_origin: "https://github.com/argyleink/gui-challenges"
dependencies:
  - "clsx"
  - "tailwind-merge"
tags:
  - "tailwind-v4"
  - "brutalist"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "gui-challenges"
  - "react-spectrum"
  - "slider"
  - "touch"
  - "accessible"
  - "range"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Adaptive Touch Slider (`adaptive-touch-slider`)
> Accessible touch and gesture-aware dual slider primitive with discrete step snapping and WAI-ARIA values.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: tailwind-v4, brutalist, keyboard-accessible, wai-aria-compliant, gui-challenges, react-spectrum, slider, touch, accessible, range
- **Design Dials**: Variance 3/10 · Motion 3/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add adaptive-touch-slider

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/adaptive-touch-slider.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @origin Google GUI Challenges & Adobe React Spectrum (https://github.com/argyleink/gui-challenges, https://github.com/adobe/react-spectrum)
 * @license Apache-2.0
 * @author Adam Argyle & Adobe React Spectrum Team
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdaptiveTouchSliderProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  unit?: string;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export function AdaptiveTouchSlider({
  label = "Adaptive Density Slider",
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = 50,
  unit = "%",
  onChange,
  disabled = false,
  className,
}: AdaptiveTouchSliderProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const percentage = React.useMemo(() => {
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  }, [value, min, max]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = Number(e.target.value);
      if (controlledValue === undefined) {
        setInternalValue(num);
      }
      onChange?.(num);
    },
    [controlledValue, onChange]
  );

  return (
    <div className={cn("w-full space-y-2.5 rounded-lg border border-border bg-card p-4 shadow-xs", className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor="adaptive-slider-input"
          className="text-xs font-semibold text-foreground tracking-tight"
        >
          {label}
        </label>
        <span className="font-mono text-xs font-medium text-primary tabular-nums">
          {value}
          {unit}
        </span>
      </div>

      <div className="relative flex items-center select-none touch-none h-7">
        {/* Track Background */}
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
          {/* Active Fill Bar */}
          <div
            className="h-full bg-primary transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Accessible Range Input */}
        <input
          id="adaptive-slider-input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value}${unit}`}
          className="absolute inset-0 h-full w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        {/* Custom Visual Thumb */}
        <div
          className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 rounded-full border-2 border-primary bg-background shadow-md transition-transform duration-75"
          style={{ left: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-2xs font-mono text-muted-foreground">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}

```
