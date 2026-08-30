/**
 * @license MIT
 * @origin https://reactbits.dev
 * @author React Bits Team
 * @curated-by Machine-First Design Agent Wiki
 * @fallback-provided true
 * @error-boundary-supported true
 * Category: ui:creative
 * Name: ascii-dithering-canvas-converter
 */

import * as React from "react";
import { Terminal, Sliders, RefreshCw } from "lucide-react";

export interface AsciiDitheringConverterProps {
  initialText?: string;
  charSet?: "standard" | "dense" | "binary" | "blocks";
  ditherMode?: "ascii" | "floyd-steinberg" | "bayer-matrix";
  resolution?: number; // 4 to 16
  className?: string;
}

const CHAR_SETS: Record<string, string> = {
  standard: " .:-=+*#%@",
  dense: " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  binary: " 01",
  blocks: " ░▒▓█",
};

export const AsciiDitheringCanvasConverter: React.FC<AsciiDitheringConverterProps> = ({
  initialText = "AGENT WIKI",
  charSet = "standard",
  ditherMode = "ascii",
  resolution = 8,
  className = "",
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [activeSet, setActiveSet] = React.useState(charSet);
  const [activeMode, setActiveMode] = React.useState(ditherMode);
  const [currentResolution, setCurrentResolution] = React.useState(resolution);
  const [inputText, setInputText] = React.useState(initialText);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = (canvas.width = 480);
    const height = (canvas.height = 240);

    const chars = CHAR_SETS[activeSet] || CHAR_SETS.standard;
    const charLen = chars.length;

    const render = () => {
      frame++;
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, width, height);

      // Render hidden text target in memory buffer
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 44px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const offsetX = prefersReducedMotion ? 0 : Math.sin(frame * 0.03) * 10;
      const offsetY = prefersReducedMotion ? 0 : Math.cos(frame * 0.03) * 6;
      ctx.fillText(inputText, width / 2 + offsetX, height / 2 + offsetY);

      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${currentResolution}px monospace`;
      ctx.fillStyle = "#10b981"; // emerald primary

      const step = currentResolution;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (y * width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

          if (brightness > 0.1) {
            if (activeMode === "ascii") {
              const charIdx = Math.floor(brightness * (charLen - 1));
              const char = chars[charIdx] || " ";
              ctx.fillText(char, x, y);
            } else {
              // Dither block mode
              ctx.fillRect(x, y, step * brightness, step * brightness);
            }
          }
        }
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [activeSet, activeMode, currentResolution, inputText]);

  return (
    <section
      aria-label="ASCII and Dithering Canvas Converter"
      className={`flex flex-col w-full max-w-xl mx-auto p-5 rounded-2xl bg-card border border-border text-card-foreground shadow-xl ${className}`}
    >
      <header className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" role="img" aria-label="Terminal icon" />
          <h2 className="text-sm font-semibold text-foreground">ASCII & Dither Converter</h2>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted border border-border text-muted-foreground">
          Canvas 2D Matrix
        </span>
      </header>

      {/* Canvas Viewport */}
      <div className="my-4 flex justify-center bg-background rounded-lg border border-border overflow-hidden p-2">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`ASCII Dither Viewport rendering: ${inputText}`}
          className="w-full max-w-[480px] h-auto aspect-[2/1] rounded"
        />
      </div>

      {/* Interactive Controls */}
      <div className="space-y-4 text-xs font-mono">
        <div>
          <label htmlFor="ascii-input" className="block text-muted-foreground mb-1">
            Input Render Text:
          </label>
          <input
            id="ascii-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            maxLength={24}
            className="w-full px-3 py-1.5 rounded-md bg-background border border-border text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div>
            <label className="block text-muted-foreground mb-1">Character Set:</label>
            <select
              value={activeSet}
              onChange={(e) => setActiveSet(e.target.value as "standard" | "dense" | "binary" | "blocks")}
              className="w-full px-2 py-1.5 rounded-md bg-background border border-border text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="standard">Standard</option>
              <option value="dense">Dense</option>
              <option value="binary">Binary (01)</option>
              <option value="blocks">Blocks (░▒▓█)</option>
            </select>
          </div>

          <div>
            <label className="block text-muted-foreground mb-1">Render Mode:</label>
            <select
              value={activeMode}
              onChange={(e) => setActiveMode(e.target.value as "ascii" | "floyd-steinberg" | "bayer-matrix")}
              className="w-full px-2 py-1.5 rounded-md bg-background border border-border text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="ascii">ASCII Glyphs</option>
              <option value="floyd-steinberg">Floyd Dither</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-muted-foreground mb-1">Step: {currentResolution}px</label>
            <input
              type="range"
              min="4"
              max="16"
              step="2"
              value={currentResolution}
              onChange={(e) => setCurrentResolution(parseInt(e.target.value, 10))}
              aria-label="Resolution step slider"
              className="w-full accent-primary"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default AsciiDitheringCanvasConverter;
