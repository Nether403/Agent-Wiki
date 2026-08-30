# UI/UX Design Specification & Plan

**Feature / Screen Name**: [e.g., Agent Workflow Canvas]  
**Author / Agent ID**: [Agent Identifier]  
**Target Delivery Date**: 2026-08-30  

---

## 1. Intent & Problem Statement
*Describe the user problem, user mental model, and context of use.*

- **Core User Goal**:  
- **Primary Action**:  
- **Secondary Actions**:  

---

## 2. Taste Dial Calibration
- **DESIGN_VARIANCE (1-10)**: [e.g., 5] *(Rationale: balanced modern SaaS layout)*
- **MOTION_INTENSITY (1-10)**: [e.g., 4] *(Rationale: responsive spring transitions on interaction)*
- **VISUAL_DENSITY (1-10)**: [e.g., 6] *(Rationale: structured metadata panel alongside canvas)*

---

## 3. Component Composition & Registry Targets
List registry components to import rather than writing from scratch:
- [ ] Primitive: `@/components/ui/button`
- [ ] Primitive: `@/components/ui/card`
- [ ] Motion: `@/components/ui/floating-dock`
- [ ] Creative/Workflow: `@/components/ui/agent-node-graph`

---

## 4. Accessibility & Responsive Contract
- **Contrast Check**: All body text ≥ 4.5:1, bold/display ≥ 3:1.
- **Keyboard Navigation**: Focus order follows visual hierarchy (`Tab`, `Shift+Tab`, `Enter`, `Escape`).
- **Focus Rings**: `:focus-visible:ring-2 :focus-visible:ring-ring`.
- **Reduced Motion**: Gracefully falls back to static layout when `prefers-reduced-motion` is active.
- **Screen Reader Support**: Valid `aria-label`, `role`, and `aria-live` regions.

---

## 5. Verification Signoff
- [ ] Scaffolding matches semantic HTML rules.
- [ ] `python skills/ui-ux-pro-max/scripts/audit-a11y.py <file>` returns 0 warnings.
- [ ] `python verify-audit.py` returns 100/100 Health Score.
