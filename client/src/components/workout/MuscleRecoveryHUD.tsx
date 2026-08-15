"use client";

import React from "react";
import { MuscleRecoveryStatusResponse } from "@/features/workouts/types/muscleRecovery";
import {
  Activity,
  Calendar,
  Zap,
  Flame,
  ShieldCheck,
  RotateCcw,
  Plus,
  Dumbbell,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MuscleRecoveryHUDProps {
  recoveryStatus?: MuscleRecoveryStatusResponse | null;
  onOpenLogger?: () => void;
  onResetRecovery?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const MuscleRecoveryHUD: React.FC<MuscleRecoveryHUDProps> = ({
  recoveryStatus,
  onOpenLogger,
  onResetRecovery,
  isLoading = false,
  className = "",
}) => {
  const summary = recoveryStatus?.summary || {
    freshCount: 16,
    recoveringCount: 0,
    fatiguedCount: 0,
    totalCount: 16,
    overallFreshness: 100,
    daysSinceLastWorkout: 0,
    lastWorkoutDate: null,
  };

  const getSystemStatus = () => {
    if (summary.overallFreshness >= 80) {
      return {
        label: "OPTIMAL COMBAT READINESS",
        badge: "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
        glow: "shadow-[0_0_15px_rgba(6,182,212,0.25)]",
        icon: ShieldCheck,
      };
    }
    if (summary.overallFreshness >= 50) {
      return {
        label: "ACTIVE REGENERATION PHASE",
        badge: "bg-amber-950/80 text-amber-300 border-amber-500/40",
        glow: "shadow-[0_0_15px_rgba(245,158,11,0.25)]",
        icon: Zap,
      };
    }
    return {
      label: "HEAVY SYSTEM FATIGUE",
      badge: "bg-red-950/80 text-red-300 border-red-500/40",
      glow: "shadow-[0_0_15px_rgba(239,68,68,0.25)]",
      icon: Flame,
    };
  };

  const systemStatus = getSystemStatus();
  const StatusIcon = systemStatus.icon;

  return (
    <div
      className={`rounded-3xl bg-gradient-to-r from-[#0C1226]/95 via-[#090E1F]/95 to-[#050814]/98 border-2 border-cyan-500/30 p-4 sm:p-5 shadow-2xl backdrop-blur-xl ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: System Health & Days Badge */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1 ${systemStatus.badge} ${systemStatus.glow}`}
              >
                <StatusIcon className="w-3 h-3" />
                {systemStatus.label}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                BIO-DECAY ENGINE v2.0
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight mt-0.5">
              Recovery & Muscle Telemetry
            </h2>
          </div>
        </div>

        {/* Right Side: Telemetry Counters & Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Days Since Last Workout */}
          <div className="px-3.5 py-2 rounded-2xl bg-black/40 border border-cyan-500/20 text-center min-w-[90px]">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block flex items-center justify-center gap-1">
              <Calendar className="w-2.5 h-2.5 text-cyan-400" />
              DAYS REST
            </span>
            <span className="text-lg font-black font-mono text-cyan-300">
              {summary.daysSinceLastWorkout === 0 ? "TODAY" : `${summary.daysSinceLastWorkout}d`}
            </span>
          </div>

          {/* Fresh Muscle Tally */}
          <div className="px-3.5 py-2 rounded-2xl bg-black/40 border border-cyan-500/20 text-center min-w-[100px]">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block flex items-center justify-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
              FRESH GROUPS
            </span>
            <span className="text-lg font-black font-mono text-emerald-400">
              {summary.freshCount} / {summary.totalCount}
            </span>
          </div>

          {/* Action Log Workout Button */}
          {onOpenLogger && (
            <Button
              onClick={onOpenLogger}
              className="h-11 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Dumbbell className="w-4 h-4" />
              LOG WORKOUT
            </Button>
          )}

          {/* Dev/Player Reset Simulation Utility */}
          {onResetRecovery && (
            <button
              onClick={onResetRecovery}
              className="w-10 h-10 rounded-2xl bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 shrink-0"
              title="Reset All Muscles to 100% Fresh (Simulation)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
