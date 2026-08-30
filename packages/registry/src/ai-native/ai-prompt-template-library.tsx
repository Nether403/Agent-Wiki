/**
 * @license MIT
 * @origin Cult UI / 21st.dev (https://cult-ui.com)
 * @author Cult UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import {
  Sparkles,
  Code2,
  Palette,
  ShieldAlert,
  TestTube2,
  Copy,
  Check,
  ArrowRight,
  Search,
} from "lucide-react";

export interface PromptTemplate {
  id: string;
  category: "coding" | "design" | "security" | "testing" | "refactor";
  title: string;
  description: string;
  prompt: string;
  tokenCount: number;
  tags: string[];
}

export interface AiPromptTemplateLibraryProps extends React.HTMLAttributes<HTMLDivElement> {
  templates?: PromptTemplate[];
  onSelectPrompt?: (prompt: string) => void;
}

const DEFAULT_TEMPLATES: PromptTemplate[] = [
  {
    id: "p1",
    category: "design",
    title: "Zero-Slop UI Refactor",
    description: "Audit raw markup, remap arbitrary pixel units to Tailwind v4 tokens, and check WCAG AA contrast.",
    prompt: "Refactor this component to strictly satisfy the 35 Anti-Slop Rules. Remap arbitrary pixel units to Tailwind system tokens, enforce semantic dark mode colors, and add full keyboard accessibility.",
    tokenCount: 42,
    tags: ["tailwind-v4", "anti-slop", "a11y"],
  },
  {
    id: "p2",
    category: "coding",
    title: "Headless State Machine Architecture",
    description: "Extract complex UI state into an accessible Zag.js/Ark UI headless state machine.",
    prompt: "Extract the state management logic from this React component into a headless custom hook with full keyboard navigation, aria-expanded states, and unit tests.",
    tokenCount: 38,
    tags: ["react19", "typescript", "architecture"],
  },
  {
    id: "p3",
    category: "security",
    title: "Tripwire Security Audit",
    description: "Scan code for prompt injection, arbitrary script evaluation, and dangerous HTML injection.",
    prompt: "Perform a security code review on this component. Identify any dangerous innerHTML injections, prompt injection vectors, or un-sanitized user inputs.",
    tokenCount: 35,
    tags: ["security", "tripwire", "ast"],
  },
  {
    id: "p4",
    category: "testing",
    title: "Playwright + Axe-Core E2E Suite",
    description: "Generate end-to-end tests validating 100% WCAG 2.1 AA compliance and spring motion fallbacks.",
    prompt: "Write a comprehensive Playwright test suite with axe-core automated accessibility audits covering keyboard tab order, focus visible rings, and prefers-reduced-motion fallbacks.",
    tokenCount: 45,
    tags: ["playwright", "axe-core", "testing"],
  },
];

export function AiPromptTemplateLibrary({
  templates = DEFAULT_TEMPLATES,
  onSelectPrompt,
  className,
  ...props
}: AiPromptTemplateLibraryProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Prompts" },
    { id: "design", label: "Design & Taste", icon: Palette },
    { id: "coding", label: "Architecture", icon: Code2 },
    { id: "security", label: "Security Audit", icon: ShieldAlert },
    { id: "testing", label: "A11y & Tests", icon: TestTube2 },
  ];

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (id: string, promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-lg space-y-5",
        className
      )}
      role="region"
      aria-label="AI Prompt Template Library"
      {...props}
    >
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            Agent Prompt Template Library
          </h3>
          <p className="text-xs text-muted-foreground">
            Curated, deterministic prompts calibrated for zero-slop code generation.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter templates..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Filter prompt templates"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selectedCategory === cat.id
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
            )}
          >
            {cat.icon && <cat.icon className="h-3.5 w-3.5" aria-hidden="true" />}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Grid of Prompt Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="flex flex-col justify-between p-4 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors shadow-xs group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-foreground">{template.title}</span>
                <span className="text-xs font-mono text-muted-foreground">
                  ~{template.tokenCount} tok
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded-md bg-background border border-border text-[10px] text-muted-foreground font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-2 border-t border-border/40">
              <button
                type="button"
                onClick={() => handleCopy(template.id, template.prompt)}
                aria-label={`Copy prompt: ${template.title}`}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {copiedId === template.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                    <span className="text-emerald-500 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onSelectPrompt?.(template.prompt)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <span>Use Prompt</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
