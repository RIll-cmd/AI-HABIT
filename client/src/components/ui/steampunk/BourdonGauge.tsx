"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface BourdonGaugeProps {
  label: string;
  value: string | number;
  subtext: string;
  pct?: number; // 0 to 100
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "amber" | "copper" | "gold" | "crimson" | "verdigris";
  size?: "sm" | "md" | "lg";
  enableJitter?: boolean;
  className?: string;
}

const GAUGE_THEMES = {
  amber: {
    bezelOuter: "#78350f",
    bezelMid: "#d97706",
    bezelInner: "#451a03",
    dialFace: "#140803",
    needle: "#f59e0b",
    glow: "#f59e0b",
    textValue: "text-[#fbbf24]",
    textAccent: "text-[#fde047]",
    tickColor: "#d97706",
  },
  copper: {
    bezelOuter: "#92400e",
    bezelMid: "#b45309",
    bezelInner: "#3d1303",
    dialFace: "#160702",
    needle: "#ea580c",
    glow: "#ea580c",
    textValue: "text-[#fdba74]",
    textAccent: "text-[#fed7aa]",
    tickColor: "#b45309",
  },
  gold: {
    bezelOuter: "#b45309",
    bezelMid: "#f59e0b",
    bezelInner: "#451a03",
    dialFace: "#180d04",
    needle: "#fde047",
    glow: "#fbbf24",
    textValue: "text-[#fef08a]",
    textAccent: "text-[#ffffff]",
    tickColor: "#f59e0b",
  },
  crimson: {
    bezelOuter: "#7f1d1d",
    bezelMid: "#b91c1c",
    bezelInner: "#450a0a",
    dialFace: "#1a0404",
    needle: "#ef4444",
    glow: "#ef4444",
    textValue: "text-[#fca5a5]",
    textAccent: "text-[#fee2e2]",
    tickColor: "#dc2626",
  },
  verdigris: {
    bezelOuter: "#115e59",
    bezelMid: "#0f766e",
    bezelInner: "#042f2e",
    dialFace: "#031716",
    needle: "#14b8a6",
    glow: "#2dd4bf",
    textValue: "text-[#99f6e4]",
    textAccent: "text-[#ccfbf1]",
    tickColor: "#0f766e",
  },
};

/**
 * Authentic Victorian Bourdon Steam Manometer & Chrono-Pressure Gauge
 */
export function BourdonGauge({
  label,
  value,
  subtext,
  pct = 50,
  icon: Icon,
  variant = "amber",
  size = "md",
  enableJitter = true,
  className = "",
}: BourdonGaugeProps) {
  const gradientId = useId();
  const clampedPct = Math.min(100, Math.max(0, pct));
  // Standard manometer sweep: -125deg to +125deg (250 degree sweep)
  const needleAngle = -125 + (clampedPct / 100) * 250;
  const theme = GAUGE_THEMES[variant] || GAUGE_THEMES.amber;

  return (
    <div
      className={cn(
        "relative bg-[#160a05]/95 backdrop-blur-md border-4 border-[#3d1908] p-4 sm:p-5 shadow-[0_12px_28px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.08)] flex flex-col justify-between overflow-hidden group select-none min-h-[156px]",
        className
      )}
    >
      {/* 4 Corner Brass Rivets */}
      <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#d97706] border border-black shadow-[0_0.5px_0_rgba(255,255,255,0.4)]" />
      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#d97706] border border-black shadow-[0_0.5px_0_rgba(255,255,255,0.4)]" />
      <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#d97706] border border-black shadow-[0_0.5px_0_rgba(255,255,255,0.4)]" />
      <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#d97706] border border-black shadow-[0_0.5px_0_rgba(255,255,255,0.4)]" />

      {/* Top Header Row with Icon and Circular Bourdon Dial */}
      <div className="flex items-start justify-between border-b border-[#4d220a] pb-2.5 gap-2">
        <span className="text-sm sm:text-base font-pixel font-bold text-[#fef08a] uppercase tracking-wider flex items-center gap-1.5 leading-tight">
          {Icon && <Icon className="w-4.5 h-4.5 text-[#fbbf24] shrink-0" />}
          <span>{label}</span>
        </span>

        {/* Circular Steampunk Dial */}
        <div
          className={cn(
            "relative shrink-0 flex items-center justify-center",
            size === "sm" ? "w-10 h-10" : size === "lg" ? "w-14 h-14" : "w-12 h-12"
          )}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_4px_#000]">
            <defs>
              {/* Metallic Brass Bezel Gradient */}
              <linearGradient id={`bezel-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={theme.bezelMid} />
                <stop offset="50%" stopColor={theme.bezelOuter} />
                <stop offset="100%" stopColor={theme.bezelInner} />
              </linearGradient>

              {/* Convex Glass Glare Reflection */}
              <linearGradient id={`glare-${gradientId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
                <stop offset="50%" stopColor="rgba(255, 255, 255, 0.05)" />
                <stop offset="100%" stopColor="rgba(0, 0, 0, 0.4)" />
              </linearGradient>
            </defs>

            {/* Outer Brass Bezel Ring */}
            <circle cx="50" cy="50" r="48" fill={`url(#bezel-${gradientId})`} stroke="#000" strokeWidth="2" />
            
            {/* 6 Miniature Perimeter Screws */}
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const sx = 50 + 44 * Math.cos(rad);
              const sy = 50 + 44 * Math.sin(rad);
              return (
                <g key={deg}>
                  <circle cx={sx} cy={sy} r="2.2" fill="#d97706" stroke="#000" strokeWidth="0.5" />
                  <line
                    x1={sx - 1.2}
                    y1={sy - 0.5}
                    x2={sx + 1.2}
                    y2={sy + 0.5}
                    stroke="#000"
                    strokeWidth="0.6"
                  />
                </g>
              );
            })}

            {/* Inner Dark Dial Face */}
            <circle cx="50" cy="50" r="40" fill={theme.dialFace} stroke="#000" strokeWidth="1.5" />

            {/* Radial Graduation Arc and Tick Marks */}
            {Array.from({ length: 11 }).map((_, i) => {
              const deg = -125 + i * 25;
              const rad = (deg * Math.PI) / 180;
              const x1 = 50 + 36 * Math.sin(rad);
              const y1 = 50 - 36 * Math.cos(rad);
              const x2 = 50 + (i % 2 === 0 ? 30 : 33) * Math.sin(rad);
              const y2 = 50 - (i % 2 === 0 ? 30 : 33) * Math.cos(rad);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 2 === 0 ? theme.glow : theme.tickColor}
                  strokeWidth={i % 2 === 0 ? "1.8" : "1"}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Bourdon Tube Dial Center Inscription */}
            <text
              x="50"
              y="74"
              textAnchor="middle"
              fill={theme.textAccent}
              fontSize="6.5"
              fontFamily="monospace"
              fontWeight="bold"
              letterSpacing="0.5"
            >
              BAR
            </text>

            {/* Needle Pivot & Indicator Arm */}
            <g
              transform={`rotate(${needleAngle} 50 50)`}
              className={cn(
                "transition-transform duration-700 ease-out",
                enableJitter && clampedPct > 0 && "animate-steampunk-jitter"
              )}
            >
              {/* Needle Counterweight Teardrop */}
              <circle cx="50" cy="62" r="4" fill="#2d1306" stroke="#000" strokeWidth="0.5" />
              {/* Tapered Pointer */}
              <polygon
                points="48.5,50 51.5,50 50,18"
                fill={theme.needle}
                stroke="#000"
                strokeWidth="0.5"
              />
            </g>

            {/* Center Ruby Jewel Pivot */}
            <circle cx="50" cy="50" r="5" fill="#f59e0b" stroke="#000" strokeWidth="1" />
            <circle cx="50" cy="50" r="2.5" fill="#b91c1c" />
            <circle cx="49" cy="49" r="1" fill="#fff" />

            {/* Specular Convex Lens Highlight */}
            <circle cx="50" cy="50" r="37" fill={`url(#glare-${gradientId})`} pointerEvents="none" />
          </svg>
        </div>
      </div>

      {/* Main Metric Value and Telemetry Subtext */}
      <div className="mt-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className={cn("text-2xl sm:text-3xl lg:text-4xl font-pixel font-bold tracking-wider leading-none", theme.textValue)}>
            {value}
          </div>
          <span className="font-mono text-sm font-bold text-[#fde047]">
            {Math.round(clampedPct)}%
          </span>
        </div>
        <span className="text-xs sm:text-sm font-sans text-amber-100 block font-medium mt-1 leading-snug">
          {subtext}
        </span>
      </div>
    </div>
  );
}
