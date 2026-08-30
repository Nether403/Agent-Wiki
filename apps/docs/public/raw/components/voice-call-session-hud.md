---
id: "voice-call-session-hud"
name: "Voice Call Session HUD"
category: "ui:ai-native"
library_origin: "https://design-wiki.dev"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "brutalist"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
  - "voice-agent"
  - "webrtc"
  - "audio-hud"
  - "ai-native"
  - "turn-taking"
  - "interruption"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 6     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Voice Call Session HUD (`voice-call-session-hud`)
> Real-time AI voice agent call overlay with live audio reactive ring, turn-taking status indicators, interrupt controls, and transcript drawer.

- **Taxonomy Category**: `ui:ai-native`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, brutalist, accessible, keyboard-accessible, wai-aria-compliant, layout-block, voice-agent, webrtc, audio-hud, ai-native, turn-taking, interruption
- **Design Dials**: Variance 6/10 · Motion 6/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add voice-call-session-hud

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/voice-call-session-hud.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Category: ui:ai-native
 * Name: voice-call-session-hud
 */

import * as React from "react";
import { Mic, MicOff, PhoneOff, Volume2, Sparkles, MessageSquare } from "lucide-react";

export interface VoiceCallSessionHUDProps {
  agentName?: string;
  sessionDurationSeconds?: number;
  connectionStatus?: "connected" | "connecting" | "reconnecting" | "disconnected";
  agentState?: "listening" | "thinking" | "speaking" | "interrupted";
  audioLevel?: number; // 0.0 to 1.0
  onMuteToggle?: (isMuted: boolean) => void;
  onInterrupt?: () => void;
  onEndCall?: () => void;
  onTranscriptToggle?: () => void;
  transcriptSnippet?: string;
  className?: string;
}

export const VoiceCallSessionHUD: React.FC<VoiceCallSessionHUDProps> = ({
  agentName = "Antigravity Voice Assistant",
  sessionDurationSeconds = 42,
  connectionStatus = "connected",
  agentState = "listening",
  audioLevel = 0.65,
  onMuteToggle,
  onInterrupt,
  onEndCall,
  onTranscriptToggle,
  transcriptSnippet = "Analyzing the design token distribution across components...",
  className = "",
}) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleMuteClick = () => {
    const next = !isMuted;
    setIsMuted(next);
    onMuteToggle?.(next);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const stateColors: Record<string, { ring: string; badge: string; text: string }> = {
    listening: { ring: "border-primary/60 shadow-primary/20", badge: "bg-primary/10 text-primary border-primary/30", text: "Listening..." },
    thinking: { ring: "border-amber-500/60 shadow-amber-500/20", badge: "bg-amber-500/10 text-amber-400 border-amber-500/30", text: "Reasoning..." },
    speaking: { ring: "border-sky-500/60 shadow-sky-500/20", badge: "bg-sky-500/10 text-sky-400 border-sky-500/30", text: "Speaking" },
    interrupted: { ring: "border-rose-500/60 shadow-rose-500/20", badge: "bg-rose-500/10 text-rose-400 border-rose-500/30", text: "Interrupted" },
  };

  const currentTheme = stateColors[agentState] || stateColors.listening;

  return (
    <section
      aria-label="Voice Agent Call HUD"
      className={`relative flex flex-col items-center justify-between w-full max-w-lg mx-auto p-6 rounded-2xl bg-card border border-border text-card-foreground shadow-2xl overflow-hidden ${className}`}
    >
      {/* Top Header Status */}
      <header className="flex items-center justify-between w-full pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            {connectionStatus === "connected" ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            )}
          </span>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">{agentName}</h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
          <time dateTime={`PT${sessionDurationSeconds}S`}>{formatDuration(sessionDurationSeconds)}</time>
          <span className="px-2 py-0.5 rounded-full border border-border text-[11px] uppercase tracking-wider">
            WebRTC HD
          </span>
        </div>
      </header>

      {/* Center Interactive Audio Orb & State */}
      <div className="flex flex-col items-center justify-center my-8 relative w-full">
        {/* Pulsing Audio Reactive Waves */}
        <div
          className={`relative flex items-center justify-center w-36 h-36 rounded-full border-2 transition-transform duration-200 ${currentTheme.ring}`}
          style={{
            transform: `scale(${1 + audioLevel * 0.15})`,
            boxShadow: `0 0 24px rgba(16, 185, 129, ${audioLevel * 0.3})`,
          }}
        >
          <div className="absolute inset-2 rounded-full bg-primary/5 blur-md" />
          <div className="relative flex flex-col items-center justify-center w-28 h-28 rounded-full bg-muted/60 border border-border">
            <Volume2 className="w-8 h-8 text-primary" role="img" aria-label="Audio Visualizer Active" />
            <span className="text-[10px] font-mono text-muted-foreground mt-1">
              {Math.round(audioLevel * 100)}% VOL
            </span>
          </div>
        </div>

        {/* State Badge */}
        <div className="mt-6 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${currentTheme.badge}`}>
            <Sparkles className="w-3.5 h-3.5" role="img" aria-label="Agent Status Indicator" />
            {currentTheme.text}
          </span>
        </div>

        {/* Live Subtitle Transcript Container */}
        <div
          role="status"
          aria-live="polite"
          className="mt-4 px-4 py-2.5 max-w-sm w-full text-center rounded-lg bg-muted/40 border border-border/60 text-xs text-muted-foreground"
        >
          &ldquo;{transcriptSnippet}&rdquo;
        </div>
      </div>

      {/* Control Action Toolbar */}
      <div className="flex items-center justify-center gap-4 w-full pt-4 border-t border-border" role="toolbar" aria-label="Call Controls">
        <button
          type="button"
          onClick={handleMuteClick}
          aria-label={isMuted ? "Unmute Microphone" : "Mute Microphone"}
          className={`p-3 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            isMuted
              ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
              : "bg-muted border-border text-foreground hover:bg-muted/80"
          }`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {agentState === "speaking" && (
          <button
            type="button"
            onClick={onInterrupt}
            className="px-4 py-2.5 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Interrupt Agent
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setIsDrawerOpen(!isDrawerOpen);
            onTranscriptToggle?.();
          }}
          aria-label="Toggle Full Transcript"
          className="p-3 rounded-full bg-muted border border-border text-foreground hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onEndCall}
          aria-label="End Call Session"
          className="p-3 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>

      {/* Expandable Transcript Drawer */}
      {isDrawerOpen && (
        <div
          role="region"
          aria-label="Transcript History"
          className="w-full mt-4 p-4 rounded-lg bg-background border border-border text-left animate-in fade-in"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Live Transcript</h3>
            <span className="text-[10px] text-muted-foreground">Auto-synced</span>
          </div>
          <div className="max-h-32 overflow-y-auto space-y-2 text-xs text-muted-foreground pr-2 font-mono">
            <p><strong className="text-primary">Agent:</strong> Initializing session topology.</p>
            <p><strong className="text-foreground">You:</strong> Verify accessibility on the navigation bar.</p>
            <p><strong className="text-primary">Agent:</strong> {transcriptSnippet}</p>
          </div>
        </div>
      )}
    </section>
  );
};
export default VoiceCallSessionHUD;

```
