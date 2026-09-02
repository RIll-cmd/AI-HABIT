"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SteampunkGearProps {
  size?: number;
  teeth?: number;
  rotation?: number;
  variant?: "brass" | "copper" | "iron" | "gold" | "verdigris";
  className?: string;
  speedMultiplier?: number;
  isContinuous?: boolean;
}

const GEAR_PALETTES = {
  brass: {
    rim: "#d97706",
    face: "#f59e0b",
    inner: "#78350f",
    hole: "#180d07",
    tooth: "#fbbf24",
    highlight: "#fef08a",
    shadow: "#451a03",
  },
  copper: {
    rim: "#b45309",
    face: "#d97706",
    inner: "#92400e",
    hole: "#180d07",
    tooth: "#ea580c",
    highlight: "#fde047",
    shadow: "#3d1303",
  },
  iron: {
    rim: "#3f3f46",
    face: "#71717a",
    inner: "#27272a",
    hole: "#09090b",
    tooth: "#a1a1aa",
    highlight: "#e4e4e7",
    shadow: "#18181b",
  },
  gold: {
    rim: "#f59e0b",
    face: "#fde047",
    inner: "#b45309",
    hole: "#1c0d05",
    tooth: "#fef08a",
    highlight: "#ffffff",
    shadow: "#78350f",
  },
  verdigris: {
    rim: "#0f766e",
    face: "#14b8a6",
    inner: "#115e59",
    hole: "#042f2e",
    tooth: "#2dd4bf",
    highlight: "#99f6e4",
    shadow: "#042f2e",
  },
};

/**
 * Procedural Steampunk Machined Cogwheel with pixel-precise bevels and spokes
 */
export function SteampunkCog({
  size = 48,
  teeth = 8,
  rotation = 0,
  variant = "brass",
  className = "",
  isContinuous = false,
  speedMultiplier = 1,
}: SteampunkGearProps) {
  const pal = GEAR_PALETTES[variant] || GEAR_PALETTES.brass;

  return (
    <div
      className={cn(
        "relative shrink-0 select-none transition-transform ease-out",
        isContinuous ? "animate-gear-spin" : "duration-700",
        className
      )}
      style={{
        width: size,
        height: size,
        transform: isContinuous ? undefined : `rotate(${rotation}deg)`,
        animationDuration: isContinuous ? `${12 / Math.max(0.1, speedMultiplier)}s` : undefined,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 32 32"
        shapeRendering="crispEdges"
        className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
      >
        {/* Gear Teeth around perimeter (8, 12, or 16 teeth layout) */}
        {teeth >= 8 && (
          <>
            {/* Cardinal Teeth */}
            <rect x="13" y="0" width="6" height="4" fill={pal.tooth} stroke="#000" strokeWidth="0.5" />
            <rect x="13" y="28" width="6" height="4" fill={pal.tooth} stroke="#000" strokeWidth="0.5" />
            <rect x="0" y="13" width="4" height="6" fill={pal.tooth} stroke="#000" strokeWidth="0.5" />
            <rect x="28" y="13" width="4" height="6" fill={pal.tooth} stroke="#000" strokeWidth="0.5" />
            
            {/* Diagonal Corner Teeth */}
            <rect x="4" y="4" width="5" height="5" fill={pal.tooth} stroke="#000" strokeWidth="0.5" />
            <rect x="23" y="4" width="5" height="5" fill={pal.tooth} stroke="#000" strokeWidth="0.5" />
            <rect x="4" y="23" width="5" height="5" fill={pal.tooth} stroke="#000" strokeWidth="0.5" />
            <rect x="23" y="23" width="5" height="5" fill={pal.tooth} stroke="#000" strokeWidth="0.5" />
          </>
        )}

        {teeth >= 12 && (
          <>
            {/* Intermediate Sub-teeth for high-density cogs */}
            <rect x="8" y="1" width="3" height="4" fill={pal.tooth} />
            <rect x="21" y="1" width="3" height="4" fill={pal.tooth} />
            <rect x="8" y="27" width="3" height="4" fill={pal.tooth} />
            <rect x="21" y="27" width="3" height="4" fill={pal.tooth} />
            <rect x="1" y="8" width="4" height="3" fill={pal.tooth} />
            <rect x="1" y="21" width="4" height="3" fill={pal.tooth} />
            <rect x="27" y="8" width="4" height="3" fill={pal.tooth} />
            <rect x="27" y="21" width="4" height="3" fill={pal.tooth} />
          </>
        )}

        {/* Outer Heavy Brass Rim */}
        <rect x="8" y="4" width="16" height="24" fill={pal.rim} stroke="#000" strokeWidth="0.5" />
        <rect x="4" y="8" width="24" height="16" fill={pal.rim} stroke="#000" strokeWidth="0.5" />
        <rect x="6" y="6" width="20" height="20" fill={pal.rim} />

        {/* Machined Recessed Face */}
        <rect x="9" y="6" width="14" height="20" fill={pal.face} />
        <rect x="6" y="9" width="20" height="14" fill={pal.face} />
        <rect x="7" y="7" width="18" height="18" fill={pal.face} />

        {/* 4 Clockwork Spoke Openings (Cutouts revealing dark interior) */}
        <rect x="9" y="9" width="4" height="4" fill={pal.inner} stroke={pal.shadow} strokeWidth="0.5" />
        <rect x="19" y="9" width="4" height="4" fill={pal.inner} stroke={pal.shadow} strokeWidth="0.5" />
        <rect x="9" y="19" width="4" height="4" fill={pal.inner} stroke={pal.shadow} strokeWidth="0.5" />
        <rect x="19" y="19" width="4" height="4" fill={pal.inner} stroke={pal.shadow} strokeWidth="0.5" />

        {/* Central Hub & Axle */}
        <circle cx="16" cy="16" r="4.5" fill={pal.rim} stroke="#000" strokeWidth="0.5" />
        <circle cx="16" cy="16" r="2.5" fill={pal.hole} />
        <circle cx="15.5" cy="15.5" r="1" fill={pal.highlight} />
      </svg>
    </div>
  );
}

/**
 * Multi-Gear Planetary Drive with synchronized angular velocities
 */
export function SteampunkGearTrain({
  rotation = 0,
  className = "",
  isContinuous = false,
}: {
  rotation?: number;
  className?: string;
  isContinuous?: boolean;
}) {
  return (
    <div className={cn("relative flex items-center select-none shrink-0", className)}>
      {/* 1. Large Driver Sun Gear (Left) */}
      <SteampunkCog
        size={52}
        teeth={12}
        variant="gold"
        rotation={rotation}
        isContinuous={isContinuous}
        speedMultiplier={1}
        className="z-10"
      />

      {/* 2. Intermediate Idler Gear (Meshing in counter-rotation) */}
      <SteampunkCog
        size={36}
        teeth={8}
        variant="copper"
        rotation={-rotation * 1.5}
        isContinuous={isContinuous}
        speedMultiplier={-1.5}
        className="-ml-3.5 mt-4 z-20"
      />

      {/* 3. Small Pinion Gear (Meshing forward) */}
      <SteampunkCog
        size={28}
        teeth={8}
        variant="brass"
        rotation={rotation * 2}
        isContinuous={isContinuous}
        speedMultiplier={2}
        className="-ml-2.5 -mt-3 z-30"
      />

      {/* 4. Large Heavy Driven Escapement Cog (Right) */}
      <SteampunkCog
        size={44}
        teeth={12}
        variant="verdigris"
        rotation={-rotation * 0.8}
        isContinuous={isContinuous}
        speedMultiplier={-0.8}
        className="-ml-3 mt-2 z-10 opacity-90"
      />
    </div>
  );
}
