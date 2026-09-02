"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface KnifeSwitchToggleProps {
  checked: boolean;
  onChange?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  "aria-label"?: string;
}

/**
 * Authentic Victorian Steampunk Knife-Switch Lever Toggle
 */
export function KnifeSwitchToggle({
  checked,
  onChange,
  disabled = false,
  size = "md",
  className = "",
  "aria-label": ariaLabel = "Toggle Switch",
}: KnifeSwitchToggleProps) {
  const sizes = {
    sm: { box: "w-7 h-5", blade: "w-5 h-2", pivot: "w-2 h-2" },
    md: { box: "w-9 h-6", blade: "w-6 h-2.5", pivot: "w-2.5 h-2.5" },
    lg: { box: "w-11 h-7", blade: "w-8 h-3", pivot: "w-3 h-3" },
  }[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        "relative inline-flex items-center justify-center p-0.5 bg-[#0e0502] border-2 border-[#542d17] rounded-xs shadow-[inset_0_1px_3px_#000,0_2px_0_#000] cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b] disabled:opacity-50 disabled:cursor-not-allowed group select-none shrink-0",
        sizes.box,
        checked ? "border-[#f59e0b] shadow-[inset_0_1px_4px_rgba(245,158,11,0.3),0_0_8px_rgba(245,158,11,0.4)]" : "hover:border-[#78350f]",
        className
      )}
    >
      {/* Dual Brass Contact Jaws (Right / Active contact) */}
      <div
        className={cn(
          "absolute right-1 w-1.5 h-3 border border-black transition-colors duration-300",
          checked ? "bg-[#fde047] shadow-[0_0_4px_#f59e0b]" : "bg-[#78350f]"
        )}
      />

      {/* Left Pivot Contact (Base Hinge) */}
      <div className="absolute left-1 w-2 h-2 rounded-full bg-[#d97706] border border-black z-20 shadow-[0_0.5px_0_#fff]" />

      {/* Mechanical Copper Knife Blade Lever */}
      <div
        className={cn(
          "absolute left-1.5 origin-left h-1.5 bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#fbbf24] border border-black rounded-xs transition-transform duration-300 ease-out z-10",
          sizes.blade,
          checked ? "rotate-0 scale-x-100" : "-rotate-45 scale-x-95 opacity-80"
        )}
      >
        {/* Insulated Bakelite Lever Grip Tip */}
        <div className="absolute -right-1 -top-1 w-2 h-3.5 bg-[#451a03] border border-black rounded-xs shadow-[0_1px_0_#000]" />
      </div>

      {/* Sparks / Glow effect when thrown */}
      {checked && (
        <span className="absolute right-0.5 top-0.5 w-1 h-1 bg-[#fff] rounded-full shadow-[0_0_6px_#fde047] animate-ping pointer-events-none" />
      )}
    </button>
  );
}
