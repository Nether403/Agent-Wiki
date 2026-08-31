---
name: ui-ux-pro-max
description: "AI-driven design intelligence for building professional UI/UX, 8-dimension design scoring, responsive layout audits, and WCAG AA verification."
version: 1.0.0
category: design-system
---

# UI/UX Pro Max Design Intelligence Skill

This skill governs the systematic design and aesthetic review of user interfaces in this project. It equips AI developer agents with repeatable design judgement, an 8-dimension scoring framework, heuristic audits, and strict anti-slop verification.

---

## 1. The 8-Dimension Design Scoring Framework

Before releasing or modifying any UI component or page layout, evaluate against the 8 Dimensions:

| Dimension | Target Criteria | Slop Anti-Pattern to Reject |
| :--- | :--- | :--- |
| **1. Visual Hierarchy** | Clear primary focal point, typographic scale (3:4 or 1.25 ratio), scannable headings. | Multiple competing high-contrast buttons or equal-weight text blocks. |
| **2. Spacing Rhythm** | Consistent 4px / 8px spacing scale (`gap-2`, `gap-4`, `gap-6`, `gap-8`, `p-6`). | Arbitrary pixel escapes (`p-[17px]`, `m-[13px]`, `gap-[15px]`). |
| **3. Color Semantics** | Semantic color tokens (`bg-card`, `bg-background`, `text-primary`, `border-border`). | Hardcoded indigo buttons (`#4f46e5`, `bg-indigo-600`) or purple gradients. |
| **4. Surface Depth** | Subtle borders (`border-border`), layered background levels, crisp inset dividers. | Blanket unanchored glassmorphism (`bg-white/10 backdrop-blur-md`). |
| **5. Motion Intent** | Targeted transitions (`transition-colors duration-200`, spring physics for entry). | Blanket `transition-all duration-300` across whole layout wrappers. |
| **6. Visual Density** | Content-calibrated density matching user intent (SaaS: 7-9, Landing: 4-6). | Wasted empty vertical space or cramped unreadable data tables. |
| **7. Accessibility AA** | Minimum 4.5:1 text contrast, WAI-ARIA roles, focus rings (`:focus-visible:ring-2`). | Unlabeled icon-only buttons (`<button><Icon/></button>`) or suppressed outlines. |
| **8. Mobile Ergonomics** | Touch targets $\ge 44 \times 44\text{px}$, dynamic viewports (`min-h-[100dvh]`), no horizontal overflow. | Rigid `h-screen` or `min-w-[800px]` containers cutting off mobile viewports. |

---

## 2. 4-Step Design Execution Loop

When prompted to build or improve a user interface:

```
[1. Plan & Scaffold] ──► Select typography hierarchy, color palette token set, and viewport constraints.
         │
         ▼
[2. Assemble Primitives] ──► Source accessible components from Agent Wiki registry (Radix + Tailwind v4).
         │
         ▼
[3. Heuristic Audit] ──► Score against the 8-Dimension Matrix & 50 Anti-Slop Rules.
         │
         ▼
[4. Handoff Receipt] ──► Deliver copy-pasteable TSX accompanied by an Integration Receipt.
```

---

## 3. Responsive Breakpoint Standards

- **Mobile First (`default`)**: Single-column vertical flow, full-width inputs, collapsible drawers.
- **Tablet (`md: >= 768px`)**: 2-column bento grids, sticky side rails, expanded navigation.
- **Desktop (`lg: >= 1024px`, `xl: >= 1280px`)**: Multi-pane dashboard layouts, data tables with faceted query toolbars.

---

## 4. Anti-Slop Rule Integration

Always run automated taste review via `@design-wiki/mcp` or `npx design-wiki audit <path>` before finalizing code.
All generated code must achieve a **Health Score of $\ge 90/100$** with zero High-severity flags.
