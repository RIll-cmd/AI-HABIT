"use client";

import React from "react";
import {
  Brain,
  Flame,
  Clock,
  Award,
  Zap,
  BookOpen,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLearningStore } from "../store/useLearningStore";

export const FocusStatistics: React.FC<{ className?: string }> = ({ className = "" }) => {
  const {
    focusSessions,
    getTotalFocusMinutes,
    getTodayFocusMinutes,
    getFocusStreak,
    completedCycles,
  } = useLearningStore();

  const totalMins = getTotalFocusMinutes();
  const todayMins = getTodayFocusMinutes();
  const streak = getFocusStreak();

  const totalHours = (totalMins / 60).toFixed(1);
  const todayHours = (todayMins / 60).toFixed(1);

  // Category counts
  const catCounts: Record<string, number> = {};
  focusSessions.forEach((s) => {
    catCounts[s.category] = (catCounts[s.category] || 0) + s.durationMinutes;
  });

  return (
    <div
      className={`rounded-3xl bg-gradient-to-br from-[#0B1020]/95 via-[#070C18]/95 to-[#040710]/98 border-2 border-cyan-500/30 p-6 shadow-2xl backdrop-blur-xl space-y-6 ${className}`}
    >
      {/* 4 Metric Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Today Focus */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
            Today Focus
          </span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-2xl font-black text-cyan-300">{todayMins}</span>
            <span className="text-xs text-slate-400">mins</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-bold block">{todayHours}h active state</span>
        </div>

        {/* Metric 2: All-Time Focus */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
            All-Time Total
          </span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-2xl font-black text-indigo-300">{totalHours}</span>
            <span className="text-xs text-slate-400">hrs</span>
          </div>
          <span className="text-[10px] text-indigo-400 font-bold block">Deep Cognitive Work</span>
        </div>

        {/* Metric 3: Total Cycles */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
            Pomodoros
          </span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-2xl font-black text-amber-300">{focusSessions.length}</span>
            <span className="text-xs text-slate-400">sessions</span>
          </div>
          <span className="text-[10px] text-amber-400 font-bold block">Completed Blocks</span>
        </div>

        {/* Metric 4: Focus Streak */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
            Focus Streak
          </span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-2xl font-black text-emerald-400">{streak}</span>
            <span className="text-xs text-slate-400">days</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
            <Flame className="w-3 h-3" /> Unbroken Habit
          </span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-3 pt-2 border-t border-cyan-500/20">
        <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
          Domain Distribution Breakdown
        </span>

        <div className="space-y-2">
          {Object.entries(catCounts).map(([cat, mins]) => {
            const pct = totalMins > 0 ? Math.round((mins / totalMins) * 100) : 0;
            return (
              <div key={cat} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">{cat}</span>
                  <span className="text-slate-400">
                    {mins} mins ({pct}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Focus Chronicle History List */}
      <div className="space-y-2 pt-2 border-t border-cyan-500/20">
        <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
          Recent Focus Logs
        </span>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {focusSessions.slice(0, 5).map((s) => (
            <div
              key={s.id}
              className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <Badge className="bg-cyan-950/60 text-cyan-300 border-cyan-500/30 text-[9px]">
                  {s.category}
                </Badge>
                <span className="text-white font-bold">{s.durationMinutes} mins</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-cyan-300">+{s.focGain} FOC</span>
                <span className="text-indigo-300">+{s.knoGain} KNO</span>
                <span className="text-amber-300">+{s.expAwarded} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
