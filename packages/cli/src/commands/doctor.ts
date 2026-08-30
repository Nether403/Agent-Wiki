import fs from "fs";
import path from "path";

export interface DoctorOptions {
  cwd?: string;
}

export async function runDoctor(options: DoctorOptions = {}): Promise<boolean> {
  console.log(`\n🩺 =======================================================`);
  console.log(`🩺 DESIGN AGENT WIKI: SYSTEM & ENVIRONMENT DOCTOR`);
  console.log(`🩺 Diagnosing workspace configuration and agent guardrails`);
  console.log(`🩺 =======================================================\n`);

  const cwd = options.cwd || process.cwd();
  let issues = 0;

  // 1. Check package.json
  const pkgPath = path.join(cwd, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    console.log(`✓ Located package.json: '${pkg.name || "workspace"}'`);

    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    if (deps["tailwindcss"]) {
      console.log(`  ✓ Tailwind CSS detected: ${deps["tailwindcss"]}`);
    } else {
      console.warn(`  ⚠️ Tailwind CSS not detected in root dependencies.`);
    }

    if (deps["motion"] || deps["framer-motion"]) {
      console.log(`  ✓ Animation engine detected: ${deps["motion"] ? "motion/react" : "framer-motion"}`);
    }
  } else {
    console.error(`❌ Missing package.json in directory: ${cwd}`);
    issues++;
  }

  // 2. Check UI components directory
  const uiPaths = [path.join(cwd, "components/ui"), path.join(cwd, "src/components/ui")];
  const foundUi = uiPaths.find((p) => fs.existsSync(p));
  if (foundUi) {
    const count = fs.readdirSync(foundUi).filter((f) => f.endsWith(".tsx")).length;
    console.log(`✓ Local UI components directory found: '${foundUi}' (${count} components installed)`);
  } else {
    console.log(`ℹ️ No local components/ui directory found yet. Run 'npx design-wiki add <name>' to initialize.`);
  }

  // 3. Check Agent rulepacks
  const agentRules = [
    { file: "SKILL.md", name: "Canonical Agent Skill Contract" },
    { file: ".cursorrules", name: "Cursor IDE Rules" },
    { file: "CLAUDE.md", name: "Claude Code Rules" },
    { file: "AGENTS.md", name: "Universal Agent Standards" },
  ];

  agentRules.forEach(({ file, name }) => {
    if (fs.existsSync(path.join(cwd, file))) {
      console.log(`✓ ${name} active (${file})`);
    }
  });

  console.log(`\n📊 Doctor Diagnosis Complete: ${issues === 0 ? "Flawless Setup (S-Grade)" : `${issues} issue(s) detected.`}`);
  return issues === 0;
}
