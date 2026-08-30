/**
 * @license MIT
 * @origin Remocn / Remotion (https://remotion.dev)
 * @author Remotion & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Play, Pause, Volume2 } from "lucide-react";

export interface WaveformAudioPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  trackTitle?: string;
  artist?: string;
  durationSeconds?: number;
}

export function WaveformAudioPlayer({
  trackTitle = "Synthesized Voiceover Track",
  artist = "Deepgram Nova-2",
  durationSeconds = 45,
  className,
  ...props
}: WaveformAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(35); // 0-100

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border border-border bg-card shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Audio Player: ${trackTitle} by ${artist}`}
      {...props}
    >
      <button
        type="button"
        onClick={() => setIsPlaying((p) => !p)}
        className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
      </button>

      <div className="flex flex-col flex-1 space-y-1.5 overflow-hidden">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-foreground truncate">{trackTitle}</span>
          <span className="text-[10px] font-mono text-muted-foreground">{artist}</span>
        </div>

        {/* Waveform Bar Track */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = Math.max(0, Math.min((e.clientX - rect.left) / rect.width * 100, 100));
            setProgress(pct);
          }}
          className="flex items-center gap-1 h-6 cursor-pointer"
        >
          {Array.from({ length: 32 }).map((_, i) => {
            const barPct = (i / 32) * 100;
            const isFilled = barPct <= progress;
            const height = Math.sin(i * 0.4) * 40 + 50;

            return (
              <div
                key={i}
                style={{ height: `${height}%` }}
                className={cn(
                  "flex-1 min-w-[2px] rounded-full transition-colors",
                  isFilled ? "bg-primary" : "bg-muted-foreground/30"
                )}
                aria-hidden="true"
              />
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 pl-2 border-l border-border/40 text-muted-foreground shrink-0">
        <Volume2 className="h-4 w-4" aria-hidden="true" />
      </div>
    </div>
  );
}
