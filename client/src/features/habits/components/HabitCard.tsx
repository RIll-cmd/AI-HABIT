import React from "react";
import Link from "next/link";
import { Habit } from "../types";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { Flame, Target, ArrowRight, Sparkles, Shield, Zap, Activity } from "lucide-react";
import { playUIMenuSFX } from "@/utils/audio";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";

interface HabitCardProps {
  habit: Habit;
}

const STAT_COLORS: Record<string, { badge: string; text: string; border: string }> = {
  strength: { badge: "bg-red-950/80", text: "text-red-400", border: "border-red-500/40" },
  knowledge: { badge: "bg-blue-950/80", text: "text-blue-400", border: "border-blue-500/40" },
  discipline: { badge: "bg-amber-950/80", text: "text-amber-400", border: "border-amber-500/40" },
  focus: { badge: "bg-cyan-950/80", text: "text-cyan-400", border: "border-cyan-500/40" },
  endurance: { badge: "bg-emerald-950/80", text: "text-emerald-400", border: "border-emerald-500/40" },
  recovery: { badge: "bg-teal-950/80", text: "text-teal-400", border: "border-teal-500/40" },
  constitution: { badge: "bg-purple-950/80", text: "text-purple-400", border: "border-purple-500/40" },
};

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  TRIVIAL: { bg: "bg-slate-900/80", text: "text-slate-400", border: "border-slate-700/50" },
  EASY: { bg: "bg-emerald-950/60", text: "text-emerald-400", border: "border-emerald-500/30" },
  MEDIUM: { bg: "bg-cyan-950/60", text: "text-cyan-400", border: "border-cyan-500/30" },
  HARD: { bg: "bg-amber-950/60", text: "text-amber-400", border: "border-amber-500/30" },
  EPIC: { bg: "bg-purple-950/60", text: "text-purple-400", border: "border-purple-500/30" },
};

export const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const strength = Math.min(100, Math.max(0, habit.metrics?.habitStrength || 0));
  const currentStreak = habit.metrics?.currentStreak || 0;
  const normalTier = habit.tiers?.find((t) => t.tier === "NORMAL") || habit.tiers?.[0];
  const expReward = normalTier?.baseExp || 50;
  const goldReward = normalTier?.baseGold || 20;

  const statStyle = STAT_COLORS[habit.primaryStat?.toLowerCase()] || STAT_COLORS.discipline;
  const diffStyle = DIFFICULTY_COLORS[habit.difficulty?.toUpperCase()] || DIFFICULTY_COLORS.MEDIUM;

  return (
    <div className="group relative rounded-[22px] bg-gradient-to-br from-[#0B1124]/95 via-[#070D1E]/95 to-[#040814]/98 border border-cyan-500/20 hover:border-cyan-400/50 p-5 shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-300 backdrop-blur-xl overflow-hidden flex flex-col justify-between">
      {/* Floating Runes inside Habit Card */}
      <FloatingRuneField density="low" className="opacity-30 group-hover:opacity-60 transition-opacity" />

      {/* Top Cyber Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent pointer-events-none group-hover:via-cyan-400 transition-all" />

      <div className="relative z-10">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            {/* Habit Icon Pedestal */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#121c3d] to-[#070c20] border border-cyan-500/30 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(6,182,212,0.2)] shrink-0 group-hover:scale-105 group-hover:border-cyan-400 transition-all">
              {habit.icon || "⚡"}
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-extrabold text-white truncate font-heading group-hover:text-cyan-300 transition-colors">
                {habit.name}
              </h3>
              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                  {habit.category || "General"}
                </span>
                <span className="text-slate-600 text-xs">•</span>
                <span className={`text-[9.5px] font-mono uppercase font-bold px-2 py-0.5 rounded-md border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                  {habit.difficulty || "MEDIUM"}
                </span>
              </div>
            </div>
          </div>

          {/* Streak Flame Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-950/40 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)] shrink-0">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30 animate-pulse" />
            <span className="text-[11px] font-mono font-extrabold text-amber-300">
              {currentStreak}d
            </span>
          </div>
        </div>

        {/* Description or Target */}
        {habit.description && (
          <p className="text-xs text-slate-300/90 font-sans line-clamp-2 mb-4 leading-relaxed">
            {habit.description}
          </p>
        )}

        {/* Habit Strength Progress Track */}
        <div className="space-y-1.5 my-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400" />
              Protocol Strength
            </span>
            <span className="text-cyan-300 font-black text-xs">
              {Math.round(strength)}%
            </span>
          </div>

          <div className="h-2 w-full bg-slate-900/90 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 shadow-[0_0_10px_rgba(6,182,212,0.6)] transition-all duration-1000"
              style={{ width: `${strength}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="mt-4 pt-3.5 border-t border-cyan-500/10 flex items-center justify-between gap-3 text-xs">
        {/* Rewards / Stat Pill */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-950/50 border border-cyan-500/25">
            <CurrencyIcon type="EXP" size="xs" />
            <span className="text-[10px] font-mono font-bold text-cyan-300">+{expReward}</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-950/50 border border-amber-500/25">
            <CurrencyIcon type="GOLD" size="xs" />
            <span className="text-[10px] font-mono font-bold text-amber-300">+{goldReward}g</span>
          </div>

          {habit.primaryStat && (
            <span className={`text-[9.5px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-lg border ${statStyle.badge} ${statStyle.text} ${statStyle.border}`}>
              +{habit.primaryStat.substring(0, 3).toUpperCase()}
            </span>
          )}
        </div>

        {/* View Protocol Link */}
        <Link
          href={`/habits/${habit.id}`}
          onClick={() => playUIMenuSFX()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono font-bold transition-all group-hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] shrink-0 cursor-pointer"
        >
          <span>Inspect</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

