"use client";

import React from "react";
import { Brain, Sparkles, BookOpen, Target, Clock, Zap, Headphones } from "lucide-react";
import { PomodoroTimer } from "@/features/learning/components/PomodoroTimer";
import { HabitLinkSelector } from "@/features/learning/components/HabitLinkSelector";
import { AmbientSoundPlayer } from "@/features/learning/components/AmbientSoundPlayer";
import { FocusStatistics } from "@/features/learning/components/FocusStatistics";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";

export default function LearningPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24 space-y-8 text-slate-100 relative">
      <FloatingRuneField density="low" />

      {/* Hero Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0C152B] via-[#0E2038] to-[#081022] border-2 border-cyan-500/40 p-6 md:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
              <Brain className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                COGNITIVE MASTERY & HABIT-INTEGRATED FOCUS
              </span>
              <h1 className="text-2xl md:text-3xl font-black font-heading text-white tracking-tight mt-0.5">
                Learning Command & Pomodoro Engine
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xl font-sans">
                Enter deep cognitive flow states with the integrated Pomodoro Timer. Link focus blocks directly to your daily habits and missions to level up real-world Knowledge (KNO), Focus (FOC), and Discipline (DIS) stats!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0B1020]/90 border border-cyan-500/20 p-3.5 rounded-2xl font-mono text-xs shadow-xl">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Standard Phase
              </span>
              <span className="text-base font-black text-cyan-300">25m Focus / 5m Rest</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left Column: Pomodoro Timer & Habit Linker */}
        <div className="lg:col-span-7 space-y-6">
          <PomodoroTimer />
          <HabitLinkSelector />
          <AmbientSoundPlayer />
        </div>

        {/* Right Column: Focus Statistics & Historical Logs */}
        <div className="lg:col-span-5 space-y-6">
          <FocusStatistics />
        </div>
      </div>
    </div>
  );
}
