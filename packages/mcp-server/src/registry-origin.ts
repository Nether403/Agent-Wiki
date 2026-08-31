export const DEFAULT_REGISTRY_HTTP = "http://localhost:3000";
export const REGISTRY_URL_ENV = "DESIGN_WIKI_REGISTRY_URL";

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

/**
 * Base URL used in shadcn install recipes from MCP tools.
 * Tool `baseUrl` wins, then DESIGN_WIKI_REGISTRY_URL, then localhost.
 */
export function resolveInstallBaseUrl(toolArg?: string): string {
  const fromArg = (toolArg ?? "").trim();
  if (fromArg) {
    return stripTrailingSlash(fromArg);
  }
  const fromEnv = (process.env[REGISTRY_URL_ENV] ?? "").trim();
  if (fromEnv) {
    return stripTrailingSlash(fromEnv);
  }
  return DEFAULT_REGISTRY_HTTP;
}
