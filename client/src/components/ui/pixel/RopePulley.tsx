"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface RopePulleyProps {
  className?: string;
  side?: "left" | "right";
}

/**
 * 8-Bit Retro Pixel Art Rope & Pulley Mechanism
 * Built using crisp pixel grid rects with authentic hemp rope weave & wooden pulley.
 */
export const RopePulley: React.FC<RopePulleyProps> = ({ className, side = "left" }) => {
  return (
    <div className={cn("relative flex flex-col items-center select-none pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]", className)}>
      <svg
        width="44"
        height="120"
        viewBox="0 0 44 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ shapeRendering: "crispEdges", imageRendering: "pixelated" }}
      >
        {/* === TIMBER CEILING BRACKET === */}
        <rect x="14" y="0" width="16" height="8" fill="#3b1d0e" />
        <rect x="12" y="8" width="20" height="4" fill="#4d2713" stroke="#1f0f08" strokeWidth="2" />
        <rect x="18" y="2" width="8" height="4" fill="#1f0f08" />
        <rect x="20" y="3" width="4" height="2" fill="#697386" />

        {/* === IRON PULLEY MOUNT STRUTS === */}
        <rect x="18" y="12" width="8" height="6" fill="#18131d" />
        <rect x="20" y="14" width="4" height="4" fill="#363945" />

        {/* === PIXEL WOODEN PULLEY WHEEL (Stepped 8-Bit Octagon Wheel) === */}
        {/* Outer Wheel Rim */}
        <rect x="16" y="18" width="12" height="2" fill="#1a0c06" />
        <rect x="12" y="20" width="20" height="2" fill="#1a0c06" />
        <rect x="10" y="22" width="24" height="12" fill="#522a15" stroke="#1a0c06" strokeWidth="2" />
        <rect x="12" y="34" width="20" height="2" fill="#1a0c06" />
        <rect x="16" y="36" width="12" height="2" fill="#1a0c06" />

        {/* Wheel Inset & Wood Texture */}
        <rect x="14" y="24" width="16" height="8" fill="#3b1d0e" />
        <rect x="16" y="26" width="12" height="4" fill="#6e391d" />

        {/* Center Iron Hub Axle */}
        <rect x="18" y="26" width="8" height="4" fill="#111827" stroke="#374151" strokeWidth="1" />
        <rect x="21" y="27" width="2" height="2" fill="#9ca3af" />

        {/* === ROPE SECTION AROUND WHEEL === */}
        <rect x="8" y="18" width="4" height="16" fill="#c99f63" />
        <rect x="8" y="20" width="2" height="3" fill="#ebd19d" />
        <rect x="8" y="25" width="2" height="3" fill="#ebd19d" />
        <rect x="8" y="30" width="2" height="3" fill="#ebd19d" />
        <rect x="32" y="18" width="4" height="16" fill="#a87d46" />
        <rect x="34" y="20" width="2" height="3" fill="#c99f63" />
        <rect x="34" y="25" width="2" height="3" fill="#c99f63" />

        {/* === HANGING PIXEL HEMP ROPE COIL 1 (Large Outer Loop) === */}
        {/* Left Strand */}
        <rect x="12" y="36" width="4" height="24" fill="#c99f63" />
        <rect x="12" y="38" width="2" height="3" fill="#fae1ab" />
        <rect x="14" y="43" width="2" height="3" fill="#9c7138" />
        <rect x="12" y="48" width="2" height="3" fill="#fae1ab" />
        <rect x="14" y="53" width="2" height="3" fill="#9c7138" />

        {/* Right Strand */}
        <rect x="28" y="36" width="4" height="24" fill="#b08449" />
        <rect x="28" y="38" width="2" height="3" fill="#dfba7c" />
        <rect x="30" y="43" width="2" height="3" fill="#805626" />
        <rect x="28" y="48" width="2" height="3" fill="#dfba7c" />
        <rect x="30" y="53" width="2" height="3" fill="#805626" />

        {/* Bottom U-Loop of Coil 1 */}
        <rect x="14" y="60" width="16" height="4" fill="#b08449" />
        <rect x="16" y="62" width="12" height="2" fill="#784f22" />
        <rect x="18" y="60" width="4" height="2" fill="#ebd19d" />

        {/* === HANGING PIXEL HEMP ROPE COIL 2 (Inner Intertwined Loop) === */}
        {/* Left inner strand */}
        <rect x="16" y="40" width="3" height="28" fill="#dfba7c" />
        <rect x="16" y="42" width="2" height="3" fill="#fae1ab" />
        <rect x="17" y="48" width="2" height="3" fill="#9c7138" />
        <rect x="16" y="54" width="2" height="3" fill="#fae1ab" />
        <rect x="17" y="60" width="2" height="3" fill="#9c7138" />

        {/* Right inner strand */}
        <rect x="25" y="40" width="3" height="28" fill="#9c7138" />
        <rect x="25" y="44" width="2" height="3" fill="#dfba7c" />
        <rect x="26" y="50" width="2" height="3" fill="#693e15" />
        <rect x="25" y="56" width="2" height="3" fill="#dfba7c" />
        <rect x="26" y="62" width="2" height="3" fill="#693e15" />

        {/* Bottom U-Loop of Coil 2 */}
        <rect x="17" y="68" width="10" height="4" fill="#9c7138" />
        <rect x="19" y="68" width="6" height="2" fill="#ebd19d" />
        <rect x="18" y="70" width="8" height="2" fill="#542e0d" />

        {/* === BINDING ROPE KNOT (Middle Clamping Tie) === */}
        <rect x="14" y="48" width="16" height="6" fill="#4d2b12" stroke="#2b1506" strokeWidth="1" />
        <rect x="16" y="49" width="12" height="2" fill="#dfba7c" />
        <rect x="15" y="51" width="14" height="2" fill="#9c7138" />

        {/* === DANGLING FRAYED ROPE ENDS (With Pixel Tassels) === */}
        {/* Left dangling tail */}
        <rect x="18" y="74" width="3" height="26" fill="#c99f63" />
        <rect x="18" y="76" width="2" height="3" fill="#fae1ab" />
        <rect x="19" y="82" width="2" height="3" fill="#805626" />
        <rect x="18" y="88" width="2" height="3" fill="#fae1ab" />
        <rect x="19" y="94" width="2" height="3" fill="#805626" />
        {/* Frayed knot end */}
        <rect x="17" y="100" width="4" height="3" fill="#ebd19d" />
        <rect x="18" y="103" width="2" height="3" fill="#dfba7c" />
        <rect x="17" y="106" width="1" height="2" fill="#fae1ab" />
        <rect x="19" y="106" width="1" height="3" fill="#fae1ab" />

        {/* Right dangling tail (longer) */}
        <rect x="23" y="74" width="3" height="34" fill="#a87d46" />
        <rect x="23" y="78" width="2" height="3" fill="#c99f63" />
        <rect x="24" y="84" width="2" height="3" fill="#693e15" />
        <rect x="23" y="90" width="2" height="3" fill="#c99f63" />
        <rect x="24" y="96" width="2" height="3" fill="#693e15" />
        <rect x="23" y="102" width="2" height="3" fill="#c99f63" />
        {/* Frayed knot end */}
        <rect x="22" y="108" width="4" height="3" fill="#c99f63" />
        <rect x="23" y="111" width="2" height="4" fill="#ebd19d" />
        <rect x="22" y="115" width="1" height="2" fill="#dfba7c" />
        <rect x="24" y="115" width="2" height="3" fill="#fae1ab" />
      </svg>
    </div>
  );
};

export default RopePulley;
