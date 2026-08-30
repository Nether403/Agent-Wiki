/**
 * @license MIT
 * @origin VengeanceUI (https://vengeanceui.com)
 * @author Ashutoshx7 & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { ArrowUpRight, Terminal, Cpu, ShieldCheck } from "lucide-react";

export interface DarkBrutalistHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  headline?: string;
  subheadline?: string;
  primaryCta?: string;
  secondaryCta?: string;
}

export function DarkBrutalistHero({
  headline = "DETERMINISTIC AI AGENT RUNTIME",
  subheadline = "High-precision UI assembly engine. Eliminates hallucinations, arbitrary layout tokens, and accessibility debt with zero human grind.",
  primaryCta = "Initialize MCP Server",
  secondaryCta = "Explore 260+ Primitives",
  className,
  ...props
}: DarkBrutalistHeroProps) {
  return (
    <section
      className={cn(
        "relative w-full border-b border-border bg-background py-16 sm:py-24 px-4 sm:px-6 overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Brutalist Grid Lines Background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl text-center space-y-6">
        {/* Terminal Telemetry Pill */}
        <div className="inline-flex items-center gap-2 rounded-none border-2 border-foreground bg-card px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-foreground shadow-[3px_3px_0px_0px_currentColor]">
          <Terminal className="h-3.5 w-3.5" />
          SYSTEM PROTOCOL: ZERO-SLOP ACTIVE
        </div>

        {/* Monolithic Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-foreground uppercase leading-none">
          {headline}
        </h1>

        {/* Technical Subheading */}
        <p className="mx-auto max-w-2xl text-sm sm:text-base font-mono text-muted-foreground leading-relaxed">
          {subheadline}
        </p>

        {/* Action Button Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button className="inline-flex items-center gap-2 rounded-none border-2 border-foreground bg-primary px-6 py-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[4px_4px_0px_0px_currentColor] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span>{primaryCta}</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-none border-2 border-border bg-card px-6 py-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span>{secondaryCta}</span>
          </button>
        </div>

        {/* Metadata Status Footer */}
        <div className="pt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-primary" />
            <span>REACT 19 / TAILWIND V4</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>WCAG 2.1 AA VERIFIED</span>
          </div>
        </div>
      </div>
    </section>
  );
}
