"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface NixieDisplayProps {
  value: string | number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  label?: string;
  variant?: "orange" | "amber" | "emerald" | "crimson";
  className?: string;
}

const NIXIE_VARIANTS = {
  orange: {
    glow: "rgba(255, 107, 0, 0.7)",
    textColor: "text-[#ff922b]",
    bgGlow: "bg-[#ff6b00]/10",
    border: "border-[#78350f]",
    tubeBorder: "border-[#542d17]",
  },
  amber: {
    glow: "rgba(245, 158, 11, 0.7)",
    textColor: "text-[#fbbf24]",
    bgGlow: "bg-[#f59e0b]/10",
    border: "border-[#78350f]",
    tubeBorder: "border-[#542d17]",
  },
  emerald: {
    glow: "rgba(16, 185, 129, 0.7)",
    textColor: "text-[#34d399]",
    bgGlow: "bg-[#10b981]/10",
    border: "border-[#064e3b]",
    tubeBorder: "border-[#065f46]",
  },
  crimson: {
    glow: "rgba(239, 68, 68, 0.7)",
    textColor: "text-[#f87171]",
    bgGlow: "bg-[#ef4444]/10",
    border: "border-[#7f1d1d]",
    tubeBorder: "border-[#991b1b]",
  },
};

const SIZE_CONFIGS = {
  xs: {
    tube: "px-1.5 py-0.5 min-w-[20px] text-xs",
    height: "h-6",
    pin: "w-0.5 h-1",
  },
  sm: {
    tube: "px-2 py-0.5 min-w-[24px] text-xs sm:text-sm",
    height: "h-7",
    pin: "w-0.5 h-1.5",
  },
  md: {
    tube: "px-2.5 py-1 min-w-[32px] text-sm sm:text-base",
    height: "h-9",
    pin: "w-1 h-1.5",
  },
  lg: {
    tube: "px-3 py-1.5 min-w-[40px] text-lg sm:text-xl",
    height: "h-11",
    pin: "w-1 h-2",
  },
  xl: {
    tube: "px-4 py-2 min-w-[50px] text-2xl sm:text-3xl",
    height: "h-14",
    pin: "w-1.5 h-2.5",
  },
};

/**
 * Individual Steampunk Nixie Tube Bulb
 */
export function NixieDigit({
  char,
  size = "md",
  variant = "orange",
}: {
  char: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "orange" | "amber" | "emerald" | "crimson";
}) {
  const conf = SIZE_CONFIGS[size];
  const theme = NIXIE_VARIANTS[variant] || NIXIE_VARIANTS.orange;

  return (
    <div className="relative inline-flex flex-col items-center select-none shrink-0 group">
      {/* Top Glass Tube Dome */}
      <div
        className={cn(
          "relative flex items-center justify-center bg-[#0d0502]/95 border-2 rounded-t-md rounded-b-xs shadow-[inset_0_0_10px_#000,0_2px_4px_rgba(0,0,0,0.8)] overflow-hidden",
          conf.tube,
          conf.height,
          theme.tubeBorder
        )}
      >
        {/* Background Cathode Honeycomb Mesh Wire Screen */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #ff922b 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        {/* Top-to-Bottom Glass Specular Reflection Highlight */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none" />

        {/* Ambient Warm Gas Glow */}
        <div className={cn("absolute inset-0 blur-xs opacity-40 pointer-events-none", theme.bgGlow)} />

        {/* Glowing Neon Filament Character */}
        <span
          className={cn(
            "relative z-10 font-mono font-extrabold tracking-wider leading-none tabular-nums animate-nixie-flicker",
            theme.textColor
          )}
          style={{
            textShadow: `0 0 6px ${theme.glow}, 0 0 12px ${theme.glow}`,
          }}
        >
          {char}
        </span>
      </div>

      {/* Bakelite Base Plate with Copper Contacts */}
      <div className="w-full flex items-center justify-around mt-0.5 px-0.5">
        <div className={cn("bg-[#b45309] border border-black rounded-xs shadow-[0_1px_0_#000]", conf.pin)} />
        <div className={cn("bg-[#b45309] border border-black rounded-xs shadow-[0_1px_0_#000]", conf.pin)} />
      </div>
    </div>
  );
}

/**
 * Steampunk Multi-Digit Nixie Tube Display Unit
 */
export function NixieDisplay({
  value,
  size = "md",
  label,
  variant = "orange",
  className = "",
}: NixieDisplayProps) {
  const chars = String(value).split("");

  return (
    <div className={cn("inline-flex flex-col items-center gap-1", className)}>
      {label && (
        <span className="text-xs font-pixel font-bold text-[#f59e0b] uppercase tracking-wider mb-0.5">
          {label}
        </span>
      )}

      <div className="flex items-center gap-1 p-1 bg-[#100602] border-2 border-[#542d17] shadow-[inset_0_2px_4px_#000,0_2px_0_#000]">
        {chars.map((ch, idx) => (
          <NixieDigit key={idx} char={ch} size={size} variant={variant} />
        ))}
      </div>
    </div>
  );
}
