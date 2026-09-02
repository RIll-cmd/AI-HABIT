"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BigTavernLanternProps {
  className?: string;
  glowIntensity?: "low" | "medium" | "high";
}

export const BigTavernLantern: React.FC<BigTavernLanternProps> = ({
  className,
  glowIntensity = "high",
}) => {
  return (
    <div className={cn("relative flex flex-col items-center select-none pointer-events-none", className)}>
      {/* Ceiling Iron Anchor Plate & Eyelet */}
      <div className="w-8 h-3.5 bg-[#0f172a] border-2 border-[#334155] rounded-t shadow-[inset_1px_1px_0_0_#64748b] flex items-center justify-center z-10 -mb-0.5">
        <div className="w-3 h-2 bg-[#1e293b] border border-[#0f172a] rounded-sm" />
      </div>

      {/* Heavy Cast Iron Chain */}
      <div className="w-4 flex flex-col items-center z-10">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-3.5 h-4 border-2 border-[#111827] bg-[#1e293b] rounded-sm -my-1 shadow-[inset_1px_1px_0_0_#475569]"
          />
        ))}
      </div>

      {/* Top Iron Mounting Collar & Chimney */}
      <div className="w-10 h-7 bg-[#1e293b] border-2 border-[#0f172a] shadow-[inset_2px_2px_0_0_#475569,0_3px_6px_rgba(0,0,0,0.6)] flex items-center justify-around z-20">
        <div className="w-1.5 h-1.5 bg-[#0f172a] rounded-full" />
        <div className="w-2 h-3 bg-[#334155] border border-[#0f172a]" />
        <div className="w-1.5 h-1.5 bg-[#0f172a] rounded-full" />
      </div>

      {/* Lantern Roof & Upper Cap */}
      <div className="w-16 h-4 bg-[#0f172a] border-2 border-[#020617] shadow-[inset_0_2px_0_0_#475569] z-20" />

      {/* Main Lantern Glass Body & Gothic Iron Cage */}
      <div className="relative w-16 h-24 bg-[#78350f]/80 border-x-4 border-b-4 border-[#0f172a] overflow-hidden flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.8)] z-20">
        {/* Ambient Glowing Bulb */}
        <div className="absolute inset-2 bg-gradient-to-b from-[#fbbf24] via-[#f59e0b] to-[#d97706] rounded-sm flex items-center justify-center animate-lantern-flicker">
          {/* Inner Bright Tungsten Filament */}
          <div className="w-4 h-7 bg-[#fef08a] rounded-full shadow-[0_0_20px_#fef08a,0_0_35px_#f59e0b] border border-[#ffffff]/80 flex items-center justify-center">
            <div className="w-1.5 h-4 bg-white rounded-full animate-pulse" />
          </div>
        </div>

        {/* Cast-Iron Grille & Diagonal Struts */}
        <div className="absolute inset-0 border-2 border-[#0f172a] pointer-events-none">
          {/* Horizontal cross beam */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-[#0f172a] -translate-y-1/2 border-y border-[#334155]" />
          {/* Vertical center bar */}
          <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-[#0f172a] -translate-x-1/2 border-x border-[#334155]" />
        </div>
      </div>

      {/* Pointed Bottom Finial & Cast Iron Base */}
      <div className="w-12 h-3 bg-[#0f172a] border-x-2 border-b-2 border-[#020617] shadow-[inset_0_1px_0_0_#334155] z-20" />
      <div className="w-6 h-5 bg-[#1e293b] border-2 border-[#0f172a] rotate-45 -mt-2 shadow-[2px_2px_4px_rgba(0,0,0,0.6)] z-10" />

      {/* Massive Warm Ambient Light Spill Aura */}
      <div className="absolute top-14 w-64 h-64 bg-gradient-radial from-amber-400/35 via-amber-600/15 to-transparent rounded-full blur-2xl pointer-events-none z-0" />
    </div>
  );
};
