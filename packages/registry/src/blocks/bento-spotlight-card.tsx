/**
 * @license MIT
 * @origin https://github.com/aceternity/ui
 * @author Manu Arora & Community
 * @curated-by Machine-First Design Agent Wiki
 * Category: ui:block
 * Description: Bento card featuring radial spotlight glow following pointer coordinates, border beam accent, and subtle hover scale.
 */

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface BentoSpotlightCardProps {
  title: string;
  description: string;
  badge?: string;
  icon?: React.ReactNode;
  spotlightColor?: string;
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export function BentoSpotlightCard({
  title,
  description,
  badge,
  icon,
  spotlightColor = "rgba(16, 185, 129, 0.15)",
  href,
  className,
  children,
}: BentoSpotlightCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = React.useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [isFocused, setIsFocused] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setCoords({ x: -1000, y: -1000 });
  };

  const CardContent = (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm transition-all duration-200 hover:border-primary/40",
        className
      )}
    >
      {/* Dynamic Pointer Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Top Header Row */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        {icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted border border-border text-foreground group-hover:text-primary transition-colors">
            {icon}
          </div>
        )}
        {badge && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            {badge}
          </span>
        )}
      </div>

      {/* Optional Custom Graphic Payload */}
      {children && <div className="relative z-10 my-4">{children}</div>}

      {/* Bottom Text Details */}
      <div className="relative z-10 mt-auto pt-4 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          {href && (
            <ArrowUpRight
              className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0"
              aria-hidden="true"
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
      >
        {CardContent}
      </a>
    );
  }

  return CardContent;
}
