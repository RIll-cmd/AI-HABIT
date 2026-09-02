"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface KonosubaMagicCircleProps {
  className?: string;
  sp?: number;
  unlockedCount?: number;
}

/**
 * Authentic KonoSuba Status Card Elemental Affinity Compass & Skill Points (SP/AP) Diagram
 * Features the 6-element nodes (Fire, Water, Wind, Earth, Light, Dark) with interconnecting
 * ley-lines and the bottom AP/SP badge from Kazuma, Megumin, and Aqua's adventurer cards.
 */
export const KonosubaMagicCircle: React.FC<KonosubaMagicCircleProps> = ({
  className,
  sp = 0,
  unlockedCount = 3,
}) => {
  return (
    <div className={cn("flex items-center gap-1 font-pixel select-none text-[#382013]", className)}>
      {/* Left Vertical Barcode Rune Strip */}
      <div className="flex flex-col items-center justify-between text-[7px] font-bold text-[#633a20] tracking-tighter h-36 px-0.5 border-r border-[#633a20]/40">
        <span className="writing-vertical rotate-180">B</span>
        <span className="writing-vertical rotate-180">L</span>
        <span className="writing-vertical rotate-180">E</span>
        <span className="writing-vertical rotate-180">A</span>
        <span className="writing-vertical rotate-180">T</span>
        <span className="writing-vertical rotate-180">W</span>
        <span className="writing-vertical rotate-180">Q/O</span>
        <span className="writing-vertical rotate-180">F</span>
      </div>

      {/* Main Elemental Compass Diagram */}
      <div className="relative w-32 h-36 flex flex-col items-center justify-between p-1 bg-[#ecd9b5]/40 border border-[#633a20]/40 shadow-[inset_0_0_8px_rgba(99,58,32,0.15)]">
        <svg
          viewBox="0 0 100 110"
          className="w-full h-28 text-[#522e18]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          style={{ shapeRendering: "crispEdges" }}
        >
          {/* Outer Magic Circles */}
          <circle cx="50" cy="40" r="34" strokeDasharray="3 2" />
          <circle cx="50" cy="40" r="30" />
          <circle cx="50" cy="40" r="22" strokeDasharray="2 2" />

          {/* Central Sacred Hexagon & Ley-lines */}
          <polygon points="50,14 74,27 74,53 50,66 26,53 26,27" strokeWidth="0.8" />
          <line x1="50" y1="6" x2="50" y2="74" strokeWidth="0.8" strokeDasharray="2 2" />
          <line x1="20" y1="23" x2="80" y2="57" strokeWidth="0.8" strokeDasharray="2 2" />
          <line x1="20" y1="57" x2="80" y2="23" strokeWidth="0.8" strokeDasharray="2 2" />

          {/* 6 Elemental Nodes */}
          {/* Top (Fire) */}
          <circle cx="50" cy="10" r="5" fill="#382013" />
          <circle cx="50" cy="10" r="3" fill="#ecd9b5" />

          {/* Top-Right (Wind) */}
          <circle cx="76" cy="25" r="4.5" fill="#382013" />
          <circle cx="76" cy="25" r="2.5" fill="#ecd9b5" />

          {/* Bottom-Right (Earth) */}
          <circle cx="76" cy="55" r="4.5" fill="#382013" />
          <circle cx="76" cy="55" r="2.5" fill="#ecd9b5" />

          {/* Bottom (Dark) */}
          <circle cx="50" cy="70" r="5" fill="#382013" />
          <circle cx="50" cy="70" r="3" fill="#ecd9b5" />

          {/* Bottom-Left (Water) */}
          <circle cx="24" cy="55" r="4.5" fill="#382013" />
          <circle cx="24" cy="55" r="2.5" fill="#ecd9b5" />

          {/* Top-Left (Light) */}
          <circle cx="24" cy="25" r="4.5" fill="#382013" />
          <circle cx="24" cy="25" r="2.5" fill="#ecd9b5" />

          {/* Central Eye / Rune Core */}
          <circle cx="50" cy="40" r="8" fill="#382013" />
          <circle cx="50" cy="40" r="4" fill="#ecd9b5" />
          <circle cx="50" cy="40" r="1.5" fill="#382013" />

          {/* Connecting Trunk to Bottom SP Badge */}
          <line x1="50" y1="75" x2="50" y2="92" strokeWidth="1.5" />
          <polygon points="46,84 50,80 54,84 50,88" fill="#382013" />
        </svg>

        {/* Bottom AP/SP Badge Plate */}
        <div className="w-full mt-[-8px] bg-[#382013] text-[#fef08a] border border-[#1a0c05] px-2 py-0.5 text-center shadow-[inset_1px_1px_0_0_#633a20]">
          <div className="flex items-center justify-between text-[8px] tracking-wider uppercase">
            <span className="text-[#e2b17a]">SP / AP</span>
            <span className="font-bold text-[#fef08a]">{sp}</span>
          </div>
        </div>
      </div>

      {/* Right Vertical Elements Text Label */}
      <div className="flex flex-col items-center justify-between text-[7px] font-bold text-[#633a20] tracking-tighter h-36 px-0.5 border-l border-[#633a20]/40">
        <span>E</span>
        <span>L</span>
        <span>E</span>
        <span>M</span>
        <span>E</span>
        <span>N</span>
        <span>T</span>
        <span>S</span>
      </div>
    </div>
  );
};

export default KonosubaMagicCircle;
