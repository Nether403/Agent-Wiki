/**
 * @license MIT
 * @origin Motion Primitives / React Bits (https://reactbits.dev)
 * @author React Bits & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface TrailItem {
  id: number;
  x: number;
  y: number;
  rotation: number;
  imageUrl: string;
}

export interface ImageMouseTrailProps extends React.HTMLAttributes<HTMLDivElement> {
  images?: string[];
  maxItems?: number;
  distanceThreshold?: number;
}

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=200&q=80",
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=200&q=80",
];

export function ImageMouseTrail({
  images = DEFAULT_IMAGES,
  maxItems = 6,
  distanceThreshold = 50,
  children,
  className,
  ...props
}: ImageMouseTrailProps) {
  const [trail, setTrail] = React.useState<TrailItem[]>([]);
  const lastPosRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const countRef = React.useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dist = Math.hypot(x - lastPosRef.current.x, y - lastPosRef.current.y);

    if (dist > distanceThreshold) {
      lastPosRef.current = { x, y };
      countRef.current += 1;
      const img = images[countRef.current % images.length];
      const rot = (Math.random() - 0.5) * 20;

      setTrail((prev) => [
        ...prev.slice(-maxItems + 1),
        { id: countRef.current, x, y, rotation: rot, imageUrl: img },
      ]);
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn("relative w-full h-96 overflow-hidden rounded-2xl border border-border bg-card select-none", className)}
      role="region"
      aria-label="Image Mouse Pointer Trail"
      {...props}
    >
      {/* Background/Content Slot */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        {children || (
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Move mouse cursor to reveal image trail
          </p>
        )}
      </div>

      {/* Trailing Floating Images */}
      {trail.map((item) => (
        <div
          key={item.id}
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
          }}
          className="absolute pointer-events-none h-24 w-24 rounded-xl border border-border/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-75 duration-200"
        >
          <img
            src={item.imageUrl}
            alt="Pointer Trail Element"
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
