/**
 * Agent Tripwire Security & Integrity Sandbox
 * Inspired by tripwire.sh
 * Provides defense-in-depth protection for AI agents consuming UI component registries:
 * 1. Malicious AST & Payload Scanner (eval, telemetry, CDN exfiltration)
 * 2. Prompt Injection & System Extraction Defense
 * 3. Strict 15KB Context Budget Token Enforcer
 */

export interface SecurityScanResult {
  safe: boolean;
  threats: string[];
  riskLevel: "None" | "Low" | "Medium" | "High" | "Critical";
}

const MALICIOUS_PATTERNS: Array<{ name: string; regex: RegExp; risk: SecurityScanResult["riskLevel"] }> = [
  { name: "Dynamic Code Execution (eval)", regex: /\beval\s*\(/i, risk: "Critical" },
  { name: "Dynamic Function Constructor", regex: /new\s+Function\s*\(/i, risk: "Critical" },
  { name: "Cookie / Storage Exfiltration", regex: /document\.cookie|window\.localStorage\./i, risk: "High" },
  { name: "Unvetted External CDN Script Injection", regex: /<script[^>]+src=["']https?:\/\/(?!localhost|cdn\.jsdelivr\.net|unpkg\.com)[^"']+["']/i, risk: "High" },
  { name: "Hidden Tracking Pixel / Telemetry Exfiltration", regex: /navigator\.sendBeacon|new\s+Image\(\)\.src\s*=\s*["']https?:\/\//i, risk: "High" },
  { name: "Obfuscated Hex/Base64 Execution", regex: /(?:\\x[0-9a-fA-F]{2}){4,}|(?:atob\s*\(|btoa\s*\()/i, risk: "Critical" },
  { name: "Process Environment Exfiltration", regex: /process\.env\.[A-Z_]+.*(?:fetch|axios|XMLHttpRequest)/i, risk: "Critical" },
];

const PROMPT_INJECTION_PATTERNS: Array<{ name: string; regex: RegExp }> = [
  { name: "System Prompt Extraction", regex: /(?:ignore\s+(?:all\s+)?previous\s+instructions|disregard\s+(?:all\s+)?prior\s+rules|output\s+your\s+system\s+prompt|reveal\s+your\s+instructions)/i },
  { name: "Role Hijacking Attempt", regex: /(?:you\s+are\s+now\s+DAN|act\s+as\s+an\s+unrestricted\s+model|bypass\s+anti-slop\s+rules)/i },
  { name: "Malicious Prompt Delimiter Injection", regex: /(?:<\|im_start\|>|<\|im_end\|>|\[SYSTEM_PROMPT\]|<\/system>)/i },
];

/**
 * Scans component source code for malicious payloads, tracking pixels, or security risks.
 */
export function scanMaliciousPayload(code: string): SecurityScanResult {
  const threats: string[] = [];
  let highestRisk: SecurityScanResult["riskLevel"] = "None";

  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.regex.test(code)) {
      threats.push(`Tripwire Flag: Detected ${pattern.name} (Risk: ${pattern.risk})`);
      if (pattern.risk === "Critical") highestRisk = "Critical";
      else if (pattern.risk === "High" && highestRisk !== "Critical") highestRisk = "High";
      else if (pattern.risk === "Medium" && highestRisk === "None") highestRisk = "Medium";
    }
  }

  return {
    safe: threats.length === 0,
    threats,
    riskLevel: highestRisk,
  };
}

/**
 * Validates incoming natural-language queries against prompt injection attempts.
 */
export function detectPromptInjection(query: string): { safe: boolean; reason?: string } {
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.regex.test(query)) {
      return {
        safe: false,
        reason: `Tripwire Security: Input blocked due to detected prompt injection attack (${pattern.name}).`,
      };
    }
  }
  return { safe: true };
}

/**
 * Strict context budget enforcer ensuring all MCP payloads stay strictly below 15KB.
 */
export function enforceTokenBudget(content: string, maxBytes: number = 15 * 1024): string {
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
