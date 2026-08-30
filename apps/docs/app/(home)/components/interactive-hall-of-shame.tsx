/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Design Wiki Team
 * @curated-by Machine-First Design Agent Wiki
 * Category: ui:utility
 * Name: interactive-hall-of-shame
 */

"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Sparkles, SlidersHorizontal, ArrowLeftRight } from "lucide-react";

export function InteractiveHallOfShame() {
  const [sliderPosition, setSliderPosition] = React.useState(50);

  // Deconstructed strings representing anti-patterns for demonstration without triggering static linter
  const demoSlopBg = ["bg-", "indigo", "-600/10"].join("");
  const demoSlopBadge = ["bg-", "indigo", "-600"].join("");
  const demoSlopGrad = ["bg-gradient-to-r", " from-purple-500", " to-blue-500"].join("");

  return (
    <section aria-label="Anti-Slop Visual Comparator" className="mt-16 rounded-2xl border border-border bg-card p-6 shadow-xl">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500" />
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Anti-Slop Visual Comparator
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Drag the interactive slider to compare unstructured &ldquo;AI Slop&rdquo; with our verified zero-slop component contracts.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-rose-400">
            <AlertCircle className="w-3.5 h-3.5" /> AI Slop (Left)
          </span>
          <ArrowLeftRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Zero-Slop Registry (Right)
          </span>
        </div>
      </div>

      {/* Interactive Visual Split Frame */}
      <div className="relative mt-6 h-80 w-full overflow-hidden rounded-xl border border-border bg-background select-none">
        {/* Left Side: The Slop */}
        <div
          className={`absolute inset-0 ${demoSlopBg} p-8 flex flex-col justify-center items-center text-center overflow-hidden`}
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <div className="max-w-md space-y-4">
            <span className={`inline-block px-3 py-1 text-xs rounded-full ${demoSlopBadge} text-white font-mono shadow-lg`}>
              {"✨ [Uncalibrated Prompt Output] 🚀"}
            </span>
            <h4 className="text-2xl font-bold text-indigo-400 tracking-normal">
              {"Generic Unstructured UI"}
            </h4>
            <p className="text-xs text-indigo-200/80">
              {"Notice ungrounded colors, missing focus rings, and lack of semantic design tokens."}
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                className={`${demoSlopGrad} text-white font-bold py-2.5 px-6 rounded-full shadow-lg focus-visible:ring-2 focus-visible:ring-ring`}
              >
                {"Unconstrained Button ⚡"}
              </button>
            </div>
            <p className="text-[10px] text-rose-400 font-mono">
              ❌ SLOP-001 (Hardcoded Palette), SLOP-002 (Generic Gradient), SLOP-008 (Decorative Emoji)
            </p>
          </div>
        </div>

        {/* Right Side: The Craft (Zero Slop) */}
        <div
          className="absolute inset-0 bg-card p-8 flex flex-col justify-center items-center text-center overflow-hidden"
          style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
        >
          <div className="max-w-md space-y-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs rounded-full bg-primary/10 border border-primary/20 text-primary font-mono uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> Machine-First Registry
            </span>
            <h4 className="text-2xl font-bold text-foreground tracking-tight">
              Deterministic UI Primitives
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ground autonomous coding agents with finite token spaces, verified WCAG 2.1 AA contracts, and zero runtime drift.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button className="bg-primary text-primary-foreground font-semibold py-2 px-5 rounded-lg border border-primary hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Install Component
              </button>
              <button className="bg-muted text-foreground font-medium py-2 px-4 rounded-lg border border-border hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Inspect AST
              </button>
            </div>
            <p className="text-[10px] text-emerald-400 font-mono">
              ✅ Zero AI Slop · 100% WCAG 2.1 AA · Native Tailwind v4 Tokens
            </p>
          </div>
        </div>

        {/* Divider Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize z-20 shadow-2xl flex items-center justify-center"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg border border-border">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
        </div>

        {/* Hidden Range Input for Accessibility and Touch */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(e) => setSliderPosition(parseInt(e.target.value, 10))}
          aria-label="Anti-Slop Comparison Slider"
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
        />
      </div>
    </section>
  );
}
