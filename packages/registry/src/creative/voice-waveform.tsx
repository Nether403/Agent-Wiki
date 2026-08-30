/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Community Contributor
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Mic } from "lucide-react";

export interface VoiceWaveformProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  barCount?: number;
}

export function VoiceWaveform({
  active = true,
  barCount = 24,
  className,
  ...props
}: VoiceWaveformProps) {
  const [heights, setHeights] = React.useState<number[]>(
    Array.from({ length: barCount }, () => 20)
  );

  React.useEffect(() => {
    if (!active) {
      setHeights(Array.from({ length: barCount }, () => 15));
      return;
    }

    const interval = setInterval(() => {
      setHeights(
        Array.from({ length: barCount }, () => Math.floor(Math.random() * 75) + 15)
      );
    }, 120);

    return () => clearInterval(interval);
  }, [active, barCount]);

  return (
    <div
      className={cn(
        "flex items-center gap-1 h-16 p-3 rounded-xl border border-border bg-card shadow-xs",
        className
      )}
      role="region"
      aria-label="Real-time Audio Frequency Waveform"
      {...props}
    >
      <Mic className="h-4 w-4 text-primary shrink-0 mr-2" aria-hidden="true" />
      <div className="flex items-center gap-1 h-full flex-1">
        {heights.map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className="flex-1 min-w-[2px] rounded-full bg-primary transition-all duration-100 ease-out opacity-80 hover:opacity-100"
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
