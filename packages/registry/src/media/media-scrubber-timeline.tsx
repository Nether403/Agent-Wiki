/**
 * @license MIT
 * @origin Remocn / Remotion (https://remotion.dev)
 * @author Remotion & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";

export interface MediaScrubberTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  durationSeconds?: number;
  onSeek?: (timeSeconds: number) => void;
}

export function MediaScrubberTimeline({
  durationSeconds = 60,
  onSeek,
  className,
  ...props
}: MediaScrubberTimelineProps) {
  const [currentTime, setCurrentTime] = React.useState(18.5);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newTime = (x / rect.width) * durationSeconds;
    setCurrentTime(newTime);
    onSeek?.(newTime);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms}`;
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full p-4 rounded-xl border border-border bg-card shadow-xs text-card-foreground space-y-3",
        className
      )}
      role="region"
      aria-label="Media Playback Scrubber Timeline"
      {...props}
    >
      {/* Controls & Timecode */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={isPlaying ? "Pause playback" : "Start playback"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
          </button>
          <button
            type="button"
            onClick={() => setCurrentTime(0)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Restart to beginning"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        <span className="font-mono text-xs font-bold text-foreground">
          {formatTime(currentTime)} / {formatTime(durationSeconds)}
        </span>
      </div>

      {/* Scrubber Track */}
      <div
        onClick={handleTimelineClick}
        className="relative h-10 w-full rounded-lg bg-muted/40 border border-border cursor-pointer overflow-hidden select-none"
      >
        {/* Synthetic audio waveform background */}
        <div className="absolute inset-0 flex items-center justify-between px-1 opacity-25">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              style={{ height: `${(Math.sin(i * 0.5) * 0.4 + 0.5) * 80}%` }}
              className="w-1 rounded-full bg-foreground"
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Progress Fill */}
        <div
          style={{ width: `${(currentTime / durationSeconds) * 100}%` }}
          className="absolute top-0 bottom-0 left-0 bg-primary/20 border-r-2 border-primary transition-all duration-75"
        />
      </div>
    </div>
  );
}
