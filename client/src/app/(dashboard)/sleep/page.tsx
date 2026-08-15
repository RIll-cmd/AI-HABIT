"use client";

import React from "react";
import { Moon, Sparkles, Activity, ShieldCheck, HeartPulse, Bed, Zap } from "lucide-react";
import { SleepLoggerCard } from "@/features/sleep/components/SleepLoggerCard";
import { SleepHistoryChart } from "@/features/sleep/components/SleepHistoryChart";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";

export default function SleepPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24 space-y-8 text-slate-100 relative">
      <FloatingRuneField density="low" />

      {/* Hero Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0C1226] via-[#101A38] to-[#080E20] border-2 border-indigo-500/40 p-6 md:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 shadow-[0_0_25px_rgba(99,102,241,0.3)]">
              <Moon className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-cyan-400" />
                SOMATIC RECOVERY & CELLULAR REGENERATION
              </span>
              <h1 className="text-2xl md:text-3xl font-black font-heading text-white tracking-tight mt-0.5">
                Sleep Sanctuary & Recovery (REC) Engine
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xl font-sans">
                Log your sleep hours to accelerate cellular recovery, replenish ATP pools, and scale your character&apos;s real-world Recovery (REC) stat. The closer you stay to the 8.0-hour golden standard, the higher your somatic multiplier!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0B1020]/90 border border-cyan-500/20 p-3.5 rounded-2xl font-mono text-xs shadow-xl">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Standard Goal
              </span>
              <span className="text-base font-black text-amber-300">8.00 Hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left Column: Interactive Sleep Logger */}
        <div className="lg:col-span-7 space-y-6">
          <SleepLoggerCard />
        </div>

        {/* Right Column: 7-Day History & Telemetry */}
        <div className="lg:col-span-5 space-y-6">
          <SleepHistoryChart />
        </div>
      </div>
    </div>
  );
}
