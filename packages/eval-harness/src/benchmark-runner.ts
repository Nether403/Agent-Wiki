/**
 * @origin Machine-First Design Agent Wiki (Eval Harness)
 * @license MIT
 * @description Benchmark runner. Slop scores use @design-wiki/audit-linter.
 * TypeScript compile and rendered a11y are not executed here (Phase 4 remaining work).
 */

import { evaluateSource } from "@design-wiki/audit-linter";

export interface BenchmarkScenario {
  id: string;
  category: string;
  prompt: string;
  expectedComponents: string[];
  simulatedTsxSnippet: string;
}

export const BENCHMARK_SCENARIOS: BenchmarkScenario[] = [
  {
    id: "BM-01",
    category: "Landing Page",
    prompt: "Assemble a modern AI agent hero section with sticky navbar and call-to-action banner.",
    expectedComponents: ["navbar-sticky", "google-gemini-glow-hero", "cta-banner-geometric"],
    simulatedTsxSnippet: `import { NavbarSticky } from "@/components/ui/navbar-sticky";
import { GoogleGeminiGlowHero } from "@/components/ui/google-gemini-glow-hero";
import { CtaBannerGeometric } from "@/components/ui/cta-banner-geometric";

export default function HeroView() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NavbarSticky />
      <main className="flex-1">
        <GoogleGeminiGlowHero />
        <CtaBannerGeometric />
      </main>
    </div>
  );
}`,
  },
  {
    id: "BM-02",
    category: "AI Workspace",
    prompt: "Construct an AI chat layout with streaming message thread, reasoning accordion, and expanded prompt bar.",
    expectedComponents: ["ai-streaming-message", "ai-reasoning-accordion", "ai-prompt-bar-expanded"],
    simulatedTsxSnippet: `import { AiStreamingMessage } from "@/components/ui/ai-streaming-message";
import { AiReasoningAccordion } from "@/components/ui/ai-reasoning-accordion";
import { AiPromptBarExpanded } from "@/components/ui/ai-prompt-bar-expanded";

export default function ChatView() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground p-4">
      <AiStreamingMessage role="assistant" content="Grounded agent session ready." />
      <AiReasoningAccordion />
      <div className="mt-auto">
        <AiPromptBarExpanded onSubmit={() => {}} />
      </div>
    </div>
  );
}`,
  },
  {
    id: "BM-03",
    category: "Enterprise Analytics",
    prompt: "Create an enterprise data grid with faceted query builder and summary pivot rows.",
    expectedComponents: ["faceted-query-builder", "data-grid-pivot-view"],
    simulatedTsxSnippet: `import { FacetedQueryBuilder } from "@/components/ui/faceted-query-builder";
import { DataGridPivotView } from "@/components/ui/data-grid-pivot-view";

export default function AnalyticsView() {
  return (
    <div className="p-6 space-y-6 bg-background text-foreground">
      <FacetedQueryBuilder />
      <DataGridPivotView />
    </div>
  );
}`,
  },
  {
    id: "BM-04",
    category: "Developer Tooling",
    prompt: "Build a code review diff inspector with unified/split hunk viewer and line commenting.",
    expectedComponents: ["diff-hunk-viewer"],
    simulatedTsxSnippet: `import { DiffHunkViewer } from "@/components/ui/diff-hunk-viewer";

export default function CodeReviewView() {
  return (
    <div className="p-6 bg-background text-foreground">
      <DiffHunkViewer />
    </div>
  );
}`,
  },
  {
    id: "BM-05",
    category: "SaaS Pricing",
    prompt: "Render an interactive pricing matrix with feature comparisons and billing toggle.",
    expectedComponents: ["pricing-table", "pricing-tier-feature-matrix"],
    simulatedTsxSnippet: `import { PricingTable } from "@/components/ui/pricing-table";
import { PricingTierFeatureMatrix } from "@/components/ui/pricing-tier-feature-matrix";

export default function PricingView() {
  return (
    <div className="p-8 space-y-8 bg-background text-foreground">
      <PricingTable />
      <PricingTierFeatureMatrix />
    </div>
  );
}`,
  },
];

export interface BenchmarkRunReport {
  scenarioId: string;
  category: string;
  prompt: string;
  slopHealthScore: number;
  compilationScore: number | null;
  a11yScore: number | null;
  overallFidelityScore: number;
  status: "PASS" | "FAIL";
  notes: string;
}

export interface BenchmarkSummary {
  totalScenarios: number;
  passedCount: number;
  averageZeroDraftFidelity: number;
  reports: BenchmarkRunReport[];
}

export function runAgentBenchmarkSuite(scenarios: BenchmarkScenario[] = BENCHMARK_SCENARIOS): BenchmarkSummary {
  const reports: BenchmarkRunReport[] = scenarios.map((scenario) => {
    const slop = evaluateSource(`${scenario.id}.tsx`, scenario.simulatedTsxSnippet);
    const overallFidelity = slop.healthScore;
    const status = slop.metrics.highSeverityCount === 0 && slop.healthScore >= 85 ? "PASS" : "FAIL";

    return {
      scenarioId: scenario.id,
      category: scenario.category,
      prompt: scenario.prompt,
      slopHealthScore: slop.healthScore,
      compilationScore: null,
      a11yScore: null,
      overallFidelityScore: overallFidelity,
      status,
      notes: "compilationScore and a11yScore are null until Phase 4 sandbox/axe exist",
    };
  });

  const passed = reports.filter((r) => r.status === "PASS").length;
  const avgFidelity = Math.round(reports.reduce((s, r) => s + r.overallFidelityScore, 0) / reports.length);

  return {
    totalScenarios: reports.length,
    passedCount: passed,
    averageZeroDraftFidelity: avgFidelity,
    reports,
  };
}
