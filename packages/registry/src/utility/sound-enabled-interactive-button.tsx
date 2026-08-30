/**
 * @license MIT
 * @origin Evil Buttons (https://evilbuttons.com)
 * @author Evil Buttons & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Volume2 } from "lucide-react";

export interface SoundButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  toneFrequency?: number;
  durationMs?: number;
}

export function SoundEnabledInteractiveButton({
  children = "Click for Haptic Audio",
  toneFrequency = 640,
  durationMs = 30,
  className,
  onClick,
  ...props
}: SoundButtonProps) {
  const playHapticTone = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(toneFrequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + durationMs / 1000);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // Graceful silent fallback
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playHapticTone();
    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-card border border-border px-4 py-2.5 text-sm font-semibold text-foreground shadow-xs transition-all hover:bg-muted active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      <Volume2 className="h-4 w-4 text-primary" aria-hidden="true" />
      <span>{children}</span>
    </button>
  );
}
