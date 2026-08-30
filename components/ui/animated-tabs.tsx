/**
 * @license MIT
 * @origin SmoothUI (https://smoothui.dev)
 * @author SmoothUI Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export interface TabOption {
  id: string;
  label: string;
}

export interface AnimatedTabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  layoutId?: string;
}

export function AnimatedTabs({
  tabs,
  activeTab,
  onChange,
  className,
  layoutId = "animated-tab-indicator",
}: AnimatedTabsProps) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-border bg-muted/50 p-1 text-muted-foreground",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive ? "text-foreground" : "hover:text-foreground/80"
            )}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                className="absolute inset-0 z-[-1] rounded-lg bg-background shadow-xs"
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
