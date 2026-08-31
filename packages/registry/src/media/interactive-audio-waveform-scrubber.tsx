/**
 * @origin Remocn & Remotion (https://remocn.dev, https://remotion.dev)
 * @license MIT
 * @author Remocn Team & Remotion Community
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { Play, Pause, RotateCcw, Volume2, Bookmark, FastForward } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AudioCuePoint {
  timeSec: number;
  label: string;
}

export interface InteractiveAudioWaveformScrubberProps {
  durationSec?: number;
  cuePoints?: AudioCuePoint[];
  onSeek?: (timeSec: number) => void;
  className?: string;
}

export function InteractiveAudioWaveformScrubber({
  durationSec = 45,
  cuePoints = [
    { timeSec: 5, label: "Intro Hook" },
    { timeSec: 18, label: "Core Feature Drop" },
    { timeSec: 36, label: "Call to Action" },
  ],
  onSeek,
  className,
}: InteractiveAudioWaveformScrubberProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [playbackRate, setPlaybackRate] = React.useState<number>(1);
  const animationFrameRef = React.useRef<number | null>(null);

  // Generate deterministic synthetic waveform bar heights (36 bars)
  const waveformHeights = React.useMemo(() => {
    const heights: number[] = [];
    for (let i = 0; i < 48; i++) {
      const h = Math.sin(i * 0.45) * 40 + Math.cos(i * 0.9) * 20 + 45;
      heights.push(Math.max(15, Math.min(95, h)));
    }
    return heights;
  }, []);

  React.useEffect(() => {
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isPlaying || prefersReducedMotion) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    let lastTimestamp = performance.now();

    const tick = (now: number) => {
      const deltaSec = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      setCurrentTime((prev) => {
        const next = prev + deltaSec * playbackRate;
        if (next >= durationSec) {
          setIsPlaying(false);
          return durationSec;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, playbackRate, durationSec]);

  const handleBarClick = (index: number) => {
    const targetTime = (index / waveformHeights.length) * durationSec;
    setCurrentTime(targetTime);
    onSeek?.(targetTime);
  };

  const progressPercentage = (currentTime / durationSec) * 100;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms}`;
  };

  return (
    <div className={cn("w-full space-y-3.5 rounded-xl border border-border bg-card p-5 shadow-xs select-none", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-primary" role="img" aria-hidden="true" />
          <span className="text-xs font-semibold text-foreground tracking-tight">
            Audio Stem Scrubber & Cue Editor
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="text-primary font-medium tabular-nums">{formatTime(currentTime)}</span>
          <span>/</span>
          <span className="tabular-nums">{formatTime(durationSec)}</span>
        </div>
      </div>

      {/* Interactive Waveform Bar Visualizer */}
      <div
        className="relative flex h-20 w-full items-end gap-1 overflow-hidden rounded-lg bg-muted/40 p-2 cursor-pointer"
        role="slider"
        aria-label="Audio Timeline Scrubber"
        aria-valuemin={0}
        aria-valuemax={durationSec}
        aria-valuenow={currentTime}
        aria-valuetext={formatTime(currentTime)}
      >
        {waveformHeights.map((height, idx) => {
          const barProgress = (idx / waveformHeights.length) * 100;
          const isPassed = barProgress <= progressPercentage;

          return (
            <div
              key={`bar-${idx}`}
              onClick={() => handleBarClick(idx)}
              className="group relative flex-1 h-full flex items-end"
            >
              <div
                className={cn(
                  "w-full rounded-xs transition-all duration-75",
                  isPassed
                    ? "bg-primary"
                    : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
                )}
                style={{ height: `${height}%` }}
              />
            </div>
          );
        })}

        {/* Playhead Marker */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-destructive z-10"
          style={{ left: `${progressPercentage}%` }}
        >
          <div className="h-2 w-2 -translate-x-[3px] rounded-full bg-destructive shadow-xs" />
        </div>

        {/* Cue Point Markers */}
        {cuePoints.map((cue) => {
          const cuePercent = (cue.timeSec / durationSec) * 100;
          return (
            <div
              key={cue.label}
              className="absolute top-1 -translate-x-1/2 z-20 group"
              style={{ left: `${cuePercent}%` }}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentTime(cue.timeSec);
              }}
            >
              <Bookmark className="h-3 w-3 text-amber-500 fill-amber-500 cursor-pointer hover:scale-125 transition-transform duration-150" role="img" aria-label={cue.label} />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap rounded-xs bg-background/95 px-1.5 py-0.5 font-mono text-3xs border border-border text-foreground shadow-xs">
                {cue.label} ({Math.round(cue.timeSec)}s)
              </div>
            </div>
          );
        })}
      </div>

      {/* Scrubber Transport Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" role="img" aria-hidden="true" /> Pause
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" role="img" aria-hidden="true" /> Play
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentTime(0)}
            aria-label="Restart Audio"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="h-3.5 w-3.5" role="img" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Speed:</span>
          {[1, 1.5, 2].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => setPlaybackRate(rate)}
              className={cn(
                "px-2 py-0.5 rounded-md font-mono transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                playbackRate === rate
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
