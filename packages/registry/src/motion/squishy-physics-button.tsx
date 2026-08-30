/**
 * @license MIT
 * @origin Evil Buttons (https://evil-buttons.dev)
 * @author Evil Buttons Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Sparkles } from "lucide-react";

export interface SquishyPhysicsButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  enableAudio?: boolean;
}

export function SquishyPhysicsButton({
  children = "Click for Spring Bounce",
  enableAudio = false,
  className,
  onClick,
  ...props
}: SquishyPhysicsButtonProps) {
  const [isPressed, setIsPressed] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const playClickAudio = () => {
    if (!enableAudio || typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // AudioContext suppressed
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClickAudio();
    onClick?.(e);
  };

  return (
    <button
      type="button"
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onClick={handleClick}
      style={{
        transform: isPressed
          ? "scale(0.92, 0.88) translateY(3px)"
          : isHovered
          ? "scale(1.04, 1.04) translateY(-2px)"
          : "scale(1, 1) translateY(0px)",
      }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-xs shadow-lg",
        "transition-transform duration-200 ease-out select-none cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      <Sparkles className="h-4 w-4" aria-hidden="true" />
      <span>{children}</span>
    </button>
  );
}
