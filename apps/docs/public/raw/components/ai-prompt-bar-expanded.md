---
id: "ai-prompt-bar-expanded"
name: "Expanded AI Prompt Bar"
category: "ui:ai-native"
library_origin: "https://kokonutui.com"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
  - "ai-native"
  - "prompt-bar"
  - "multimodal"
  - "kokonut-ui"
  - "cult-ui"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Expanded AI Prompt Bar (`ai-prompt-bar-expanded`)
> Multimodal prompt bar with voice recording button, attachment tray, model selector dropdown, token counter, and slash-command trigger.

- **Taxonomy Category**: `ui:ai-native`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block, ai-native, prompt-bar, multimodal, kokonut-ui, cult-ui
- **Design Dials**: Variance 6/10 · Motion 4/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add ai-prompt-bar-expanded

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/ai-prompt-bar-expanded.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Kokonut UI / Cult UI (https://kokonutui.com)
 * @author KokonutUI Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import {
  Mic,
  MicOff,
  Paperclip,
  ArrowUp,
  Sparkles,
  ChevronDown,
  X,
  FileText,
  Image as ImageIcon,
  Command,
} from "lucide-react";

export interface AiPromptBarExpandedProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  onSubmit?: (prompt: string, attachments: File[], model: string) => void;
  models?: Array<{ id: string; label: string; tag?: string }>;
  defaultModel?: string;
  placeholder?: string;
  maxTokens?: number;
  isLoading?: boolean;
}

export function AiPromptBarExpanded({
  onSubmit,
  models = [
    { id: "gpt-4o", label: "GPT-4o", tag: "Fast" },
    { id: "claude-3-7-sonnet", label: "Claude 3.7 Sonnet", tag: "Reasoning" },
    { id: "gemini-2-flash", label: "Gemini 2.0 Flash", tag: "Multimodal" },
  ],
  defaultModel = "claude-3-7-sonnet",
  placeholder = "Ask anything, type '/' for commands, or attach files...",
  maxTokens = 8192,
  isLoading = false,
  className,
  ...props
}: AiPromptBarExpandedProps) {
  const [prompt, setPrompt] = React.useState("");
  const [selectedModel, setSelectedModel] = React.useState(defaultModel);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = React.useState(false);
  const [isSlashMenuOpen, setIsSlashMenuOpen] = React.useState(false);
  const [attachments, setAttachments] = React.useState<
    Array<{ id: string; name: string; size: string; type: "file" | "image" }>
  >([]);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const estimatedTokens = React.useMemo(() => {
    return Math.max(1, Math.round(prompt.length / 4));
  }, [prompt]);

  const slashCommands = [
    { cmd: "/refactor", desc: "Refactor active code for clarity & performance" },
    { cmd: "/test", desc: "Generate comprehensive unit & integration tests" },
    { cmd: "/audit", desc: "Scan against 35 Anti-Slop & A11y rules" },
    { cmd: "/explain", desc: "Explain architecture and data flow in depth" },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsSlashMenuOpen(false);
      setIsModelDropdownOpen(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setPrompt(val);
    if (val.endsWith("/")) {
      setIsSlashMenuOpen(true);
    } else if (isSlashMenuOpen && !val.includes("/")) {
      setIsSlashMenuOpen(false);
    }
  };

  const insertSlashCommand = (cmd: string) => {
    const withoutSlash = prompt.endsWith("/") ? prompt.slice(0, -1) : prompt;
    setPrompt(`${withoutSlash}${cmd} `);
    setIsSlashMenuOpen(false);
    textareaRef.current?.focus();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newItems = Array.from(files).map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      type: f.type.startsWith("image/") ? ("image" as const) : ("file" as const),
    }));
    setAttachments((prev) => [...prev, ...newItems]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = () => {
    if ((!prompt.trim() && attachments.length === 0) || isLoading) return;
    onSubmit?.(prompt, [], selectedModel);
    setPrompt("");
    setAttachments([]);
    setIsSlashMenuOpen(false);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col w-full rounded-2xl border border-border bg-card text-card-foreground shadow-lg transition-colors",
        className
      )}
      {...props}
    >
      {/* Attachment Tray */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-4 pt-3 pb-1 border-b border-border/40">
          {attachments.map((file) => (
            <div
              key={file.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 text-xs font-medium text-foreground border border-border"
            >
              {file.type === "image" ? (
                <ImageIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              ) : (
                <FileText className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              )}
              <span className="max-w-xs truncate">{file.name}</span>
              <span className="text-muted-foreground text-xs">({file.size})</span>
              <button
                type="button"
                onClick={() => removeAttachment(file.id)}
                aria-label={`Remove file ${file.name}`}
                className="ml-1 p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Textarea Input */}
      <div className="relative px-4 pt-3 pb-2">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
          aria-label="AI Prompt Input"
        />

        {/* Slash Commands Dropdown */}
        {isSlashMenuOpen && (
          <div
            className="absolute bottom-full left-4 mb-2 w-80 rounded-xl border border-border bg-popover p-1.5 shadow-xl z-50 text-popover-foreground animate-in fade-in-50"
            role="menu"
            aria-label="Slash Commands List"
          >
            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Command className="h-3 w-3" aria-hidden="true" /> Commands
            </div>
            {slashCommands.map((item) => (
              <button
                key={item.cmd}
                type="button"
                onClick={() => insertSlashCommand(item.cmd)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-accent hover:text-accent-foreground text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <span className="font-mono font-semibold text-primary">{item.cmd}</span>
                <span className="text-muted-foreground text-xs">{item.desc}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Control Bar Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/40 bg-muted/20 rounded-b-2xl">
        <div className="flex items-center gap-2">
          {/* Model Selector Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsModelDropdownOpen((prev) => !prev)}
              aria-expanded={isModelDropdownOpen}
              aria-haspopup="listbox"
              aria-label="Select AI Model"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-accent text-xs font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>{models.find((m) => m.id === selectedModel)?.label || "Model"}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
            </button>

            {isModelDropdownOpen && (
              <div
                className="absolute bottom-full left-0 mb-1.5 w-56 rounded-xl border border-border bg-popover p-1 shadow-lg z-50 text-popover-foreground"
                role="listbox"
              >
                {models.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedModel(m.id);
                      setIsModelDropdownOpen(false);
                    }}
                    role="option"
                    aria-selected={selectedModel === m.id}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors focus-visible:outline-none",
                      selectedModel === m.id
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-accent hover:text-accent-foreground text-foreground"
                    )}
                  >
                    <span>{m.label}</span>
                    {m.tag && (
                      <span className="text-xs opacity-75">{m.tag}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Attach Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach images or documents"
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Paperclip className="h-4 w-4" aria-hidden="true" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            aria-hidden="true"
          />

          {/* Voice Input Toggle */}
          <button
            type="button"
            onClick={() => setIsRecording((prev) => !prev)}
            aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
            className={cn(
              "p-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isRecording
                ? "bg-destructive text-destructive-foreground animate-pulse"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {isRecording ? (
              <MicOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Mic className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Right Side: Token Counter & Send Button */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground" aria-label="Estimated Tokens">
            ~{estimatedTokens}/{maxTokens} tok
          </span>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={(!prompt.trim() && attachments.length === 0) || isLoading}
            aria-label="Send AI Prompt"
            className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-primary text-primary-foreground font-medium shadow-xs hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

```
