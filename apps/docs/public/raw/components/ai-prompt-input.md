---
id: "ai-prompt-input"
name: "Ai Prompt Input"
category: "ui:block"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Ai Prompt Input (`ai-prompt-input`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block
- **Design Dials**: Variance 6/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add ai-prompt-input

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/ai-prompt-input.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin KokonutUI / Cult UI (https://kokonutui.com)
 * @author KokonutUI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { ArrowUp, Paperclip, Globe, Sparkles, Square, ChevronDown } from "lucide-react";

export interface AiPromptInputProps extends React.HTMLAttributes<HTMLDivElement> {
  onSubmit?: (prompt: string, options: { model: string; webSearch: boolean; attachments: File[] }) => void;
  onStop?: () => void;
  isGenerating?: boolean;
  tokenCount?: number;
  maxTokens?: number;
  placeholder?: string;
}

const MODELS = [
  { id: "claude-3-7-sonnet", name: "Claude 3.7 Sonnet", badge: "Smartest" },
  { id: "gpt-4o", name: "GPT-4o", badge: "Fast" },
  { id: "gemini-2-5-pro", name: "Gemini 2.5 Pro", badge: "1M Context" },
];

export function AiPromptInput({
  className,
  onSubmit,
  onStop,
  isGenerating = false,
  tokenCount = 0,
  maxTokens = 128000,
  placeholder = "Ask a question, request code generation, or drag files here...",
  ...props
}: AiPromptInputProps) {
  const [prompt, setPrompt] = React.useState("");
  const [selectedModel, setSelectedModel] = React.useState(MODELS[0].id);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = React.useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = React.useState(false);
  const [attachments, setAttachments] = React.useState<File[]>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!prompt.trim() && attachments.length === 0) return;
    if (isGenerating) {
      onStop?.();
      return;
    }
    onSubmit?.(prompt, {
      model: selectedModel,
      webSearch: webSearchEnabled,
      attachments,
    });
    setPrompt("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const selectedModelObj = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  return (
    <div
      className={cn(
        "relative flex flex-col w-full rounded-xl border border-border bg-card shadow-xs transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20",
        className
      )}
      {...props}
    >
      {/* File attachments badge strip */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border-b border-border/50 bg-muted/30">
          {attachments.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-secondary text-secondary-foreground border border-border"
            >
              <Paperclip className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              <span className="max-w-[120px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                className="ml-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-label={`Remove attachment ${file.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Auto-expanding textarea */}
      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        className="w-full resize-none bg-transparent px-4 pt-3 pb-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] max-h-[200px]"
        aria-label="AI Prompt Input"
      />

      {/* Bottom Controls Toolbar */}
      <div className="flex items-center justify-between px-3 pb-3 pt-1 border-t border-border/40">
        <div className="flex items-center gap-2">
          {/* Model Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsModelDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-expanded={isModelDropdownOpen}
              aria-haspopup="listbox"
              aria-label="Select AI Model"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>{selectedModelObj.name}</span>
              <ChevronDown className="h-3 w-3 opacity-70" aria-hidden="true" />
            </button>

            {isModelDropdownOpen && (
              <div
                role="listbox"
                className="absolute left-0 bottom-full mb-1 w-52 rounded-lg border border-border bg-popover p-1 shadow-md z-50 animate-in fade-in-50 zoom-in-95"
              >
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    role="option"
                    aria-selected={m.id === selectedModel}
                    onClick={() => {
                      setSelectedModel(m.id);
                      setIsModelDropdownOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between w-full px-2.5 py-1.5 text-xs rounded-md text-left transition-colors focus-visible:outline-none focus-visible:bg-accent",
                      m.id === selectedModel ? "bg-accent text-accent-foreground font-medium" : "text-popover-foreground hover:bg-muted"
                    )}
                  >
                    <span>{m.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{m.badge}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Web Search Toggle */}
          <button
            type="button"
            onClick={() => setWebSearchEnabled((prev) => !prev)}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              webSearchEnabled
                ? "bg-primary/10 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            aria-pressed={webSearchEnabled}
            aria-label="Toggle web search"
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Web</span>
          </button>

          {/* File Attachment Upload */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Attach files"
          >
            <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Token Counter */}
          {tokenCount > 0 && (
            <span className="text-[11px] font-mono text-muted-foreground">
              {tokenCount.toLocaleString()} / {(maxTokens / 1000).toFixed(0)}k
            </span>
          )}

          {/* Submit / Stop Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isGenerating && !prompt.trim() && attachments.length === 0}
            className={cn(
              "flex items-center justify-center h-8 w-8 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:cursor-not-allowed",
              isGenerating
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            aria-label={isGenerating ? "Stop Generation" : "Send Message"}
          >
            {isGenerating ? (
              <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            ) : (
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

```
