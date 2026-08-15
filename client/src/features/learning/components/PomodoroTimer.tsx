"use client";

import React, { useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Brain,
  Zap,
  Coffee,
  Sparkles,
  BookOpen,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLearningStore, PomodoroMode } from "../store/useLearningStore";
import { playUIMenuSFX } from "@/utils/audio";

export const PomodoroTimer: React.FC<{ className?: string }> = ({ className = "" }) => {
  const {
    mode,
    status,
    timeLeft,
    totalDuration,
    completedCycles,
    selectedCategory,
    linkedHabitName,
    setMode,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    skipTimer,
    tick,
  } = useLearningStore();

  // Tick timer every second when RUNNING
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (status === "RUNNING") {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, tick]);

  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Calculate circular SVG progress
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progressPct = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const strokeDashoffset = circumference - progressPct * circumference;

  const isBreak = mode === "SHORT_BREAK" || mode === "LONG_BREAK";

  return (
    <div
      className={`relative rounded-3xl bg-gradient-to-br from-[#0B1020]/95 via-[#070C18]/95 to-[#040710]/98 border-2 ${
        isBreak ? "border-emerald-500/30" : "border-cyan-500/30"
      } p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col items-center justify-between space-y-6 ${className}`}
    >
      {/* Background Radiance */}
      <div
        className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isBreak ? "bg-emerald-500/10" : "bg-cyan-500/15"
        }`}
      />

      {/* Mode Selector Header Tabs */}
      <div className="w-full flex items-center justify-between gap-2 border-b border-white/5 pb-4 relative z-10">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/50 border border-white/10 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => {
              playUIMenuSFX("confirm");
              setMode("FOCUS");
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              mode === "FOCUS"
                ? "bg-cyan-500 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            25m Focus
          </button>

          <button
            type="button"
            onClick={() => {
              playUIMenuSFX("confirm");
              setMode("SHORT_BREAK");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              mode === "SHORT_BREAK"
                ? "bg-emerald-500 text-slate-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            5m Break
          </button>

          <button
            type="button"
            onClick={() => {
              playUIMenuSFX("confirm");
              setMode("LONG_BREAK");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              mode === "LONG_BREAK"
                ? "bg-purple-500 text-slate-950 font-black shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            15m Long Break
          </button>
        </div>

        {/* Completed Cycles Badge */}
        <Badge className="bg-indigo-950/80 text-indigo-300 border-indigo-500/40 text-xs font-mono font-bold px-3 py-1 hidden sm:flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          {completedCycles} Cycles Completed
        </Badge>
      </div>

      {/* Circular Timer Stage */}
      <div className="relative flex items-center justify-center py-4 my-2 select-none">
        <svg className="w-60 h-60 sm:w-68 sm:h-68 -rotate-90 transform" viewBox="0 0 240 240">
          {/* Background Track */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            stroke="#1e293b"
            strokeWidth="10"
            fill="transparent"
            className="opacity-40"
          />
          {/* Animated Progress Ring */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            stroke={isBreak ? "#10b981" : "#06b6d4"}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]"
          />
        </svg>

        {/* Center Digital Display */}
        <div className="absolute flex flex-col items-center justify-center text-center space-y-1">
          <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
            {isBreak ? "✦ RESTORATIVE BREAK ✦" : `FOCUS STATE: ${selectedCategory}`}
          </span>
          <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            {formattedTime}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {linkedHabitName ? `🔗 ${linkedHabitName}` : status === "RUNNING" ? "Neural Engine Active" : "Paused"}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3 w-full max-w-sm relative z-10">
        <Button
          type="button"
          size="icon"
          onClick={() => {
            playUIMenuSFX("confirm");
            resetTimer();
          }}
          className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 cursor-pointer shadow-lg"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        {status === "RUNNING" ? (
          <Button
            type="button"
            onClick={pauseTimer}
            className="flex-1 h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-black text-base uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer transition-all"
          >
            <Pause className="w-5 h-5 mr-2 fill-current" />
            PAUSE
          </Button>
        ) : (
          <Button
            type="button"
            onClick={status === "PAUSED" ? resumeTimer : startTimer}
            className={`flex-1 h-14 rounded-2xl ${
              isBreak
                ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.5)]"
            } font-mono font-black text-base uppercase tracking-wider cursor-pointer transition-all`}
          >
            <Play className="w-5 h-5 mr-2 fill-current" />
            {status === "PAUSED" ? "RESUME FOCUS" : "ENTER FOCUS"}
          </Button>
        )}

        <Button
          type="button"
          size="icon"
          onClick={() => {
            playUIMenuSFX("confirm");
            skipTimer();
          }}
          className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 cursor-pointer shadow-lg"
          title="Skip Phase"
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Live Cognitive Stat Yield Banner */}
      <div className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-950/40 border border-cyan-500/20 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300 font-bold">Session Stat Yield:</span>
        </div>
        <div className="flex items-center gap-3 font-bold">
          <span className="text-cyan-300">+0.4 FOC</span>
          <span className="text-indigo-300">+0.4 KNO</span>
          <span className="text-amber-300">+0.3 DIS</span>
          <span className="text-emerald-400">+75 XP</span>
        </div>
      </div>
    </div>
  );
};
