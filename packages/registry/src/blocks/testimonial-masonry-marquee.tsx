/**
 * @license MIT
 * @origin Tailark / Magic UI (https://tailark.com)
 * @author Tailark Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Star, CheckCircle, Quote } from "lucide-react";

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  quote: string;
  rating?: number;
}

export interface TestimonialMasonryMarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  testimonials?: TestimonialItem[];
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    name: "Alex Rivera",
    role: "Staff Design Engineer",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    quote: "The 35 anti-slop rules completely transformed our agent-generated code. No more random hex colors or unhandled keyboard accessibility.",
    rating: 5,
  },
  {
    id: "2",
    name: "Elena Rostova",
    role: "Head of Autonomous Systems",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80",
    quote: "Direct MCP integration with Claude Code means our developers query and install verified primitives in milliseconds.",
    rating: 5,
  },
  {
    id: "3",
    name: "Marcus Chen",
    role: "Frontend Architect",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    quote: "Sub-15KB context budgeting ensures our prompts never overflow context limits when injecting rich components.",
    rating: 5,
  },
];

export function TestimonialMasonryMarquee({
  title = "Trusted by Design Engineers & Autonomous Agents",
  testimonials = DEFAULT_TESTIMONIALS,
  className,
  ...props
}: TestimonialMasonryMarqueeProps) {
  return (
    <section
      className={cn(
        "flex flex-col w-full py-16 px-4 bg-background text-foreground space-y-8 select-none overflow-hidden",
        className
      )}
      aria-label="Testimonials Section"
      {...props}
    >
      <div className="max-w-2xl mx-auto text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground">
          Verified testimonials from engineering teams shipping production AI interfaces.
        </p>
      </div>

      {/* Testimonials Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="flex flex-col justify-between p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow space-y-4"
          >
            <div className="space-y-3">
              {/* Star ratings */}
              <div className="flex items-center gap-1">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </div>

              <p className="text-xs text-foreground leading-relaxed italic">
                "{t.quote}"
              </p>
            </div>

            {/* Author Profile */}
            <div className="flex items-center gap-3 pt-4 border-t border-border/40">
              <img
                src={t.avatarUrl}
                alt={`${t.name}'s profile avatar`}
                className="h-10 w-10 rounded-full object-cover border border-border"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-xs text-foreground truncate">{t.name}</span>
                  <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                </div>
                <span className="text-[10px] text-muted-foreground block truncate">{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
