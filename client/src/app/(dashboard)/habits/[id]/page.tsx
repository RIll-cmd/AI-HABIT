"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useHabitStore } from "@/features/habits/store/useHabitStore";
import { EditHabitModal } from "@/features/habits/components/EditHabitModal";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import {
  ArrowLeft,
  MoreVertical,
  Flame,
  Activity,
  Zap,
  Shield,
  Clock,
  Calendar,
  Sparkles,
  Edit3,
  PauseCircle,
  PlayCircle,
  Archive,
  Trash2,
  CheckCircle2,
  Award,
  Layers,
  ChevronRight,
} from "lucide-react";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { toast } from "sonner";

export default function HabitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const habitId = params.id as string;

  const { habits, loadHabits, updateHabitStatus, isLoading } = useHabitStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (habits.length === 0) {
      loadHabits();
    }
  }, [habits.length, loadHabits]);

  const habit = habits.find((h) => h.id === habitId);

  if (isLoading && !habit) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-400 font-mono text-xs">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mr-3" />
        Syncing Protocol Matrix Telemetry...
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white font-heading">Protocol Not Found</h2>
        <p className="text-slate-400 text-xs font-sans">
          This habit protocol may have been decommissioned or does not exist in the active matrix.
        </p>
        <Link
          href="/habits"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:text-white font-mono text-xs font-bold transition-all shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Protocols Hub</span>
        </Link>
      </div>
    );
  }

  const handleStatusChange = async (
    newStatus: "PAUSED" | "ACTIVE" | "ARCHIVED" | "DELETED"
  ) => {
    setIsMenuOpen(false);

    if (newStatus === "DELETED") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this habit protocol? This action cannot be undone."
      );
      if (!confirmDelete) return;
    }

    playBuffSFX();
    await updateHabitStatus(habit.id, newStatus);
    toast.success(`Protocol status changed to ${newStatus}`);

    if (newStatus === "DELETED") {
      router.push("/habits");
    }
  };

  const strength = Math.min(100, Math.max(0, habit.metrics?.habitStrength || 0));
  const currentStreak = habit.metrics?.currentStreak || 0;
  const longestStreak = habit.metrics?.longestStreak || 0;
  const consistency = habit.metrics?.currentConsistency || 0;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6 font-sans animate-in fade-in duration-300 relative">
      {/* Background Floating Runes */}
      <FloatingRuneField density="low" className="opacity-50" />

      {/* Navigation Breadcrumb */}
      <Link
        href="/habits"
        onClick={() => playUIMenuSFX()}
        className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Protocols Hub</span>
      </Link>

      {/* ========================================================= */}
      {/* PROTOCOL TELEMETRY HERO HEADER */}
      {/* ========================================================= */}
      <div className="relative rounded-[28px] bg-gradient-to-br from-[#0B1126]/95 via-[#070D1E]/95 to-[#040814]/98 border border-cyan-500/25 p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl">
        {/* Floating Runes & Ambient Particles */}
        <FloatingRuneField density="medium" />

        {/* Cyber Accent Lines */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent pointer-events-none" />

        {/* Quick Menu */}
        <div className="absolute top-6 right-6 z-20">
          <div className="relative">
            <button
              onClick={() => {
                playUIMenuSFX();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer shadow-lg"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#0A1024]/98 border border-cyan-500/30 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] z-30 overflow-hidden font-mono text-xs backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    playUIMenuSFX();
                    setIsMenuOpen(false);
                    setIsEditModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-cyan-300 hover:bg-cyan-950/60 flex items-center gap-2.5 font-bold cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Parameters</span>
                </button>

                {habit.status === "ACTIVE" ? (
                  <button
                    onClick={() => handleStatusChange("PAUSED")}
                    className="w-full text-left px-4 py-2.5 text-amber-400 hover:bg-amber-950/60 flex items-center gap-2.5 font-bold cursor-pointer"
                  >
                    <PauseCircle className="w-3.5 h-3.5" />
                    <span>Pause Protocol</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange("ACTIVE")}
                    className="w-full text-left px-4 py-2.5 text-emerald-400 hover:bg-emerald-950/60 flex items-center gap-2.5 font-bold cursor-pointer"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Resume Protocol</span>
                  </button>
                )}

                <button
                  onClick={() => handleStatusChange("ARCHIVED")}
                  className="w-full text-left px-4 py-2.5 text-slate-300 hover:bg-slate-800/60 flex items-center gap-2.5 cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Archive Protocol</span>
                </button>

                <button
                  onClick={() => handleStatusChange("DELETED")}
                  className="w-full text-left px-4 py-2.5 text-rose-400 hover:bg-rose-950/60 flex items-center gap-2.5 border-t border-slate-800 cursor-pointer font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Decommission (Delete)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#121c3d] to-[#070c20] border-2 border-cyan-500/40 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0">
              {habit.icon || "⚡"}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase border ${
                    habit.status === "ACTIVE"
                      ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                      : habit.status === "PAUSED"
                      ? "bg-amber-950/80 text-amber-300 border-amber-500/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  ● {habit.status}
                </span>

                <span className="text-xs text-slate-500 font-mono">•</span>
                <span className="text-xs font-mono text-cyan-300 font-bold uppercase">
                  {habit.category || "General Protocol"}
                </span>
                <span className="text-xs text-slate-500 font-mono">•</span>
                <span className="text-xs font-mono text-purple-300 font-bold uppercase">
                  +{habit.primaryStat}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                {habit.name}
              </h1>
            </div>
          </div>

          {habit.description && (
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed font-sans">
              {habit.description}
            </p>
          )}

          {/* Strength Bar */}
          <div className="p-4 rounded-2xl bg-[#060B18]/80 border border-cyan-500/20 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Neural Habit Strength
              </span>
              <span className="text-cyan-300 font-black text-sm">{Math.round(strength)}%</span>
            </div>
            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all duration-1000"
                style={{ width: `${strength}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3-TIER EXECUTION TARGETS DECK */}
      {/* ========================================================= */}
      <div>
        <h3 className="text-xs font-mono uppercase font-bold text-cyan-400 tracking-wider mb-3 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5" />
          Execution Target Tiers & Rewards
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(habit.tiers || [
            { tier: "MINI", targetValue: 1, targetUnit: "reps", baseExp: 25, baseGold: 10 },
            { tier: "NORMAL", targetValue: 3, targetUnit: "reps", baseExp: 50, baseGold: 20 },
            { tier: "ELITE", targetValue: 5, targetUnit: "reps", baseExp: 100, baseGold: 40 },
          ]).map((t, idx) => {
            const isElite = t.tier === "ELITE";
            const isNormal = t.tier === "NORMAL";

            return (
              <div
                key={idx}
                className={`p-5 rounded-[22px] border transition-all relative overflow-hidden backdrop-blur-xl flex flex-col justify-between ${
                  isElite
                    ? "bg-gradient-to-br from-amber-950/30 via-[#080E20]/95 to-[#050914]/98 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                    : isNormal
                    ? "bg-gradient-to-br from-cyan-950/30 via-[#080E20]/95 to-[#050914]/98 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                    : "bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                        isElite
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                          : isNormal
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                          : "bg-slate-800 text-slate-300 border-slate-700"
                      }`}
                    >
                      {t.tier} TIER
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      Target: {t.targetValue} {t.targetUnit || ""}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-4">
                    {isElite
                      ? "Push past standard operational boundaries for maximum attribute acceleration."
                      : isNormal
                      ? "Standard expected baseline quota for regular daily maintenance."
                      : "Minimum viable execution to protect your active discipline streak."}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30">
                    <CurrencyIcon type="EXP" size="xs" />
                    <span className="text-xs font-mono font-bold text-cyan-300">+{t.baseExp || 50}</span>
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/30">
                    <CurrencyIcon type="GOLD" size="xs" />
                    <span className="text-xs font-mono font-bold text-amber-300">+{t.baseGold || 20}g</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* PARAMETERS & PERFORMANCE TELEMETRY */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CONFIGURATION CARD */}
        <div className="p-6 rounded-[24px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/20 shadow-xl backdrop-blur-xl space-y-4">
          <h3 className="text-xs font-mono uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-2 border-b border-cyan-500/10 pb-3">
            <Layers className="w-3.5 h-3.5" />
            Protocol Parameters
          </h3>

          <div className="grid grid-cols-2 gap-3.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Schedule</span>
              <span className="text-white font-bold">{habit.scheduleType}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Threat Difficulty</span>
              <span className="text-amber-400 font-bold">{habit.difficulty}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Primary Stat</span>
              <span className="text-cyan-300 font-bold uppercase">{habit.primaryStat}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Preferred Time</span>
              <span className="text-white font-bold">{habit.preferredTime || "Anytime"}</span>
            </div>
          </div>
        </div>

        {/* PERFORMANCE TELEMETRY CARD */}
        <div className="p-6 rounded-[24px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/20 shadow-xl backdrop-blur-xl space-y-4">
          <h3 className="text-xs font-mono uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-2 border-b border-cyan-500/10 pb-3">
            <Activity className="w-3.5 h-3.5" />
            Telemetry Metrics
          </h3>

          <div className="grid grid-cols-3 gap-3 font-mono text-center">
            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Streak</span>
              <span className="text-lg font-black text-amber-400">{currentStreak}d</span>
            </div>

            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Best Record</span>
              <span className="text-lg font-black text-white">{longestStreak}d</span>
            </div>

            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Consistency</span>
              <span className="text-lg font-black text-emerald-400">{consistency}%</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-300/90 font-mono">
            💡 <strong>System Advisory:</strong> Completing normal or elite tiers consecutively compounds your streak multiplier, increasing bonus EXP drops during level ups.
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditHabitModal
        habit={habit}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}

