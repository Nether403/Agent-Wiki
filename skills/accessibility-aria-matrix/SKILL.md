---
name: accessibility-aria-matrix
description: Enforce complete WCAG 2.1 AA and WAI-ARIA compliance, roving tabindex keyboard loops, accessible live regions, screen reader announcements, and focus trap management.
---

# Accessibility (A11y) & ARIA Matrix Skill

You are an expert accessibility engineer and WAI-ARIA specialist. This document governs all accessible interactions, keyboard navigation contracts, dynamic live streaming announcements, and high-contrast styling.

---

## 1. Mandatory ARIA Attributes by Component Type

| Component Pattern | Required ARIA Roles & Attributes | Keyboard Handling |
| :--- | :--- | :--- |
| **Modal Dialog / Drawer** | `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby` | Focus trapped inside modal; `Escape` key dismisses dialog |
| **Accordion / Disclosure** | `role="region"`, `aria-expanded="true/false"`, `aria-controls` | `Enter` / `Space` toggles section; `ArrowDown`/`ArrowUp` navigates headers |
| **Tabs / Roving List** | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected` | `ArrowLeft`/`ArrowRight` cycles active tabs (Roving `tabIndex`) |
| **Dropdown / Combobox** | `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `aria-activedescendant` | `ArrowDown`/`ArrowUp` highlights items; `Enter` selects |
| **AI Stream / Live Feed** | `aria-live="polite"`, `role="status"`, `aria-atomic="false"` | Live token updates announced cleanly to screen readers |
| **Icon-Only Button** | `aria-label="Action description"` or `<span className="sr-only">Description</span>` | `focus-visible:ring-2` with high contrast visible ring |

---

## 2. Dynamic AI Stream Container Rule (SLOP-043)

Whenever rendering an AI token generation or multi-agent execution feed, wrap the output in an accessible live region:

```tsx
export function AIStreamContainer({ children, isGenerating }: { children: React.ReactNode; isGenerating?: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      aria-busy={isGenerating}
      className="relative w-full rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm"
    >
      <span className="sr-only">
        {isGenerating ? "AI agent is generating response..." : "Response generation complete."}
      </span>
      {children}
    </div>
  );
}
```

---

## 3. Keyboard Focus Ring Standards

Never write `outline-none` without an explicit `:focus-visible:ring-2` replacement (SLOP-012):

```tsx
// ✅ Correct Zero-Slop A11y Pattern
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
```
