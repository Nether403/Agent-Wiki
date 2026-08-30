/**
 * @license MIT
 * @origin Remocn & Remotion (https://remocn.dev)
 * @author Remocn & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Play, Pause, SkipBack, SkipForward, Volume2, Layers } from "lucide-react";

export interface TrackItem {
  id: string;
  name: string;
  type: "video" | "audio" | "text" | "fx";
  startFrame: number;
  durationFrames: number;
}

export interface VideoTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  tracks: TrackItem[];
  totalFrames?: number;
  fps?: number;
}

export function ProgrammaticVideoTimeline({
  tracks,
  totalFrames = 300,
  fps = 30,
  className,
  ...props
}: VideoTimelineProps) {
  const [currentFrame, setCurrentFrame] = React.useState(45);
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => (prev >= totalFrames ? 0 : prev + 1));
      }, 1000 / fps);
    }
    return () => clearInterval(interval);
  }, [isPlaying, fps, totalFrames]);

  const trackColors = {
    video: "bg-blue-500/30 border-blue-500/60 text-blue-300",
    audio: "bg-emerald-500/30 border-emerald-500/60 text-emerald-300",
    text: "bg-amber-500/30 border-amber-500/60 text-amber-300",
    fx: "bg-purple-500/30 border-purple-500/60 text-purple-300",
  };

  const progressPercent = (currentFrame / totalFrames) * 100;

  return (
    <div
      className={cn("w-full overflow-hidden rounded-2xl border border-border bg-card shadow-lg select-none", className)}
      role="region"
      aria-label="Programmatic video editor timeline"
      {...props}
    >
      {/* Controls Bar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={isPlaying ? "Pause video timeline" : "Play video timeline"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
          </button>
          <button
            onClick={() => setCurrentFrame(0)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Restart timeline from frame 0"
          >
            <SkipBack className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-foreground">
          <span>FRAME: {currentFrame} / {totalFrames}</span>
          <span className="text-muted-foreground">({(currentFrame / fps).toFixed(1)}s)</span>
        </div>
      </div>

      {/* Multi-Track Canvas View */}
      <div className="relative p-4 space-y-2 overflow-x-auto min-h-[140px]">
        {/* Playhead Scrubber Line */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 z-20 w-0.5 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
          style={{ left: `calc(${progressPercent}% + 16px)` }}
          aria-hidden="true"
        />

        {tracks.map((track) => {
          const leftPct = (track.startFrame / totalFrames) * 100;
          const widthPct = (track.durationFrames / totalFrames) * 100;

          return (
            <div key={track.id} className="relative h-8 w-full rounded-md bg-muted/20 border border-border/40">
              <div
                className={cn(
                  "absolute top-0 bottom-0 flex items-center px-2 text-[11px] font-mono font-semibold rounded-md border truncate",
                  trackColors[track.type]
                )}
                style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
              >
                {track.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
