---
name: "tokens-studio-dtcg"
description: "Authoritative design token management complying with W3C DTCG specifications, compiling directly to Tailwind v4 CSS variables."
version: "1.0.0"
freshness: "2026-08-30"
dials:
  DESIGN_VARIANCE: 4
  MOTION_INTENSITY: 3
  VISUAL_DENSITY: 6
---

# Tokens Studio & DTCG Design Token Playbook
*Adapted from Tokens Studio and Style Dictionary for the Machine-First Design Agent Wiki.*

This skill ensures that all visual properties in the repository stem from a machine-readable, centralized W3C Design Token Community Group (DTCG) specification.

---

## 1. DTCG Standard Format

All design tokens are defined in `packages/registry/tokens/design-tokens.json` following the W3C DTCG format:

```json
{
  "color": {
    "primary": {
      "$value": "#18181b",
      "$type": "color",
      "$description": "Primary action and brand color token"
    }
  }
}
```

---

## 2. Compilation Targets

The token compilation engine translates `design-tokens.json` into:
1. **Tailwind v4 `@theme` block** in `apps/docs/app/globals.css`
2. **TypeScript Token Constants** in `packages/registry/src/lib/tokens.ts`

Run the token builder:
```bash
pnpm build:tokens
```

---

## 3. Rules for Token Discipline
- Never write hardcoded hex values in component files (violates `SLOP-026`).
- Reference semantic Tailwind utility classes (`bg-primary`, `text-foreground`, `border-border`).
- Dark mode must be achieved via CSS variable remapping under `.dark { ... }` rather than duplicated arbitrary color classes.
