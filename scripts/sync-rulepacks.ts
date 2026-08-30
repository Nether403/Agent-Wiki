import fs from "fs";
import path from "path";

/**
 * Distributes the core ruleset from SKILL.md into global IDE rulepacks:
 * - .cursorrules (Cursor IDE)
 * - .windsurfrules (Windsurf IDE)
 * - .codex-plugin/rules.json (OpenAI Codex / Plugin integrations)
 * - .github/copilot-instructions.md (GitHub Copilot)
 * - apps/docs/public/SKILL.md (Machine-readable proxy for remote agents)
 */
function syncRulepacks() {
  console.log("🚀 Syncing IDE Rulepacks from SKILL.md...");

  const rootDir = path.resolve(__dirname, "..");
  const skillPath = path.join(rootDir, "SKILL.md");

  if (!fs.existsSync(skillPath)) {
    console.error(`❌ Error: SKILL.md not found at ${skillPath}`);
    process.exit(1);
  }

  const skillContent = fs.readFileSync(skillPath, "utf-8");

  // 1. Copy SKILL.md to docs public directory
  const docsPublicDir = path.join(rootDir, "apps/docs/public");
  fs.mkdirSync(docsPublicDir, { recursive: true });
  fs.writeFileSync(path.join(docsPublicDir, "SKILL.md"), skillContent, "utf-8");
  console.log("  ✓ Synchronized: apps/docs/public/SKILL.md");

  // 2. Format .cursorrules
  const cursorRulesPath = path.join(rootDir, ".cursorrules");
  const cursorRulesHeader = `# Machine-First Design System Agent Rules
# Auto-generated from SKILL.md - Governs Cursor, Claude Code, and local coding agents\n\n`;
  const cleanBody = skillContent.replace(/^---[\s\S]*?---\s*/, "");
  fs.writeFileSync(cursorRulesPath, cursorRulesHeader + cleanBody, "utf-8");
  console.log("  ✓ Synchronized: .cursorrules");

  // 3. Format .windsurfrules
  const windsurfRulesPath = path.join(rootDir, ".windsurfrules");
  fs.writeFileSync(windsurfRulesPath, cursorRulesHeader + cleanBody, "utf-8");
  console.log("  ✓ Synchronized: .windsurfrules");

  // 4. Format .github/copilot-instructions.md
  const githubDir = path.join(rootDir, ".github");
  fs.mkdirSync(githubDir, { recursive: true });
  const copilotPath = path.join(githubDir, "copilot-instructions.md");
  fs.writeFileSync(copilotPath, cursorRulesHeader + cleanBody, "utf-8");
  console.log("  ✓ Synchronized: .github/copilot-instructions.md");

  // 5. Format .codex-plugin/rules.json
  const codexDir = path.join(rootDir, ".codex-plugin");
  fs.mkdirSync(codexDir, { recursive: true });
  const codexJson = {
    name: "design-agent-wiki-rulepack",
    version: "1.0.0",
    description: "Machine-First Design Agent Wiki ruleset ensuring zero AI slop and deterministic UI assembly.",
    rules: [
      "Scan Before You Build: query Design Wiki MCP tools before authoring UI components.",
      "Zero AI Slop: reject hardcoded indigo, purple-to-blue linear gradients, blanket glassmorphism, and arbitrary pixel sizing like p-[17px].",
      "Strict Accessibility: WCAG AA contrast, keyboard navigation, focus-visible rings, and WAI-ARIA roles.",
      "Tailwind v4 First: use semantic tokens and theme variables.",
      "Taste Dials: adhere to DESIGN_VARIANCE (5), MOTION_INTENSITY (4), and VISUAL_DENSITY (6).",
    ],
    mcpTools: [
      "search_components",
      "fetch_raw_markdown",
      "get_installation_commands",
      "audit_code_slop",
    ],
    skillSource: "https://design-wiki.dev/SKILL.md",
  };
  fs.writeFileSync(path.join(codexDir, "rules.json"), JSON.stringify(codexJson, null, 2), "utf-8");
  console.log("  ✓ Synchronized: .codex-plugin/rules.json");

  console.log("🎉 All IDE Rulepacks synchronized successfully!");
}

syncRulepacks();
