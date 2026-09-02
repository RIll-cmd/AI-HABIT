"use client";

import React from "react";
import {
  Flame,
  Dumbbell,
  ShieldAlert,
  Brain,
  Layers,
  Sparkles,
  Zap,
  TrendingUp,
  HeartPulse,
  Egg,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FeatureGrid() {
  return (
    <section
      id="features"
      className="relative w-full py-20 px-4 sm:px-6 max-w-6xl mx-auto flex flex-col gap-12"
      aria-labelledby="features-heading"
    >
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>FOUR PILLARS OF ASCENSION</span>
        </div>

        <h2
          id="features-heading"
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white"
        >
          Engineered for Ruthless Discipline.
        </h2>

        <p className="text-sm text-zinc-400 leading-relaxed">
          Every daily action directly raises your IRL attributes and deals live combat damage to dungeon raid bosses.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        
        {/* Pillar 1: Neural Habit Matrix (Spans 7 cols on LG) */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-zinc-900/80 border border-zinc-800/90 shadow-xl flex flex-col justify-between gap-6 relative overflow-hidden group hover:border-zinc-750 transition-colors">
          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                Habit Engine
              </span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              Neural Habit Matrix & Streaks
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
              Customizable schedules (daily, specific weekdays, weekly targets) with multi-tier Bronze, Silver, and Gold completion thresholds. Protect consistency with streak freeze shields and calendar adherence heatmaps.
            </p>
          </div>

          {/* Habit Mock UI Snippet */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col gap-2.5 font-mono text-xs text-zinc-300 relative z-10">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60 text-[11px]">
              <span className="text-zinc-400">MISSION DECK (TODAY)</span>
              <span className="text-cyan-400 font-bold">3/4 CLEARED</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-[9px]">✓</span>
                <span className="text-zinc-200">Deep Work: 90m Code Architecture</span>
              </div>
              <span className="text-[11px] text-amber-400">+50 EXP • +20 GOLD</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-[9px]">✓</span>
                <span className="text-zinc-200">Hydration: 3.5L Pure Water</span>
              </div>
              <span className="text-[11px] text-emerald-400">+10 REC</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Kinetic Workout Terminal (Spans 5 cols on LG) */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-zinc-900/80 border border-zinc-800/90 shadow-xl flex flex-col justify-between gap-6 relative overflow-hidden group hover:border-zinc-750 transition-colors">
          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-cyan-400">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                Gym Terminal
              </span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              Kinetic 16-Muscle Recovery
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Log sets, weight, reps, and RPE with automated 1RM calculations. Track anatomical recovery across 16 muscle groups over 48-72h curves.
            </p>
          </div>

          {/* Recovery Heatmap Status */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col gap-2 font-mono text-xs relative z-10">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">ANATOMICAL READINESS</span>
              <span className="text-emerald-400 font-bold">88% FRESH</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[88%]" />
            </div>
            <span className="text-[10px] text-zinc-500">Chest, Delts & Quads fully recovered</span>
          </div>
        </div>

        {/* Pillar 3: Character Arsenal & Bestiary (Spans 5 cols on LG) */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-zinc-900/80 border border-zinc-800/90 shadow-xl flex flex-col justify-between gap-6 relative overflow-hidden group hover:border-zinc-750 transition-colors">
          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-purple-400">
                <Egg className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                Bestiary & Arsenal
              </span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              Bestiary Pedometer & Gear
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Convert daily walking strides into incubation energy for 20 companion species. Equip socketed armory items with percentage multipliers.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between font-mono text-xs relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 text-[11px] font-bold">
                🥚
              </div>
              <div className="flex flex-col">
                <span className="text-zinc-200 font-bold text-[11px]">Astral Serpent Egg</span>
                <span className="text-[10px] text-zinc-500">6,840 / 10,000 Steps</span>
              </div>
            </div>
            <span className="text-[11px] text-purple-300 font-bold">68%</span>
          </div>
        </div>

        {/* Pillar 4: AIRA Neural AI Guidance (Spans 7 cols on LG) */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-zinc-900/80 border border-zinc-800/90 shadow-xl flex flex-col justify-between gap-6 relative overflow-hidden group hover:border-zinc-750 transition-colors">
          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-cyan-400">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                AI Companion
              </span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              AIRA Autonomous System Administrator
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
              Autonomous neural companion with direct telemetry access to your workout logs, sleep debt, and habit consistency. Briefs you with daily strategy and high-agency motivation.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-start gap-3 text-xs text-zinc-300 relative z-10">
            <div className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 text-[10px] font-mono font-bold">
              AI
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              <strong className="text-cyan-300">AIRA:</strong> &quot;Operative, your chest recovery is at 100% while sleep debt reduced by 1.2h. Today is optimal for a heavy Push workout and completing your 90-minute focus sprint.&quot;
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
