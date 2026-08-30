---
name: "visual-qa-playwright"
description: "Autonomous visual regression testing, DOM snapshot verification, and axe-core accessibility auditing playbook."
version: "1.0.0"
freshness: "2026-08-30"
dials:
  DESIGN_VARIANCE: 4
  MOTION_INTENSITY: 3
  VISUAL_DENSITY: 6
---

# Autonomous Visual QA & Accessibility Playbook (Playwright & axe-core)

This playbook establishes a rigorous, automated verification pipeline for AI coding agents to test, validate, and certify generated web interfaces against visual drift, contrast failures, and responsive layout breakage.

---

## 1. The 3-Tier Verification Gate

Every UI component or full-page scaffold must pass three automated tiers before being accepted into production:

```
[Component / Scaffold]
          │
          ▼
┌─────────────────────────────────┐
│ Tier 1: axe-core WCAG 2.1 AA    │ ───> 0 Critical or Serious Violations
└─────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│ Tier 2: Multi-Viewport Snap     │ ───> Desktop (1280px), Tablet (768px), Mobile (375px)
└─────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│ Tier 3: Motion & Reduced-Motion │ ───> prefers-reduced-motion snapshot parity
└─────────────────────────────────┘
```

---

## 2. Playwright Test Script Blueprint

Agents should execute Playwright headless tests to assert compliance:

```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Zero-Slop UI Verification", () => {
  test("Passes axe-core WCAG AA accessibility audit", async ({ page }) => {
    await page.goto("http://localhost:3000/preview/component-slug");
    
    // Inject and execute axe-core
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Maintains responsive viewport integrity without horizontal scroll", async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },  // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1280, height: 800 }, // Desktop
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.goto("http://localhost:3000/preview/component-slug");
      
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      
      // Ensure zero accidental horizontal overflow
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    }
  });

  test("Respects prefers-reduced-motion media query", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("http://localhost:3000/preview/component-slug");
    
    // Assert animated elements disable continuous keyframe rotations
    const animationPlayState = await page.locator(".animate-spin, .animate-aurora").evaluateAll((elements) =>
      elements.map((el) => window.getComputedStyle(el).animationPlayState)
    );

    animationPlayState.forEach((state) => {
      expect(["paused", "idle"]).toContain(state);
    });
  });
});
```

---

## 3. Automated Error Recovery Rules
1. **If axe-core reports `color-contrast`**:
   - Query `@design-wiki/mcp` `verify_accessibility_contrast` with the failing colors.
   - Boost luminance distance to achieve at least 4.5:1 for body copy or 3.0:1 for large headers.
2. **If viewport test fails with horizontal overflow**:
   - Audit for hardcoded `w-[...px]` or unconstrained `flex` containers.
   - Replace with `w-full max-w-...` and `overflow-hidden` wrappers.
3. **If keyboard navigation fails**:
   - Assert all custom buttons and interactive nodes contain `tabIndex={0}` and respond to `Enter` and `Space`.
