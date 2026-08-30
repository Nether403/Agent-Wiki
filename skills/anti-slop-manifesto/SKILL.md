---
name: "anti-slop-manifesto"
description: "Universal 50-rule anti-slop specification, token remapping tables, automated unslop regex patterns, and security tripwire guidelines."
version: "1.0.0"
freshness: "2026-08-31"
dials:
  DESIGN_VARIANCE: 3
  MOTION_INTENSITY: 3
  VISUAL_DENSITY: 8
---

# Anti-Slop Manifesto & Design Hygiene Standard
*Synthesized from unslop (aahil62), no-ai-slop (petergyang), and anti-slop (dmmulroy).*

When AI coding models build interfaces without explicit guardrails, they default to superficial visual tropes and brittle code constructs. This document establishes the mandatory hygiene rules to eliminate slop at compilation time.

---

## 1. The 5 Core Anti-Slop Pillars

### Pillar A: No Banned Visual Clichés
- **SLOP-001 (The Indigo Button)**: Ban `#4f46e5`, `bg-indigo-600`. Use semantic theme tokens (`bg-primary`).
- **SLOP-002 (The Linear Gradient Slope)**: Ban `from-purple-500 to-blue-500`. Use subtle solid card surfaces with crisp structural borders (`border-border`).
- **SLOP-003 (Blanket Glassmorphism)**: Ban un-bordered `bg-white/10 backdrop-blur-md` across every section.
- **SLOP-008 (Decorative Emoji Bullet Points)**: Ban emojis as icons. Use typed Lucide/Iconoir vector SVGs with `currentColor`.

### Pillar B: TypeScript Strictness & Code Completeness
- **SLOP-004 (Chained Type Assertions)**: Ban `as any as`, `as unknown as Type`. Write precise Discriminated Unions.
- **SLOP-005 (Empty Object Spreads)**: Ban `...(cond ? { val } : {})`. Use explicit typed fallback objects.
- **SLOP-009 (Truncated Skeletons)**: Ban `// TODO: add logic` or omitted handler functions. Write 100% complete, runnable TSX.

### Pillar C: Dynamic Viewport & Spacing Precision
- **SLOP-007 (Arbitrary Pixel Escapes)**: Ban `p-[17px]`, `mt-[13px]`, `gap-[15px]`. Quantize into 4px/8px Tailwind steps (`p-4`, `gap-4`).
- **SLOP-038 & SLOP-041 (Dynamic Mobile Viewport)**: Ban rigid `h-screen`. Use `min-h-[100dvh]` or `min-h-screen` to prevent iOS Safari address bar clipping.

### Pillar D: Motion Safety & Lifecycle Cleanups
- **SLOP-006 (Blanket Transitions)**: Ban `transition-all duration-300` on parent wrappers. Scope transitions explicitly (`transition-colors duration-200`).
- **SLOP-014 (Canvas Motion Checks)**: Every `requestAnimationFrame` loop must check `prefers-reduced-motion`.
- **SLOP-025 & SLOP-044 (Uncancelled Listeners)**: Clean up all `setInterval`, `addEventListener`, and animation frames in `useEffect` return hooks.

### Pillar E: A11y & Screen Reader Discipline
- **SLOP-010 (Unlabeled Icon Buttons)**: Icon-only buttons must have `aria-label` or `<span className="sr-only">`.
- **SLOP-011 (SVGs Missing Role/Title)**: Inline SVGs must have `aria-hidden="true"` or `role="img"` with title.
- **SLOP-012 (Suppressed Outlines)**: Never use `outline-none` without `:focus-visible:ring-2` fallback.
- **SLOP-043 (Live Stream Regions)**: AI streaming responses must be marked with `aria-live="polite"` or `role="status"`.

---

## 2. Automated Unslop Command Recipes

```bash
# Automated AST/Regex remediation via Design Wiki CLI
npx design-wiki unslop ./components/ui/hero.tsx --theme neo-tokyo

# Automated code audit via MCP
# audit_code_slop({ code: "<raw-code>" })
# audit_and_fix_slop({ code: "<raw-code>", theme: "midnight" })
```
