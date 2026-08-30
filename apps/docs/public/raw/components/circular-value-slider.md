---
id: "circular-value-slider"
name: "Circular Value Slider"
category: "ui:primitive"
library_origin: "https://github.com/argyleink/gui-challenges"
dependencies:
  - "clsx"
  - "tailwind-merge"
tags:
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
  - "circular-slider"
  - "dial"
  - "radial"
  - "gauge"
  - "touch"
  - "gui-challenges"
  - "cloudscape"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Circular Value Slider (`circular-value-slider`)
> Accessible SVG circular dial with drag interaction, keyboard step increment, precision readout, and dynamic arc calculation.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block, circular-slider, dial, radial, gauge, touch, gui-challenges, cloudscape
- **Design Dials**: Variance 6/10 · Motion 3/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add circular-value-slider

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/circular-value-slider.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin https://github.com/argyleink/gui-challenges
 * @author Adam Argyle & Community
 * @curated-by Machine-First Design Agent Wiki
 * Category: ui:primitive
 * Description: Accessible SVG circular dial with drag interaction, keyboard step increment, precision readout, and dynamic arc calculation.
 */

import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface CircularValueSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  size?: number;
  strokeWidth?: number;
  label?: string;
  unit?: string;
  className?: string;
}

export function CircularValueSlider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  size = 180,
  strokeWidth = 14,
  label = "Volume Level",
  unit = "%",
  className,
}: CircularValueSliderProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = (clampedValue - min) / (max - min);
  const strokeDashoffset = circumference - percentage * circumference;

  const updateAngleFromEvent = (clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    let angle = Math.atan2(deltaY, deltaX) + Math.PI / 2;
    if (angle < 0) angle += 2 * Math.PI;

    const rawPct = angle / (2 * Math.PI);
    const rawVal = min + rawPct * (max - min);
    const steppedVal = Math.round(rawVal / step) * step;
    onChange(Math.min(Math.max(steppedVal, min), max));
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.preventDefault();
    setIsDragging(true);
    updateAngleFromEvent(e.clientX, e.clientY);
  };

  React.useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      updateAngleFromEvent(e.clientX, e.clientY);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, min, max, step]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      onChange(Math.min(max, clampedValue + step));
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      onChange(Math.max(min, clampedValue - step));
    }
  };

  return (
    <div
      role="slider"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={clampedValue}
      aria-valuetext={`${clampedValue}${unit}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative flex flex-col items-center justify-center select-none rounded-2xl p-4 bg-card border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
      style={{ width: size + 32, height: size + 32 }}
    >
      <svg
        ref={svgRef}
        width={size}
        height={size}
        onPointerDown={handlePointerDown}
        className="cursor-pointer touch-none"
        role="img"
        aria-label={`${label} dial control`}
      >
        {/* Track Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-muted, #27272a)"
          strokeWidth={strokeWidth}
        />
        {/* Active Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-primary, #10b981)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-[stroke-dashoffset] duration-75"
        />
      </svg>

      {/* Center Readout Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
        <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
          {clampedValue}
          <span className="text-xs text-muted-foreground ml-0.5">{unit}</span>
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">
          {label}
        </span>
      </div>
    </div>
  );
}

```
