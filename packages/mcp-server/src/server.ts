import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fs from "fs";
import path from "path";

// 20 anti-slop rules embedded for self-contained audit tool
interface SlopCheck {
  id: string;
  name: string;
  severity: "High" | "Medium" | "Low";
  regex: RegExp;
  recommendation: string;
}

const MCP_SLOP_CHECKS: SlopCheck[] = [
  {
    id: "SLOP-001",
    name: "Hardcoded Indigo Color",
    severity: "Medium",
    regex: /bg-indigo-(?:500|600|700)|text-indigo-(?:500|600)|(?:#4f46e5|#6366f1)/i,
    recommendation: "Replace hardcoded indigo with semantic Tailwind tokens (bg-primary, text-primary-foreground).",
  },
  {
    id: "SLOP-002",
    name: "Purple-to-Blue Linear Gradient",
    severity: "Medium",
    regex: /from-purple-500\s+to-blue-500|bg-gradient-to-[r|tr|tl|b]\s+from-fuchsia/i,
    recommendation: "Replace generic linear gradients with subtle solid card backgrounds accented by structural borders.",
  },
  {
    id: "SLOP-003",
    name: "Blanket Glassmorphism",
    severity: "Low",
    regex: /bg-white\/10\s+backdrop-blur|bg-white\/5\s+backdrop-blur/i,
    recommendation: "Use solid card surfaces with crisp border-border instead of blanket glassmorphism blur.",
  },
  {
    id: "SLOP-004",
    name: "Chained Type Assertions",
    severity: "High",
    regex: /as\s+\w+\s+as\s+\w+/i,
    recommendation: "Remove chained assertions (as any as). Define explicit TypeScript interfaces and type guards.",
  },
  {
    id: "SLOP-005",
    name: "Conditional Empty Object Spreads",
    severity: "High",
    regex: /\.\.\.\s*\(\s*[^?]+\s*\?\s*\{[^}]*\}\s*:\s*\{\s*\}\s*\)/i,
    recommendation: "Use explicit fallback keys instead of ad-hoc conditional empty spreads.",
  },
  {
    id: "SLOP-006",
    name: "Blanket Transition All",
    severity: "Low",
    regex: /transition-all\s+duration-(?:300|500)/i,
    recommendation: "Target mutable styles explicitly (e.g. transition-colors duration-200) rather than transition-all.",
  },
  {
    id: "SLOP-007",
    name: "Non-Token Arbitrary Pixel Spacing",
    severity: "Low",
    regex: /(?:p|m|gap)-\[(?:\d+px|\d+rem)\]/i,
    recommendation: "Replace arbitrary pixel units (p-[17px]) with Tailwind spacing steps (p-4).",
  },
  {
    id: "SLOP-008",
    name: "Decorative Emojis in Cards/Buttons",
    severity: "Medium",
    regex: /(?:<span>|<li>|<button>)\s*[\uD800-\uDBFF][\uDC00-\uDFFF]\s*(?:<\/span>|<\/li>|<\/button>)/i,
    recommendation: "Replace decorative emojis with semantic SVG vector icons from lucide-react.",
  },
  {
    id: "SLOP-009",
    name: "Incomplete Code / Mock TODOs",
    severity: "High",
    regex: /\/\/\s*TODO:\s*(?:implement|add\s+logic|finish|mock)/i,
    recommendation: "Deliver complete, functional code without truncation or placeholder comments.",
  },
  {
    id: "SLOP-010",
    name: "Missing Interactive A11y Label",
    severity: "High",
    regex: /<button[^>]*>\s*<[A-Z]\w+[^>]*\/>\s*<\/button>/i,
    recommendation: "Add aria-label or accessible <span className='sr-only'> text to icon-only buttons.",
  },
];

function getRegistryItems(): any[] {
  const possiblePaths = [
    path.resolve(__dirname, "../../../apps/docs/public/r/registry.json"),
    path.resolve(__dirname, "../../registry/dist/r/registry.json"),
    path.resolve(__dirname, "../../apps/docs/public/r/registry.json"),
    path.resolve(process.cwd(), "apps/docs/public/r/registry.json"),
    path.resolve(process.cwd(), "packages/registry/dist/r/registry.json"),
    path.resolve(process.cwd(), "../../apps/docs/public/r/registry.json"),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, "utf-8"));
      } catch (e) {
        console.error(`Failed to parse registry at ${p}`, e);
      }
    }
  }
  return [];
}

export function createDesignWikiMcpServer(): McpServer {
  const server = new McpServer({
    name: "design-agent-wiki",
    version: "1.0.0",
  });

  // Tool 1: search_components
  server.registerTool(
    "search_components",
    {
      description:
        "Search the Machine-First Design Agent Wiki for curated, high-performance UI components by keyword, taxonomy category, tags, or taste dials.",
      inputSchema: z.object({
        query: z.string().optional().describe("Search keywords (e.g., 'dialog', 'matrix', 'dock', 'bento')"),
        category: z
          .enum([
            "ui:primitive",
            "ui:motion",
            "ui:creative",
            "ui:editorial",
            "ui:block",
            "ui:media",
            "ui:utility",
          ])
          .optional()
          .describe("Taxonomy category filter"),
        tag: z.string().optional().describe("Technical or visual tag (e.g., 'tailwind-v4', 'motion/react', 'webgl')"),
        minMotionIntensity: z.number().min(1).max(10).optional().describe("Minimum motion intensity dial (1-10)"),
        maxVisualDensity: z.number().min(1).max(10).optional().describe("Maximum visual density dial (1-10)"),
      }),
    },
    async ({ query, category, tag, minMotionIntensity, maxVisualDensity }) => {
      const items = getRegistryItems();
      let filtered = items;

      if (category) {
        filtered = filtered.filter((i) => i.category === category);
      }
      if (tag) {
        filtered = filtered.filter((i) => i.tags && i.tags.includes(tag.toLowerCase()));
      }
      if (minMotionIntensity) {
        filtered = filtered.filter((i) => i.dials && i.dials.motion_intensity >= minMotionIntensity);
      }
      if (maxVisualDensity) {
        filtered = filtered.filter((i) => i.dials && i.dials.visual_density <= maxVisualDensity);
      }
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            (i.tags && i.tags.some((t: string) => t.toLowerCase().includes(q)))
        );
      }

      const results = filtered.map((i) => ({
        name: i.name,
        title: i.title,
        category: i.category,
        tags: i.tags,
        dials: i.dials,
        a11y: i.a11y,
        dependencies: i.dependencies,
        installCommand: `npx shadcn@latest add http://localhost:3000/r/${i.name}.json`,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                matchCount: results.length,
                components: results,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 2: get_component_markup
  server.registerTool(
    "get_component_markup",
    {
      description:
        "Fetch the complete, production-grade TSX source code, dependencies, and styling recipes for a registered component.",
      inputSchema: z.object({
        name: z.string().describe("Component slug identifier (e.g., 'floating-dock', 'button', 'canvas-fluid-wave')"),
      }),
    },
    async ({ name }) => {
      const items = getRegistryItems();
      const item = items.find((i) => i.name.toLowerCase() === name.toLowerCase());

      if (!item) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Component "${name}" was not found in the Design Agent Wiki registry. Use search_components to view available slugs.`,
            },
          ],
        };
      }

      const fileEntry = item.files?.[0];
      const sourceCode = fileEntry?.content || "// Error: Source code not bundled in registry artifact.";

      const response = {
        name: item.name,
        title: item.title,
        category: item.category,
        dependencies: item.dependencies,
        registryDependencies: item.registryDependencies,
        dials: item.dials,
        a11y: item.a11y,
        sourceCode: sourceCode,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    }
  );

  // Tool 3: get_install_recipe
  server.registerTool(
    "get_install_recipe",
    {
      description:
        "Get the exact CLI installation recipe, shadcn command, and required peer npm dependencies for a component.",
      inputSchema: z.object({
        name: z.string().describe("Component slug identifier (e.g., 'bento-grid', 'dialog')"),
        baseUrl: z.string().optional().default("http://localhost:3000"),
      }),
    },
    async ({ name, baseUrl = "http://localhost:3000" }) => {
      const activeBaseUrl = baseUrl || "http://localhost:3000";
      const items = getRegistryItems();
      const item = items.find((i) => i.name.toLowerCase() === name.toLowerCase());

      if (!item) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Component "${name}" was not found.`,
            },
          ],
        };
      }

      const recipe = {
        component: item.name,
        shadcnAddCommand: `npx shadcn@latest add ${activeBaseUrl}/r/${item.name}.json`,
        bunAddCommand: `bunx --bun shadcn add ${activeBaseUrl}/r/${item.name}.json`,
        npmDependencies: item.dependencies,
        registryDependencies: item.registryDependencies,
        quickInstructions: [
          `Run '${recipeFormat(item.name, activeBaseUrl)}' in your project root.`,
          `Ensure peer dependencies (${item.dependencies.join(", ")}) are installed.`,
          `Verify path alias '@/components/ui/${item.name}' is correctly imported.`,
        ],
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(recipe, null, 2),
          },
        ],
      };
    }
  );

  // Tool 4: audit_code_slop
  server.registerTool(
    "audit_code_slop",
    {
      description:
        "Scan an arbitrary block of React/TypeScript/Tailwind code against the 20 anti-slop rules and return a remediation receipt.",
      inputSchema: z.object({
        code: z.string().describe("The source code string to audit for AI slop and design regression."),
      }),
    },
    async ({ code }) => {
      const lines = code.split("\n");
      const findings: Array<{
        ruleId: string;
        name: string;
        severity: string;
        lineNum: number;
        lineText: string;
        recommendation: string;
      }> = [];

      lines.forEach((line, idx) => {
        for (const check of MCP_SLOP_CHECKS) {
          if (check.regex.test(line)) {
            findings.push({
              ruleId: check.id,
              name: check.name,
              severity: check.severity,
              lineNum: idx + 1,
              lineText: line.trim(),
              recommendation: check.recommendation,
            });
          }
        }
      });

      const highCount = findings.filter((f) => f.severity === "High").length;
      const medCount = findings.filter((f) => f.severity === "Medium").length;
      const lowCount = findings.filter((f) => f.severity === "Low").length;
      const healthScore = Math.max(0, 100 - (highCount * 15 + medCount * 8 + lowCount * 3));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                healthScore: `${healthScore}/100`,
                status: healthScore >= 85 ? "PASS" : "FAIL - Remediation Needed",
                violationsFound: findings.length,
                severityBreakdown: { High: highCount, Medium: medCount, Low: lowCount },
                findings: findings,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  return server;
}

function recipeFormat(name: string, baseUrl: string) {
  return `npx shadcn@latest add ${baseUrl}/r/${name}.json`;
}
