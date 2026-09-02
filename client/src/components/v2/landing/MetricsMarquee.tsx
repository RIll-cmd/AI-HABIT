"use client";

import React from "react";
import { Zap, Flame, Activity, Egg, Lock, Shield } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";

export function MetricsMarquee() {
  const metrics = [
    { icon: Zap, label: "Solo Leveling PWR Rating", color: "text-cyan-400" },
    { icon: Flame, label: "24-Day Streak Protection", color: "text-amber-400" },
    { icon: Activity, label: "16-Muscle Recovery Curves", color: "text-emerald-400" },
    { icon: Egg, label: "20 Mythic Bestiary Species", color: "text-purple-400" },
    { icon: Lock, label: "Zero-Knowledge Telemetry", color: "text-cyan-400" },
    { icon: Shield, label: "100% Client-Side Sandbox", color: "text-emerald-400" },
  ];

  return (
    <div
      data-pause-on-hover="true"
      className="group/marquee-container relative w-full shrink-0 my-8 py-4 bg-zinc-950/90 border-y border-zinc-850/80 overflow-hidden z-20"
    >
      {/* Left and Right Fade Gradients */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent z-10" />

      {/* Magic UI Infinite Scrolling Marquee */}
      <Marquee pauseOnHover className="[--duration:28s] [--gap:1.5rem] py-1">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 select-none shadow-sm cursor-pointer transition-all duration-300 group-hover/marquee-container:opacity-30 group-hover/marquee-container:grayscale group-hover/marquee-container:scale-[0.98] hover:!opacity-100 hover:!grayscale-0 hover:!scale-105 hover:!border-zinc-600 hover:!bg-zinc-900 hover:!shadow-lg"
            >
              <div className="w-5 h-5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center transition-colors">
                <Icon className={`w-3 h-3 ${m.color}`} />
              </div>
              <span className="text-zinc-200 font-medium font-mono text-xs whitespace-nowrap transition-colors">
                {m.label}
              </span>
            </div>
          );
        })}
      </Marquee>
    </div>
  );
}

export default MetricsMarquee;
