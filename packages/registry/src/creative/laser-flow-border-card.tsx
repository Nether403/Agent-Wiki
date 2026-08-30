/**
 * @license MIT
 * @origin Cult UI (https://cult-ui.com)
 * @author Cult UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Sparkles, ArrowRight } from "lucide-react";

export interface LaserFlowBorderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  badgeText?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  laserColor?: string;
  durationSeconds?: number;
  children?: React.ReactNode;
}

export function LaserFlowBorderCard({
  title = "Agentic Laser Flow Card",
  description = "Continuous directional laser beam border effect utilizing SVG stroke animations and CSS conic gradients for high-craft UI moments.",
  badgeText = "Cult UI Pattern",
  ctaText = "Inspect Primitive",
  onCtaClick,
  laserColor = "var(--color-primary, #10b981)",
  durationSeconds = 4,
  children,
  className,
  ...props
}: LaserFlowBorderCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl p-[1.5px] overflow-hidden group shadow-xl transition-transform duration-300 hover:scale-[1.01]",
        className
      )}
      {...props}
    >
      {/* Animated Rotating Laser Glow Gradient */}
      <div
        className="pointer-events-none absolute -inset-[150%] animate-[spin_4s_linear_infinite] motion-reduce:hidden"
        style={{
          background: `conic-gradient(from 0deg, transparent 0 320deg, ${laserColor} 360deg)`,
          animationDuration: `${durationSeconds}s`,
        }}
        aria-hidden="true"
      />

      {/* Static Fallback Border for prefers-reduced-motion */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl border border-primary/40 hidden motion-reduce:block"
        aria-hidden="true"
      />

      {/* Card Body Surface */}
      <div className="relative rounded-[15px] bg-card p-6 md:p-8 text-card-foreground border border-border/80 h-full flex flex-col justify-between gap-6 z-10">
        {children ? (
          children
        ) : (
          <>
            <div className="space-y-4">
              {badgeText && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold shadow-xs">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{badgeText}</span>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            {ctaText && (
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  @cult-ui/laser-flow
                </span>
                <button
                  type="button"
                  onClick={onCtaClick}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
