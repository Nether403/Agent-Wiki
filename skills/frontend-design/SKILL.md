---
name: "frontend-design"
description: "Expert design-direction skill for crafting distinctive, production-grade web interfaces with high taste, avoiding generic AI clichés."
version: "1.0.0"
freshness: "2026-08-30"
dials:
  DESIGN_VARIANCE: 7     # Asymmetrical layouts, editorial hierarchy, characterful styling
  MOTION_INTENSITY: 4    # Snappy spring physics and layout transitions, zero bloated delays
  VISUAL_DENSITY: 6      # Balanced information density with crisp structural boundaries
---

# Frontend Design Direction Playbook
*Adapted from Anthropic Claude Code frontend-design principles for the Machine-First Design Agent Wiki.*

This skill guides AI agents away from generic, uninspired "AI slop" interfaces toward bold, memorable, and production-tested web applications.

---

## 1. Aesthetic Mandates & Anti-Patterns

### ❌ What to Reject
1. **The Indigo Default**: Never default to Tailwind's `#4f46e5`, `#6366f1`, or `bg-indigo-600` for primary buttons and accents.
2. **The Purple-to-Blue Gradient**: Reject generic `bg-gradient-to-r from-purple-500 to-blue-500` card headers and hero backgrounds.
3. **Centered Card Syndrome**: Avoid 3 identical centered cards with an emoji at the top and generic centered copy below.
4. **Blanket Glassmorphism**: Do not use `bg-white/10 backdrop-blur` everywhere. Use crisp structural tokens (`border-border`, `bg-card`, `bg-background`).
5. **AI Writing Clichés**: Outlaw copy like *"In today's fast-paced world"*, *"Unleash the power of"*, *"The future is here"*. Write clear, concrete, domain-specific copy.

### ✅ What to Emphasize
1. **Asymmetrical Balance**: Break out of 12-column symmetry. Use 60/40 splits, offset section headers, and overlapping layers.
2. **Distinctive Typography Pairings**:
   - **Display / Editorial**: Characterful serif or high-contrast display face for main headlines (e.g. Instrument Serif, Playfair, Newsreader).
   - **Interface / Body**: Highly legible geometric or humanist sans-serif (e.g. Inter, Geist, Plus Jakarta Sans).
   - **Metadata / Monospace**: Crisp technical monospace for stats, badges, coordinates, and code snippets (e.g. JetBrains Mono, Geist Mono).
3. **Contextual Color Harmony**: Derive palettes from the domain (e.g. warm amber/sepia for editorial archives, crisp zinc/emerald for financial or security tools).
4. **Structural Wireframing**: Define hierarchy through deliberate borders (`border-border`), hairline divider rules, and subtle elevation rather than heavy drop shadows.

---

## 2. Layout & Grid Strategies

```
+-------------------------------------------------------------+
|  [Header / Brand]                          [Search / Nav]   |
+-------------------------------------------------------------+
|  [Col 1: 65%]                             | [Col 2: 35%]    |
|  Editorial Headline                       | Live Telemetry  |
|  Sub-narrative with mono timestamp        | Real-time Spark |
|  Primary Action (Solid) + Outline Action  | Mini Metric Grid|
+-------------------------------------------+-----------------+
|  [Full-width Data Stream or Faceted Filter Table]           |
+-------------------------------------------------------------+
```

1. **The Asymmetrical Hero**: Anchor the left 60-65% with expressive typography and a clear call to action; dedicate the right 35-40% to interactive live previews or dense data artifacts.
2. **Section Transitions**: Use hairline divider lines with labeled anchor tags (e.g. `01 // ARCHITECTURE`, `02 // TELEMETRY`) rather than wave SVG dividers.
3. **Fluid Viewports**: Ensure layouts scale gracefully across phone, tablet, desktop, and ultrawide viewports using standard Tailwind container queries and responsive prefixes.

---

## 3. Interaction & Motion Rules

- **Restraint First**: Interactive elements should feel instantaneous. Keep transitions between 150ms and 250ms with easing curves (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Reduced Motion Contract**: Always wrap animation triggers in `@media (prefers-reduced-motion: reduce)` or `useReducedMotion()` from `motion/react`. Provide instantaneous state changes when reduced motion is preferred.
- **Physicality**: Buttons and interactive pills should use tactile active states (`active:scale-[0.98] transition-transform`).

---

## 4. Execution Checklist for Agents

Before completing any frontend implementation:
- [ ] Are colors bound to CSS variables / semantic theme tokens?
- [ ] Is typography structured across display, body, and monospace layers?
- [ ] Is there at least one asymmetrical layout element or visual anchor?
- [ ] Are icon buttons equipped with `aria-label` or `.sr-only` text?
- [ ] Has all placeholder copy been replaced with realistic, domain-specific text?
- [ ] Does the page respect `prefers-reduced-motion`?
