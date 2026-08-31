import fs from "fs";
import path from "path";
import { evaluateSource } from "@design-wiki/audit-linter";
import { auditLocalPath } from "./audit";

export interface EvalOptions {
  cwd?: string;
  suite?: "benchmark" | "workspace";
}

interface BenchmarkScenario {
  id: string;
  category: string;
  prompt: string;
  expectedComponents: string[];
  simulatedTsxSnippet: string;
}

const BENCHMARK_SCENARIOS: BenchmarkScenario[] = [
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

export async function evalCommand(targetPath?: string, options: EvalOptions = {}): Promise<void> {
  const cwd = path.resolve(options.cwd || process.cwd());
  const suite = options.suite || (targetPath ? "workspace" : "benchmark");

  console.log(`\n🧪 Evaluation harness (${suite})`);
  console.log(`   Slop scores come from @design-wiki/audit-linter.`);
  console.log(`   TypeScript compile and rendered a11y are not measured yet.\n`);

  if (suite === "benchmark") {
    const reports = BENCHMARK_SCENARIOS.map((scenario) => {
      const slop = evaluateSource(`${scenario.id}.tsx`, scenario.simulatedTsxSnippet);
      const missing = scenario.expectedComponents.filter((slug) => {
        const candidates = [
          path.join(cwd, "packages/registry/src"),
          path.join(cwd, "apps/docs/public/r"),
        ];
        return !candidates.some((root) => {
          if (!fs.existsSync(root)) return false;
          const walk = (dir: string): boolean => {
            for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
              const full = path.join(dir, entry.name);
              if (entry.isDirectory()) {
                if (walk(full)) return true;
              } else if (entry.name.startsWith(slug) && /\.(tsx|json)$/.test(entry.name)) {
                return true;
              }
            }
            return false;
          };
          return walk(root);
        });
      });

      const status =
        slop.metrics.highSeverityCount === 0 && missing.length === 0 ? "PASS" : "FAIL";

      return {
        scenarioId: scenario.id,
        category: scenario.category,
        slopHealthScore: slop.healthScore,
        missingComponents: missing,
        compilationScore: "not-run",
        a11yScore: "heuristic-only",
        status,
      };
    });

    const passedCount = reports.filter((r) => r.status === "PASS").length;
    console.log(`Scenarios: ${passedCount}/${reports.length} passed (slop + catalog presence)\n`);
    reports.forEach((r) => {
      const missing =
        r.missingComponents.length > 0 ? ` missing=${r.missingComponents.join(",")}` : "";
      console.log(`  ${r.status.padEnd(4)} ${r.scenarioId}  slop ${r.slopHealthScore}/100${missing}`);
    });
    return;
  }

  const scanDir = targetPath ? path.resolve(cwd, targetPath) : cwd;
  auditLocalPath(scanDir);
}
