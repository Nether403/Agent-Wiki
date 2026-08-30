/**
 * @license MIT
 * @origin Tailark / Aceternity (https://tailark.com)
 * @author Tailark Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../lib/utils";

export interface BentoItem {
  title: string;
  description: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[18rem]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
}: BentoItem) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xs transition-colors hover:border-primary/40",
        className
      )}
    >
      <div className="flex h-full flex-col justify-between">
        {header && <div className="mb-4">{header}</div>}
        <div>
          {icon && <div className="mb-3 text-primary">{icon}</div>}
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        <span>Explore architecture</span>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}
