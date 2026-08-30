# 📦 @design-wiki/cli (`design-wiki`)

The official standalone installer CLI for the **Machine-First Design Agent Wiki**. 

Designed for both human developers and autonomous AI coding agents (Claude Code, Cursor, Codex), `design-wiki` resolves project path aliases (`components.json` and `tsconfig.json`), downloads clean, zero-slop UI components, recursively links dependencies, scaffolds utility helpers (`lib/utils.ts`), and verifies missing peer packages.

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
Downloads and writes a component directly into your local components directory.

```bash
# Add a component by name
npx design-wiki add canvas-fluid-wave

# Specify target installation directory
npx design-wiki add floating-dock --path src/components/ui

# Overwrite existing files
npx design-wiki add bento-grid --overwrite

# Automatically run npm/pnpm/bun install for missing peer packages
npx design-wiki add spring-dialog --install-deps
```

**Key Features:**
* **Automatic Path Mapping**: Reads `components.json` or `tsconfig.json` to place files into `@/components/ui` (`src/components/ui` or `components/ui`).
* **Recursive Dependencies**: Automatically checks and installs internal registry dependencies (e.g. `magnetic-button` &rarr; `button`).
* **Helper Scaffolding**: Detects if `lib/utils.ts` (with `cn`) exists; scaffolds it automatically if missing.
* **Peer Package Audit**: Identifies missing packages (`motion`, `three`, `remotion`, `clsx`, `tailwind-merge`) and displays or runs the correct install command for your package manager (`pnpm`, `npm`, `bun`, `yarn`).

---

### 2. `list`
Lists all 29 verified zero-slop components indexed in the registry with their taxonomy categories, taste dials, and tags.

```bash
npx design-wiki list
```

---

### 3. `search <query>`
Searches the component registry by keyword, category, or tag.

```bash
npx design-wiki search dock
npx design-wiki search creative
```

---

### 4. `audit [path]`
Runs the 21 Anti-Slop Rules against a local file or directory, flagging arbitrary pixel overrides (`p-[17px]`), chained type assertions (`as any as`), unshaded backgrounds (`bg-white`), blanket transitions, and accessibility issues.

```bash
npx design-wiki audit ./components/ui
```

---

## ⚙️ Options

| Flag | Description | Default |
| :--- | :--- | :--- |
| `-p, --path <dir>` | Destination folder for component files | Auto-detected from `components.json` |
| `-o, --overwrite` | Overwrite existing local component files | `false` |
| `-y, --yes` | Skip confirmation prompts | `false` |
| `-i, --install-deps` | Automatically install missing peer dependencies via detected package manager | `false` |
| `--registry <url>` | Custom registry base URL | `http://localhost:3000` |
| `-v, --version` | Display CLI version | |
| `-h, --help` | Display command help | |

---

## 📄 License

MIT © Design Agent Wiki Contributors
