/**
 * @license MIT
 * @origin Magic UI & Launch UI (https://launch-ui.com)
 * @author Launch UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface LogoItem {
  name: string;
  logo?: React.ReactNode;
}

export interface LogoCloudProps extends React.HTMLAttributes<HTMLDivElement> {
  logos: LogoItem[];
  headline?: string;
  speed?: "slow" | "normal" | "fast";
}

export function InfiniteLogoCloudCarousel({
  logos,
  headline = "POWERING ENTERPRISE AGENT WORKFLOWS WORLDWIDE",
  speed = "normal",
  className,
  ...props
}: LogoCloudProps) {
  const speedDurations = {
    slow: "60s",
    normal: "35s",
    fast: "20s",
  };

  return (
    <section
      className={cn("w-full overflow-hidden py-10 bg-transparent select-none", className)}
      role="region"
      aria-label="Partner and integration logo carousel"
      {...props}
    >
      {headline && (
        <p className="text-center text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground mb-8">
          {headline}
        </p>
      )}

      {/* Marquee Track with Masked Edges */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <div
          className="flex w-max gap-12 sm:gap-16 animate-marquee motion-reduce:animate-none"
          style={{ animationDuration: speedDurations[speed] }}
        >
          {[...logos, ...logos, ...logos].map((logo, idx) => (
            <div
              key={`${logo.name}-${idx}`}
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground grayscale hover:grayscale-0"
            >
              {logo.logo ? (
                logo.logo
              ) : (
                <div className="flex h-8 items-center justify-center font-bold tracking-tight text-sm sm:text-base">
                  {logo.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
