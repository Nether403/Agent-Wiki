---
id: "ai-message-thread"
name: "Ai Message Thread"
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

# Ai Message Thread (`ai-message-thread`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block
- **Design Dials**: Variance 6/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add ai-message-thread

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/ai-message-thread.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Hallmark / 21st.dev (https://21st.dev)
 * @author Hallmark & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Copy, Check, RotateCw, GitFork, ThumbsUp, ThumbsDown, Bot, User, Code2 } from "lucide-react";

export interface MessageAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

export interface MessageItem {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
  isStreaming?: boolean;
  modelName?: string;
  thoughtProcess?: string;
}

export interface AiMessageThreadProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: MessageItem[];
  onCopy?: (content: string) => void;
  onRetry?: (messageId: string) => void;
  onFork?: (messageId: string) => void;
  onFeedback?: (messageId: string, type: "like" | "dislike") => void;
}

export function AiMessageThread({
  messages,
  className,
  onCopy,
  onRetry,
  onFork,
  onFeedback,
  ...props
}: AiMessageThreadProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    onCopy?.(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      className={cn("flex flex-col space-y-6 w-full max-w-4xl mx-auto py-6", className)}
      role="feed"
      aria-label="Conversation Message Thread"
      {...props}
    >
      {messages.map((message) => {
        const isAssistant = message.role === "assistant";
        const isUser = message.role === "user";

        return (
          <article
            key={message.id}
            className={cn(
              "flex gap-4 p-4 rounded-xl transition-colors",
              isUser ? "bg-muted/40 ml-auto max-w-[85%] border border-border/40" : "bg-card w-full border border-border shadow-xs"
            )}
            aria-label={`${message.role} message`}
          >
            {/* Avatar */}
            <div
              className={cn(
                "flex items-center justify-center h-8 w-8 rounded-lg shrink-0 text-xs font-semibold select-none",
                isAssistant
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground border border-border"
              )}
              aria-hidden="true"
            >
              {isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </div>

            {/* Message Content Body */}
            <div className="flex flex-col flex-1 space-y-2 overflow-hidden">
              <header className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    {isAssistant ? (message.modelName || "AI Assistant") : "You"}
                  </span>
                  {message.timestamp && (
                    <span className="text-[11px] text-muted-foreground">{message.timestamp}</span>
                  )}
                </div>
              </header>

              {/* Message text with streaming typewriter cursor */}
              <div className="text-sm text-foreground/90 leading-relaxed break-words whitespace-pre-wrap">
                {message.content}
                {message.isStreaming && (
                  <span
                    className="inline-block w-2 h-4 ml-1 bg-primary align-middle animate-pulse"
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Assistant Message Actions Toolbar */}
              {isAssistant && !message.isStreaming && (
                <footer className="flex items-center gap-1 pt-2 mt-2 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => handleCopy(message.id, message.content)}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Copy message text"
                  >
                    {copiedId === message.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        <span className="text-primary text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onRetry?.(message.id)}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Retry response generation"
                  >
                    <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="text-[11px]">Retry</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onFork?.(message.id)}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Fork conversation from this turn"
                  >
                    <GitFork className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="text-[11px]">Fork</span>
                  </button>

                  <div className="flex items-center ml-auto gap-0.5">
                    <button
                      type="button"
                      onClick={() => onFeedback?.(message.id, "like")}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Thumbs up good response"
                    >
                      <ThumbsUp className="h-3 w-3" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onFeedback?.(message.id, "dislike")}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Thumbs down poor response"
                    >
                      <ThumbsDown className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                </footer>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

```
