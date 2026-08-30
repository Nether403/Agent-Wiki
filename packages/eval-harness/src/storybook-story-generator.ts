/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * Storybook CSF3 Auto-Story Generator for Registry Components
 */

import fs from "fs";
import path from "path";

export interface StorybookGenerationConfig {
  componentName: string;
  importPath: string;
  category?: string;
  defaultProps?: Record<string, unknown>;
}

export function generateCSF3Story(config: StorybookGenerationConfig): string {
  const { componentName, importPath, category = "Components", defaultProps = {} } = config;

  return `// Auto-generated CSF3 Storybook Story
import type { Meta, StoryObj } from "@storybook/react";
import { ${componentName} } from "${importPath}";

const meta: Meta<typeof ${componentName}> = {
  title: "${category}/${componentName}",
  component: ${componentName},
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
          { id: "button-name", enabled: true },
        ],
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  args: ${JSON.stringify(defaultProps, null, 2)},
};

export const DarkSurface: Story = {
  args: ${JSON.stringify(defaultProps, null, 2)},
  parameters: {
    backgrounds: { default: "dark" },
  },
};
`;
}
