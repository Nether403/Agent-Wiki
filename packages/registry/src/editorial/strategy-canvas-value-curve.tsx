/**
 * @license MIT
 * @origin Diagram Design (https://github.com/cathrynlavery/diagram-design)
 * @author Cathryn Lavery & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface StrategyFactor {
  id: string;
  name: string;
}

export interface StrategyCurve {
  id: string;
  name: string;
  color: string;
  values: number[]; // 1 to 10 scale matching factors index
  isHighlighted?: boolean;
}

export interface StrategyCanvasValueCurveProps extends React.HTMLAttributes<HTMLDivElement> {
  factors?: StrategyFactor[];
  curves?: StrategyCurve[];
  title?: string;
  description?: string;
}

export function StrategyCanvasValueCurve({
  title = "Blue Ocean Strategy Canvas (Value Curves)",
  description = "Compare competitive value curves across primary industry factors to identify differentiation zones.",
  factors = [
    { id: "1", name: "Zero AI Slop" },
    { id: "2", name: "Context Size (<15KB)" },
    { id: "3", name: "MCP Tool Speed" },
    { id: "4", name: "WCAG AA A11y" },
    { id: "5", name: "Tailwind v4 First" },
    { id: "6", name: "AST Auto-Unslop" },
    { id: "7", name: "Price / Free OSS" },
  ],
  curves = [
    {
      id: "agent-wiki",
      name: "Agent Wiki Stack",
      color: "#10b981", // emerald-500
      values: [10, 10, 9, 10, 10, 9, 10],
      isHighlighted: true,
    },
    {
      id: "traditional-ui",
      name: "Standard Component Lib",
      color: "#64748b", // slate-500
      values: [4, 3, 2, 7, 5, 1, 8],
    },
    {
      id: "raw-ai-gen",
      name: "Unguided AI Generation",
      color: "#ef4444", // red-500
      values: [1, 2, 8, 2, 3, 2, 5],
    },
  ],
  className,
  ...props
}: StrategyCanvasValueCurveProps) {
  const [activeCurveId, setActiveCurveId] = React.useState<string | null>(null);

  const svgWidth = 700;
  const svgHeight = 280;
  const paddingX = 50;
  const paddingY = 40;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const stepX = factors.length > 1 ? chartWidth / (factors.length - 1) : chartWidth;

  const getYCoord = (val: number) => {
    const clamped = Math.max(1, Math.min(10, val));
    return svgHeight - paddingY - ((clamped - 1) / 9) * chartHeight;
  };

  const getXCoord = (index: number) => paddingX + index * stepX;

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border bg-card p-6 shadow-sm text-card-foreground flex flex-col gap-6",
        className
      )}
      {...props}
    >
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3">
          {curves.map((curve) => {
            const isHovered = activeCurveId === curve.id;
            return (
              <button
                key={curve.id}
                type="button"
                onMouseEnter={() => setActiveCurveId(curve.id)}
                onMouseLeave={() => setActiveCurveId(null)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isHovered || curve.isHighlighted
                    ? "border-border bg-muted/60 text-foreground"
                    : "border-transparent text-muted-foreground opacity-80"
                )}
                aria-label={`Toggle ${curve.name} curve`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: curve.color }}
                  aria-hidden="true"
                />
                <span>{curve.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Value Curve Canvas */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[560px] select-none"
          role="img"
          aria-labelledby="strategy-canvas-title"
        >
          <title id="strategy-canvas-title">{title}</title>

          {/* Horizontal Rating Guideline Lines */}
          {[1, 3, 5, 7, 10].map((level) => {
            const y = getYCoord(level);
            return (
              <g key={level}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  fill="currentColor"
                  fillOpacity="0.4"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {level === 10 ? "High" : level === 1 ? "Low" : level}
                </text>
              </g>
            );
          })}

          {/* Vertical Factor Column Lines */}
          {factors.map((f, i) => {
            const x = getXCoord(i);
            return (
              <line
                key={f.id}
                x1={x}
                y1={paddingY}
                x2={x}
                y2={svgHeight - paddingY}
                stroke="currentColor"
                strokeOpacity="0.08"
              />
            );
          })}

          {/* Render Curve Paths */}
          {curves.map((curve) => {
            const points = curve.values.map((v, i) => `${getXCoord(i)},${getYCoord(v)}`).join(" ");
            const isTarget = activeCurveId === curve.id || (!activeCurveId && curve.isHighlighted);

            return (
              <g key={curve.id} className="transition-opacity duration-300">
                <polyline
                  fill="none"
                  stroke={curve.color}
                  strokeWidth={isTarget ? "3.5" : "2"}
                  strokeOpacity={isTarget ? "1" : "0.4"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />

                {/* Point Dots */}
                {curve.values.map((val, i) => (
                  <circle
                    key={i}
                    cx={getXCoord(i)}
                    cy={getYCoord(val)}
                    r={isTarget ? 5 : 3.5}
                    fill={curve.color}
                    stroke="var(--color-card, #09090b)"
                    strokeWidth="2"
                  />
                ))}
              </g>
            );
          })}

          {/* Bottom X-Axis Factor Labels */}
          {factors.map((factor, i) => {
            const x = getXCoord(i);
            return (
              <text
                key={factor.id}
                x={x}
                y={svgHeight - 12}
                fill="currentColor"
                fillOpacity="0.8"
                fontSize="10.5"
                fontWeight="600"
                textAnchor="middle"
              >
                {factor.name}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
