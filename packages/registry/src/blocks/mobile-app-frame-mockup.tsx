/**
 * @license MIT
 * @origin Launch UI (https://launch-ui.com)
 * @author Launch UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Wifi, BatteryMedium, Signal } from "lucide-react";

export interface MobileAppFrameMockupProps extends React.HTMLAttributes<HTMLDivElement> {
  time?: string;
  dynamicIslandContent?: React.ReactNode;
  children?: React.ReactNode;
}

export function MobileAppFrameMockup({
  time = "9:41",
  dynamicIslandContent,
  children,
  className,
  ...props
}: MobileAppFrameMockupProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-[320px] sm:w-[360px] h-[660px] sm:h-[720px] rounded-[48px] border-[10px] border-zinc-900 bg-background shadow-2xl overflow-hidden flex flex-col select-none ring-1 ring-white/10",
        className
      )}
      {...props}
    >
      {/* Glossy bezel highlight border */}
      <div className="pointer-events-none absolute inset-0 rounded-[38px] ring-1 ring-white/20 z-30" aria-hidden="true" />

      {/* Top Status Bar & Dynamic Island */}
      <div className="relative z-20 flex items-center justify-between px-7 pt-3.5 pb-2 text-foreground">
        {/* Clock */}
        <span className="text-xs font-semibold tracking-tight">{time}</span>

        {/* Dynamic Island Capsule */}
        <div className="absolute left-1/2 -translate-x-1/2 top-2.5 h-6 px-3 min-w-[90px] rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-md transition-all">
          {dynamicIslandContent ? (
            dynamicIslandContent
          ) : (
            <div className="flex items-center gap-1.5" role="presentation">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              <span className="text-[10px] font-mono text-zinc-400">Ready</span>
            </div>
          )}
        </div>

        {/* Status Icons */}
        <div className="flex items-center gap-1.5 text-foreground" role="presentation">
          <Signal className="h-3 w-3" aria-hidden="true" />
          <Wifi className="h-3 w-3" aria-hidden="true" />
          <BatteryMedium className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
      </div>

      {/* Screen Viewport Container */}
      <div className="relative flex-1 overflow-y-auto px-4 py-3 z-10 flex flex-col">
        {children ? (
          children
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-lg">
              📱
            </div>
            <h4 className="text-base font-bold text-foreground">Mobile Showcase Frame</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mobile-first viewport container designed for evaluating touch navigation, responsive ergonomics, and swipe gestures.
            </p>
          </div>
        )}
      </div>

      {/* Home Indicator Bar */}
      <div className="relative z-20 flex justify-center py-2 bg-background/80 backdrop-blur-xs">
        <div className="h-1 w-32 rounded-full bg-muted-foreground/30" aria-hidden="true" />
      </div>
    </div>
  );
}
