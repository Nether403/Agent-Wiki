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
  {
    id: "SLOP-011",
    name: "Inline SVG Missing Role or Title",
    severity: "Medium",
    regex: /<svg\b(?![^>]*(?:role=["']img["']|aria-hidden=["']true["']|aria-label))[^>]*>/i,
    recommendation: "Add role='img' and aria-label or accessible title to inline SVGs.",
  },
  {
    id: "SLOP-012",
    name: "Focus Ring Suppression Without Replacement",
    severity: "High",
    regex: /(?:outline-none|ring-0)\b/i,
    recommendation: "Provide focus-visible rings (focus-visible:ring-2) when suppressing default outlines.",
  },
  {
    id: "SLOP-013",
    name: "Layout-Triggering Transitions",
    severity: "Medium",
    regex: /transition-\[(?:height|width|margin|padding)\]/i,
    recommendation: "Animate transform or opacity instead of layout-triggering dimension properties.",
  },
  {
    id: "SLOP-014",
    name: "Canvas Loop Missing Reduced Motion Check",
    severity: "Medium",
    regex: /requestAnimationFrame/i,
    recommendation: "Check window.matchMedia('(prefers-reduced-motion: reduce)') before starting canvas animation loops.",
  },
  {
    id: "SLOP-015",
    name: "External Image Missing Fallback Dimensions",
    severity: "High",
    regex: /<img[^>]+src=["']http[^"']+["'](?!.*(?:width=|height=|aspect-))/i,
    recommendation: "Specify explicit width, height, or aspect-ratio on external image elements.",
  },
  {
    id: "SLOP-016",
    name: "Missing LayoutGroup or Stable Key During Morph",
    severity: "Low",
    regex: /layoutId=(?!.*key=)/i,
    recommendation: "Ensure components with layoutId inside arrays have unique stable React keys.",
  },
  {
    id: "SLOP-017",
    name: "Implicit Any Props on Component Export",
    severity: "Medium",
    regex: /export\s+(?:function|const)\s+\w+\s*=\s*\([^)]*:\s*any\s*\)/i,
    recommendation: "Define explicit TypeScript interfaces for component props instead of any.",
  },
  {
    id: "SLOP-018",
    name: "Repetitive Centered Card Layout Pattern",
    severity: "Medium",
    regex: /grid-cols-3.*items-center.*text-center.*rounded-xl.*p-6/i,
    recommendation: "Introduce asymmetrical rhythm or editorial layout styling.",
  },
  {
    id: "SLOP-019",
    name: "Deep Relative Import Bypassing Aliases",
    severity: "High",
    regex: /import\s+.*from\s+["'](?:\.\.\/){3,}/i,
    recommendation: "Use standard import path aliases (@/components/ui/...).",
  },
  {
    id: "SLOP-020",
    name: "Missing Mandatory License Attribution",
    severity: "High",
    regex: /^$/i,
    recommendation: "Inject upstream license attribution header before publication.",
  },
  {
    id: "SLOP-021",
    name: "Raw Unshaded Background",
    severity: "Medium",
    regex: /(?:bg-white|bg-black)\b|bg-\[#(?:fff|ffffff|000|000000)\]/i,
    recommendation: "Replace raw unshaded background with semantic tokens (bg-card, bg-background, bg-muted) and dark variant.",
  },
];

export function getRegistryItems(): any[] {
  const possiblePaths = [
    path.resolve(__dirname, "../../../apps/docs/public/r/registry.json"),
    path.resolve(__dirname, "../../registry/dist/r/registry.json"),
    path.resolve(__dirname, "../../apps/docs/public/r/registry.json"),
    path.resolve(__dirname, "../../../packages/registry/dist/r/registry.json"),
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

export function getComponentItem(slug: string): any | null {
  const items = getRegistryItems();
  const directMatch = items.find((i) => i.name.toLowerCase() === slug.toLowerCase());
  if (directMatch) return directMatch;

  const possibleItemPaths = [
    path.resolve(__dirname, `../../../apps/docs/public/r/${slug}.json`),
    path.resolve(__dirname, `../../registry/dist/r/${slug}.json`),
    path.resolve(__dirname, `../../apps/docs/public/r/${slug}.json`),
    path.resolve(process.cwd(), `apps/docs/public/r/${slug}.json`),
    path.resolve(process.cwd(), `packages/registry/dist/r/${slug}.json`),
  ];

  for (const p of possibleItemPaths) {
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, "utf-8"));
      } catch (e) {
        console.error(`Failed to parse item at ${p}`, e);
      }
    }
  }

  return null;
}

export function createDesignWikiMcpServer(): McpServer {
  const server = new McpServer({
    name: "design-agent-wiki",
    version: "1.0.0",
  });

  const searchInputSchema = z.object({
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
    minDesignVariance: z.number().min(1).max(10).optional().describe("Minimum design variance dial (1-10)"),
  });

  const handleSearchComponents = async ({
    query,
    category,
    tag,
    minMotionIntensity,
    maxVisualDensity,
    minDesignVariance,
  }: {
    query?: string;
    category?: any;
    tag?: string;
    minMotionIntensity?: number;
    maxVisualDensity?: number;
    minDesignVariance?: number;
  }) => {
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
    if (minDesignVariance) {
      filtered = filtered.filter((i) => i.dials && i.dials.design_variance >= minDesignVariance);
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
      registryDependencies: i.registryDependencies,
      installCommand: `npx shadcn@latest add http://localhost:3000/r/${i.name}.json`,
    }));

    return {
      content: [
        {
          type: "text" as const,
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
  };

  // Tool 1: search_components
  server.registerTool(
    "search_components",
    {
      description:
        "Search the Machine-First Design Agent Wiki for curated, high-performance UI components by keyword, taxonomy category, tags, or taste dials.",
      inputSchema: searchInputSchema,
    },
    handleSearchComponents
  );

  // Tool 1 Alias: search_library (for agent workflows in Cursor, Claude Code, etc.)
  server.registerTool(
    "search_library",
    {
      description:
        "Search and discover UI component templates and libraries within the Machine-First Design Agent Wiki by keyword, taxonomy category, tags, or taste dials.",
      inputSchema: searchInputSchema,
    },
    handleSearchComponents
  );

  // Helper handler for markup retrieval
  // Handler for raw markdown retrieval (with complete YAML frontmatter and verified TSX source)
  const handleFetchRawMarkdown = async (name: string) => {
    const item = getComponentItem(name);

    if (!item) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: Component "${name}" was not found in the Design Agent Wiki registry. Use search_components to view available slugs.`,
          },
        ],
      };
    }

    const fileEntry = item.files?.[0];
    const sourceCode = fileEntry?.content || "// Error: Source code not bundled in registry artifact.";

    const depsYaml =
      item.dependencies && item.dependencies.length > 0
        ? item.dependencies.map((d: string) => `  - "${d}"`).join("\n")
        : "  # No external runtime dependencies";

    const tagsYaml =
      item.tags && item.tags.length > 0
        ? item.tags.map((t: string) => `  - "${t}"`).join("\n")
        : '  - "ui"';

    const complexity =
      item.complexity ||
      (sourceCode.length > 3500 || sourceCode.includes("requestAnimationFrame")
        ? "high"
        : sourceCode.length < 1500
        ? "low"
        : "medium");

    const markdownDoc = `---
id: "${item.name}"
name: "${item.title}"
category: "${item.category}"
library_origin: "${item.license_origin?.source_repository || "Design Agent Wiki"}"
dependencies:
${depsYaml}
tags:
${tagsYaml}
dials:
  design_variance: ${item.dials?.design_variance ?? 5}      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: ${item.dials?.motion_intensity ?? 5}     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: ${item.dials?.visual_density ?? 5}       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "${complexity}"
a11y:
  keyboard_navigable: ${item.a11y?.keyboard_navigable ?? false}
  wai_aria_compliant: ${item.a11y?.wai_aria_compliant ?? true}
  fallback_provided: ${item.a11y?.fallback_provided ?? true}
---

# ${item.title} (\`${item.name}\`)
> ${item.description}

- **Category**: \`${item.category}\`
- **Structural Complexity**: \`${complexity.toUpperCase()}\`
- **Technical Tags**: ${(item.tags || []).join(", ") || "None"}
- **Taste Dials**: Variance ${item.dials?.design_variance ?? 5}/10 · Motion ${item.dials?.motion_intensity ?? 5}/10 · Density ${item.dials?.visual_density ?? 5}/10
- **Accessibility AA**: Keyboard Nav: ${item.a11y?.keyboard_navigable ?? false}, ARIA: ${item.a11y?.wai_aria_compliant ?? true}, Fallback: ${item.a11y?.fallback_provided ?? true}

## Installation Recipe
\`\`\`bash
npx design-wiki add ${item.name}
# or via shadcn
npx shadcn@latest add http://localhost:3000/r/${item.name}.json
\`\`\`

## Peer Dependencies
${item.dependencies && item.dependencies.length > 0 ? item.dependencies.map((d: string) => `- \`${d}\``).join("\n") : "- None"}

## Verified TypeScript Source
\`\`\`tsx
${sourceCode}
\`\`\`
`;

    return {
      content: [
        {
          type: "text" as const,
          text: markdownDoc,
        },
      ],
    };
  };

  // Helper handler for markup JSON retrieval (backward compatibility)
  const handleFetchMarkup = async (name: string) => {
    const item = getComponentItem(name);

    if (!item) {
      return {
        content: [
          {
            type: "text" as const,
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
      markdownDocs: `### ${item.title} (\`${item.name}\`)\n${item.description}\n\n**Category**: \`${item.category}\`\n**Dependencies**: ${item.dependencies.join(", ") || "None"}\n**Dials**: Variance ${item.dials?.design_variance}/10, Motion ${item.dials?.motion_intensity}/10, Density ${item.dials?.visual_density}/10\n\n\`\`\`tsx\n${sourceCode}\n\`\`\``,
    };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  };

  // Tool 2 (Primary): fetch_raw_markdown
  server.registerTool(
    "fetch_raw_markdown",
    {
      description:
        "Fetch the complete raw Markdown documentation (including structured YAML frontmatter, taxonomy, taste dials, accessibility contracts, and verified TSX source code) for a component.",
      inputSchema: z.object({
        name: z.string().describe("Component slug identifier (e.g., 'canvas-fluid-wave', 'floating-dock', 'button')"),
      }),
    },
    async ({ name }) => handleFetchRawMarkdown(name)
  );

  // Tool 2 Alias: fetch_raw_markup (backward compatibility)
  server.registerTool(
    "fetch_raw_markup",
    {
      description:
        "Fetch the complete, un-truncated production TSX/JSX source code, peer dependencies, and styling recipes for a registered component.",
      inputSchema: z.object({
        name: z.string().describe("Component slug identifier (e.g., 'floating-dock', 'button', 'canvas-fluid-wave')"),
      }),
    },
    async ({ name }) => handleFetchMarkup(name)
  );

  // Tool 2 Alias: get_component_markup (backward compatibility)
  server.registerTool(
    "get_component_markup",
    {
      description:
        "Fetch the complete TSX source code, peer dependencies, and styling recipes for a registered component (alias to fetch_raw_markup).",
      inputSchema: z.object({
        name: z.string().describe("Component slug identifier (e.g., 'floating-dock', 'button', 'canvas-fluid-wave')"),
      }),
    },
    async ({ name }) => handleFetchMarkup(name)
  );

  // Handler for installation commands (CLI and package managers)
  const handleGetInstallationCommands = async (
    name: string,
    packageManager: "pnpm" | "npm" | "bun" | "yarn" = "pnpm",
    baseUrl: string = "http://localhost:3000"
  ) => {
    const activeBaseUrl = baseUrl || "http://localhost:3000";
    const item = getComponentItem(name);

    if (!item) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: Component "${name}" was not found. Use search_components to find valid component slugs.`,
          },
        ],
      };
    }

    const pm = packageManager || "pnpm";
    const peerAddCmd =
      item.dependencies && item.dependencies.length > 0
        ? pm === "npm"
          ? `npm install ${item.dependencies.join(" ")}`
          : pm === "bun"
          ? `bun add ${item.dependencies.join(" ")}`
          : pm === "yarn"
          ? `yarn add ${item.dependencies.join(" ")}`
          : `pnpm add ${item.dependencies.join(" ")}`
        : "None required";

    const commands = {
      cli: `npx design-wiki add ${item.name}`,
      shadcn: `npx shadcn@latest add ${activeBaseUrl}/r/${item.name}.json`,
      bun: `bunx --bun shadcn add ${activeBaseUrl}/r/${item.name}.json`,
      pnpm: `pnpm dlx shadcn add ${activeBaseUrl}/r/${item.name}.json`,
      npm: `npx shadcn@latest add ${activeBaseUrl}/r/${item.name}.json`,
    };

    const response = {
      component: item.name,
      title: item.title,
      category: item.category,
      commands,
      preferredCliCommand: commands.cli,
      peerInstallCommand: peerAddCmd,
      peerDependencies: item.dependencies || [],
      devDependencies: item.devDependencies || [],
      registryDependencies: item.registryDependencies || [],
      importStatement: `import { ${item.title.replace(/\s+/g, "")} } from "@/components/ui/${item.name}";`,
      instructions: [
        `Run '${commands.cli}' to install the component and resolve path aliases.`,
        `Or run '${commands.shadcn}' in your workspace root.`,
        item.dependencies?.length > 0
          ? `Ensure peer packages are installed: ${peerAddCmd}`
          : `No external runtime dependencies required.`,
        `Import in your page or layout: import { ${item.title.replace(/\s+/g, "")} } from "@/components/ui/${item.name}";`,
      ],
    };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  };

  // Helper handler for installation schema retrieval (backward compatibility)
  const handleGetInstallSchema = async (name: string, baseUrl: string = "http://localhost:3000") => {
    const activeBaseUrl = baseUrl || "http://localhost:3000";
    const item = getComponentItem(name);

    if (!item) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: Component "${name}" was not found. Use search_components to find valid component slugs.`,
          },
        ],
      };
    }

    const schemaResponse = {
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      category: item.category,
      tags: item.tags,
      dials: item.dials,
      a11y: item.a11y,
      license_origin: item.license_origin,
      dependencies: item.dependencies,
      devDependencies: item.devDependencies,
      registryDependencies: item.registryDependencies,
      files: item.files,
      installCommands: {
        cli: `npx design-wiki add ${item.name}`,
        shadcn: `npx shadcn@latest add ${activeBaseUrl}/r/${item.name}.json`,
        bun: `bunx --bun shadcn add ${activeBaseUrl}/r/${item.name}.json`,
      },
      instructions: [
        `Execute 'npx design-wiki add ${item.name}' or 'npx shadcn@latest add ${activeBaseUrl}/r/${item.name}.json'.`,
        `Verify required peer packages are installed: ${item.dependencies.join(", ") || "None"}.`,
        `Import in your layout using '@/components/ui/${item.name}'.`,
      ],
    };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(schemaResponse, null, 2),
        },
      ],
    };
  };

  // Tool 3 (Primary): get_installation_commands
  server.registerTool(
    "get_installation_commands",
    {
      description:
        "Get the exact CLI installation commands (e.g. npx design-wiki add <slug> or npx shadcn add ...), package manager commands, and peer dependencies for a component.",
      inputSchema: z.object({
        name: z.string().describe("Component slug identifier (e.g., 'floating-dock', 'canvas-fluid-wave', 'bento-grid')"),
        packageManager: z.enum(["pnpm", "npm", "bun", "yarn"]).optional().default("pnpm").describe("Target package manager (pnpm, npm, bun, yarn)"),
        baseUrl: z.string().optional().default("http://localhost:3000").describe("Base URL hosting the /r/ registry endpoints"),
      }),
    },
    async ({ name, packageManager = "pnpm", baseUrl = "http://localhost:3000" }) =>
      handleGetInstallationCommands(name, packageManager, baseUrl)
  );

  // Tool 3 Alias: get_installation_schema (backward compatibility)
  server.registerTool(
    "get_installation_schema",
    {
      description:
        "Get the complete shadcn v3 registry JSON installation schema (including files, dependencies, registryDependencies, and CLI install recipe) for a component.",
      inputSchema: z.object({
        name: z.string().describe("Component slug identifier (e.g., 'bento-grid', 'dialog', 'floating-dock')"),
        baseUrl: z.string().optional().default("http://localhost:3000").describe("Base URL hosting the /r/ registry endpoints"),
      }),
    },
    async ({ name, baseUrl = "http://localhost:3000" }) => handleGetInstallSchema(name, baseUrl)
  );

  // Tool 3 Alias: get_install_recipe (backward compatibility)
  server.registerTool(
    "get_install_recipe",
    {
      description:
        "Get the exact CLI installation recipe, shadcn command, and required peer npm dependencies for a component (alias to get_installation_schema).",
      inputSchema: z.object({
        name: z.string().describe("Component slug identifier (e.g., 'bento-grid', 'dialog')"),
        baseUrl: z.string().optional().default("http://localhost:3000"),
      }),
    },
    async ({ name, baseUrl = "http://localhost:3000" }) => handleGetInstallSchema(name, baseUrl)
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
          if (check.id === "SLOP-020") continue;
          if (check.id === "SLOP-012" && (line.includes("focus-visible:") || line.includes("focus:ring"))) {
            continue;
          }
          if (check.id === "SLOP-014" && code.includes("prefers-reduced-motion")) {
            continue;
          }
          if (check.id === "SLOP-021" && (line.includes("dark:bg-") || line.includes("bg-white/") || line.includes("bg-black/"))) {
            continue;
          }

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
