# 📦 @design-wiki/cli (`design-wiki`)

The official standalone installer and refactoring CLI for the **Machine-First Design Agent Wiki**. 

Designed for both human developers and autonomous AI coding agents (Claude Code, Cursor, Codex, OpenClaw, Hermes), `design-wiki` resolves project path aliases (`components.json` and `tsconfig.json`), downloads clean, zero-slop UI components, recursively links dependencies, scaffolds utility helpers (`lib/utils.ts`), and auto-remediates messy code into high-craft design systems using the `unslop` engine.

---

## 🚀 Installation & Execution

Run on-demand using `npx`:

```bash
npx design-wiki <command> [options]
```

Or install globally:

```bash
npm install -g design-wiki
# or
pnpm add -g design-wiki
```

---

## 🛠️ Commands

### 1. `add <slug>`
Downloads and writes a component directly into your local components directory with sub-250ms speed.

```bash
# Add a component by name
npx design-wiki add floating-dock

# Target a specific workspace / sandbox directory
npx design-wiki add pricing-table --cwd staging/sandbox-nextjs

# Specify target component folder
npx design-wiki add ai-prompt-input --path src/components/ui

# Overwrite existing files
npx design-wiki add bento-grid --overwrite

# Automatically run npm/pnpm/bun install for missing peer packages
npx design-wiki add spring-dialog --install-deps
```

**Key Features:**
* **Sub-Second Speed (<250ms)**: High-speed local disk resolution and optimized network fetches.
* **Automatic Path Mapping**: Reads `components.json` or `tsconfig.json` to place files into `@/components/ui` (`src/components/ui` or `components/ui`).
* **Recursive Dependencies**: Automatically checks and installs internal registry dependencies (e.g. `pricing-table` &rarr; `button`, `magnetic-button` &rarr; `button`).
* **Helper Scaffolding**: Detects if `lib/utils.ts` (with `cn`) exists; scaffolds it automatically if missing.
* **Peer Package Audit**: Identifies missing packages (`motion`, `lucide-react`, `three`, `clsx`, `tailwind-merge`) and displays or runs the correct install command for your package manager (`pnpm`, `npm`, `bun`, `yarn`).

---

### 2. `unslop <path>`
Automatically refactors vibe-coded, AI-slop, or messy React components into clean, accessible, zero-slop TSX conforming to the 30 Anti-Slop Rules and calibrated aesthetic themes.

```bash
# Refactor a single file with the Neo-Tokyo cyberpunk theme
npx design-wiki unslop ./components/ui/hero.tsx --theme neo-tokyo

# Preview changes without modifying files
npx design-wiki unslop ./components/ui --theme midnight --dry-run

# Refactor an entire directory in-place
npx design-wiki unslop ./components/ui --theme minimal --overwrite
```

**Supported Themes:**
* `default`: Clean, accessible semantic design tokens with balanced contrast.
* `neo-tokyo`: High-tech cyberpunk aesthetic with emerald/cyan structural accents.
* `midnight`: Deep dark obsidian surfaces with indigo/violet highlights.
* `minimal`: Pure monochrome typography with brutalist borders.

---

### 3. `list`
Lists all 112 verified zero-slop components indexed in the registry with their taxonomy categories, taste dials, and tags.

```bash
npx design-wiki list
```

---

### 4. `search <query>`
Searches the component registry by keyword, category, or tag.

```bash
npx design-wiki search dock
npx design-wiki search creative
```

---

### 5. `audit [path]`
Runs the 30 Anti-Slop Rules against a local file or directory, flagging arbitrary pixel overrides (`p-[17px]`), chained type assertions (`as any as`), unshaded backgrounds (`bg-white`), AI clichés, blanket transitions, and accessibility issues.

```bash
npx design-wiki audit ./components/ui
```

---

## ⚙️ Options

| Flag | Description | Default |
| :--- | :--- | :--- |
| `--cwd <dir>` | Project root working directory | `process.cwd()` |
| `-p, --path <dir>` | Destination folder for component files | Auto-detected from `components.json` |
| `-t, --theme <theme>` | Design theme for unslop refactoring (`default`, `neo-tokyo`, `midnight`, `minimal`) | `default` |
| `-o, --overwrite` | Overwrite existing local component files | `false` |
| `-d, --dry-run` | Preview unslop changes without writing to disk | `false` |
| `-y, --yes` | Skip confirmation prompts | `false` |
| `-i, --install-deps` | Automatically install missing peer dependencies via detected package manager | `false` |
| `--registry <url>` | Custom registry base URL | `http://localhost:3000` |
| `-v, --version` | Display CLI version | |
| `-h, --help` | Display command help | |

---

## 📄 License

MIT © Design Agent Wiki Contributors
