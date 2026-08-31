// @ts-nocheck — reconstructed from dist after a checkout of this file; keep runtime identical to the slim 14-tool server.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { loadCatalogSnapshot, CatalogRecord, isCatalogRecord } from "./embedded-catalog";
import { resolveInstallBaseUrl } from "./registry-origin";
import {
    applyCatalogTier,
    catalogTier,
    loadCatalogCoreSlugs,
    resolveSearchScope,
    SEARCH_RETURN_LIMIT,
} from "./catalog-core";
import { scanMaliciousPayload, detectPromptInjection } from "./security";
import { evaluateSource, unslopCode, RULE_COUNT } from "@design-wiki/audit-linter";
export const MCP_CORE_TOOLS = [
    "search_components",
    "search_library",
    "fetch_raw_markdown",
    "fetch_raw_markup",
    "get_component_markup",
    "get_installation_commands",
    "get_installation_schema",
    "get_install_recipe",
    "audit_code_slop",
    "audit_and_fix_slop",
    "get_dependency_graph",
    "semantic_search_components",
    "compose_layout_tree",
    "verify_accessibility_contrast",
] as const;
export function getRegistryItems(): CatalogRecord[] {
    return loadCatalogSnapshot();
}
export function getComponentItem(slug: string): CatalogRecord | null {
    const items = getRegistryItems();
    const directMatch = items.find((i) => i.name.toLowerCase() === slug.toLowerCase());
    if (directMatch)
        return directMatch;
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
                const parsed: unknown = JSON.parse(fs.readFileSync(p, "utf-8"));
                if (isCatalogRecord(parsed))
                    return parsed;
            }
            catch (e) {
                console.error(`Failed to parse item at ${p}`, e);
            }
        }
    }
    return null;
}
/**
 * Stripping utility to guarantee context payloads do not exceed the 15KB per component threshold
 */
export function stripPayloadToBudget(content: string, maxBytes = 15 * 1024): string {
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
        tier: z
            .enum(["core", "experimental", "all"])
            .optional()
            .describe("Catalog tier. Unqualified search defaults to trusted core (catalog-core.json). Keyword search defaults to all, core first."),
    });
    const handleSearchComponents = async ({ query, category, tag, minMotionIntensity, maxVisualDensity, minDesignVariance, tier, }) => {
        const items = getRegistryItems();
        const core = loadCatalogCoreSlugs();
        let filtered = items;
        if (category) {
            filtered = filtered.filter((i) => i.category === category);
        }
        if (tag) {
            filtered = filtered.filter((i) => i.tags && i.tags.includes(tag.toLowerCase()));
        }
        if (minMotionIntensity) {
            filtered = filtered.filter((i) => i.dials && i.dials?.motion_intensity >= minMotionIntensity);
        }
        if (maxVisualDensity) {
            filtered = filtered.filter((i) => i.dials && i.dials?.visual_density <= maxVisualDensity);
        }
        if (minDesignVariance) {
            filtered = filtered.filter((i) => i.dials && i.dials?.design_variance >= minDesignVariance);
        }
        if (query) {
            const injectionCheck = detectPromptInjection(query);
            if (!injectionCheck.safe) {
                return {
                    content: [
                        {
                            type: "text",
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
            filtered = filtered.filter((i) => i.name.toLowerCase().includes(q) ||
                (i.title ?? "").toLowerCase().includes(q) ||
                (i.description ?? "").toLowerCase().includes(q) ||
                (i.tags && i.tags.some((t) => t.toLowerCase().includes(q))));
        }
        const scope = resolveSearchScope({ query, category, tier });
        const ranked = applyCatalogTier(filtered, scope, core);
        const returned = ranked.slice(0, SEARCH_RETURN_LIMIT);
        const results = returned.map((i) => ({
            name: i.name,
            title: i.title,
            category: i.category,
            tier: i.tier,
            tags: i.tags,
            dials: i.dials,
            a11y: i.a11y,
            dependencies: i.dependencies,
            registryDependencies: i.registryDependencies,
            installCommand: `npx design-wiki add ${i.name}`,
        }));
        const rawJson = JSON.stringify({
            matchCount: ranked.length,
            returnedCount: results.length,
            defaultedToCore: scope === "core" && !tier,
            catalogCoreCount: core.size,
            components: results,
        }, null, 2);
        return {
            content: [
                {
                    type: "text",
                    text: stripPayloadToBudget(rawJson),
                },
            ],
        };
    };
    // Tool 1: search_components
    server.registerTool("search_components", {
        description: "Search the Machine-First Design Agent Wiki. Unqualified browse returns catalog-core.json only. Keyword search still covers the full inventory, core first.",
        inputSchema: searchInputSchema,
    }, handleSearchComponents);
    // Tool 1 Alias: search_library (for agent workflows in Cursor, Claude Code, etc.)
    server.registerTool("search_library", {
        description: "Search and discover UI components. Unqualified browse returns the trusted core (catalog-core.json). Pass tier='all' or a keyword to include experimental inventory.",
        inputSchema: searchInputSchema,
    }, handleSearchComponents);
    // Helper handler for markup retrieval
    // Handler for raw markdown retrieval (with complete YAML frontmatter and verified TSX source)
    const handleFetchRawMarkdown = async (name) => {
        const item = getComponentItem(name);
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
        const depsYaml = item.dependencies && item.dependencies.length > 0
            ? item.dependencies.map((d) => `  - "${d}"`).join("\n")
            : "  # No external runtime dependencies";
        const tagsYaml = item.tags && item.tags.length > 0
            ? item.tags.map((t) => `  - "${t}"`).join("\n")
            : '  - "ui"';
        const complexity = item.complexity ||
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
npx shadcn@latest add ${resolveInstallBaseUrl()}/r/${item.name}.json
\`\`\`

## Peer Dependencies
${item.dependencies && item.dependencies.length > 0 ? item.dependencies.map((d) => `- \`${d}\``).join("\n") : "- None"}

## Verified TypeScript Source
\`\`\`tsx
${sourceCode}
\`\`\`
`;
        return {
            content: [
                {
                    type: "text",
                    text: stripPayloadToBudget(markdownDoc),
                },
            ],
        };
    };
    // Helper handler for markup JSON retrieval (backward compatibility)
    const handleFetchMarkup = async (name) => {
        const item = getComponentItem(name);
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
            markdownDocs: `### ${item.title} (\`${item.name}\`)\n${item.description}\n\n**Category**: \`${item.category}\`\n**Dependencies**: ${(item.dependencies ?? []).join(", ") || "None"}\n**Dials**: Variance ${item.dials?.design_variance}/10, Motion ${item.dials?.motion_intensity}/10, Density ${item.dials?.visual_density}/10\n\n\`\`\`tsx\n${sourceCode}\n\`\`\``,
        };
        return {
            content: [
                {
                    type: "text",
                    text: stripPayloadToBudget(JSON.stringify(response, null, 2)),
                },
            ],
        };
    };
    // Tool 2 (Primary): fetch_raw_markdown
    server.registerTool("fetch_raw_markdown", {
        description: "Fetch the complete raw Markdown documentation (including structured YAML frontmatter, taxonomy, taste dials, accessibility contracts, and verified TSX source code) for a component.",
        inputSchema: z.object({
            name: z.string().describe("Component slug identifier (e.g., 'canvas-fluid-wave', 'floating-dock', 'button')"),
        }),
    }, async ({ name }) => handleFetchRawMarkdown(name));
    // Tool 2 Alias: fetch_raw_markup (backward compatibility)
    server.registerTool("fetch_raw_markup", {
        description: "Fetch the complete, un-truncated production TSX/JSX source code, peer dependencies, and styling recipes for a registered component.",
        inputSchema: z.object({
            name: z.string().describe("Component slug identifier (e.g., 'floating-dock', 'button', 'canvas-fluid-wave')"),
        }),
    }, async ({ name }) => handleFetchMarkup(name));
    // Tool 2 Alias: get_component_markup (backward compatibility)
    server.registerTool("get_component_markup", {
        description: "Fetch the complete TSX source code, peer dependencies, and styling recipes for a registered component (alias to fetch_raw_markup).",
        inputSchema: z.object({
            name: z.string().describe("Component slug identifier (e.g., 'floating-dock', 'button', 'canvas-fluid-wave')"),
        }),
    }, async ({ name }) => handleFetchMarkup(name));
    // Handler for installation commands (CLI and package managers)
    const handleGetInstallationCommands = async (name, packageManager = "pnpm", baseUrl) => {
        const activeBaseUrl = resolveInstallBaseUrl(baseUrl);
        const item = getComponentItem(name);
        if (!item) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: Component "${name}" was not found. Use search_components to find valid component slugs.`,
                    },
                ],
            };
        }
        const pm = packageManager || "pnpm";
        const peerAddCmd = item.dependencies && item.dependencies.length > 0
            ? pm === "npm"
                ? `npm install ${(item.dependencies ?? []).join(" ")}`
                : pm === "bun"
                    ? `bun add ${(item.dependencies ?? []).join(" ")}`
                    : pm === "yarn"
                        ? `yarn add ${(item.dependencies ?? []).join(" ")}`
                        : `pnpm add ${(item.dependencies ?? []).join(" ")}`
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
            importStatement: `import { ${(item.title ?? item.name).replace(/\s+/g, "")} } from "@/components/ui/${item.name}";`,
            instructions: [
                `Run '${commands.cli}' to install the component and resolve path aliases.`,
                `Or run '${commands.shadcn}' in your workspace root.`,
                (item.dependencies?.length ?? 0) > 0
                    ? `Ensure peer packages are installed: ${peerAddCmd}`
                    : `No external runtime dependencies required.`,
                `Import in your page or layout: import { ${(item.title ?? item.name).replace(/\s+/g, "")} } from "@/components/ui/${item.name}";`,
            ],
        };
        return {
            content: [
                {
                    type: "text",
                    text: stripPayloadToBudget(JSON.stringify(response, null, 2)),
                },
            ],
        };
    };
    // Helper handler for installation schema retrieval (backward compatibility)
    const handleGetInstallSchema = async (name, baseUrl) => {
        const activeBaseUrl = resolveInstallBaseUrl(baseUrl);
        const item = getComponentItem(name);
        if (!item) {
            return {
                content: [
                    {
                        type: "text",
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
                `Verify required peer packages are installed: ${(item.dependencies ?? []).join(", ") || "None"}.`,
                `Import in your layout using '@/components/ui/${item.name}'.`,
            ],
        };
        return {
            content: [
                {
                    type: "text",
                    text: stripPayloadToBudget(JSON.stringify(schemaResponse, null, 2)),
                },
            ],
        };
    };
    // Tool 3 (Primary): get_installation_commands
    server.registerTool("get_installation_commands", {
        description: "Get the exact CLI installation commands (e.g. npx design-wiki add <slug> or npx shadcn add ...), package manager commands, and peer dependencies for a component.",
        inputSchema: z.object({
            name: z.string().describe("Component slug identifier (e.g., 'floating-dock', 'canvas-fluid-wave', 'bento-grid')"),
            packageManager: z.enum(["pnpm", "npm", "bun", "yarn"]).optional().default("pnpm").describe("Target package manager (pnpm, npm, bun, yarn)"),
            baseUrl: z.string().optional().describe("Base URL hosting the /r/ registry endpoints. Defaults to DESIGN_WIKI_REGISTRY_URL or http://localhost:3000"),
        }),
    }, async ({ name, packageManager = "pnpm", baseUrl }) => handleGetInstallationCommands(name, packageManager, baseUrl));
    // Tool 3 Alias: get_installation_schema (backward compatibility)
    server.registerTool("get_installation_schema", {
        description: "Get the complete shadcn v3 registry JSON installation schema (including files, dependencies, registryDependencies, and CLI install recipe) for a component.",
        inputSchema: z.object({
            name: z.string().describe("Component slug identifier (e.g., 'bento-grid', 'dialog', 'floating-dock')"),
            baseUrl: z.string().optional().describe("Base URL hosting the /r/ registry endpoints. Defaults to DESIGN_WIKI_REGISTRY_URL or http://localhost:3000"),
        }),
    }, async ({ name, baseUrl }) => handleGetInstallSchema(name, baseUrl));
    // Tool 3 Alias: get_install_recipe (backward compatibility)
    server.registerTool("get_install_recipe", {
        description: "Get the exact CLI installation recipe, shadcn command, and required peer npm dependencies for a component (alias to get_installation_schema).",
        inputSchema: z.object({
            name: z.string().describe("Component slug identifier (e.g., 'bento-grid', 'dialog')"),
            baseUrl: z.string().optional().describe("Base URL hosting the /r/ registry endpoints. Defaults to DESIGN_WIKI_REGISTRY_URL or http://localhost:3000"),
        }),
    }, async ({ name, baseUrl }) => handleGetInstallSchema(name, baseUrl));
    // Tool 4: audit_code_slop
    server.registerTool("audit_code_slop", {
        description: `Scan React/TypeScript/Tailwind code against the canonical ${RULE_COUNT} anti-slop rules in @design-wiki/audit-linter and return a remediation receipt.`,
        inputSchema: z.object({
            code: z.string().describe("The source code string to audit for AI slop and design regression."),
        }),
    }, async ({ code }) => {
        const result = evaluateSource("mcp-audit.tsx", code);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        ruleCount: RULE_COUNT,
                        ruleSource: "@design-wiki/audit-linter",
                        healthScore: `${result.healthScore}/100`,
                        grade: result.grade,
                        status: result.metrics.highSeverityCount === 0 && result.healthScore >= 85 ? "PASS" : "FAIL - Remediation Needed",
                        violationsFound: result.metrics.totalFindings,
                        severityBreakdown: {
                            High: result.metrics.highSeverityCount,
                            Medium: result.metrics.mediumSeverityCount,
                            Low: result.metrics.lowSeverityCount,
                        },
                        findings: result.findings,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 4.5: audit_and_fix_slop
    server.registerTool("audit_and_fix_slop", {
        description: "Scan raw TypeScript/React/Tailwind code for anti-slop violations and return an auto-corrected TSX payload. Scores are re-measured with the canonical linter; 100/100 is not assumed.",
        inputSchema: z.object({
            code: z.string().describe("The source code string to audit and auto-remediate."),
            theme: z
                .string()
                .optional()
                .default("default")
                .describe("Target theme calibration ('default', 'neo-tokyo', 'midnight', 'minimal')"),
        }),
    }, async ({ code, theme = "default" }) => {
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
        const allowedThemes = ["default", "neo-tokyo", "midnight", "minimal"] as const;
        type ThemeName = (typeof allowedThemes)[number];
        const themeName: ThemeName = (allowedThemes as readonly string[]).includes(theme)
            ? (theme as ThemeName)
            : "default";
        const remapped = unslopCode(code, { theme: themeName });
        return {
            content: [
                {
                    type: "text",
                    text: stripPayloadToBudget(JSON.stringify({
                        healthScoreBefore: `${remapped.scoreBefore}/100`,
                        healthScoreAfter: `${remapped.scoreAfter}/100`,
                        status: remapped.scoreAfter >= 85 ? "PASS" : "NEEDS_MANUAL_FIX",
                        changesApplied: remapped.changesApplied,
                        remediatedSourceCode: remapped.code,
                    }, null, 2)),
                },
            ],
        };
    });
    // Tool 5: get_dependency_graph
    server.registerTool("get_dependency_graph", {
        description: "Return the dynamic DAG dependency topology, topological installation sequence, and required npm packages for a component or the full registry.",
        inputSchema: z.object({
            name: z.string().optional().describe("Component slug to inspect (e.g., 'pricing-table', 'floating-dock'). If omitted, returns entire catalog topology."),
            includeMermaid: z.boolean().optional().describe("Whether to include Mermaid.js flowchart string in response."),
        }),
    }, async ({ name, includeMermaid }) => {
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
            const regDeps = item.registryDependencies || [];
            const npmDeps = item.dependencies || [];
            const devDeps = item.devDependencies || [];
            // Build topological installation order for this component
            const installOrder = [...regDeps, item.name];
            const payload = JSON.stringify({
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
            }, null, 2);
            return {
                content: [{ type: "text", text: stripPayloadToBudget(payload) }],
            };
        }
        // Full catalog graph summary
        const nodes = {};
        const allNpm = new Set();
        items.forEach((it) => {
            nodes[it.name] = {
                category: it.category,
                registryDependencies: it.registryDependencies || [],
                dependencies: it.dependencies || [],
            };
            (it.dependencies || []).forEach((d) => allNpm.add(d));
        });
        const fullPayload = JSON.stringify({
            totalComponents: items.length,
            totalNpmDependencies: Array.from(allNpm),
            nodes,
        }, null, 2);
        return {
            content: [{ type: "text", text: stripPayloadToBudget(fullPayload) }],
        };
    });
    // Tool 6: semantic_search_components
    server.registerTool("semantic_search_components", {
        description: "Keyword and taste-dial search across the registry. This is not an embedding/vector index; tokens in the query are scored against name, title, tags, and description.",
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
    }, async ({ naturalLanguageQuery, targetDialProfile, topK = 5 }) => {
        const items = getRegistryItems();
        const core = loadCatalogCoreSlugs();
        const queryTokens = naturalLanguageQuery.toLowerCase().split(/\s+/).filter(Boolean);
        const scored = items.map((item) => {
            let textScore = 0;
            const corpus = `${item.name} ${item.title} ${item.description} ${item.category} ${(item.tags || []).join(" ")}`.toLowerCase();
            queryTokens.forEach((token) => {
                if (item.name.toLowerCase().includes(token))
                    textScore += 5;
                if ((item.title ?? "").toLowerCase().includes(token))
                    textScore += 4;
                if ((item.tags || []).some((t) => t.toLowerCase().includes(token)))
                    textScore += 3;
                if ((item.description ?? "").toLowerCase().includes(token))
                    textScore += 2;
                if (corpus.includes(token))
                    textScore += 1;
            });
            if (core.has(item.name)) {
                textScore += 4;
            }
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
                tier: catalogTier(item.name, core),
                description: item.description,
                tags: item.tags || [],
                dials: item.dials,
                similarityScore: Number(finalScore.toFixed(2)),
                installCommand: `npx design-wiki add ${item.name}`,
            };
        });
        scored.sort((a, b) => {
            if (b.similarityScore !== a.similarityScore) {
                return b.similarityScore - a.similarityScore;
            }
            if (a.tier === b.tier) return 0;
            return a.tier === "core" ? -1 : 1;
        });
        const results = scored.slice(0, topK);
        const payload = JSON.stringify({
            query: naturalLanguageQuery,
            targetDialProfile: targetDialProfile || "Unspecified (Neutral)",
            matchCount: results.length,
            topMatches: results,
        }, null, 2);
        return {
            content: [{ type: "text", text: stripPayloadToBudget(payload) }],
        };
    });
    // Tool 7: compose_layout_tree
    server.registerTool("compose_layout_tree", {
        description: "Synthesize a layout tree for a page type. The settings archetype uses catalog-core.json slugs only. Other archetypes may still recommend experimental inventory and are labeled with tier.",
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
    }, async ({ pageType, requiredFeatures = [], targetDials }) => {
        const core = loadCatalogCoreSlugs();
        let layoutTree: Record<string, unknown>;
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
        }
        else if (pageType === "dashboard") {
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
        }
        else if (pageType === "settings") {
            layoutTree = {
                archetype: "Settings / preferences (trusted core)",
                recommendedComponents: [
                    { position: "Frame", slug: "card", title: "Card", rationale: "Section surface with structural border" },
                    { position: "Sections", slug: "tabs", title: "Tabs", rationale: "General vs access panes" },
                    { position: "Fields", slug: "input", title: "Input", rationale: "Labeled text fields" },
                    { position: "Toggles", slug: "switch", title: "Switch", rationale: "Boolean preferences" },
                    { position: "Rules", slug: "separator", title: "Separator", rationale: "Group breaks inside a card" },
                    { position: "Submit", slug: "button", title: "Button", rationale: "Save action with focus ring" },
                    { position: "Confirm", slug: "dialog", title: "Dialog", rationale: "Destructive confirm" },
                    { position: "Meta", slug: "key-value-definition-list", title: "Key Value Definition List", rationale: "Read-only account facts" },
                ],
                scaffoldTsx: `import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
        <h1 className="text-2xl font-semibold">Workspace settings</h1>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="access">Access</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Input aria-label="Display name" placeholder="Display name" />
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Email notifications</span>
                  <Switch aria-label="Email notifications" />
                </div>
                <Button type="button">Save changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}`,
            };
        }
        else if (pageType === "auth-flow") {
            layoutTree = {
                archetype: "Auth card (trusted core)",
                recommendedComponents: [
                    { position: "Surface", slug: "card", title: "Card", rationale: "Sign-in panel" },
                    { position: "Identity", slug: "input", title: "Input", rationale: "Email / password fields" },
                    { position: "Submit", slug: "button", title: "Button", rationale: "Primary sign-in" },
                    { position: "Avatar", slug: "avatar", title: "Avatar", rationale: "Account glyph" },
                    { position: "Help", slug: "tooltip", title: "Tooltip", rationale: "Field hints" },
                    { position: "Legal", slug: "dialog", title: "Dialog", rationale: "Terms overlay" },
                ],
                scaffoldTsx: `import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AuthPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-background p-6 text-foreground">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-row items-center gap-3">
          <Avatar />
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input type="email" aria-label="Email" placeholder="you@example.com" />
          <Input type="password" aria-label="Password" placeholder="Password" />
          <Button type="button">Continue</Button>
        </CardContent>
      </Card>
    </main>
  );
}`,
            };
        }
        else {
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
        const recommended = layoutTree.recommendedComponents;
        if (Array.isArray(recommended)) {
            layoutTree.recommendedComponents = recommended.map((row: { slug?: string }) => ({
                ...row,
                tier: catalogTier(row.slug ?? "", core),
            }));
        }
        layoutTree.catalogCoreFile = "catalog-core.json";
        layoutTree.catalogCoreCount = core.size;
        return {
            content: [{ type: "text", text: stripPayloadToBudget(JSON.stringify(layoutTree, null, 2)) }],
        };
    });
    // Tool 9: verify_accessibility_contrast
    server.registerTool("verify_accessibility_contrast", {
        description: "Calculates the exact WCAG 2.1 contrast ratio between foreground and background hexadecimal colors and validates AA / AAA compliance.",
        inputSchema: z.object({
            foregroundHex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).describe("Foreground hex color (e.g. #FFFFFF)"),
            backgroundHex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).describe("Background hex color (e.g. #09090B)"),
        }),
    }, async ({ foregroundHex, backgroundHex }) => {
        const getLuminance = (hex: string): number => {
            let clean = hex.replace("#", "");
            if (clean.length === 3)
                clean = clean.split("").map((c: string) => c + c).join("");
            const rgb = [
                parseInt(clean.substring(0, 2), 16) / 255,
                parseInt(clean.substring(2, 4), 16) / 255,
                parseInt(clean.substring(4, 6), 16) / 255,
            ].map((v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
            return 0.2126 * (rgb[0] ?? 0) + 0.7152 * (rgb[1] ?? 0) + 0.0722 * (rgb[2] ?? 0);
        };
        const l1 = getLuminance(foregroundHex);
        const l2 = getLuminance(backgroundHex);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        const rounded = Math.round(ratio * 100) / 100;
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        foreground: foregroundHex,
                        background: backgroundHex,
                        contrastRatio: `${rounded}:1`,
                        wcagAA_normalText: ratio >= 4.5,
                        wcagAA_largeText: ratio >= 3.0,
                        wcagAAA_normalText: ratio >= 7.0,
                        status: ratio >= 4.5 ? "PASS_AA" : ratio >= 3.0 ? "PASS_LARGE_ONLY" : "FAIL",
                    }, null, 2),
                },
            ],
        };
    });
    return server;
}
