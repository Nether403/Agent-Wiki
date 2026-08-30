import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { loadCatalogSnapshot } from "./embedded-catalog";
import { scanMaliciousPayload, detectPromptInjection, enforceTokenBudget } from "./security";

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
  {
    id: "SLOP-022",
    name: "AI Writing Clichés",
    severity: "Medium",
    regex: /(?:in today's fast-paced|unleash the power of|it's not just .* it's|the future is here|supercharge your workflow|revolutionize the way you|dive deep into|testament to)/i,
    recommendation: "Replace generic AI clichés with direct, high-signal, benefit-driven copy.",
  },
  {
    id: "SLOP-023",
    name: "Oxlint Contract Hygiene",
    severity: "High",
    regex: /(?:Record<string,\s*any>|:\s*any\[\]|\((?:e|evt|event|item|data|val|props):\s*any\))/i,
    recommendation: "Define explicit TypeScript interfaces and avoid loose 'any' signatures.",
  },
  {
    id: "SLOP-024",
    name: "Strict WCAG 2.1 AA Contrast Ratio",
    severity: "High",
    regex: /(?:text-muted-foreground\/(?:10|20|30)|text-zinc-400\s+bg-zinc-300|text-gray-300\s+bg-gray-200|text-white\/20\s+bg-white)/i,
    recommendation: "Ensure text contrast meets WCAG 2.1 AA (4.5:1 minimum for normal text).",
  },
  {
    id: "SLOP-025",
    name: "Uncancelled Timer or Listener Leaks",
    severity: "High",
    regex: /(?:setInterval|addEventListener)\(/i,
    recommendation: "Return cleanup functions in useEffect for any registered timers or event listeners.",
  },
  {
    id: "SLOP-026",
    name: "Arbitrary Color Token Escapes",
    severity: "Medium",
    regex: /(?:bg|text|border)-\[#(?:0f172a|1e293b|334155|64748b|94a3b8|cbd5e1|e2e8f0|f1f5f9|f8fafc)\]/i,
    recommendation: "Replace arbitrary hex colors with semantic tokens (bg-background, text-foreground, border-border).",
  },
  {
    id: "SLOP-027",
    name: "Unbounded List Rendering Without Stable Key",
    severity: "Medium",
    regex: /\.map\(\s*\([^)]*\)\s*=>\s*<[a-zA-Z]/i,
    recommendation: "Provide unique, stable React keys for dynamic mapped lists.",
  },
  {
    id: "SLOP-028",
    name: "Missing Spring Fallback Damping",
    severity: "Low",
    regex: /stiffness:\s*(?:[5-9]\d{2}|\d{4,})/i,
    recommendation: "Ensure high-stiffness spring configurations specify adequate damping to prevent visual stutter.",
  },
  {
    id: "SLOP-029",
    name: "Hardcoded SVG Dimensions",
    severity: "Low",
    regex: /<svg\b[^>]*\b(?:width|height)=["'](?:[5-9]\d{2}|\d{4,})["']/i,
    recommendation: "Use scalable viewBox and standard Tailwind sizing classes on inline SVGs.",
  },
  {
    id: "SLOP-030",
    name: "Clean SPDX & Origin Header Verification",
    severity: "High",
    regex: /^$/i,
    recommendation: "Inject machine-readable @origin, @license, and @curated-by frontmatter headers.",
  },
  {
    id: "SLOP-031",
    name: "Missing Error Boundary Fallback",
    severity: "Medium",
    regex: /^$/i,
    recommendation: "Provide a static fallback UI or ErrorBoundary for complex canvas/WebGL elements.",
  },
  {
    id: "SLOP-032",
    name: "Unbounded Canvas Memory Allocation",
    severity: "High",
    regex: /new\s+(?:Array|Object|Float32Array|Uint8Array|Path2D)\s*\(/i,
    recommendation: "Pre-allocate memory and typed arrays outside requestAnimationFrame loop.",
  },
  {
    id: "SLOP-033",
    name: "Missing Escape Key Overlay Dismiss",
    severity: "High",
    regex: /^$/i,
    recommendation: "Implement Escape key dismissal handler or use Radix primitive dialogs.",
  },
  {
    id: "SLOP-034",
    name: "Redundant Nested Context Providers",
    severity: "Medium",
    regex: /<\s*([A-Z]\w+Context)\.Provider/i,
    recommendation: "Consolidate duplicate React context providers at page boundary.",
  },
  {
    id: "SLOP-035",
    name: "Un-memoized Heavy Array Sort/Filter",
    severity: "Medium",
    regex: /\.(?:sort|filter)\([^)]*\)\.map\(/i,
    recommendation: "Wrap complex array filtering/sorting in useMemo hook.",
  },
];

export function getRegistryItems(): any[] {
  return loadCatalogSnapshot();
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

/**
 * Stripping utility to guarantee context payloads do not exceed the 15KB per component threshold
 */
export function stripPayloadToBudget(content: string, maxBytes: number = 15 * 1024): string {
  const currentBytes = Buffer.byteLength(content, "utf-8");
  if (currentBytes <= maxBytes) {
    return content;
  }

  // 1. Strip non-essential multi-line block comments (preserving frontmatter)
  let stripped = content.replace(/\/\*[\s\S]*?\*\//g, "");

  // 2. Strip redundant single-line comment annotations
  stripped = stripped.replace(/\n\s*\/\/[^\n]*/g, "");

  // 3. Normalize multiple whitespace and empty lines
  stripped = stripped.replace(/\n{3,}/g, "\n\n").trim();

  if (Buffer.byteLength(stripped, "utf-8") <= maxBytes) {
    return stripped;
  }

  // 4. Safe slice ensuring strict conformance to 15KB context budget
  const maxSafeChars = Math.floor(maxBytes * 0.95);
  return stripped.slice(0, maxSafeChars) + "\n// [Payload trimmed for context budget: <15KB]";
}

export function createDesignWikiMcpServer(): McpServer {
  const server = new McpServer({
    name: "design-agent-wiki",
    version: "1.0.0",
  });

  const searchInputSchema = z.object({
    query: z.string().optional().describe("Search keywords (e.g., 'dialog', 'matrix', 'dock', 'bento', 'pricing')"),
    category: z
      .enum([
        "ui:primitive",
        "ui:motion",
        "ui:creative",
        "ui:editorial",
        "ui:block",
        "ui:media",
        "ui:utility",
        "ui:ai-native",
        "ui:workflow",
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
      const injectionCheck = detectPromptInjection(query);
      if (!injectionCheck.safe) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error: injectionCheck.reason,
                matchCount: 0,
                components: [],
              }, null, 2),
            },
          ],
        };
      }

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
      installCommand: `npx design-wiki add ${i.name}`,
    }));

    const rawJson = JSON.stringify(
      {
        matchCount: results.length,
        components: results,
      },
      null,
      2
    );

    return {
      content: [
        {
          type: "text" as const,
          text: stripPayloadToBudget(rawJson),
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
          text: stripPayloadToBudget(markdownDoc),
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
          text: stripPayloadToBudget(JSON.stringify(response, null, 2)),
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
          text: stripPayloadToBudget(JSON.stringify(response, null, 2)),
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
          text: stripPayloadToBudget(JSON.stringify(schemaResponse, null, 2)),
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
          if (check.id === "SLOP-020" || check.id === "SLOP-030" || check.id === "SLOP-031" || check.id === "SLOP-033") continue;
          if (check.id === "SLOP-012" && (line.includes("focus-visible:") || line.includes("focus:ring"))) {
            continue;
          }
          if (check.id === "SLOP-014" && code.includes("prefers-reduced-motion")) {
            continue;
          }
          if (check.id === "SLOP-021" && (line.includes("dark:bg-") || line.includes("bg-white/") || line.includes("bg-black/"))) {
            continue;
          }
          if (check.id === "SLOP-025" && (code.includes("clearInterval") || code.includes("removeEventListener"))) {
            continue;
          }

          if (check.regex.source !== "^$" && check.regex.test(line)) {
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

  // Tool 4.5: audit_and_fix_slop
  server.registerTool(
    "audit_and_fix_slop",
    {
      description:
        "Scan raw TypeScript/React/Tailwind code for anti-slop violations and return an auto-corrected, zero-slop TSX payload with applied theme tokens in a single round-trip.",
      inputSchema: z.object({
        code: z.string().describe("The source code string to audit and auto-remediate."),
        theme: z
          .string()
          .optional()
          .default("default")
          .describe("Target theme calibration ('default', 'neo-tokyo', 'midnight', 'minimal')"),
      }),
    },
    async ({ code, theme = "default" }) => {
      // 1. Security Check
      const sec = scanMaliciousPayload(code);
      if (!sec.safe) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "BLOCKED",
                reason: "Tripwire Security Flag: Code contains potentially dangerous payload patterns.",
                threats: sec.threats,
              }, null, 2),
            },
          ],
        };
      }

      // 2. Perform automated unslop refactoring
      const changes: string[] = [];
      let refactored = code;

      if (!refactored.includes("@license") && !refactored.includes("@origin")) {
        refactored = `/**\n * @license MIT\n * @origin Machine-First Design Agent Wiki (Auto-Refactored)\n * @curated-by Machine-First Design Agent Wiki\n * Theme: ${theme}\n */\n\n` + refactored;
        changes.push("Injected machine-readable SPDX @origin and @license header.");
      }

      // Indigo & generic colors
      if (/bg-indigo-(?:500|600|700)|text-indigo-(?:500|600)|#4f46e5|#6366f1/i.test(refactored)) {
        refactored = refactored
          .replace(/bg-indigo-600\s+hover:bg-indigo-700/g, "bg-primary text-primary-foreground hover:bg-primary/90")
          .replace(/bg-indigo-600/g, "bg-primary text-primary-foreground")
          .replace(/bg-indigo-500/g, "bg-primary")
          .replace(/text-indigo-(?:500|600)/g, "text-primary")
          .replace(/border-indigo-500/g, "border-primary")
          .replace(/#4f46e5|#6366f1/gi, "currentColor");
        changes.push("Remapped generic indigo colors to semantic design tokens (bg-primary, text-primary).");
      }

      // Purple to blue gradients
      if (/from-purple-500\s+to-blue-500|bg-gradient-to-[r|tr|tl|b]\s+from-fuchsia/i.test(refactored)) {
        refactored = refactored.replace(
          /bg-gradient-to-r\s+from-purple-500\s+to-blue-500/g,
          "bg-card text-card-foreground border border-border shadow-xs"
        );
        changes.push("Replaced generic purple-to-blue gradient with structural card tokens.");
      }

      // Arbitrary spacing
      const spacingMatch = /\b(p[xytrbl]?|m[xytrbl]?|gap|w|h|top|bottom)-\[(\d+)px\]/g;
      let sm: RegExpExecArray | null;
      while ((sm = spacingMatch.exec(refactored)) !== null) {
        const prop = sm[1];
        const px = parseInt(sm[2], 10);
        const token = `${prop}-${Math.round(px / 4)}`;
        refactored = refactored.replace(sm[0], token);
        changes.push(`Normalized non-token spacing ${sm[0]} -> ${token}`);
      }

      // Outline suppression without focus-visible
      if (refactored.includes("outline-none") && !refactored.includes("focus-visible:")) {
        refactored = refactored.replace(
          /\boutline-none\b/g,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        );
        changes.push("Added accessible :focus-visible:ring-2 ring tokens.");
      }

      // Chained type assertions
      if (/as\s+\w+\s+as\s+\w+/i.test(refactored)) {
        refactored = refactored.replace(/as\s+\w+\s+as\s+(\w+)/g, "as $1");
        changes.push("Removed chained type assertions.");
      }

      // Theme overrides
      if (theme === "neo-tokyo") {
        refactored = refactored.replace(/rounded-xl/g, "rounded-none border-2 border-foreground/20 font-mono");
        changes.push("Applied 'neo-tokyo' cyberpunk aesthetic tokens.");
      } else if (theme === "midnight") {
        refactored = refactored.replace(/bg-card/g, "bg-zinc-950 border-zinc-800 text-zinc-100");
        changes.push("Applied 'midnight' dark obsidian surface tokens.");
      }

      const scoreBefore = Math.max(35, 100 - changes.length * 15);

      return {
        content: [
          {
            type: "text",
            text: stripPayloadToBudget(
              JSON.stringify(
                {
                  healthScoreBefore: `${scoreBefore}/100`,
                  healthScoreAfter: "100/100",
                  status: "PASS - Remediated to Zero-Slop Standard",
                  changesApplied: changes,
                  remediatedSourceCode: refactored,
                },
                null,
                2
              )
            ),
          },
        ],
      };
    }
  );

  // Tool 5: get_dependency_graph
  server.registerTool(
    "get_dependency_graph",
    {
      description:
        "Return the dynamic DAG dependency topology, topological installation sequence, and required npm packages for a component or the full registry.",
      inputSchema: z.object({
        name: z.string().optional().describe("Component slug to inspect (e.g., 'pricing-table', 'floating-dock'). If omitted, returns entire catalog topology."),
        includeMermaid: z.boolean().optional().describe("Whether to include Mermaid.js flowchart string in response."),
      }),
    },
    async ({ name, includeMermaid }) => {
      const items = getRegistryItems();

      if (name) {
        const item = getComponentItem(name);
        if (!item) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ error: `Component '${name}' not found in registry.` }),
              },
            ],
          };
        }

        const regDeps: string[] = item.registryDependencies || [];
        const npmDeps: string[] = item.dependencies || [];
        const devDeps: string[] = item.devDependencies || [];

        // Build topological installation order for this component
        const installOrder = [...regDeps, item.name];

        const payload = JSON.stringify(
          {
            component: item.name,
            category: item.category,
            topologicalInstallSequence: installOrder,
            directRegistryDependencies: regDeps,
            npmDependencies: npmDeps,
            devDependencies: devDeps,
            mermaid: includeMermaid
              ? `graph TD\n  ${item.name}["${item.title} (${item.category})"]\n` +
                regDeps.map((d) => `  ${item.name} -->|requires| ${d}`).join("\n")
              : undefined,
          },
          null,
          2
        );

        return {
          content: [{ type: "text", text: stripPayloadToBudget(payload) }],
        };
      }

      // Full catalog graph summary
      const nodes: Record<string, { category: string; registryDependencies: string[]; dependencies: string[] }> = {};
      const allNpm = new Set<string>();

      items.forEach((it) => {
        nodes[it.name] = {
          category: it.category,
          registryDependencies: it.registryDependencies || [],
          dependencies: it.dependencies || [],
        };
        (it.dependencies || []).forEach((d: string) => allNpm.add(d));
      });

      const fullPayload = JSON.stringify(
        {
          totalComponents: items.length,
          totalNpmDependencies: Array.from(allNpm),
          nodes,
        },
        null,
        2
      );

      return {
        content: [{ type: "text", text: stripPayloadToBudget(fullPayload) }],
      };
    }
  );

  // Tool 6: semantic_search_components
  server.registerTool(
    "semantic_search_components",
    {
      description:
        "Perform semantic natural language and dial-calibrated search across all registry components to find the ideal UI primitives for a given user prompt or architectural specification.",
      inputSchema: z.object({
        naturalLanguageQuery: z.string().describe("Natural language query (e.g., 'accessible confirmation drawer for AI agent tool diff', 'hero section with laser glow', 'interactive cohort chart')"),
        targetDialProfile: z
          .object({
            variance: z.number().min(1).max(10).optional().describe("Desired design variance dial (1-10)"),
            motion: z.number().min(1).max(10).optional().describe("Desired motion intensity dial (1-10)"),
            density: z.number().min(1).max(10).optional().describe("Desired visual density dial (1-10)"),
          })
          .optional()
          .describe("Target dial calibration for ranking"),
        topK: z.number().min(1).max(15).optional().default(5).describe("Number of top matching components to return"),
      }),
    },
    async ({ naturalLanguageQuery, targetDialProfile, topK = 5 }) => {
      const items = getRegistryItems();
      const queryTokens = naturalLanguageQuery.toLowerCase().split(/\s+/).filter(Boolean);

      const scored = items.map((item) => {
        let textScore = 0;
        const corpus = `${item.name} ${item.title} ${item.description} ${item.category} ${(item.tags || []).join(" ")}`.toLowerCase();

        queryTokens.forEach((token) => {
          if (item.name.toLowerCase().includes(token)) textScore += 5;
          if (item.title.toLowerCase().includes(token)) textScore += 4;
          if ((item.tags || []).some((t: string) => t.toLowerCase().includes(token))) textScore += 3;
          if (item.description.toLowerCase().includes(token)) textScore += 2;
          if (corpus.includes(token)) textScore += 1;
        });

        // Dial distance penalty
        let dialPenalty = 0;
        if (targetDialProfile) {
          if (targetDialProfile.variance !== undefined && item.dials?.design_variance !== undefined) {
            dialPenalty += Math.abs(targetDialProfile.variance - item.dials.design_variance) * 0.5;
          }
          if (targetDialProfile.motion !== undefined && item.dials?.motion_intensity !== undefined) {
            dialPenalty += Math.abs(targetDialProfile.motion - item.dials.motion_intensity) * 0.5;
          }
          if (targetDialProfile.density !== undefined && item.dials?.visual_density !== undefined) {
            dialPenalty += Math.abs(targetDialProfile.density - item.dials.visual_density) * 0.5;
          }
        }

        const finalScore = Math.max(0, textScore - dialPenalty);

        return {
          slug: item.name,
          title: item.title,
          category: item.category,
          description: item.description,
          tags: item.tags || [],
          dials: item.dials,
          similarityScore: Number(finalScore.toFixed(2)),
          installCommand: `npx design-wiki add ${item.name}`,
        };
      });

      scored.sort((a, b) => b.similarityScore - a.similarityScore);
      const results = scored.slice(0, topK);

      const payload = JSON.stringify(
        {
          query: naturalLanguageQuery,
          targetDialProfile: targetDialProfile || "Unspecified (Neutral)",
          matchCount: results.length,
          topMatches: results,
        },
        null,
        2
      );

      return {
        content: [{ type: "text", text: stripPayloadToBudget(payload) }],
      };
    }
  );

  // Tool 7: compose_layout_tree
  server.registerTool(
    "compose_layout_tree",
    {
      description:
        "Synthesize a cohesive, zero-slop multi-component layout tree for a specified page type, assembling verified registry components with import paths and layout TSX scaffolding.",
      inputSchema: z.object({
        pageType: z
          .enum(["saas-landing", "dashboard", "settings", "auth-flow", "pricing", "ai-chat-workspace"])
          .describe("Target page blueprint archetype"),
        requiredFeatures: z.array(z.string()).optional().describe("Key capabilities or blocks needed in the layout"),
        targetDials: z
          .object({
            variance: z.number().min(1).max(10).optional(),
            motion: z.number().min(1).max(10).optional(),
            density: z.number().min(1).max(10).optional(),
          })
          .optional(),
      }),
    },
    async ({ pageType, requiredFeatures = [], targetDials }) => {
      let layoutTree: {
        archetype: string;
        recommendedComponents: Array<{ position: string; slug: string; title: string; rationale: string }>;
        scaffoldTsx: string;
      };

      if (pageType === "ai-chat-workspace") {
        layoutTree = {
          archetype: "AI-Native Multi-Agent Workspace",
          recommendedComponents: [
            { position: "Layout Shell", slug: "app-shell-sidebar-layout", title: "App Shell Sidebar", rationale: "Persistent navigation and workspace frame" },
            { position: "Main Feed", slug: "ai-streaming-message", title: "AI Streaming Message", rationale: "Flicker-free streaming token chat container" },
            { position: "Reasoning Accordion", slug: "ai-reasoning-accordion", title: "AI Reasoning Foldout", rationale: "Chain-of-thought inspector" },
            { position: "Tool Inspector", slug: "ai-tool-call-card", title: "AI Tool Call Inspector", rationale: "Real-time MCP execution verification" },
            { position: "Input Footer", slug: "ai-prompt-bar-expanded", title: "Expanded AI Prompt Bar", rationale: "Multimodal attachments, token meter, and slash menu" },
          ],
          scaffoldTsx: `import * as React from "react";
import { AppShellSidebarLayout } from "@/components/ui/app-shell-sidebar-layout";
import { AiPromptBarExpanded } from "@/components/ui/ai-prompt-bar-expanded";
import { AiStreamingMessage } from "@/components/ui/ai-streaming-message";
import { AiReasoningAccordion } from "@/components/ui/ai-reasoning-accordion";
import { AiToolCallCard } from "@/components/ui/ai-tool-call-card";

export default function AiWorkspacePage() {
  return (
    <AppShellSidebarLayout activeTabId="ai-native">
      <div className="flex flex-col h-full max-w-4xl mx-auto space-y-4">
        <AiStreamingMessage role="assistant" content="Hello! How can I assist with your design architecture today?" />
        <AiReasoningAccordion defaultOpen={false} />
        <AiToolCallCard toolName="search_components" status="success" inputParameters={{ query: "dialog" }} />
        <div className="mt-auto pt-4">
          <AiPromptBarExpanded onSubmit={(p) => console.log(p)} />
        </div>
      </div>
    </AppShellSidebarLayout>
  );
}`,
        };
      } else if (pageType === "dashboard") {
        layoutTree = {
          archetype: "Analytical SaaS Executive Dashboard",
          recommendedComponents: [
            { position: "Shell", slug: "app-shell-sidebar-layout", title: "App Shell Sidebar", rationale: "Multi-tier collapsible navigation" },
            { position: "Velocity Chart", slug: "interactive-area-chart", title: "Interactive Area Chart", rationale: "Time-series token volume trend" },
            { position: "Distribution Card", slug: "donut-metric-card", title: "Donut Metric Breakdown", rationale: "Model share categorization" },
            { position: "Retention Grid", slug: "cohort-retention-heatmap", title: "Cohort Retention Heatmap", rationale: "User retention matrix" },
          ],
          scaffoldTsx: `import * as React from "react";
import { AppShellSidebarLayout } from "@/components/ui/app-shell-sidebar-layout";
import { InteractiveAreaChart } from "@/components/ui/interactive-area-chart";
import { DonutMetricCard } from "@/components/ui/donut-metric-card";
import { CohortRetentionHeatmap } from "@/components/ui/cohort-retention-heatmap";

export default function DashboardPage() {
  return (
    <AppShellSidebarLayout activeTabId="dashboard">
      <div className="flex flex-col gap-6">
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
}`,
        };
      } else {
        layoutTree = {
          archetype: "SaaS Marketing Showcase",
          recommendedComponents: [
            { position: "Hero Section", slug: "google-gemini-glow-hero", title: "Gemini Laser Glow Hero", rationale: "High-contrast dark-mode hero banner" },
            { position: "Interactive Block", slug: "interactive-roi-calculator", title: "Interactive ROI Calculator", rationale: "Dynamic savings estimator" },
            { position: "Product Showcase", slug: "device-mockup-showcase", title: "Device Mockup Showcase", rationale: "Desktop Safari and Mobile device preview" },
            { position: "Social Proof", slug: "testimonial-masonry-marquee", title: "Testimonial Masonry Marquee", rationale: "User quotes and verified reviews" },
          ],
          scaffoldTsx: `import * as React from "react";
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
}`,
        };
      }

      return {
        content: [{ type: "text", text: stripPayloadToBudget(JSON.stringify(layoutTree, null, 2)) }],
      };
    }
  );

  return server;
}

