"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Authentic Victorian Steampunk Clockwork Sanctuary Backdrop
 * Completely occludes default backgrounds with boiler plate iron,
 * monumental escapement gear watermarks, blueprint crosshatches, and warm amber combustion glows.
 */
export function SteampunkBackground({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#0c0502]",
        className
      )}
    >
      {/* 1. Deep Victorian Iron & Cast-Boiler Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#180903] via-[#0e0502] to-[#070201] opacity-98" />

      {/* 2. Radial Boiler Furnace Combustion Glows */}
      <div
        className="absolute top-0 inset-x-0 h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(245, 158, 11, 0.18), rgba(180, 83, 9, 0.08) 50%, transparent 80%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 100% 100%, rgba(217, 119, 6, 0.12), rgba(69, 26, 3, 0.05) 50%, transparent 75%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 0% 100%, rgba(180, 83, 9, 0.1), transparent 70%)",
        }}
      />

      {/* 3. Machinist Blueprint & Boiler Rivet Crosshatch Grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(245, 158, 11, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(245, 158, 11, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* 4. Giant Background Clockwork Cog Silhouettes */}
      {/* Top-Right Giant 36-Tooth Escapement Gear */}
      <div className="absolute -top-32 -right-32 w-[580px] h-[580px] opacity-[0.06] text-[#f59e0b] animate-[gear-continuous-spin_120s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
          <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="3" fill="none" />
          <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" fill="none" />
          <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="2" fill="none" />
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            return (
              <rect
                key={i}
                x="47"
                y="1"
                width="6"
                height="8"
                transform={`rotate(${angle} 50 50)`}
                rx="1"
              />
            );
          })}
          {/* 6 Spokes */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 360) / 6;
            return (
              <line
                key={i}
                x1="50"
                y1="16"
                x2="50"
                y2="44"
                stroke="currentColor"
                strokeWidth="2.5"
                transform={`rotate(${angle} 50 50)`}
              />
            );
          })}
        </svg>
      </div>

      {/* Bottom-Left Giant 18-Tooth Ratchet Gear */}
      <div className="absolute -bottom-40 -left-40 w-[640px] h-[640px] opacity-[0.05] text-[#d97706] animate-[gear-continuous-spin_90s_linear_infinite_reverse] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="3" fill="none" />
          <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="2" strokeDasharray="4,2" fill="none" />
          <circle cx="50" cy="50" r="14" stroke="currentColor" strokeWidth="2" fill="none" />
          {Array.from({ length: 18 }).map((_, i) => {
            const angle = (i * 360) / 18;
            return (
              <polygon
                key={i}
                points="46,2 54,2 51,9 49,9"
                transform={`rotate(${angle} 50 50)`}
              />
            );
          })}
          {/* 4 Heavy Cross Spokes */}
          {[0, 90, 180, 270].map((angle) => (
            <line
              key={angle}
              x1="50"
              y1="14"
              x2="50"
              y2="42"
              stroke="currentColor"
              strokeWidth="3.5"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </svg>
      </div>

      {/* Center Astrolabe Planetary Orbit Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] opacity-[0.035] text-[#fbbf24] animate-[gear-continuous-spin_180s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-none stroke-current">
          <circle cx="100" cy="100" r="95" strokeWidth="1.5" strokeDasharray="8,4" />
          <circle cx="100" cy="100" r="80" strokeWidth="1" />
          <circle cx="100" cy="100" r="60" strokeWidth="1" strokeDasharray="2,6" />
          <circle cx="100" cy="100" r="40" strokeWidth="1.5" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 360) / 12;
            return (
              <line
                key={i}
                x1="100"
                y1="5"
                x2="100"
                y2="20"
                strokeWidth="1.5"
                transform={`rotate(${angle} 100 100)`}
              />
            );
          })}
        </svg>
      </div>

      {/* Top Steam Pipe Manifold Shadow */}
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#78350f] via-[#fbbf24] to-[#78350f] opacity-30 shadow-[0_2px_8px_#000]" />
    </div>
  );
}
