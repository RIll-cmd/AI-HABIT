"use client";

import React from "react";
import {
  Moon,
  TrendingUp,
  Activity,
  Calendar,
  Flame,
  Award,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSleepStore, SleepLog } from "../store/useSleepStore";

export const SleepHistoryChart: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { sleepLogs, getAverageHours, getAverageEfficiency, getSleepDebt, getCurrentStreak } =
    useSleepStore();

  const avgHours = getAverageHours(7);
  const avgEfficiency = getAverageEfficiency(7);
  const sleepDebt = getSleepDebt();
  const streak = getCurrentStreak();

  // Get past 7 days logs
  const last7Logs = sleepLogs.slice(0, 7).reverse();

  return (
    <div
      className={`rounded-3xl bg-gradient-to-br from-[#0B1020]/95 via-[#070C18]/95 to-[#040710]/98 border-2 border-cyan-500/30 p-6 shadow-2xl backdrop-blur-xl space-y-6 ${className}`}
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Avg Duration */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
            7-Day Avg
          </span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-2xl font-black text-cyan-300">{avgHours}</span>
            <span className="text-xs text-slate-400">hrs</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold block">
            {avgHours >= 7.5 && avgHours <= 8.5 ? "✦ Golden Target" : "Target: 8.0h"}
          </span>
        </div>

        {/* Metric 2: Avg Efficiency */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
            Regen Efficiency
          </span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-2xl font-black text-indigo-300">{avgEfficiency}%</span>
          </div>
          <span className="text-[10px] text-indigo-400 font-bold block">Recovery Score</span>
        </div>

        {/* Metric 3: Sleep Debt */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
            Sleep Debt
          </span>
          <div className="flex items-baseline gap-1 font-mono">
            <span
              className={`text-2xl font-black ${
                sleepDebt <= 0 ? "text-emerald-400" : sleepDebt > 5 ? "text-red-400" : "text-amber-400"
              }`}
            >
              {sleepDebt > 0 ? `-${sleepDebt}` : `+${Math.abs(sleepDebt)}`}
            </span>
            <span className="text-xs text-slate-400">hrs</span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold block">
            {sleepDebt <= 0 ? "Zero Debt! Fully Rested" : "Accumulated fatigue"}
          </span>
        </div>

        {/* Metric 4: Sleep Streak */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
            Sleep Streak
          </span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-2xl font-black text-amber-300">{streak}</span>
            <span className="text-xs text-slate-400">days</span>
          </div>
          <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
            <Flame className="w-3 h-3" /> Unbroken Rest
          </span>
        </div>
      </div>

      {/* 7-Day Bar Chart */}
      <div className="space-y-3 pt-2 border-t border-cyan-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            7-Day Restorative Duration vs 8.0h Standard
          </span>
          <span className="text-[11px] font-mono text-cyan-400">Target Line: 8.0h</span>
        </div>

        {/* Visual Bars Container */}
        <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
          <div className="h-40 flex items-end justify-between gap-2 pt-4 relative">
            {/* 8.0h Dashed Golden Standard Line */}
            <div
              className="absolute left-0 right-0 border-b border-dashed border-amber-400/50 pointer-events-none z-10 flex items-center justify-end pr-2"
              style={{ bottom: `${(8.0 / 12.0) * 100}%` }}
            >
              <span className="text-[9px] font-mono font-bold text-amber-300 bg-black/80 px-1 rounded">
                8.0h GOLDEN
              </span>
            </div>

            {last7Logs.map((log) => {
              const heightPct = Math.min(100, Math.max(15, (log.hoursSlept / 12.0) * 100));
              const isTarget = Math.abs(log.hoursSlept - 8.0) <= 0.5;

              return (
                <div key={log.id} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 bg-slate-900 border border-cyan-500/50 text-white text-[10px] font-mono rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-xl">
                    <div>{log.hoursSlept}h slept ({log.efficiencyScore}%)</div>
                    <div className="text-emerald-400 font-bold">+{log.recoveryGain} REC</div>
                  </div>

                  {/* The Bar */}
                  <div
                    className={`w-full max-w-[32px] rounded-t-xl transition-all duration-500 relative overflow-hidden ${
                      isTarget
                        ? "bg-gradient-to-t from-cyan-600 via-indigo-500 to-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                        : log.hoursSlept < 6
                        ? "bg-gradient-to-t from-red-900 to-red-500"
                        : "bg-gradient-to-t from-indigo-900 to-cyan-500"
                    }`}
                    style={{ height: `${heightPct}%` }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/40" />
                  </div>

                  {/* Day Label */}
                  <span className="text-[10px] font-mono text-slate-400 mt-2 truncate max-w-full">
                    {new Date(log.date).toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-slate-200">
                    {log.hoursSlept}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Log Table */}
      <div className="space-y-2 pt-2 border-t border-cyan-500/20">
        <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
          Recent Biometric Sleep Chronicle
        </span>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {sleepLogs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">{log.date}</span>
                <Badge className="bg-indigo-950/60 text-indigo-300 border-indigo-500/30 text-[9px]">
                  {log.quality.replace("_", " ")}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-bold">{log.hoursSlept}h</span>
                <span className="text-emerald-400 font-bold">+{log.recoveryGain} REC</span>
                <span className="text-amber-300">+{log.expAwarded} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
