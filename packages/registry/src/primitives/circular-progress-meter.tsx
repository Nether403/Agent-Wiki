/**
 * @license MIT
 * @origin HeroUI (https://heroui.com)
 * @author HeroUI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  showValueLabel?: boolean;
  label?: string;
}

export function CircularProgressMeter({
  value = 75,
  size = 120,
  strokeWidth = 10,
  showValueLabel = true,
  label = "Quality Health Index",
  className,
  ...props
}: CircularProgressProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-2 p-4", className)}
      role="progressbar"
      aria-valuenow={normalizedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      {...props}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="h-full w-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Progress ring">
          <title>Progress ring</title>
          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-muted/40"
            fill="none"
          />
          {/* Progress Stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="stroke-primary transition-[stroke-dashoffset] duration-500 ease-out"
            fill="none"
          />
        </svg>

        {showValueLabel && (
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold tracking-tight text-foreground font-mono">
              {normalizedValue}%
            </span>
          </div>
        )}
      </div>

      {label && <span className="text-xs font-medium text-muted-foreground">{label}</span>}
    </div>
  );
}
