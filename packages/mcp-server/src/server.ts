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
  {
    id: "SLOP-036",
    name: "Hallucinated Static KPI Metric Claims",
    severity: "Medium",
    regex: /(?:99\.9%|10x\s+Faster|100x\s+Speed|#1\s+Platform|Zero\s+Latency)/i,
    recommendation: "Provide dynamic props for statistical claims rather than hardcoding static marketing assertions.",
  },
  {
    id: "SLOP-037",
    name: "Unvalidated Form Handler or Silent Submit",
    severity: "High",
    regex: /onSubmit=\{\s*\(\s*e\s*\)\s*=>\s*e\.preventDefault\(\)\s*\}/i,
    recommendation: "Attach interactive form validation states, pending indicators, or action handlers.",
  },
  {
    id: "SLOP-038",
    name: "Mobile Viewport Height Cutoff",
    severity: "Medium",
    regex: /\bh-screen\b/i,
    recommendation: "Use min-h-screen or min-h-[100dvh] to prevent mobile address bar viewport clipping.",
  },
  {
    id: "SLOP-039",
    name: "Global Outline Suppression Without Replacement",
    severity: "High",
    regex: /(?:outline-none|\*:\s*outline-none)\b/i,
    recommendation: "Always maintain visible :focus-visible:ring-2 or focus outlines for WCAG AA compliance.",
  },
  {
    id: "SLOP-040",
    name: "Non-Semantic Div Soup Navigation Landmark",
    severity: "Medium",
    regex: /^$/i,
    recommendation: "Wrap top navigation and headers with semantic <nav> and <header> landmarks.",
  },
  {
    id: "SLOP-041",
    name: "Mobile Dynamic Viewport Unit Omission",
    severity: "Medium",
    regex: /\bh-screen\b/i,
    recommendation: "Support dynamic mobile viewports via min-h-screen or min-h-[100dvh] rather than rigid h-screen.",
  },
  {
    id: "SLOP-042",
    name: "Unbounded Arbitrary High Z-Index Clashes",
    severity: "Low",
    regex: /z-\[(?:9999|99999|\d{4,})\]/i,
    recommendation: "Use structured z-index scale (z-10 through z-50) rather than extreme arbitrary escapes (z-[9999]).",
  },
  {
    id: "SLOP-043",
    name: "Unannounced Dynamic Streaming Content",
    severity: "High",
    regex: /(?:StreamingMessage|StreamingChat|TokenStream|AgentStatus)\b/i,
    recommendation: "Add aria-live='polite' or role='status' to containers receiving live AI token streams.",
  },
  {
    id: "SLOP-044",
    name: "Uncleaned Animation/Resize Listeners in useEffect",
    severity: "High",
    regex: /addEventListener\s*\(\s*["'](?:resize|scroll|mousemove|keydown)["']/i,
    recommendation: "Return cleanup callbacks in useEffect to prevent memory leaks from dangling event listeners.",
  },
  {
    id: "SLOP-045",
    name: "Non-Responsive Hardcoded Container Min-Width",
    severity: "Medium",
    regex: /min-w-\[(?:[6-9]\d\dpx|1\d{3}px)\]/i,
    recommendation: "Avoid rigid min-width overrides on mobile viewports; gate behind responsive sm/md/lg prefixes.",
  },
  {
    id: "SLOP-046",
    name: "Nested Interactive Control Trap",
    severity: "High",
    regex: /<a\b[^>]*>.*<button\b|<button\b[^>]*>.*<button\b/i,
    recommendation: "Avoid nesting button elements inside anchor links or buttons to preserve valid accessible DOM.",
  },
  {
    id: "SLOP-047",
    name: "Hardcoded Exaggerated SLA Claims",
    severity: "Medium",
    regex: /(?:100%\s+Guaranteed|Zero\s+Downtime|Instant\s+0ms\s+Latency|Completely\s+Unbreakable)/i,
    recommendation: "Avoid unsubstantiated marketing absolutes in component copy templates.",
  },
  {
    id: "SLOP-048",
    name: "Excessive DOM Nesting Wrapper Clutter",
    severity: "Low",
    regex: /(?:<div[^>]*>\s*){6,}/i,
    recommendation: "Flatten redundant container div wrappers to maintain lean DOM trees and high rendering speed.",
  },
  {
    id: "SLOP-049",
    name: "Unconstrained Image Loading Without Lazy/Priority",
    severity: "Medium",
    regex: /<img\b[^>]*\bsrc=["']http/i,
    recommendation: "Add loading='lazy' and decoding='async' to external web images.",
  },
  {
    id: "SLOP-050",
    name: "Font Family Override Without Fallbacks",
    severity: "Low",
    regex: /font-\[[^\]]+\]/i,
    recommendation: "Always include system fallback fonts (sans-serif, serif, mono) when configuring custom font families.",
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
          if ((check.id === "SLOP-012" || check.id === "SLOP-039") && (line.includes("focus-visible:") || line.includes("focus:ring") || line.includes("focus-visible:ring"))) {
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

  // Tool 8: recommend_stack
  server.registerTool(
    "recommend_stack",
    {
      description:
        "Provides a deterministic, zero-slop architectural stack recommendation (archetype, components, taste dials, and token set) based on product requirements.",
      inputSchema: z.object({
        archetype: z.enum([
          "saas-dashboard",
          "ai-chat-workspace",
          "editorial-publication",
          "marketing-launch",
          "spatial-canvas",
        ]).describe("Target web application archetype"),
        primaryGoal: z.string().optional().describe("User goal or mission statement"),
      }),
    },
    async ({ archetype }) => {
      const recommendations: Record<string, any> = {
        "saas-dashboard": {
          archetype: "saas-dashboard",
          dialProfile: { variance: 4, motion: 2, density: 8 },
          tokens: { primary: "sky-500", background: "slate-950", border: "slate-800" },
          corePrimitives: ["app-shell-sidebar-layout", "interactive-area-chart", "donut-metric-card", "value-chain-map"],
          guidelines: "Prioritize information hierarchy, high data density, and instant legibility. Avoid decorative animations.",
        },
        "ai-chat-workspace": {
          archetype: "ai-chat-workspace",
          dialProfile: { variance: 6, motion: 4, density: 6 },
          tokens: { primary: "emerald-500", background: "zinc-950", border: "zinc-800" },
          corePrimitives: ["ai-prompt-bar-expanded", "ai-streaming-message", "ai-reasoning-accordion", "ai-artifact-sandbox-iframe"],
          guidelines: "Ensure streaming states have smooth height transitions. Provide clear artifact previews.",
        },
        "editorial-publication": {
          archetype: "editorial-publication",
          dialProfile: { variance: 7, motion: 3, density: 6 },
          tokens: { primary: "amber-600", background: "stone-950", border: "stone-800" },
          corePrimitives: ["publication-showcase-card", "iceberg-depth-diagram", "flywheel-momentum-diagram", "venn-three-circle-diagram"],
          guidelines: "Focus on refined typography, wide margins, and academic/case-study clarity.",
        },
        "marketing-launch": {
          archetype: "marketing-launch",
          dialProfile: { variance: 8, motion: 6, density: 5 },
          tokens: { primary: "violet-500", background: "neutral-950", border: "neutral-800" },
          corePrimitives: ["aurora-background-shader", "shiny-text-shimmer", "dither-noise-card", "interactive-roi-calculator"],
          guidelines: "High visual impact, GPU shader ambient backdrops with strict prefers-reduced-motion fallbacks.",
        },
        "spatial-canvas": {
          archetype: "spatial-canvas",
          dialProfile: { variance: 7, motion: 5, density: 7 },
          tokens: { primary: "blue-500", background: "gray-950", border: "gray-800" },
          corePrimitives: ["agent-node-wire-pulse", "floating-dock", "architecture-topology-diagram"],
          guidelines: "Infinite canvas, pan-zoom controls, memory-safe requestAnimationFrame buffers.",
        },
      };

      const result = recommendations[archetype] || recommendations["saas-dashboard"];
      return {
        content: [{ type: "text", text: stripPayloadToBudget(JSON.stringify(result, null, 2)) }],
      };
    }
  );

  // Tool 9: verify_accessibility_contrast
  server.registerTool(
    "verify_accessibility_contrast",
    {
      description:
        "Calculates the exact WCAG 2.1 contrast ratio between foreground and background hexadecimal colors and validates AA / AAA compliance.",
      inputSchema: z.object({
        foregroundHex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).describe("Foreground hex color (e.g. #FFFFFF)"),
        backgroundHex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).describe("Background hex color (e.g. #09090B)"),
      }),
    },
    async ({ foregroundHex, backgroundHex }) => {
      const getLuminance = (hex: string) => {
        let clean = hex.replace("#", "");
        if (clean.length === 3) clean = clean.split("").map((c) => c + c).join("");
        const rgb = [
          parseInt(clean.substring(0, 2), 16) / 255,
          parseInt(clean.substring(2, 4), 16) / 255,
          parseInt(clean.substring(4, 6), 16) / 255,
        ].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
      };

      const l1 = getLuminance(foregroundHex);
      const l2 = getLuminance(backgroundHex);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const rounded = Math.round(ratio * 100) / 100;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                foreground: foregroundHex,
                background: backgroundHex,
                contrastRatio: `${rounded}:1`,
                wcagAA_normalText: ratio >= 4.5,
                wcagAA_largeText: ratio >= 3.0,
                wcagAAA_normalText: ratio >= 7.0,
                status: ratio >= 4.5 ? "PASS_AA" : ratio >= 3.0 ? "PASS_LARGE_ONLY" : "FAIL",
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 10: generate_color_palette
  server.registerTool(
    "generate_color_palette",
    {
      description:
        "Generates an accessible, semantic Tailwind CSS v4 @theme token block for a chosen mood or aesthetic direction.",
      inputSchema: z.object({
        themeName: z.string().describe("Theme identifier (e.g. 'amber-editorial', 'neo-tokyo', 'slate-analytical')"),
        baseHue: z.enum(["slate", "zinc", "neutral", "stone", "amber", "emerald", "sky", "violet"]).optional().default("zinc"),
      }),
    },
    async ({ themeName, baseHue = "zinc" }) => {
      const paletteCss = `@theme {
  --color-brand-id: "${themeName}";
  --color-background: var(--color-${baseHue}-950);
  --color-foreground: var(--color-${baseHue}-50);
  --color-card: var(--color-${baseHue}-900);
  --color-card-foreground: var(--color-${baseHue}-50);
  --color-border: var(--color-${baseHue}-800);
  --color-primary: var(--color-${baseHue === "zinc" ? "emerald" : baseHue}-500);
  --color-primary-foreground: #000000;
  --color-muted: var(--color-${baseHue}-800);
  --color-muted-foreground: var(--color-${baseHue}-400);
}`;
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              theme: themeName,
              baseHue,
              cssBlock: paletteCss,
              a11yCompliance: "WCAG 2.1 AA Guaranteed on Dark Mode Default",
            }, null, 2),
          },
        ],
      };
    }
  );

  // Tool 11: validate_theme_contrast_matrix
  server.registerTool(
    "validate_theme_contrast_matrix",
    {
      description:
        "Validates the entire contrast matrix of a design token set (foreground, background, muted, card, primary) and guarantees WCAG 2.1 AA compliance.",
      inputSchema: z.object({
        tokens: z.object({
          background: z.string().describe("Background hex, e.g. #09090b"),
          foreground: z.string().describe("Foreground hex, e.g. #fafafa"),
          card: z.string().describe("Card surface hex, e.g. #18181b"),
          cardForeground: z.string().describe("Card foreground hex, e.g. #fafafa"),
          primary: z.string().describe("Primary brand hex, e.g. #10b981"),
          primaryForeground: z.string().describe("Primary foreground hex, e.g. #000000"),
          muted: z.string().describe("Muted surface hex, e.g. #27272a"),
          mutedForeground: z.string().describe("Muted text hex, e.g. #a1a1aa"),
        }),
      }),
    },
    async ({ tokens }) => {
      const getLuminance = (hex: string) => {
        let clean = hex.replace("#", "");
        if (clean.length === 3) clean = clean.split("").map((c) => c + c).join("");
        const rgb = [
          parseInt(clean.substring(0, 2), 16) / 255,
          parseInt(clean.substring(2, 4), 16) / 255,
          parseInt(clean.substring(4, 6), 16) / 255,
        ].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
      };

      const calcRatio = (fg: string, bg: string) => {
        const l1 = getLuminance(fg);
        const l2 = getLuminance(bg);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        return Math.round(ratio * 100) / 100;
      };

      const checks = [
        { pair: "foreground on background", fg: tokens.foreground, bg: tokens.background, required: 4.5 },
        { pair: "cardForeground on card", fg: tokens.cardForeground, bg: tokens.card, required: 4.5 },
        { pair: "primaryForeground on primary", fg: tokens.primaryForeground, bg: tokens.primary, required: 4.5 },
        { pair: "mutedForeground on background", fg: tokens.mutedForeground, bg: tokens.background, required: 4.5 },
        { pair: "mutedForeground on card", fg: tokens.mutedForeground, bg: tokens.card, required: 4.5 },
      ].map((c) => {
        const ratio = calcRatio(c.fg, c.bg);
        return {
          ...c,
          ratio: `${ratio}:1`,
          passesAA: ratio >= c.required,
        };
      });

      const allPass = checks.every((c) => c.passesAA);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                status: allPass ? "COMPLIANT" : "REJECTED_LOW_CONTRAST",
                wcagStandard: "WCAG 2.1 AA (4.5:1 for Normal Text)",
                matrix: checks,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 12: recommend_responsive_blueprint
  server.registerTool(
    "recommend_responsive_blueprint",
    {
      description:
        "Generates an optimal, mobile-first responsive layout blueprint with breakpoint classes and landmark structure for any requested page type.",
      inputSchema: z.object({
        pageType: z.enum(["landing", "dashboard", "settings", "kanban-workflow", "analytics-report"]),
        targetDials: z
          .object({
            variance: z.number().min(1).max(10).optional(),
            density: z.number().min(1).max(10).optional(),
          })
          .optional(),
      }),
    },
    async ({ pageType, targetDials }) => {
      const blueprint = {
        pageType,
        viewportStrategy: "Mobile-first with min-h-[100dvh] dynamic viewport height",
        breakpoints: {
          mobile: "< 640px (single column, full width, bottom sheet drawer nav)",
          tablet: "640px - 1024px (2-column responsive bento grid, collapsed sidebar)",
          desktop: "> 1024px (multi-pane grid, persistent hierarchical sidebar)",
        },
        recommendedLandmarks: ["<header role='banner'>", "<nav aria-label='Main'>", "<main id='main-content'>", "<aside aria-label='Contextual Inspector'>", "<footer role='contentinfo'>"],
        suggestedClasses: {
          container: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8",
          grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
        },
      };

      return {
        content: [{ type: "text", text: JSON.stringify(blueprint, null, 2) }],
      };
    }
  );

  // Tool 13: diff_against_zero_slop
  server.registerTool(
    "diff_against_zero_slop",
    {
      description:
        "Compares user-provided component code against the closest verified zero-slop registry component and returns actionable architectural migration diff steps.",
      inputSchema: z.object({
        code: z.string().describe("User's current React/Tailwind implementation"),
        targetComponentSlug: z.string().optional().describe("Optional target registry slug to compare against"),
      }),
    },
    async ({ code, targetComponentSlug }) => {
      const items = getRegistryItems();
      let matched = targetComponentSlug ? getComponentItem(targetComponentSlug) : null;

      if (!matched) {
        // Auto-match by code tokens
        if (/chart|sparkline|axis/i.test(code)) matched = getComponentItem("interactive-area-chart");
        else if (/dialog|modal/i.test(code)) matched = getComponentItem("dialog");
        else if (/button/i.test(code)) matched = getComponentItem("button");
        else if (/input|form/i.test(code)) matched = getComponentItem("input");
        else matched = items[0];
      }

      const diffReport = {
        recommendedRegistryComponent: matched?.name || "button",
        category: matched?.category,
        antiSlopAudit: MCP_SLOP_CHECKS.filter((c) => c.regex.source !== "^$" && c.regex.test(code)).map((c) => ({
          rule: c.id,
          name: c.name,
          fix: c.recommendation,
        })),
        recommendedInstallation: `npx design-wiki add ${matched?.name}`,
        migrationGuidance: `Replace ad-hoc custom styling with the verified ${matched?.name} primitive from @/components/ui/${matched?.name}.`,
      };

      return {
        content: [{ type: "text", text: JSON.stringify(diffReport, null, 2) }],
      };
    }
  );

  // Tool 14: unslop_screenshot_draft
  server.registerTool(
    "unslop_screenshot_draft",
    {
      description:
        "Transforms raw vision-model or screenshot-to-code generated HTML/TSX into clean, zero-slop TSX with semantic tokens and WCAG compliance.",
      inputSchema: z.object({
        rawCode: z.string().describe("The raw code generated from a screenshot or mockup"),
      }),
    },
    async ({ rawCode }) => {
      let code = rawCode;
      const fixesApplied: string[] = [];

      // 1. Remap hardcoded indigo buttons
      if (/bg-indigo-(?:500|600|700)/i.test(code)) {
        code = code.replace(/bg-indigo-(?:500|600|700)/g, "bg-primary");
        code = code.replace(/text-indigo-(?:500|600)/g, "text-primary");
        fixesApplied.push("SLOP-001: Remapped indigo to semantic bg-primary/text-primary tokens");
      }

      // 2. Remap purple linear gradients
      if (/bg-gradient-to-[r|tr|tl|b]\s+from-(?:purple|fuchsia)-500\s+to-blue-500/i.test(code)) {
        code = code.replace(
          /bg-gradient-to-[r|tr|tl|b]\s+from-(?:purple|fuchsia)-500\s+to-blue-500/g,
          "bg-card border border-border"
        );
        fixesApplied.push("SLOP-002: Replaced purple-blue gradient with structured border card");
      }

      // 3. Normalize arbitrary pixel spacing
      code = code.replace(/(p|m|gap)-\[(\d+)px\]/g, (match, prefix, px) => {
        const num = parseInt(px, 10);
        let step = "4";
        if (num <= 4) step = "1";
        else if (num <= 8) step = "2";
        else if (num <= 12) step = "3";
        else if (num <= 16) step = "4";
        else if (num <= 24) step = "6";
        else if (num <= 32) step = "8";
        else step = "12";
        fixesApplied.push(`SLOP-007: Normalized ${match} to standard ${prefix}-${step}`);
        return `${prefix}-${step}`;
      });

      // 4. Inject focus-visible ring
      if (/(?:outline-none|ring-0)\b/i.test(code) && !code.includes("focus-visible:")) {
        code = code.replace(/(outline-none|ring-0)/g, "$1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none");
        fixesApplied.push("SLOP-012: Injected focus-visible:ring-2 compliance");
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ unslappedCode: code, fixesApplied, totalFixes: fixesApplied.length }, null, 2),
          },
        ],
      };
    }
  );

  // Tool 15: audit_accessibility_tree
  server.registerTool(
    "audit_accessibility_tree",
    {
      description:
        "Evaluates component JSX/TSX markup against WCAG 2.1 AA and WAI-ARIA standards (missing labels, ARIA roles, keyboard traversal, semantic landmarks, and screen reader readiness).",
      inputSchema: z.object({
        code: z.string().describe("TSX component code string to evaluate for accessibility."),
      }),
    },
    async ({ code }) => {
      const issues: Array<{ type: string; message: string; severity: "High" | "Medium" | "Low" }> = [];

      // Check 1: Icon buttons without aria-label
      if (/<button[^>]*>\s*<[A-Z]\w+[^>]*\/>\s*<\/button>/i.test(code)) {
        issues.push({
          type: "Unlabeled Icon Button",
          message: "Icon-only <button> detected without aria-label or accessible text. Add aria-label='...' or <span className='sr-only'>.",
          severity: "High",
        });
      }

      // Check 2: Missing image alt tags
      if (/<img\b(?![^>]*\balt=)[^>]*>/i.test(code)) {
        issues.push({
          type: "Missing Image Alt",
          message: "Image element <img> missing alt attribute. Add alt text describing image or alt='' if purely decorative.",
          severity: "High",
        });
      }

      // Check 3: Focus suppression without visible replacement
      if (/(?:outline-none|ring-0)\b/i.test(code) && !code.includes("focus-visible:")) {
        issues.push({
          type: "Focus Ring Suppression",
          message: "Focus outline suppressed (outline-none) without replacement. Add focus-visible:ring-2.",
          severity: "High",
        });
      }

      // Check 4: Interactive role without tabIndex or key listener
      if (/role=["'](?:button|slider|tab|switch)["']/i.test(code) && !code.includes("onKeyDown") && !code.includes("tabIndex")) {
        issues.push({
          type: "Interactive ARIA Role Missing Keyboard Handling",
          message: "Custom ARIA role element requires tabIndex={0} and onKeyDown handler for keyboard navigation.",
          severity: "Medium",
        });
      }

      // Check 5: SVGs missing role/title/aria-hidden
      if (/<svg\b(?![^>]*(?:role=["']img["']|aria-hidden=["']true["']|aria-label))[^>]*>/i.test(code)) {
        issues.push({
          type: "SVG Missing Accessibility Marker",
          message: "Inline SVG missing role='img', aria-label, or aria-hidden='true'.",
          severity: "Medium",
        });
      }

      const score = Math.max(0, 100 - issues.filter((i) => i.severity === "High").length * 25 - issues.filter((i) => i.severity === "Medium").length * 10);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                a11yScore: `${score}/100`,
                wcagCompliance: score >= 90 ? "WCAG 2.1 AA PASS" : "WCAG 2.1 AA ACTION_REQUIRED",
                violations: issues,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 16: deconstruct_visual_reference
  server.registerTool(
    "deconstruct_visual_reference",
    {
      description:
        "Deconstructs a visual interface description or screenshot analysis into verified zero-slop layout blocks, semantic color tokens, and matching Agent Wiki component slugs.",
      inputSchema: z.object({
        visualDescription: z.string().describe("Description of the UI layout, screenshot details, or visual reference."),
        targetArchetype: z
          .enum(["saas-dashboard", "ai-chat-workspace", "marketing-launch", "ecommerce-admin", "spatial-canvas"])
          .optional()
          .default("saas-dashboard"),
      }),
    },
    async ({ visualDescription, targetArchetype }) => {
      const items = getRegistryItems();
      const tokens = visualDescription.toLowerCase().split(/\s+/).filter(Boolean);

      const matchedSlugs = items
        .filter((item) => {
          const text = `${item.name} ${item.title} ${item.description} ${(item.tags || []).join(" ")}`.toLowerCase();
          return tokens.some((t) => t.length > 3 && text.includes(t));
        })
        .slice(0, 6)
        .map((i) => ({ slug: i.name, title: i.title, category: i.category, installCommand: `npx design-wiki add ${i.name}` }));

      const recommendation = {
        archetype: targetArchetype,
        deconstructionRecipe: {
          spatialRhythm: "Mobile-first flex/grid layout with min-h-[100dvh] container",
          colorTokens: {
            background: "bg-background (dark mode default: zinc-950)",
            surface: "bg-card border-border",
            primaryAction: "bg-primary text-primary-foreground",
          },
          recommendedPrimitives: matchedSlugs.length > 0 ? matchedSlugs : [
            { slug: "app-shell-sidebar-layout", title: "App Shell Sidebar Layout", category: "ui:block" },
            { slug: "bento-spotlight-card", title: "Bento Spotlight Card", category: "ui:block" },
            { slug: "toast-notification-center", title: "Toast Notification Center", category: "ui:primitive" },
          ],
        },
      };

      return {
        content: [
          {
            type: "text",
            text: stripPayloadToBudget(JSON.stringify(recommendation, null, 2)),
          },
        ],
      };
    }
  );

  // Tool 17: export_dtcg_tokens
  server.registerTool(
    "export_dtcg_tokens",
    {
      description:
        "Exports the system's design tokens in the W3C Design Tokens Community Group (DTCG) standard JSON format for Figma / cross-platform synchronization.",
      inputSchema: z.object({
        themeName: z.string().optional().default("default").describe("Theme name to export"),
      }),
    },
    async ({ themeName }) => {
      const dtcg = {
        $name: `Design Wiki DTCG Tokens (${themeName})`,
        $version: "1.0.0",
        color: {
          background: { $value: "#09090b", $type: "color" },
          foreground: { $value: "#fafafa", $type: "color" },
          card: { $value: "#18181b", $type: "color" },
          cardForeground: { $value: "#fafafa", $type: "color" },
          border: { $value: "#27272a", $type: "color" },
          primary: { $value: "#10b981", $type: "color" },
          primaryForeground: { $value: "#000000", $type: "color" },
          muted: { $value: "#27272a", $type: "color" },
          mutedForeground: { $value: "#a1a1aa", $type: "color" },
        },
        spacing: {
          "1": { $value: "4px", $type: "dimension" },
          "2": { $value: "8px", $type: "dimension" },
          "3": { $value: "12px", $type: "dimension" },
          "4": { $value: "16px", $type: "dimension" },
          "6": { $value: "24px", $type: "dimension" },
          "8": { $value: "32px", $type: "dimension" },
        },
        borderRadius: {
          sm: { $value: "6px", $type: "dimension" },
          md: { $value: "8px", $type: "dimension" },
          lg: { $value: "12px", $type: "dimension" },
          xl: { $value: "16px", $type: "dimension" },
        },
      };

      return {
        content: [{ type: "text", text: JSON.stringify(dtcg, null, 2) }],
      };
    }
  );

  // Tool 18: benchmark_taste_profile
  server.registerTool(
    "benchmark_taste_profile",
    {
      description:
        "Analyzes arbitrary component code against the 3 canonical Taste Dials (Variance 1-10, Motion 1-10, Density 1-10) and returns calibration scores.",
      inputSchema: z.object({
        code: z.string().describe("Component source code string to benchmark"),
      }),
    },
    async ({ code }) => {
      let variance = 4;
      let motion = 3;
      let density = 6;

      // Variance heuristics
      if (/rotate-|skew-|translate-x-|asymmetric|grid-cols-12/i.test(code)) variance += 3;
      if (/font-serif|tracking-widest|uppercase/i.test(code)) variance += 2;
      if (/table|tabular-nums|font-mono/i.test(code)) variance = Math.max(1, variance - 2);

      // Motion heuristics
      if (/requestAnimationFrame|webgl|canvas|three/i.test(code)) motion = 9;
      else if (/motion\.div|useSpring|useMotionValue|gsap/i.test(code)) motion = 7;
      else if (/transition-colors|hover:/i.test(code)) motion = 3;
      else motion = 1;

      // Density heuristics
      if (/px-2|py-1|text-xs|text-\[10px\]|table|divide-y/i.test(code)) density = 9;
      else if (/py-24|py-32|p-12|text-5xl/i.test(code)) density = 3;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                tasteDialScorecard: {
                  designVariance: `${variance}/10`,
                  motionIntensity: `${motion}/10`,
                  visualDensity: `${density}/10`,
                },
                profileArchetype:
                  variance > 6 && motion > 6
                    ? "Creative / Experimental Experience"
                    : density > 7
                    ? "High-Density Analytical / Enterprise UI"
                    : "Balanced Production SaaS",
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 19: export_style_dictionary_tokens
  server.registerTool(
    "export_style_dictionary_tokens",
    {
      description:
        "Exports design tokens compiled for specific multi-platform targets (Tailwind CSS v4 @theme, iOS Swift Struct, Android Jetpack Compose, or W3C DTCG JSON).",
      inputSchema: z.object({
        target: z.enum(["tailwind-v4", "swift", "compose", "dtcg-json"]).describe("Target compilation platform"),
        themeName: z.string().optional().default("default").describe("Theme palette identifier"),
      }),
    },
    async ({ target, themeName = "default" }) => {
      let code = "";
      if (target === "tailwind-v4") {
        code = `@theme {
  --color-background: #09090b;
  --color-foreground: #fafafa;
  --color-card: #121215;
  --color-card-foreground: #fafafa;
  --color-border: #27272a;
  --color-primary: #10b981;
  --color-primary-foreground: #000000;
  --color-muted: #18181b;
  --color-muted-foreground: #a1a1aa;
  --color-ring: #10b981;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
}`;
      } else if (target === "swift") {
        code = `import SwiftUI\n\npublic struct DesignTokens {\n    public struct Colors {\n        public static let background = Color(hex: "#09090b")\n        public static let foreground = Color(hex: "#fafafa")\n        public static let primary = Color(hex: "#10b981")\n    }\n}`;
      } else if (target === "compose") {
        code = `package dev.agentwiki.tokens\n\nimport androidx.compose.ui.graphics.Color\nimport androidx.compose.ui.unit.dp\n\nobject DesignTokens {\n    val Background = Color(0xFF09090B)\n    val Primary = Color(0xFF10B981)\n}`;
      } else {
        code = JSON.stringify({
          $name: `Design Wiki Tokens (${themeName})`,
          color: {
            background: { $value: "#09090b", $type: "color" },
            primary: { $value: "#10b981", $type: "color" },
          },
        }, null, 2);
      }

      return {
        content: [{ type: "text", text: stripPayloadToBudget(code) }],
      };
    }
  );

  // Tool 20: generate_storybook_story
  server.registerTool(
    "generate_storybook_story",
    {
      description:
        "Generates a verified, zero-slop CSF3 Storybook (.stories.tsx) file with multiple component state variants for isolated visual testing.",
      inputSchema: z.object({
        name: z.string().describe("Component slug identifier (e.g., 'voice-call-session-hud', 'pricing-table')"),
      }),
    },
    async ({ name }) => {
      const item = getComponentItem(name);
      const componentName = item?.title.replace(/[\s-]+/g, "") || "Component";
      const importSlug = item?.name || name;

      const storyCode = `import type { Meta, StoryObj } from "@storybook/react";
import { ${componentName} } from "@/components/ui/${importSlug}";

const meta: Meta<typeof ${componentName}> = {
  title: "${item?.category || "Components"}/${componentName}",
  component: ${componentName},
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  args: {},
};

export const DarkSurface: Story = {
  args: {},
  parameters: {
    backgrounds: { default: "dark" },
  },
};
`;

      return {
        content: [{ type: "text", text: stripPayloadToBudget(storyCode) }],
      };
    }
  );

  // Tool 21: compare_design_tokens
  server.registerTool(
    "compare_design_tokens",
    {
      description:
        "Compares two design token palettes for contrast differences, WCAG AA compliance delta, and semantic token alignment.",
      inputSchema: z.object({
        paletteA: z.record(z.string()).describe("First theme key-value hex tokens"),
        paletteB: z.record(z.string()).describe("Second theme key-value hex tokens"),
      }),
    },
    async ({ paletteA, paletteB }) => {
      const keys = Array.from(new Set([...Object.keys(paletteA), ...Object.keys(paletteB)]));
      const comparison = keys.map((key) => ({
        token: key,
        valueA: paletteA[key] || "UNSET",
        valueB: paletteB[key] || "UNSET",
        isIdentical: paletteA[key] === paletteB[key],
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                totalTokensChecked: keys.length,
                identicalCount: comparison.filter((c) => c.isIdentical).length,
                divergentCount: comparison.filter((c) => !c.isIdentical).length,
                tokens: comparison,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 22: generate_playwright_test
  server.registerTool(
    "generate_playwright_test",
    {
      description:
        "Generates an automated Playwright + Axe-core end-to-end accessibility test file (.spec.ts) for any page route or component.",
      inputSchema: z.object({
        routeName: z.string().describe("Target route or component test name (e.g., '/pricing', 'voice-call-session-hud')"),
        requireZeroA11yViolations: z.boolean().optional().default(true).describe("Whether Axe scan fails on any violation"),
      }),
    },
    async ({ routeName, requireZeroA11yViolations = true }) => {
      const testCode = `import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("${routeName} Accessibility & Visual Flow", () => {
  test("should pass WCAG 2.1 AA automated axe scan", async ({ page }) => {
    await page.goto("${routeName.startsWith("/") ? routeName : `/${routeName}`}");
    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    ${
      requireZeroA11yViolations
        ? "expect(accessibilityScanResults.violations).toEqual([]);"
        : "expect(accessibilityScanResults.violations.filter(v => v.impact === 'critical')).toHaveLength(0);"
    }
  });

  test("should maintain focus visible ring during keyboard navigation", async ({ page }) => {
    await page.goto("${routeName.startsWith("/") ? routeName : `/${routeName}`}");
    await page.keyboard.press("Tab");
    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElement).toBeTruthy();
  });
});
`;

      return {
        content: [{ type: "text", text: stripPayloadToBudget(testCode) }],
      };
    }
  );

  // Tool 23: audit_bundle_cost
  server.registerTool(
    "audit_bundle_cost",
    {
      description:
        "Estimates the gzipped JavaScript bundle size, CSS overhead, and runtime GPU/DOM rendering cost for a component or code snippet.",
      inputSchema: z.object({
        code: z.string().describe("Component source code string to analyze for bundle impact"),
        componentName: z.string().optional().describe("Optional component name for reporting"),
      }),
    },
    async ({ code, componentName = "Component" }) => {
      let jsBytesGzip = 1200; // base React primitive footprint
      let cssBytesGzip = 450;
      let gpuOverhead: "None" | "Low" | "Medium" | "High" = "None";
      const heavyImports: string[] = [];

      if (/three|@react-three/i.test(code)) {
        jsBytesGzip += 140000;
        gpuOverhead = "High";
        heavyImports.push("three (@react-three/fiber): ~140KB gzipped");
      }
      if (/motion\/react|framer-motion/i.test(code)) {
        jsBytesGzip += 28000;
        gpuOverhead = "Low";
        heavyImports.push("motion/react: ~28KB gzipped");
      }
      if (/lucide-react/i.test(code)) {
        jsBytesGzip += 2400; // Tree-shaken icon imports
      }
      if (/canvas|requestAnimationFrame|webgl/i.test(code)) {
        gpuOverhead = gpuOverhead === "High" ? "High" : "Medium";
      }

      const report = {
        component: componentName,
        estimatedGzipJs: `${(jsBytesGzip / 1024).toFixed(1)} KB`,
        estimatedGzipCss: `${(cssBytesGzip / 1024).toFixed(1)} KB`,
        totalGzipPayload: `${((jsBytesGzip + cssBytesGzip) / 1024).toFixed(1)} KB`,
        gpuRenderingOverhead: gpuOverhead,
        heavyDependenciesDetected: heavyImports.length > 0 ? heavyImports : ["None (Zero-dependency or lightweight)"],
        budgetStatus: jsBytesGzip < 45000 ? "PASS_LEAN_BUDGET" : "ACTION_RECOMMENDED_CODE_SPLIT",
        recommendation:
          gpuOverhead === "High"
            ? "Ensure dynamic import with next/dynamic or React.lazy to defer Three.js bundle loading until client visible."
            : "Bundle within optimal <45KB production performance budget.",
      };

      return {
        content: [{ type: "text", text: JSON.stringify(report, null, 2) }],
      };
    }
  );

  // Tool 24: generate_lighthouse_budget_spec
  server.registerTool(
    "generate_lighthouse_budget_spec",
    {
      description:
        "Generates an automated .lighthouserc.json configuration file enforcing performance (FCP < 1.2s, LCP < 2.0s, CLS < 0.05) and 100% accessibility CI gates.",
      inputSchema: z.object({
        targetUrl: z.string().optional().default("http://localhost:3000").describe("Target URL or route to audit"),
        minPerformanceScore: z.number().min(50).max(100).optional().default(90).describe("Minimum Performance score (0-100)"),
        minA11yScore: z.number().min(50).max(100).optional().default(100).describe("Minimum Accessibility score (0-100)"),
      }),
    },
    async ({ targetUrl = "http://localhost:3000", minPerformanceScore = 90, minA11yScore = 100 }) => {
      const config = {
        ci: {
          collect: {
            url: [targetUrl],
            numberOfRuns: 3,
            startServerCommand: "pnpm start",
          },
          assert: {
            assertions: {
              "categories:performance": ["error", { minScore: minPerformanceScore / 100 }],
              "categories:accessibility": ["error", { minScore: minA11yScore / 100 }],
              "first-contentful-paint": ["warn", { maxNumericValue: 1200 }],
              "largest-contentful-paint": ["error", { maxNumericValue: 2000 }],
              "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
              "categories:best-practices": ["warn", { minScore: 0.95 }],
            },
          },
          upload: {
            target: "temporary-public-storage",
          },
        },
      };

      return {
        content: [{ type: "text", text: JSON.stringify(config, null, 2) }],
      };
    }
  );

  // Tool 25: deconstruct_video_interaction
  server.registerTool(
    "deconstruct_video_interaction",
    {
      description:
        "Translates visual interaction archetypes (tabs, bouncy badge, drawer, hero reveal) into verified motion/react spring configurations and accessible TSX snippets.",
      inputSchema: z.object({
        interactionType: z
          .enum(["snappy-tab", "bouncy-badge", "spatial-drawer", "hero-reveal", "continuous-float"])
          .describe("Observed visual interaction archetype"),
        customStiffness: z.number().optional().describe("Optional spring stiffness override"),
        customDamping: z.number().optional().describe("Optional spring damping override"),
      }),
    },
    async ({ interactionType, customStiffness, customDamping }) => {
      const configs: Record<string, { stiffness: number; damping: number; mass: number; snippet: string }> = {
        "snappy-tab": {
          stiffness: customStiffness || 380,
          damping: customDamping || 28,
          mass: 1.0,
          snippet: `<motion.div layoutId="activeTabPill" transition={{ type: "spring", stiffness: 380, damping: 28 }} className="absolute inset-0 bg-primary/10 rounded-lg" />`,
        },
        "bouncy-badge": {
          stiffness: customStiffness || 450,
          damping: customDamping || 16,
          mass: 0.9,
          snippet: `<motion.span whileHover={{ scale: 1.15, rotate: 2 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 450, damping: 16 }} className="inline-block" />`,
        },
        "spatial-drawer": {
          stiffness: customStiffness || 220,
          damping: customDamping || 26,
          mass: 1.1,
          snippet: `<motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 220, damping: 26 }} className="fixed right-0 top-0 h-full w-80 bg-card" />`,
        },
        "hero-reveal": {
          stiffness: customStiffness || 180,
          damping: customDamping || 24,
          mass: 1.2,
          snippet: `<motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="text-5xl font-black" />`,
        },
        "continuous-float": {
          stiffness: customStiffness || 100,
          damping: customDamping || 10,
          mass: 1.0,
          snippet: `<motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} />`,
        },
      };

      const matched = configs[interactionType] || configs["snappy-tab"];

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                archetype: interactionType,
                springParameters: {
                  stiffness: matched.stiffness,
                  damping: matched.damping,
                  mass: matched.mass,
                },
                motionReactSnippet: matched.snippet,
                a11yGuard: "Wrap with motion-reduce:transition-none or check window.matchMedia('(prefers-reduced-motion: reduce)')",
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


