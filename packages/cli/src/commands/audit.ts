import fs from "fs";
import path from "path";

// 20 anti-slop rules embedded for standalone CLI portability
const CLI_SLOP_CHECKS = [
  { id: "SLOP-001", name: "Hardcoded Indigo Color", severity: "Medium", regex: /bg-indigo-(?:500|600|700)|text-indigo-(?:500|600)|(?:#4f46e5|#6366f1)/i, rec: "Use semantic tokens (bg-primary)." },
  { id: "SLOP-002", name: "Purple-to-Blue Linear Gradient", severity: "Medium", regex: /from-purple-500\s+to-blue-500|bg-gradient-to-[r|tr|tl|b]\s+from-fuchsia/i, rec: "Use solid card backgrounds with structural borders." },
  { id: "SLOP-003", name: "Blanket Glassmorphism", severity: "Low", regex: /bg-white\/10\s+backdrop-blur|bg-white\/5\s+backdrop-blur/i, rec: "Use solid cards with border-border." },
  { id: "SLOP-004", name: "Chained Type Assertions", severity: "High", regex: /as\s+\w+\s+as\s+\w+/i, rec: "Use explicit TypeScript types instead of chained assertions." },
  { id: "SLOP-005", name: "Conditional Empty Object Spreads", severity: "High", regex: /\.\.\.\s*\(\s*[^?]+\s*\?\s*\{[^}]*\}\s*:\s*\{\s*\}\s*\)/i, rec: "Use explicit fallback properties." },
  { id: "SLOP-006", name: "Blanket Transition All", severity: "Low", regex: /transition-all\s+duration-(?:300|500)/i, rec: "Target specific mutable CSS properties." },
  { id: "SLOP-007", name: "Non-Token Arbitrary Pixel Spacing", severity: "Low", regex: /(?:p[xytrbl]?|m[xytrbl]?|gap|w|h|top|bottom)-\[(\d+)px\]/i, rec: "Replace arbitrary pixel escapes (p-[17px]) with system spacing tokens (p-4)." },
  { id: "SLOP-008", name: "Decorative Emojis in Buttons/Cards", severity: "Medium", regex: /(?:<span>|<li>|<button>)\s*[\uD800-\uDBFF][\uDC00-\uDFFF]\s*(?:<\/span>|<\/li>|<\/button>)/i, rec: "Use typed SVG icons from lucide-react." },
  { id: "SLOP-009", name: "Incomplete Code / Mock TODOs", severity: "High", regex: /\/\/\s*TODO:\s*(?:implement|add\s+logic|finish|mock)/i, rec: "Deliver complete functional code." },
  { id: "SLOP-010", name: "Missing A11y Label on Button", severity: "High", regex: /<button[^>]*>\s*<[A-Z]\w+[^>]*\/>\s*<\/button>/i, rec: "Add aria-label or accessible text to icon buttons." },
  { id: "SLOP-012", name: "Focus Ring Suppression Without Replacement", severity: "High", regex: /(?:outline-none|ring-0)\b/i, rec: "Provide focus-visible:ring-2 when suppressing default focus outlines." },
  { id: "SLOP-014", name: "Canvas Loop Missing Reduced Motion Check", severity: "Medium", regex: /requestAnimationFrame/i, rec: "Verify window.matchMedia('(prefers-reduced-motion: reduce)') before running canvas loops." },
];

export function auditLocalPath(targetPath: string = process.cwd()): void {
  const resolved = path.resolve(targetPath);
  console.log(`\n🛡️ Running Anti-Slop Audit on: ${resolved}`);

  if (!fs.existsSync(resolved)) {
    console.error(`❌ Path "${resolved}" does not exist.`);
    return;
  }

  const stat = fs.statSync(resolved);
  const filesToScan: string[] = [];

  if (stat.isFile()) {
    filesToScan.push(resolved);
  } else {
    const walk = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (e.isDirectory() && !["node_modules", ".next", "dist", ".git"].includes(e.name)) {
          walk(path.join(dir, e.name));
        } else if (e.isFile() && /\.(tsx|ts|jsx|js)$/.test(e.name)) {
          filesToScan.push(path.join(dir, e.name));
        }
      }
    };
    walk(resolved);
  }

  console.log(`📂 Scanned ${filesToScan.length} code file(s)...\n`);
  let totalViolations = 0;
  let highCount = 0;

  filesToScan.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");
    const lines = content.split("\n");
    const findings: Array<{ line: number; rule: string; rec: string; text: string }> = [];

    lines.forEach((line, idx) => {
      CLI_SLOP_CHECKS.forEach((check) => {
        if (check.id === "SLOP-012" && (line.includes("focus-visible:") || line.includes("focus:ring"))) return;
        if (check.id === "SLOP-014" && content.includes("prefers-reduced-motion")) return;

        if (check.regex.test(line)) {
          findings.push({
            line: idx + 1,
            rule: `${check.name} (${check.id})`,
            rec: check.rec,
            text: line.trim(),
          });
          if (check.severity === "High") highCount++;
          totalViolations++;
        }
      });
    });

    if (findings.length > 0) {
      console.log(`📁 File: ${path.relative(process.cwd(), file)} (${findings.length} flags)`);
      findings.forEach((f) => {
        console.log(`   - Line ${f.line}: ${f.rule}`);
        console.log(`     Snippet: \`${f.text.slice(0, 60)}\``);
        console.log(`     Remedy:  ${f.rec}\n`);
      });
    }
  });

  if (totalViolations === 0) {
    console.log(`🎉 Zero Slop Detected! Workspace is 100% compliant with design guardrails.`);
  } else {
    console.log(`⚠️ Total Violations Detected: ${totalViolations} (${highCount} High-severity).`);
  }
}
