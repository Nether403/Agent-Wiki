import fs from "fs";
import path from "path";

export interface SyncTokensOptions {
  cwd?: string;
  format?: "dtcg" | "tailwind" | "css";
  theme?: string;
}

export async function syncTokensCommand(options: SyncTokensOptions = {}): Promise<void> {
  const cwd = options.cwd || process.cwd();
  const format = options.format || "tailwind";
  const theme = options.theme || "modern-minimal";

  console.log(`🎨 Synchronizing W3C DTCG Design Tokens (Theme: ${theme}, Format: ${format})...`);

  const tailwindThemeCss = `@theme {
  --color-primary: #09090b;
  --color-primary-foreground: #fafafa;
  --color-background: #ffffff;
  --color-foreground: #09090b;
  --color-card: #ffffff;
  --color-card-foreground: #09090b;
  --color-muted: #f4f4f5;
  --color-muted-foreground: #71717a;
  --color-border: #e4e4e7;
  --color-ring: #18181b;
  --color-destructive: #dc2626;
  --color-destructive-foreground: #ffffff;
}

.dark {
  --color-primary: #fafafa;
  --color-primary-foreground: #09090b;
  --color-background: #09090b;
  --color-foreground: #fafafa;
  --color-card: #121215;
  --color-card-foreground: #fafafa;
  --color-muted: #27272a;
  --color-muted-foreground: #a1a1aa;
  --color-border: #27272a;
  --color-ring: #d4d4d8;
  --color-destructive: #ef4444;
  --color-destructive-foreground: #ffffff;
}
`;

  const targetPath = path.resolve(cwd, "styles/theme.css");
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(targetPath, tailwindThemeCss, "utf8");
  console.log(`✅ Compiled Tailwind v4 @theme variables written to ${targetPath}`);
}
