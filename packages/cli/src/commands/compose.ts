import fs from "fs";
import path from "path";
import { addComponent } from "./add";

export interface ComposeOptions {
  cwd?: string;
  overwrite?: boolean;
  registry?: string;
  outputPath?: string;
}

interface LayoutArchetype {
  title: string;
  description: string;
  requiredSlugs: string[];
  defaultFilePath: string;
  scaffoldTsx: string;
}

const ARCHETYPES: Record<string, LayoutArchetype> = {
  "ai-chat-workspace": {
    title: "AI-Native Multi-Agent Workspace",
    description: "Multi-agent workspace with streaming message container, reasoning foldout, tool inspector, and expanded prompt bar.",
    requiredSlugs: [
      "app-shell-sidebar-layout",
      "ai-streaming-message",
      "ai-reasoning-accordion",
      "ai-tool-call-card",
      "ai-prompt-bar-expanded",
    ],
    defaultFilePath: "app/workspace/page.tsx",
    scaffoldTsx: `"use client";

import * as React from "react";
import { AppShellSidebarLayout } from "@/components/ui/app-shell-sidebar-layout";
import { AiPromptBarExpanded } from "@/components/ui/ai-prompt-bar-expanded";
import { AiStreamingMessage } from "@/components/ui/ai-streaming-message";
import { AiReasoningAccordion } from "@/components/ui/ai-reasoning-accordion";
import { AiToolCallCard } from "@/components/ui/ai-tool-call-card";

export default function AiWorkspacePage() {
  return (
    <AppShellSidebarLayout activeTabId="ai-native">
      <div className="flex flex-col h-full max-w-4xl mx-auto space-y-4 p-4">
        <AiStreamingMessage
          role="assistant"
          content="Hello! I am grounded in the Machine-First Design Agent Wiki. What interface should we assemble today?"
        />
        <AiReasoningAccordion defaultOpen={false} />
        <AiToolCallCard
          toolName="search_components"
          status="success"
          inputParameters={{ query: "dialog" }}
        />
        <div className="mt-auto pt-4">
          <AiPromptBarExpanded onSubmit={(prompt) => console.log("Submitted prompt:", prompt)} />
        </div>
      </div>
    </AppShellSidebarLayout>
  );
}
`,
  },
  "dashboard": {
    title: "Analytical SaaS Executive Dashboard",
    description: "SaaS dashboard with area charts, donut metric cards, and cohort retention heatmap.",
    requiredSlugs: [
      "app-shell-sidebar-layout",
      "interactive-area-chart",
      "donut-metric-card",
      "cohort-retention-heatmap",
    ],
    defaultFilePath: "app/dashboard/page.tsx",
    scaffoldTsx: `"use client";

import * as React from "react";
import { AppShellSidebarLayout } from "@/components/ui/app-shell-sidebar-layout";
import { InteractiveAreaChart } from "@/components/ui/interactive-area-chart";
import { DonutMetricCard } from "@/components/ui/donut-metric-card";
import { CohortRetentionHeatmap } from "@/components/ui/cohort-retention-heatmap";

export default function DashboardPage() {
  return (
    <AppShellSidebarLayout activeTabId="dashboard">
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InteractiveAreaChart title="Token Velocity" />
          </div>
          <div>
            <DonutMetricCard title="Traffic Share" />
          </div>
        </div>
        <CohortRetentionHeatmap />
      </div>
    </AppShellSidebarLayout>
  );
}
`,
  },
  "saas-landing": {
    title: "SaaS Marketing Showcase",
    description: "High-contrast dark-mode hero banner, device preview showcase, interactive ROI calculator, and testimonial marquee.",
    requiredSlugs: [
      "google-gemini-glow-hero",
      "device-mockup-showcase",
      "interactive-roi-calculator",
      "testimonial-masonry-marquee",
    ],
    defaultFilePath: "app/page.tsx",
    scaffoldTsx: `"use client";

import * as React from "react";
import { GoogleGeminiGlowHero } from "@/components/ui/google-gemini-glow-hero";
import { InteractiveRoiCalculator } from "@/components/ui/interactive-roi-calculator";
import { DeviceMockupShowcase } from "@/components/ui/device-mockup-showcase";
import { TestimonialMasonryMarquee } from "@/components/ui/testimonial-masonry-marquee";

export default function LandingPage() {
  return (
    <main className="flex flex-col w-full bg-background text-foreground min-h-screen">
      <GoogleGeminiGlowHero />
      <div className="max-w-6xl mx-auto px-4 py-16 w-full space-y-16">
        <DeviceMockupShowcase />
        <InteractiveRoiCalculator />
        <TestimonialMasonryMarquee />
      </div>
    </main>
  );
}
`,
  },
};

export async function composePage(archetypeKey: string, options: ComposeOptions = {}): Promise<boolean> {
  const archetype = ARCHETYPES[archetypeKey];

  if (!archetype) {
    console.error(`❌ Error: Unknown archetype "${archetypeKey}".`);
    console.log(`\nAvailable Archetypes:`);
    Object.entries(ARCHETYPES).forEach(([key, val]) => {
      console.log(`  - ${key}: ${val.title} (${val.description})`);
    });
    return false;
  }

  const baseCwd = options.cwd ? path.resolve(options.cwd) : process.cwd();
  console.log(`\n🏗️  Composing Page Archetype: [${archetype.title}]`);
  console.log(`📦 Required Components: [${archetype.requiredSlugs.join(", ")}]`);

  // Step 1: Install all required components
  for (const slug of archetype.requiredSlugs) {
    console.log(`\n   Installing component [${slug}]...`);
    const success = await addComponent(slug, {
      cwd: baseCwd,
      registry: options.registry,
      overwrite: options.overwrite,
      installDeps: true,
    });
    if (!success) {
      console.warn(`   ⚠️ Warning: Could not install component "${slug}", continuing with layout generation.`);
    }
  }

  // Step 2: Write scaffolded page TSX
  const relativePagePath = options.outputPath || archetype.defaultFilePath;
  const targetFile = path.join(baseCwd, relativePagePath);
  const targetDir = path.dirname(targetFile);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (fs.existsSync(targetFile) && !options.overwrite) {
    console.warn(`\n⚠️ Target page file already exists: ${relativePagePath}`);
    console.log(`   Use --overwrite to replace it.`);
    return true;
  }

  fs.writeFileSync(targetFile, archetype.scaffoldTsx, "utf-8");
  console.log(`\n✅ Successfully generated layout page at: ${relativePagePath}`);
  console.log(`🎉 Page archetype [${archetypeKey}] composed with zero slop!`);

  return true;
}
