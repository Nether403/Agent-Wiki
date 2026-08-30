/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki (https://design-wiki.agent)
 * @author Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useState } from "react";
import { Box, RotateCw, MapPin, Eye } from "lucide-react";

export interface PinItem {
  id: string;
  title: string;
  description: string;
  topPct: number;
  leftPct: number;
}

export interface Interactive3DPinCanvasProps {
  pins?: PinItem[];
  modelTitle?: string;
  className?: string;
}

export function Interactive3DPinCanvas({
  pins = [
    { id: "1", title: "Optical Sensor Array", description: "Multi-axis tracking sensor with zero drift", topPct: 35, leftPct: 40 },
    { id: "2", title: "Thermal Dissipation Core", description: "Ceramic heat spreader with passive airflow channels", topPct: 55, leftPct: 65 },
    { id: "3", title: "Lithium Power Module", description: "Fast-charging solid state cell with 48h autonomy", topPct: 70, leftPct: 30 },
  ],
  modelTitle = "Industrial Telemetry Unit",
  className = "",
}: Interactive3DPinCanvasProps) {
  const [activePinId, setActivePinId] = useState<string | null>("1");
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  const activePin = pins.find((p) => p.id === activePinId);

  const handleRotate = () => {
    setRotationAngle((prev) => (prev + 45) % 360);
  };

  return (
    <div className={"w-full rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm flex flex-col " + className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Box className="w-4 h-4" role="img" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">{modelTitle}</h3>
            <span className="text-xs text-muted-foreground font-mono">Interactive 3D Spatial Canvas • WebGL Ready</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRotate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none w-fit"
          aria-label="Rotate 3D model 45 degrees"
        >
          <RotateCw className="w-3.5 h-3.5" role="img" aria-hidden="true" />
          Rotate 45°
        </button>
      </div>

      {/* 3D Viewport Simulation Surface with Hotspot Pins */}
      <div 
        className="relative w-full h-64 my-4 rounded-lg bg-gradient-to-b from-muted/30 to-muted/80 border border-border overflow-hidden flex items-center justify-center"
        role="region"
        aria-label="3D Model Viewport"
      >
        {/* Isometric 3D Wireframe Silhouette */}
        <div
          style={{ transform: `rotate(${rotationAngle}deg)`, transition: "transform 0.4s ease-out" }}
          className="w-36 h-36 rounded-2xl border-2 border-dashed border-primary/40 flex items-center justify-center bg-card/60 shadow-lg relative motion-reduce:transition-none"
        >
          <Box className="w-16 h-16 text-primary/60" role="img" aria-hidden="true" />
        </div>

        {/* Hotspot Pins */}
        {pins.map((pin) => {
          const isActive = pin.id === activePinId;
          return (
            <button
              key={pin.id}
              type="button"
              onClick={() => setActivePinId(pin.id)}
              style={{ top: `${pin.topPct}%`, left: `${pin.leftPct}%` }}
              className={
                "absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none " +
                (isActive
                  ? "bg-primary text-primary-foreground scale-110 shadow-md ring-4 ring-primary/20"
                  : "bg-card border border-border text-foreground hover:scale-105")
              }
              aria-label={`View annotation: ${pin.title}`}
            >
              <MapPin className="w-3.5 h-3.5" role="img" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {/* Active Pin Detail Card */}
      {activePin && (
        <div className="p-3.5 rounded-lg bg-background border border-border flex items-start justify-between gap-3">
          <div>
            <h4 className="text-xs font-semibold text-foreground">{activePin.title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{activePin.description}</p>
          </div>
          <span className="text-xs font-mono text-primary shrink-0 flex items-center gap-1">
            <Eye className="w-3 h-3" role="img" aria-hidden="true" />
            Active
          </span>
        </div>
      )}
    </div>
  );
}
