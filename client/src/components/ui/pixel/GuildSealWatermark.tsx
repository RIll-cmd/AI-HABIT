"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GuildSealWatermarkProps {
  className?: string;
  rank?: string;
}

/**
 * 8-Bit Retro Pixel Art Guild Seal Watermark (Magic Circle + Large Stamp)
 * Matches the authenticated Adventurer License ID card reference photo.
 */
export const GuildSealWatermark: React.FC<GuildSealWatermarkProps> = ({ className, rank = "F" }) => {
  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden select-none", className)}>
      {/* 1. Left Faded Crimson Magic Circle / Guild Stamp Watermark */}
      <svg
        className="absolute -bottom-8 -left-10 w-72 h-72 opacity-[0.14] text-red-700"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ shapeRendering: "crispEdges" }}
      >
        {/* Outer Concentric Circles */}
        <circle cx="50" cy="50" r="46" strokeDasharray="3 2" />
        <circle cx="50" cy="50" r="42" />
        <circle cx="50" cy="50" r="36" strokeDasharray="2 2" />
        {/* Sacred Hexagram / Star */}
        <polygon points="50,16 79,68 21,68" strokeWidth="1.2" />
        <polygon points="50,84 79,32 21,32" strokeWidth="1.2" />
        {/* Inner Rune Core */}
        <circle cx="50" cy="50" r="18" />
        <circle cx="50" cy="50" r="10" strokeDasharray="2 1" />
        {/* Cardinal Cross Rays */}
        <line x1="50" y1="4" x2="50" y2="96" strokeWidth="0.8" strokeDasharray="2 3" />
        <line x1="4" y1="50" x2="96" y2="50" strokeWidth="0.8" strokeDasharray="2 3" />
      </svg>

      {/* 2. Right Faded Antique Giant Rank Watermark Stamp */}
      <div className="absolute right-4 bottom-2 opacity-[0.11] flex flex-col items-center justify-center font-pixel pointer-events-none">
        <div className="w-36 h-36 rounded-full border-4 border-dashed border-[#542d17] flex items-center justify-center">
          <span className="text-8xl font-black text-[#542d17] leading-none select-none">
            {rank.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GuildSealWatermark;
