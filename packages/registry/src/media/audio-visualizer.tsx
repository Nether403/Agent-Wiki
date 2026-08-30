/**
 * @license MIT
 * @origin Remocn / Machine-First Design Agent Wiki
 * @author Remocn Team & Community
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import * as React from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { cn } from "../lib/utils";

export interface AudioVisualizerProps extends React.HTMLAttributes<HTMLDivElement> {
  barCount?: number;
  initialPlaying?: boolean;
}

export function AudioVisualizer({
  barCount = 32,
  initialPlaying = false,
  className,
  ...props
}: AudioVisualizerProps) {
  const [isPlaying, setIsPlaying] = React.useState(initialPlaying);
  const [frequencies, setFrequencies] = React.useState<number[]>(() =>
    Array.from({ length: barCount }, () => Math.random() * 0.5 + 0.2)
  );

  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setFrequencies(
        Array.from({ length: barCount }, () => Math.random() * 0.8 + 0.2)
      );
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying, barCount]);

  return (
    <div
      role="region"
      aria-label="Audio Waveform Visualizer"
      className={cn(
        "flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-xs font-semibold text-foreground">
            Acoustic Signal Stream
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Pause audio stream" : "Play audio stream"}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isPlaying ? (
            <>
              <Pause className="h-3.5 w-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              <span>Synthesize</span>
            </>
          )}
        </button>
      </div>

      {/* Waveform Bar Graphic */}
      <div
        aria-hidden="true"
        className="flex h-20 items-end justify-between gap-1 rounded-2xl bg-muted/40 px-4 py-3"
      >
        {frequencies.map((freq, idx) => (
          <div
            key={idx}
            style={{
              transform: `scaleY(${isPlaying ? freq : 0.2})`,
            }}
            className="h-full w-full max-w-1.5 origin-bottom rounded-full bg-primary transition-transform duration-100 ease-out"
          />
        ))}
      </div>
    </div>
  );
}
