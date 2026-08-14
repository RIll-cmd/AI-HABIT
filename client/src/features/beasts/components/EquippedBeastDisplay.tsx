"use client";

import React from "react";
import { Beast } from "../types/beast";
import { Zap, Sparkles, Shield, Flame } from "lucide-react";
import Link from "next/link";

interface EquippedBeastDisplayProps {
  beast: Beast | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const EquippedBeastDisplay: React.FC<EquippedBeastDisplayProps> = ({
  beast,
  className = "",
  size = "md",
}) => {
  if (!beast) return null;

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14 sm:w-16 sm:h-16",
    lg: "w-20 h-20 sm:w-24 sm:h-24",
  };

  const getElementGlow = (element: string) => {
    switch (element) {
      case "FIRE":
        return "bg-red-500/25 shadow-[0_0_20px_rgba(239,68,68,0.5)]";
      case "FROST":
        return "bg-cyan-400/25 shadow-[0_0_20px_rgba(6,182,212,0.5)]";
      case "VOID":
        return "bg-purple-500/25 shadow-[0_0_20px_rgba(168,85,247,0.5)]";
      case "CYBER":
        return "bg-teal-400/25 shadow-[0_0_20px_rgba(45,212,191,0.5)]";
      case "NATURE":
        return "bg-emerald-400/25 shadow-[0_0_20px_rgba(16,185,129,0.5)]";
      case "HOLY":
        return "bg-amber-400/25 shadow-[0_0_20px_rgba(245,158,11,0.5)]";
      case "STORM":
        return "bg-yellow-400/25 shadow-[0_0_20px_rgba(234,179,8,0.5)]";
      default:
        return "bg-cyan-500/20";
    }
  };

  const buffType = beast.statBonusType || beast.passiveBuffType || "EXP_BOOST";
  const buffVal = beast.statBonusValue ?? beast.passiveBuffValue ?? 5;

  return (
    <Link href="/beasts">
      <div
        className={`relative flex items-center justify-center cursor-pointer group transition-transform duration-300 hover:scale-110 select-none ${className}`}
        title={`${beast.name} (${beast.species}) - +${buffVal}${buffType.includes("BOOST") ? "%" : " SP"} ${buffType.replace("_", " ")}`}
      >
        {/* Glowing Elemental Halo */}
        <div
          className={`absolute inset-0 rounded-full ${getElementGlow(
            beast.element
          )} blur-md pointer-events-none animate-pulse`}
        />

        {/* Dragon Sprite with Floating Physics */}
        <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
          <img
            src={beast.spritePath}
            alt={beast.name}
            className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(6,182,212,0.8)] animate-float-slow"
            style={{ imageRendering: "pixelated" }}
          />

          {/* Floating Sparkle Micro-badge */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-950/90 border border-cyan-500/50 flex items-center justify-center shadow-md">
            <Zap className="w-3 h-3 text-cyan-300" />
          </div>
        </div>
      </div>
    </Link>
  );
};
