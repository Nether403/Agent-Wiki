/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Community Contributor
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface CyberHudFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  systemCode?: string;
}

export function CyberHudFrame({
  title = "TELEMETRY OVERLAY",
  systemCode = "SYS.CORE-01",
  children,
  className,
  ...props
}: CyberHudFrameProps) {
  return (
    <div
      className={cn(
        "relative p-6 rounded-xl border border-primary/40 bg-card/90 text-card-foreground shadow-lg overflow-hidden",
        className
      )}
      role="region"
      aria-label={`HUD Frame: ${title}`}
      {...props}
    >
      {/* Corner Bracket Accents */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary" aria-hidden="true" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary" aria-hidden="true" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary" aria-hidden="true" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary" aria-hidden="true" />

      {/* Header bar */}
      <header className="flex items-center justify-between pb-3 mb-4 border-b border-primary/20 text-[10px] font-mono text-primary font-bold tracking-widest uppercase">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
          {title}
        </span>
        <span className="opacity-80">{systemCode}</span>
      </header>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
