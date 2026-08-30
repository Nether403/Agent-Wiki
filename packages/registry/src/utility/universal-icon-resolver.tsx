/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki (https://design-wiki.agent)
 * @author Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React from "react";
import * as LucideIcons from "lucide-react";

export type IconSet = "lucide" | "tabler" | "iconoir";

export interface UniversalIconResolverProps {
  name: string;
  size?: number;
  className?: string;
  fallbackIcon?: string;
}

export function UniversalIconResolver({
  name,
  size = 18,
  className = "",
  fallbackIcon = "HelpCircle",
}: UniversalIconResolverProps) {
  // 1. Resolve normalized PascalCase name for Lucide registry
  const formattedName = name
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  const IconComponent =
    (LucideIcons as Record<string, React.ElementType>)[formattedName] ||
    (LucideIcons as Record<string, React.ElementType>)[fallbackIcon] ||
    LucideIcons.HelpCircle;

  return (
    <span className={"inline-flex items-center justify-center " + className} role="img" aria-label={name}>
      <IconComponent size={size} className="currentColor" role="img" aria-hidden="true" />
    </span>
  );
}
