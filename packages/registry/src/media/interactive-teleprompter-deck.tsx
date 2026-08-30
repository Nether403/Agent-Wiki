/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Category: ui:media
 * Name: interactive-teleprompter-deck
 */

import * as React from "react";
import { Play, Pause, RotateCcw, FlipHorizontal, Type, Gauge } from "lucide-react";

export interface TeleprompterDeckProps {
  initialScript?: string;
  initialWpm?: number;
  fontSizeRem?: number;
  className?: string;
}

export const InteractiveTeleprompterDeck: React.FC<TeleprompterDeckProps> = ({
  initialScript = `Welcome to the Machine-First Design Agent Wiki presentation.

Today, we demonstrate how autonomous AI coding agents move away from brittle pixel-pushing to deterministic, high-craft architectural assembly.

By utilizing pre-tested, zero-slop component registries, agents generate WCAG 2.1 AA compliant interfaces with zero hallucinated tokens.

Notice how the teleprompter maintains smooth, readable pacing calibrated directly to natural speaking velocity.`,
  initialWpm = 130,
  fontSizeRem = 1.5,
  className = "",
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [wpm, setWpm] = React.useState(initialWpm);
  const [fontSize, setFontSize] = React.useState(fontSizeRem);
  const [isMirrored, setIsMirrored] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scrollLoop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (isPlaying && scrollContainerRef.current && !prefersReducedMotion) {
        // Calculate scroll speed based on words per minute (approx 200 words = 1000px height)
        const pixelsPerSecond = (wpm / 60) * 18;
        scrollContainerRef.current.scrollTop += (pixelsPerSecond * delta) / 1000;
      }

      if (isPlaying && !prefersReducedMotion) {
        animId = requestAnimationFrame(scrollLoop);
      }
    };

    if (isPlaying && !prefersReducedMotion) {
      animId = requestAnimationFrame(scrollLoop);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, wpm]);

  const handleReset = () => {
    setIsPlaying(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  return (
    <section
      aria-label="Interactive Teleprompter Deck"
      className={`flex flex-col w-full max-w-3xl mx-auto rounded-2xl bg-card border border-border text-card-foreground shadow-2xl overflow-hidden ${className}`}
    >
      {/* Control Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border bg-muted/40 text-xs font-mono">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause Prompter" : "Play Prompter"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? "Pause" : "Start"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset Prompter"
            className="p-1.5 rounded-md bg-background border border-border text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed & Font Dials */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-primary" role="img" aria-label="Speed dial" />
            <span>{wpm} WPM</span>
            <input
              type="range"
              min="80"
              max="240"
              step="10"
              value={wpm}
              onChange={(e) => setWpm(parseInt(e.target.value, 10))}
              aria-label="Words per minute slider"
              className="w-20 accent-primary"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Type className="w-4 h-4 text-primary" role="img" aria-label="Font size dial" />
            <span>{fontSize}rem</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.25"
              value={fontSize}
              onChange={(e) => setFontSize(parseFloat(e.target.value))}
              aria-label="Font size slider"
              className="w-20 accent-primary"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsMirrored(!isMirrored)}
            aria-label="Toggle Mirror Mode"
            className={`p-1.5 rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isMirrored
                ? "bg-primary/20 border-primary text-primary"
                : "bg-background border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Prompter Visual Viewport */}
      <div className="relative w-full h-80 bg-zinc-950 text-zinc-100 dark:bg-black overflow-hidden">
        {/* Reading Marker Overlay Line */}
        <div
          className="absolute top-1/3 left-0 right-0 h-12 bg-primary/10 border-y border-primary/30 pointer-events-none z-10 flex items-center justify-end px-4"
          aria-hidden="true"
        >
          <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Eye-Level Guide</span>
        </div>

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          role="region"
          aria-label="Teleprompter Text Scroll Area"
          tabIndex={0}
          style={{
            transform: isMirrored ? "scaleX(-1)" : "none",
          }}
          className="w-full h-full overflow-y-auto px-8 py-32 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary select-none"
        >
          <div
            style={{ fontSize: `${fontSize}rem`, lineHeight: "1.8" }}
            className="font-sans font-medium text-center text-zinc-100 max-w-xl mx-auto whitespace-pre-line tracking-wide"
          >
            {initialScript}
          </div>
        </div>
      </div>

      {/* Footer Instructions */}
      <footer className="flex items-center justify-between p-3 border-t border-border bg-muted/20 text-xs text-muted-foreground font-mono">
        <span>Remocn & Remotion Video Workflow Compatible</span>
        <span className="text-primary">Zero Layout Slop</span>
      </footer>
    </section>
  );
};
export default InteractiveTeleprompterDeck;
