/**
 * @license MIT
 * @origin Magic UI / Motion Primitives (https://magicui.design)
 * @author Magic UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import {
  Terminal,
  Folder,
  Settings,
  Sparkles,
  Layers,
  Code2,
} from "lucide-react";

export interface DockItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  onClick?: () => void;
}

export interface DockMagnificationProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: DockItem[];
}

const DEFAULT_ITEMS: DockItem[] = [
  { id: "term", label: "Terminal", icon: Terminal },
  { id: "files", label: "Files", icon: Folder },
  { id: "code", label: "Editor", icon: Code2 },
  { id: "agent", label: "AI Agent", icon: Sparkles },
  { id: "layers", label: "Design Wiki", icon: Layers },
  { id: "settings", label: "Preferences", icon: Settings },
];

export function DockMagnification({
  items = DEFAULT_ITEMS,
  className,
  ...props
}: DockMagnificationProps) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  const getScale = (idx: number) => {
    if (hoveredIdx === null) return 1;
    const distance = Math.abs(hoveredIdx - idx);
    if (distance === 0) return 1.45;
    if (distance === 1) return 1.25;
    if (distance === 2) return 1.1;
    return 1;
  };

  return (
    <div
      onMouseLeave={() => setHoveredIdx(null)}
      className={cn(
        "inline-flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-card/80 backdrop-blur-md shadow-2xl transition-all select-none",
        className
      )}
      role="toolbar"
      aria-label="Application Quick Access Dock"
      {...props}
    >
      {items.map((item, idx) => {
        const IconComponent = item.icon;
        const scale = getScale(idx);

        return (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            onMouseEnter={() => setHoveredIdx(idx)}
            style={{
              transform: `scale(${scale}) translateY(${scale > 1 ? -(scale - 1) * 12 : 0}px)`,
            }}
            aria-label={item.label}
            className="relative group flex items-center justify-center h-10 w-10 rounded-xl bg-background border border-border shadow-xs text-foreground transition-transform duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <IconComponent className="h-5 w-5 text-primary" aria-hidden="true" />

            {/* Hover Tooltip Title */}
            <span className="absolute -top-8 px-2 py-0.5 rounded-md bg-popover border border-border text-popover-foreground text-[10px] font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
