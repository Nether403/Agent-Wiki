import fs from "fs";
import path from "path";

export interface ProjectPathConfig {
  cwd: string;
  hasSrc: boolean;
  uiDir: string;
  libDir: string;
  aliasPrefix: string;
  packageManager: "pnpm" | "npm" | "bun" | "yarn";
}

/**
 * Inspects local workspace configuration (components.json, tsconfig.json, lockfiles)
 * to resolve target installation directories and path aliases.
 */
export function resolveProjectPathConfig(cwd: string = process.cwd()): ProjectPathConfig {
  const hasSrc = fs.existsSync(path.join(cwd, "src"));
  let uiDir = hasSrc ? path.join(cwd, "src", "components", "ui") : path.join(cwd, "components", "ui");
  let libDir = hasSrc ? path.join(cwd, "src", "lib") : path.join(cwd, "lib");
  let aliasPrefix = "@";

  // 1. Check components.json (shadcn configuration)
  const componentsJsonPath = path.join(cwd, "components.json");
  if (fs.existsSync(componentsJsonPath)) {
    try {
      const componentsJson = JSON.parse(fs.readFileSync(componentsJsonPath, "utf-8"));
      if (componentsJson.aliases?.ui) {
        const rawUi = componentsJson.aliases.ui;
        // e.g. "@/components/ui"
        const relativeUi = rawUi.replace(/^@\//, hasSrc ? "src/" : "");
        uiDir = path.resolve(cwd, relativeUi);
      }
      if (componentsJson.aliases?.utils) {
        const rawUtils = componentsJson.aliases.utils;
        const relativeUtils = path.dirname(rawUtils.replace(/^@\//, hasSrc ? "src/" : ""));
        libDir = path.resolve(cwd, relativeUtils);
      }
    } catch {
      // Ignore JSON parse errors and proceed with fallback
    }
  }

  // 2. Check tsconfig.json for path alias mapping
  const tsconfigPath = path.join(cwd, "tsconfig.json");
  if (fs.existsSync(tsconfigPath)) {
    try {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));
      const paths = tsconfig.compilerOptions?.paths;
      if (paths) {
        if (paths["@/*"]) {
          const mapTarget = paths["@/*"][0] || "";
          if (mapTarget.startsWith("./src/")) {
            uiDir = path.join(cwd, "src", "components", "ui");
            libDir = path.join(cwd, "src", "lib");
          }
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
  }

  // 3. Detect Package Manager
  let packageManager: "pnpm" | "npm" | "bun" | "yarn" = "pnpm";
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
    packageManager = "pnpm";
  } else if (fs.existsSync(path.join(cwd, "bun.lockb")) || fs.existsSync(path.join(cwd, "bun.lock"))) {
    packageManager = "bun";
  } else if (fs.existsSync(path.join(cwd, "yarn.lock"))) {
    packageManager = "yarn";
  } else if (fs.existsSync(path.join(cwd, "package-lock.json"))) {
    packageManager = "npm";
  }

  return {
    cwd,
    hasSrc,
    uiDir,
    libDir,
    aliasPrefix,
    packageManager,
  };
}
