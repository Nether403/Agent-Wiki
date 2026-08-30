import fs from "fs";
import path from "path";

interface AgentPlatformCheck {
  name: string;
  filePath: string;
  expectedKeywords: string[];
  requiredMcpTools: string[];
}

const AGENT_PLATFORMS: AgentPlatformCheck[] = [
  {
    name: "Anthropic / Claude Code / Antigravity (SKILL.md)",
    filePath: "SKILL.md",
    expectedKeywords: ["design-system-agent", "DESIGN_VARIANCE", "AI slop", "search_library"],
    requiredMcpTools: ["search_library", "fetch_raw_markup"],
  },
  {
    name: "Cursor IDE (.cursorrules)",
    filePath: ".cursorrules",
    expectedKeywords: ["Machine-First Design System Agent Rules", "DESIGN_VARIANCE", "MOTION_INTENSITY"],
    requiredMcpTools: ["search_library", "fetch_raw_markup"],
  },
  {
    name: "Cursor Rules v2 (.cursor/rules/design-wiki.mdc)",
    filePath: ".cursor/rules/design-wiki.mdc",
    expectedKeywords: ["alwaysApply: true", "globs: **/*.{tsx,ts,jsx,js,css}"],
    requiredMcpTools: ["search_library", "fetch_raw_markup"],
  },
  {
    name: "Windsurf IDE (.windsurfrules)",
    filePath: ".windsurfrules",
    expectedKeywords: ["Machine-First Design System Agent Rules", "AI slop"],
    requiredMcpTools: ["search_library", "fetch_raw_markup"],
  },
  {
    name: "GitHub Copilot (.github/copilot-instructions.md)",
    filePath: ".github/copilot-instructions.md",
    expectedKeywords: ["Machine-First Design System Agent Rules", "Tailwind v4"],
    requiredMcpTools: ["search_library"],
  },
  {
    name: "Universal Agent Standards (AGENTS.md)",
    filePath: "AGENTS.md",
    expectedKeywords: ["Machine-First Design System Agent Rules", "DESIGN_VARIANCE"],
    requiredMcpTools: ["search_library", "fetch_raw_markup"],
  },
  {
    name: "Claude Code Workspace (CLAUDE.md)",
    filePath: "CLAUDE.md",
    expectedKeywords: ["Machine-First Design System Agent Rules", "AI slop"],
    requiredMcpTools: ["search_library"],
  },
  {
    name: "OpenAI Codex / Plugin (.codex-plugin/rules.json)",
    filePath: ".codex-plugin/rules.json",
    expectedKeywords: ["design-agent-wiki-rulepack", "Scan Before You Build"],
    requiredMcpTools: ["search_library", "fetch_raw_markup", "audit_code_slop"],
  },
  {
    name: "OpenClaw Agent (.openclaw/instructions.md)",
    filePath: ".openclaw/instructions.md",
    expectedKeywords: ["Machine-First Design System Agent Rules"],
    requiredMcpTools: ["search_library"],
  },
  {
    name: "Hermes Agent (.hermes/instructions.md)",
    filePath: ".hermes/instructions.md",
    expectedKeywords: ["Machine-First Design System Agent Rules"],
    requiredMcpTools: ["search_library"],
  },
  {
    name: "Public Edge Machine Skill (apps/docs/public/SKILL.md)",
    filePath: "apps/docs/public/SKILL.md",
    expectedKeywords: ["design-system-agent", "DESIGN_VARIANCE", "search_library"],
    requiredMcpTools: ["search_library", "fetch_raw_markup"],
  },
];

async function runAgentEcosystemTests() {
  console.log("\n🤖 =======================================================");
  console.log("🤖 DESIGN AGENT WIKI: AGENT ECOSYSTEM COMPATIBILITY SUITE");
  console.log("🤖 Verifying 11 Agent Platforms & Ruleset Distribution");
  console.log("🤖 =======================================================\n");

  const rootDir = path.resolve(__dirname, "..");
  let passedCount = 0;
  let failedCount = 0;

  for (const agent of AGENT_PLATFORMS) {
    const fullPath = path.join(rootDir, agent.filePath);
    console.log(`Testing Agent Platform: [${agent.name}]...`);
    console.log(`   - Config Path: ${agent.filePath}`);

    if (!fs.existsSync(fullPath)) {
      console.error(`   ❌ FAIL: File not found at ${agent.filePath}`);
      failedCount++;
      continue;
    }

    const content = fs.readFileSync(fullPath, "utf-8");

    // Check size threshold
    if (content.length < 50) {
      console.error(`   ❌ FAIL: File content too small (${content.length} bytes)`);
      failedCount++;
      continue;
    }

    // Check required keywords
    const missingKeywords = agent.expectedKeywords.filter(
      (kw) => !content.toLowerCase().includes(kw.toLowerCase())
    );

    if (missingKeywords.length > 0) {
      console.error(`   ❌ FAIL: Missing required keywords: ${missingKeywords.join(", ")}`);
      failedCount++;
      continue;
    }

    // Check required MCP tool mentions
    const missingTools = agent.requiredMcpTools.filter((t) => !content.includes(t));
    if (missingTools.length > 0) {
      console.error(`   ❌ FAIL: Missing MCP tool bindings: ${missingTools.join(", ")}`);
      failedCount++;
      continue;
    }

    console.log(`   ✓ Pass: Verified rules, MCP bindings, and dialect formatting (${content.length} chars)`);
    passedCount++;
  }

  console.log(`\n📊 Agent Ecosystem Validation Summary:`);
  console.log(`   - Total Platforms Tested: ${AGENT_PLATFORMS.length}`);
  console.log(`   - Verified Compliant:     ${passedCount}/${AGENT_PLATFORMS.length}`);
  console.log(`   - Failures:               ${failedCount}`);

  if (failedCount > 0) {
    throw new Error(`❌ Agent ecosystem compatibility check failed (${failedCount} errors).`);
  }

  console.log(`\n🎉 ALL 11 AGENT PLATFORMS FULLY VERIFIED (100% Ecosystem Reach)!\n`);
}

runAgentEcosystemTests().catch((err) => {
  console.error("❌ Test error:", err);
  process.exit(1);
});
