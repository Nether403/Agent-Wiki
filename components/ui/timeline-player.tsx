/**
 * @license MIT
 * @origin https://github.com/remocn/remocn
 * @author Remocn Team & Community
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, FastForward } from "lucide-react";
import { cn } from "../lib/utils";

export interface TimelinePlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  totalDurationFrames?: number;
  fps?: number;
  autoPlay?: boolean;
}

/**
 * TimelinePlayer: Precision timeline-based motion and video composition controller.
 * Conforms to ui:media taxonomy for frame-accurate playback and scrubbing.
 */
export function TimelinePlayer({
  title = "Composition Timeline",
  totalDurationFrames = 300,
  fps = 30,
  autoPlay = false,
  className,
  ...props
}: TimelinePlayerProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = React.useState(autoPlay && !shouldReduceMotion);
  const [currentFrame, setCurrentFrame] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(false);
  const [speed, setSpeed] = React.useState<1 | 1.5 | 2>(1);

  // Playback timer ticker
  React.useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = 1000 / (fps * speed);
    const timer = setInterval(() => {
      setCurrentFrame((prev) => {
        if (prev >= totalDurationFrames) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, fps, speed, totalDurationFrames]);

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const restart = () => {
    setCurrentFrame(0);
    setIsPlaying(true);
  };

  const cycleSpeed = () => {
    setSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1));
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFrame(Number(e.target.value));
  };

  // Convert frame to MM:SS:FF format
  const formatTimecode = (frame: number) => {
    const totalSeconds = Math.floor(frame / fps);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    const remainderFrames = (frame % fps).toString().padStart(2, "0");
    return `${minutes}:${seconds}:${remainderFrames}`;
  };

  const progressPercent = (currentFrame / totalDurationFrames) * 100;

  return (
    <div
      role="region"
      aria-label={title}
      className={cn(
        "relative flex flex-col w-full max-w-2xl rounded-2xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden p-5",
        className
      )}
      {...props}
    >
      {/* Media Canvas Viewport Placeholder */}
      <div className="relative w-full aspect-video rounded-xl border border-border bg-muted/40 flex flex-col items-center justify-center overflow-hidden mb-4">
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: isPlaying ? [1, 1.03, 1] : 1,
                  opacity: isPlaying ? 1 : 0.85,
                }
          }
          transition={{ repeat: Infinity, duration: 2 / speed }}
          className="flex flex-col items-center gap-2 select-none"
        >
          <div className="w-12 h-12 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center text-primary font-mono text-xs">
            {fps} FPS
          </div>
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <span className="font-mono text-xs text-muted-foreground tracking-wider">
            {formatTimecode(currentFrame)} / {formatTimecode(totalDurationFrames)}
          </span>
        </motion.div>

        {/* Scrub Overlay Track Line */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-primary transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Frame Timeline Slider */}
      <div className="flex flex-col gap-1.5 mb-4">
        <div className="flex justify-between items-center text-xs font-mono text-muted-foreground">
          <span>FRAME: {currentFrame}</span>
          <span>TOTAL: {totalDurationFrames}</span>
        </div>
        <label htmlFor="timeline-scrubber" className="sr-only">
          Timeline frame scrubber
        </label>
        <input
          id="timeline-scrubber"
          type="range"
          min={0}
          max={totalDurationFrames}
          value={currentFrame}
          onChange={handleScrub}
          aria-valuemin={0}
          aria-valuemax={totalDurationFrames}
          aria-valuenow={currentFrame}
          aria-valuetext={`Frame ${currentFrame} of ${totalDurationFrames}`}
          className="w-full h-2 rounded-lg bg-muted appearance-none cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {/* Composition Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause timeline playback" : "Play timeline playback"}
            className="p-2.5 rounded-xl border border-border bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={restart}
            aria-label="Restart timeline playback from frame zero"
            className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={cycleSpeed}
            aria-label={`Current playback speed ${speed}x. Click to change.`}
            className="px-2.5 py-1 text-xs font-mono rounded-lg border border-border bg-card text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {speed}x
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMuted((m) => !m)}
            aria-label={isMuted ? "Unmute audio track" : "Mute audio track"}
            className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
