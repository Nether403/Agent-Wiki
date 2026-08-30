---
name: responsive-fluid-scaling
description: Master fluid typography, modern container queries (@container), responsive clamp formulas, and mobile touch ergonomics for zero-slop responsive interfaces.
---

# Responsive Fluid Scaling & Container Query Skill

You are an expert responsive design and layout scaling engineer. This document governs how to implement fluid typography, sub-grid layouts, container query adaptations, and touch-first ergonomics without rigid breakpoints or brittle pixel media queries.

---

## 1. Core Principles

1. **Fluid Interpolation (`clamp()`)**: Eliminate jarring font size jumps at arbitrary media query boundaries. Calculate continuous typography curves using standard viewport tokens.
2. **Container Queries First**: Style components relative to their parent card or pane width (`@container`), not the global viewport (`@media`). This ensures components look flawless inside sidebars, modal dialogs, bento grids, and full-bleed heroes alike.
3. **Touch Ergonomics**: All mobile interactive targets must meet the WCAG 2.1 AAA 44x44px or AA 24x24px minimum touch target size with explicit spacing.
4. **Dynamic Viewport Height**: Always use `min-h-[100dvh]` or `h-[100dvh]` instead of `h-screen` to prevent iOS Safari address bar layout jitter (SLOP-038).

---

## 2. Standard Fluid Typography Scale

Use Tailwind CSS v4 variables and standard `clamp()` tokens:

```css
/* Fluid Typography Token Definitions */
--font-fluid-sm: clamp(0.8125rem, 0.78rem + 0.15vw, 0.875rem);   /* 13px -> 14px */
--font-fluid-base: clamp(0.9375rem, 0.9rem + 0.2vw, 1.0625rem);  /* 15px -> 17px */
--font-fluid-lg: clamp(1.125rem, 1.05rem + 0.35vw, 1.35rem);     /* 18px -> 21.6px */
--font-fluid-xl: clamp(1.35rem, 1.2rem + 0.75vw, 1.85rem);       /* 21.6px -> 29.6px */
--font-fluid-2xl: clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem);       /* 28px -> 40px */
--font-fluid-display: clamp(2.25rem, 1.8rem + 2.25vw, 4rem);     /* 36px -> 64px */
```

---

## 3. Container Query Implementation Pattern

Declare container contexts on parent wrappers and style children with `@container` modifiers:

```tsx
export function ResponsiveBentoCard({ title, description, children }: CardProps) {
  return (
    <article className="@container/card relative w-full overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-6 transition-colors">
      <div className="flex flex-col gap-3 @[380px]/card:flex-row @[380px]/card:items-center @[380px]/card:justify-between">
        <div className="space-y-1">
          <h3 className="text-base @[420px]/card:text-lg @[600px]/card:text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="text-xs @[420px]/card:text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 @[480px]/card:grid-cols-2 @[720px]/card:grid-cols-3 gap-3">
        {children}
      </div>
    </article>
  );
}
```

---

## 4. Mobile Ergonomics Checklist

- [x] Minimum touch target $\ge 44 \times 44\text{px}$ on mobile (`min-h-[44px] min-w-[44px]` or `p-3`).
- [x] Input fields have `text-base` (16px) on mobile to prevent iOS Safari auto-zoom on focus.
- [x] Horizontal scroll carousels include `snap-x snap-mandatory` and `scroll-pl-4`.
- [x] Safe area insets respected via `pt-[env(safe-area-inset-top)]` and `pb-[env(safe-area-inset-bottom)]`.
- [x] Zero hardcoded horizontal pixel bounds (`w-[800px]`) without `max-w-full` or responsive prefixes.
