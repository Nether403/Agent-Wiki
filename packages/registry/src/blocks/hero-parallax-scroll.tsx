/**
 * @license MIT
 * @origin Aceternity UI (https://ui.aceternity.com)
 * @author Manu Arora & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";

export interface HeroParallaxScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  headline?: string;
  subheadline?: string;
  images?: string[];
  ctaLabel?: string;
  onCtaClick?: () => void;
}

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&q=80",
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&q=80",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80",
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80",
];

export function HeroParallaxScroll({
  headline = "The Machine-First Interface Standard",
  subheadline = "Deterministic, token-efficient UI components calibrated for autonomous coding agents and design engineers.",
  images = DEFAULT_IMAGES,
  ctaLabel = "Explore Component Registry",
  onCtaClick,
  className,
  ...props
}: HeroParallaxScrollProps) {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className={cn(
        "relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden bg-background text-foreground py-20 px-4",
        className
      )}
      aria-label="Hero Section"
      {...props}
    >
      {/* Central Hero Typography */}
      <div className="relative z-20 max-w-4xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-card/80 backdrop-blur-md shadow-xs text-xs font-medium text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>React 19 & Tailwind CSS v4 Ready</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          {headline}
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
          {subheadline}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={onCtaClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 3D Perspective Parallax Gallery Grid */}
      <div className="relative z-10 w-full max-w-6xl mt-16 [perspective:1000px]">
        <div
          style={{
            transform: `rotateX(15deg) translateY(-${Math.min(100, scrollY * 0.15)}px)`,
          }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-6 transition-transform duration-100 ease-out"
        >
          {images.map((src, idx) => (
            <div
              key={idx}
              className="relative h-48 sm:h-64 rounded-2xl overflow-hidden border border-border bg-card shadow-2xl transition-transform hover:scale-105 duration-200"
            >
              <img
                src={src}
                alt="UI Registry Snapshot"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
