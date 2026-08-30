---
name: "storybook-workshop"
description: "Isolated UI component workshop playbook for automated state matrix generation and visual quality auditing."
version: "1.0.0"
freshness: "2026-08-30"
dials:
  DESIGN_VARIANCE: 4
  MOTION_INTENSITY: 3
  VISUAL_DENSITY: 6
---

# Storybook Component State Workshop Playbook
*Adapted from storybookjs/storybook for the Machine-First Design Agent Wiki.*

This skill ensures every generated UI component is accompanied by an isolated component story capturing all critical interactive states (Default, Active, Disabled, Loading, Error).

---

## 1. Component State Matrix

Every component submitted to the Wiki must declare a standard Storybook CSF3 (Component Story Format) structure:

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./my-component";

const meta: Meta<typeof MyComponent> = {
  title: "Components/MyComponent",
  component: MyComponent,
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: {},
};

export const Active: Story = {
  args: { isActive: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { isLoading: true },
};
```

---

## 2. Automated Visual Snapshot Verification
Use with the `visual-qa-playwright` playbook to capture viewport regressions across breakpoints.
