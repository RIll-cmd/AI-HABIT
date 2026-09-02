"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface PixelAgedParchmentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "folio" | "grimoire" | "tablet" | "raw";
  showTornEdges?: boolean;
  showWaterRing?: boolean;
  showCreases?: boolean;
  showInkSpill?: boolean;
}

export const PixelAgedParchment: React.FC<PixelAgedParchmentProps> = ({
  variant = "folio",
  showTornEdges = true,
  showWaterRing = true,
  showCreases = true,
  showInkSpill = true,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative select-none text-[#231006] transition-all overflow-hidden",
        /* Base antique parchment background with high-res texture and charred burnt borders */
        "bg-[#ebd5ab] border-2 border-[#4a1f0a]",
        "shadow-[0_0_0_1px_#1c0a04,0_6px_16px_rgba(0,0,0,0.8),inset_0_0_28px_rgba(45,18,7,0.7),inset_0_0_8px_rgba(20,6,2,0.9)]",
        variant === "folio" && "p-4 sm:p-5",
        variant === "grimoire" && "p-5 sm:p-6",
        variant === "tablet" && "p-3 sm:p-4",
        className
      )}
      style={{
        backgroundImage: `url('/textures/ancient_parchment.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      {...props}
    >
      {/* ================= 1. SUN-BLEACHED MULTIPLY TINT OVERLAY ================= */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-60"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(254, 243, 199, 0.5) 0%, rgba(217, 119, 6, 0.15) 60%, rgba(69, 26, 3, 0.45) 100%)`,
        }}
      />



      {/* ================= 3. TATTERED & FRAYED EDGE NOTCHES (MICRO-TEARS) ================= */}
      {showTornEdges && (
        <>
          {/* Top Edge Singed Notches */}
          <div className="absolute top-[-2px] left-8 w-3 h-[2px] bg-[#1a0803] pointer-events-none" />
          <div className="absolute top-[-2px] right-14 w-4 h-[3px] bg-[#2d1005] pointer-events-none" />
          <div className="absolute top-[-1px] left-1/3 w-2 h-[2px] bg-[#1a0803] pointer-events-none" />

          {/* Bottom Edge Singed Notches */}
          <div className="absolute bottom-[-2px] left-12 w-4 h-[3px] bg-[#2d1005] pointer-events-none" />
          <div className="absolute bottom-[-2px] right-10 w-3 h-[2px] bg-[#1a0803] pointer-events-none" />
          <div className="absolute bottom-[-1px] left-2/3 w-2 h-[2px] bg-[#1a0803] pointer-events-none" />

          {/* Left Edge Frayed Tears */}
          <div className="absolute left-[-2px] top-10 w-[2px] h-3 bg-[#1a0803] pointer-events-none" />
          <div className="absolute left-[-2px] bottom-12 w-[3px] h-4 bg-[#2d1005] pointer-events-none" />

          {/* Right Edge Frayed Tears */}
          <div className="absolute right-[-2px] top-14 w-[3px] h-4 bg-[#2d1005] pointer-events-none" />
          <div className="absolute right-[-2px] bottom-8 w-[2px] h-3 bg-[#1a0803] pointer-events-none" />
        </>
      )}

      {/* ================= 4. FOLD CREASES & DIAGONAL WRINKLE SHADOWS ================= */}
      {showCreases && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Major Diagonal Fold Line (Light highlight + Dark shadow ridge) */}
          <line x1="0%" y1="20%" x2="100%" y2="75%" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="0%" y1="20.5%" x2="100%" y2="75.5%" stroke="#3d1908" strokeWidth="1.2" strokeOpacity="0.6" />

          {/* Minor Horizontal Crease */}
          <line x1="5%" y1="48%" x2="95%" y2="52%" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.3" />
          <line x1="5%" y1="48.5%" x2="95%" y2="52.5%" stroke="#421a07" strokeWidth="1" strokeOpacity="0.5" />
        </svg>
      )}

      {/* ================= 5. FADED WATER RING STAIN (DRIED CIRCULAR CUP STAIN) ================= */}
      {showWaterRing && (
        <div className="absolute top-2 right-3 w-16 h-16 pointer-events-none opacity-20">
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <circle cx="32" cy="32" r="26" stroke="#4a1f0a" strokeWidth="2.5" strokeDasharray="6 3 12 2" />
            <circle cx="32" cy="32" r="24" stroke="#78350f" strokeWidth="1.2" opacity="0.6" />
            <circle cx="31" cy="31" r="27" stroke="#2d1005" strokeWidth="0.8" opacity="0.4" />
          </svg>
        </div>
      )}

      {/* ================= 6. INK SPLATTERS & FOXING AGE SPOTS ================= */}
      {showInkSpill && (
        <div className="absolute bottom-3 left-4 w-12 h-10 pointer-events-none opacity-15">
          <svg viewBox="0 0 48 40" fill="#2d1005" className="w-full h-full">
            <circle cx="12" cy="14" r="3" />
            <circle cx="15" cy="18" r="1.5" />
            <circle cx="18" cy="12" r="1" />
            <circle cx="8" cy="22" r="2" />
            <circle cx="24" cy="16" r="1.2" />
            <circle cx="30" cy="26" r="2.2" />
          </svg>
        </div>
      )}

      {/* ================= 7. INNER CONTENT CONTAINER ================= */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default PixelAgedParchment;
