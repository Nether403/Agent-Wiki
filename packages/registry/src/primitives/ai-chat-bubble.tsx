/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Community Contributor
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Bot, User, Copy, Check } from "lucide-react";

export interface AiChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  role: "user" | "assistant" | "system";
  content: string;
  avatarUrl?: string;
  timestamp?: string;
  onCopy?: () => void;
}

export function AiChatBubble({
  role,
  content,
  avatarUrl,
  timestamp,
  onCopy,
  className,
  ...props
}: AiChatBubbleProps) {
  const [copied, setCopied] = React.useState(false);
  const isUser = role === "user";

  const handleCopy = () => {
    navigator.clipboard?.writeText(content);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-3 w-full max-w-2xl my-2",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto",
        className
      )}
      role="article"
      aria-label={`${role} chat bubble`}
      {...props}
    >
      <div
        className={cn(
          "flex items-center justify-center h-7 w-7 rounded-full shrink-0 text-xs",
          isUser
            ? "bg-secondary text-secondary-foreground border border-border"
            : "bg-primary text-primary-foreground"
        )}
        aria-hidden="true"
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>

      <div
        className={cn(
          "group relative flex flex-col px-4 py-2.5 rounded-2xl text-xs leading-relaxed transition-colors",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-xs"
            : "bg-card text-card-foreground border border-border rounded-tl-xs shadow-xs"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>

        <div className="flex items-center justify-between mt-1 pt-1 text-[10px] opacity-70 gap-3">
          {timestamp && <span>{timestamp}</span>}
          <button
            type="button"
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="Copy bubble message"
          >
            {copied ? <Check className="h-3 w-3 inline" /> : <Copy className="h-3 w-3 inline" />}
          </button>
        </div>
      </div>
    </div>
  );
}
