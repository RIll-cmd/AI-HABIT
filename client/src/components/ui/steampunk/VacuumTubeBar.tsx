"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface VacuumTubeBarProps {
  percentage: number; // 0 to 100
  segments?: number;
  size?: "sm" | "md" | "lg";
  variant?: "amber" | "copper" | "gold" | "crimson" | "emerald";
  showLabel?: boolean;
  className?: string;
}

const TUBE_VARIANTS = {
  amber: {
    activeSeg: "bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]",
    activeFilament: "bg-[#fef08a]",
    inactiveSeg: "bg-[#1f0d05]",
    border: "border-[#78350f]",
    cap: "bg-[#b45309]",
  },
  copper: {
    activeSeg: "bg-[#ea580c] shadow-[0_0_8px_#ea580c]",
    activeFilament: "bg-[#fed7aa]",
    inactiveSeg: "bg-[#1f0a03]",
    border: "border-[#92400e]",
    cap: "bg-[#9a3412]",
  },
  gold: {
    activeSeg: "bg-[#fde047] shadow-[0_0_10px_#fde047]",
    activeFilament: "bg-[#ffffff]",
    inactiveSeg: "bg-[#241306]",
    border: "border-[#b45309]",
    cap: "bg-[#d97706]",
  },
  crimson: {
    activeSeg: "bg-[#ef4444] shadow-[0_0_8px_#ef4444]",
    activeFilament: "bg-[#fee2e2]",
    inactiveSeg: "bg-[#240808]",
    border: "border-[#7f1d1d]",
    cap: "bg-[#991b1b]",
  },
  emerald: {
    activeSeg: "bg-[#10b981] shadow-[0_0_8px_#10b981]",
    activeFilament: "bg-[#a7f3d0]",
    inactiveSeg: "bg-[#042018]",
    border: "border-[#065f46]",
    cap: "bg-[#047857]",
  },
};

const HEIGHT_CONFIGS = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4.5",
};

/**
 * Steampunk Segmented Vacuum Tube Filament Meter
 */
export function VacuumTubeBar({
  percentage,
  segments = 5,
  size = "md",
  variant = "amber",
  showLabel = false,
  className = "",
}: VacuumTubeBarProps) {
  const theme = TUBE_VARIANTS[variant] || TUBE_VARIANTS.amber;
  const height = HEIGHT_CONFIGS[size];
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div className={cn("inline-flex flex-col gap-1 w-full select-none", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-200">
          <span>TUBE VACUUM</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}

      {/* Glass Tube Container with Brass End-Caps */}
      <div className="flex items-center w-full">
        {/* Left Copper Anode Cap */}
        <div className={cn("w-1 shrink-0 rounded-l-xs border-y border-l border-black", height, theme.cap)} />

        {/* Central Glass Vacuum Envelope */}
        <div
          className={cn(
            "flex-1 flex items-center gap-0.5 p-0.5 bg-[#0e0502]/95 border-y border-black relative overflow-hidden shadow-[inset_0_0_6px_#000]",
            height
          )}
        >
          {/* Glass Specular Glare */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none z-10" />

          {/* Filament Segments */}
          {Array.from({ length: segments }).map((_, idx) => {
            const stepThreshold = ((idx + 1) / segments) * 100;
            const isLit = clamped >= stepThreshold;
            const isPartial = !isLit && clamped > (idx / segments) * 100;

            return (
              <div
                key={idx}
                className={cn(
                  "flex-1 h-full rounded-xs border border-black/80 transition-all duration-500 relative flex items-center justify-center overflow-hidden",
                  isLit ? theme.activeSeg : isPartial ? "bg-[#78350f]" : theme.inactiveSeg
                )}
              >
                {/* Glowing Coiled Filament Core */}
                {isLit && (
                  <div className={cn("w-full h-0.5 rounded-full", theme.activeFilament)} />
                )}
              </div>
            );
          })}
        </div>

        {/* Right Copper Cathode Cap */}
        <div className={cn("w-1 shrink-0 rounded-r-xs border-y border-r border-black", height, theme.cap)} />
      </div>
    </div>
  );
}
