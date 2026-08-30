/**
 * @license MIT
 * @origin Fancy Components (https://fancycomponents.dev)
 * @author Fancy Components & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface VariableFontSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  minWeight?: number;
  maxWeight?: number;
  minSlant?: number;
  maxSlant?: number;
}

export function VariableFontSlider({
  text = "MACHINE FIRST CRAFT",
  minWeight = 200,
  maxWeight = 900,
  minSlant = 0,
  maxSlant = -10,
  className,
  ...props
}: VariableFontSliderProps) {
  const [weight, setWeight] = React.useState(500);
  const [slant, setSlant] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const ratioX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ratioY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setWeight(Math.round(minWeight + ratioX * (maxWeight - minWeight)));
    setSlant(Math.round(minSlant + ratioY * (maxSlant - minSlant)));
  };

  const handleMouseLeave = () => {
    setWeight(500);
    setSlant(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative flex h-48 w-full select-none flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs cursor-crosshair", className)}
      role="region"
      aria-label="Variable font interactive interpolation surface"
      {...props}
    >
      <h2
        className="text-3xl sm:text-5xl font-black tracking-tight text-foreground transition-[font-variation-settings,font-weight] duration-75 text-center leading-none"
        style={{
          fontWeight: weight,
          fontVariationSettings: `'wght' ${weight}, 'slnt' ${slant}`,
        }}
      >
        {text}
      </h2>
      <div className="mt-4 flex items-center gap-4 text-xs font-mono text-muted-foreground">
        <span>WEIGHT: {weight}</span>
        <span>SLANT: {slant}°</span>
      </div>
    </div>
  );
}
