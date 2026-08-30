/**
 * @license MIT
 * @origin Cult UI / Vercel AI SDK (https://cult-ui.com)
 * @author Cult UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Copy, Check, ThumbsUp, ThumbsDown, Bot, User, Sparkles } from "lucide-react";

export interface AiStreamingMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: "user" | "assistant" | "system";
  content: string;
  isStreaming?: boolean;
  modelName?: string;
  timestamp?: string;
  onFeedback?: (type: "up" | "down") => void;
}

export function AiStreamingMessage({
  role = "assistant",
  content,
  isStreaming = false,
  modelName = "Claude 3.7 Sonnet",
  timestamp,
  onFeedback,
  className,
  ...props
}: AiStreamingMessageProps) {
  const [copied, setCopied] = React.useState(false);
  const [feedback, setFeedback] = React.useState<"up" | "down" | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(type);
    onFeedback?.(type);
  };

  const isAssistant = role === "assistant";
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-3 p-4 rounded-2xl transition-colors",
        isUser
          ? "bg-muted/40 border border-border/60 ml-auto max-w-2xl"
          : "bg-card border border-border max-w-3xl",
        className
      )}
      role="article"
      aria-label={`${role} message`}
      aria-live="polite"
      {...props}
    >
      {/* Avatar Indicator */}
      <div className="shrink-0 pt-0.5">
        {isAssistant ? (
          <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </div>
        ) : isUser ? (
          <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-secondary border border-border text-secondary-foreground">
            <User className="h-4 w-4" aria-hidden="true" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-muted border border-border text-muted-foreground">
            <Bot className="h-4 w-4" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 space-y-2">
        {/* Header meta */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              {isAssistant ? modelName : isUser ? "You" : "System"}
            </span>
            {isStreaming && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                streaming
              </span>
            )}
          </div>
          {timestamp && (
            <span className="text-muted-foreground text-xs">{timestamp}</span>
          )}
        </div>

        {/* Message Body with Streaming Cursor */}
        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
          {content}
          {isStreaming && (
            <span
              className="inline-block w-2 h-4 ml-0.5 align-middle bg-primary animate-pulse"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Action Controls for Assistant Messages */}
        {isAssistant && !isStreaming && (
          <div className="flex items-center gap-1 pt-2 border-t border-border/40 text-muted-foreground">
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied message" : "Copy message"}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {copied ? (
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

            <div className="h-3 w-px bg-border mx-1" aria-hidden="true" />

            <button
              type="button"
              onClick={() => handleFeedback("up")}
              aria-label="Thumbs up good response"
              className={cn(
                "p-1 rounded-md text-xs hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                feedback === "up" ? "text-primary bg-primary/10" : "hover:text-foreground"
              )}
            >
              <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => handleFeedback("down")}
              aria-label="Thumbs down poor response"
              className={cn(
                "p-1 rounded-md text-xs hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                feedback === "down" ? "text-destructive bg-destructive/10" : "hover:text-foreground"
              )}
            >
              <ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
