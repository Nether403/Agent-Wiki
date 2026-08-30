/**
 * @license MIT
 * @origin Magic UI (https://magicui.design)
 * @author Magic UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Sparkles, Terminal, Code2, Cpu, Globe, Database } from "lucide-react";

export interface OrbitItem {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  radius: number;
  durationSeconds: number;
  reverse?: boolean;
}

export interface OrbitingCirclesProps extends React.HTMLAttributes<HTMLDivElement> {
  centerIcon?: React.ReactNode;
  orbits?: OrbitItem[];
}

const DEFAULT_ORBITS: OrbitItem[] = [
  { icon: Terminal, radius: 80, durationSeconds: 20 },
  { icon: Code2, radius: 80, durationSeconds: 20, reverse: true },
  { icon: Cpu, radius: 140, durationSeconds: 30 },
  { icon: Database, radius: 140, durationSeconds: 30, reverse: true },
  { icon: Globe, radius: 190, durationSeconds: 40 },
];

export function OrbitingCircles({
  centerIcon,
  orbits = DEFAULT_ORBITS,
  className,
  ...props
}: OrbitingCirclesProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center h-96 w-full overflow-hidden rounded-2xl border border-border bg-card select-none",
        className
      )}
      role="region"
      aria-label="Orbiting Circles Animation"
      {...props}
    >
      {/* Central Core Icon */}
      <div className="relative z-10 flex items-center justify-center h-14 w-14 rounded-2xl bg-primary text-primary-foreground shadow-xl border border-primary/40">
        {centerIcon || <Sparkles className="h-6 w-6" aria-hidden="true" />}
      </div>

      {/* SVG Orbit Tracks */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none" role="img" aria-hidden="true">
        {[80, 140, 190].map((r) => (
          <circle
            key={r}
            cx="50%"
            cy="50%"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border"
            strokeDasharray="4 4"
          />
        ))}
      </svg>

      {/* Orbiting Elements */}
      {orbits.map((item, idx) => {
        const IconComponent = item.icon;
        const animDuration = `${item.durationSeconds}s`;

        return (
          <div
            key={idx}
            style={{
              width: `${item.radius * 2}px`,
              height: `${item.radius * 2}px`,
              animation: `spin ${animDuration} linear infinite ${item.reverse ? "reverse" : "normal"}`,
            }}
            className="absolute rounded-full pointer-events-none flex items-start justify-center"
          >
            <div className="flex items-center justify-center h-9 w-9 rounded-xl border border-border bg-background shadow-md text-foreground -translate-y-1/2">
              <IconComponent className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
