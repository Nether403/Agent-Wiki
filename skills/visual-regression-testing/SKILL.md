---
name: visual-regression-testing
description: "Automated Playwright visual regression baseline configuration, pixel threshold calibration, masking dynamic elements, and CI artifact management."
risk: safe
source: "https://github.com/Visual-Regression-Tracker/Visual-Regression-Tracker"
date_added: "2026-08-31"
---

# Visual Regression Testing Skill

This skill governs automated screenshot diffing, visual baseline maintenance, and regression control in AI-assisted web design pipelines using **Playwright**, **Visual Regression Tracker**, and **BackstopJS**.

---

## 1. Core Principles

1. **Deterministic Viewports**: Always capture snapshots at fixed breakpoint widths (`375px` mobile, `768px` tablet, `1280px` desktop, `1920px` wide).
2. **Dynamic Element Masking**: Mask or freeze non-deterministic UI elements (realtime clocks, video frames, random avatars, streaming tickers, canvas particle loops) before taking screenshots.
3. **Threshold Calibration**: Enforce strict `maxDiffPixelRatio: 0.01` (1% tolerance) for static primitives and `0.03` for complex layout blocks.
4. **Theme Matrix Testing**: Always snapshot both Light Mode and Dark Mode states to catch color token regressions.

---

## 2. Playwright Visual Snapshot Pattern

```typescript
import { test, expect } from "@playwright/test";

test.describe("Visual Regression Baseline Gate", () => {
  const VIEWPORTS = [
    { name: "mobile", width: 375, height: 667 },
    { name: "desktop", width: 1280, height: 800 },
  ];

  for (const vp of VIEWPORTS) {
    test(`Component Visual Baseline - ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/preview/hero-section");

      // Wait for fonts and animations to settle
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);

      // Mask dynamic elements
      const dynamicElements = page.locator("[data-dynamic='true'], time, [role='status']");

      await expect(page).toHaveScreenshot(`hero-section-${vp.name}.png`, {
        mask: [dynamicElements],
        maxDiffPixelRatio: 0.01,
        animations: "disabled",
      });
    });
  }
});
```

---

## 3. Automated CI Gate Integration

- Run `pnpm test:visual` in CI before merging pull requests.
- Block merging if visual delta exceeds threshold without human or agent sign-off.
- Generate side-by-side visual diff reports using `visual-diff-regression-viewer`.
