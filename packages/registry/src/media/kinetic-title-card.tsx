/**
 * @license MIT
 * @origin Remocn / Remotion (https://remotion.dev)
 * @author Remotion & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface KineticTitleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function KineticTitleCard({
  title,
  subtitle,
  badge = "SCENE 01",
  className,
  ...props
}: KineticTitleCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-12 rounded-2xl border border-border bg-card text-card-foreground shadow-xl overflow-hidden text-center aspect-video max-w-xl mx-auto select-none",
        className
      )}
      role="region"
      aria-label={`Kinetic Title Card: ${title}`}
      {...props}
    >
      {/* Mesh backdrop */}
      <div
        className="absolute inset-0 bg-radial from-primary/20 via-transparent to-transparent opacity-60 pointer-events-none"
        aria-hidden="true"
      />

      {badge && (
        <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary uppercase mb-3">
          {badge}
        </span>
      )}

      <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight leading-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="text-xs text-muted-foreground mt-2 max-w-sm leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
