---
name: gui-challenges-adaptive-css
description: "Modern adaptive CSS patterns: CSS Subgrid, @container queries, light-dark() color switching, color-mix() token transformations, and fluid typography."
risk: safe
source: "https://github.com/argyleink/gui-challenges"
date_added: "2026-08-31"
---

# Modern Adaptive CSS & GUI Challenges Skill

Based on Google Chrome's GUI Challenges, this skill guides agents in writing forward-compatible, highly adaptive CSS layouts utilizing **CSS Subgrid**, **Container Queries**, **Color Functions**, and **Semantic Landmarks**.

---

## 1. Core Adaptive CSS Rules

1. **CSS Subgrid for Card Grids**:
   - Use `grid-template-rows: subgrid` to ensure card headers, bodies, and footer buttons align seamlessly across adjacent columns regardless of dynamic content height.
2. **Container Queries Over Media Queries**:
   - Use `@container (min-width: ...)` on self-contained card modules so they adapt based on available parent pane width rather than rigid global window breakpoints.
3. **Native `light-dark()` Color Switching**:
   - Leverage `light-dark(#ffffff, #09090b)` and `color-mix(in oklab, var(--color-primary) 80%, transparent)` in Tailwind v4 `@theme` layers.
4. **Fluid Typography with `clamp()`**:
   - Ensure responsive heading scaling without jagged breakpoint layout jumps: `font-size: clamp(1.5rem, 4vw + 1rem, 3rem)`.

---

## 2. Exemplary CSS Subgrid Card Pattern

```tsx
export function SubgridCardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item) => (
        <article
          key={item.id}
          className="grid grid-rows-[auto_1fr_auto] gap-4 rounded-xl border border-border bg-card p-6"
        >
          <header className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
            <p className="text-2xs text-muted-foreground">{item.subtitle}</p>
          </header>
          
          <main className="text-xs text-muted-foreground leading-relaxed">
            {item.description}
          </main>
          
          <footer className="pt-4 border-t border-border/60">
            <button type="button" className="w-full h-8 bg-primary text-primary-foreground text-xs font-semibold rounded-lg">
              {item.actionLabel}
            </button>
          </footer>
        </article>
      ))}
    </div>
  );
}
```
