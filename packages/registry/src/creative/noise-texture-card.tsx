/**
 * @license MIT
 * @origin React Bits (https://reactbits.dev)
 * @author React Bits Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface NoiseTextureCardProps {
  title: string;
  subtitle?: string;
  description: string;
  tag?: string;
  className?: string;
}

export function NoiseTextureCard({
  title,
  subtitle,
  description,
  tag = "Creative Engine",
  className,
}: NoiseTextureCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-sm transition-all hover:border-border/80 hover:shadow-md",
        className
      )}
    >
      {/* Micro SVG Noise Texture Pattern */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-20 transition-opacity group-hover:opacity-30"
        aria-hidden="true"
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      <div className="relative z-10">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          {tag}
        </div>
        <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {subtitle}
          </p>
        )}
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
