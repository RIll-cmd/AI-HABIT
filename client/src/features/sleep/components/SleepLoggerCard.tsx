"use client";

import React, { useState } from "react";
import {
  Moon,
  Sparkles,
  Clock,
  Zap,
  CheckCircle2,
  AlertCircle,
  Activity,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSleepStore, SleepQuality, calculateSleepEfficiency } from "../store/useSleepStore";
import { playUIMenuSFX } from "@/utils/audio";

const QUALITY_OPTIONS: { id: SleepQuality; label: string; icon: string; desc: string }[] = [
  { id: "DEEP_REM", label: "Deep REM", icon: "🌌", desc: "Optimal restorative neural delta waves" },
  { id: "RESTFUL", label: "Restful", icon: "✨", desc: "Uninterrupted, woke up energized" },
  { id: "MODERATE", label: "Moderate", icon: "🌙", desc: "Mild restlessness or short waking" },
  { id: "FRAGMENTED", label: "Fragmented", icon: "⚡", desc: "Multiple wake-ups or light sleep" },
  { id: "POOR", label: "Poor / Insomnia", icon: "🥀", desc: "Severe sleep deprivation / fatigue" },
];

export const SleepLoggerCard: React.FC<{ onLogSuccess?: () => void; className?: string }> = ({
  onLogSuccess,
  className = "",
}) => {
  const { logSleep, todayLogged } = useSleepStore();

  const [hours, setHours] = useState<number>(8.0);
  const [bedtime, setBedtime] = useState<string>("23:00");
  const [wakeTime, setWakeTime] = useState<string>("07:00");
  const [quality, setQuality] = useState<SleepQuality>("RESTFUL");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { score, recoveryGain, exp, gold, ratingLabel } = calculateSleepEfficiency(hours, quality);

  // Proximity to golden 8.0h standard
  const diffFrom8 = Math.abs(hours - 8.0);
  const isOptimal = diffFrom8 <= 0.5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      logSleep({
        hoursSlept: hours,
        bedtime,
        wakeTime,
        quality,
        notes: notes.trim() ? notes.trim() : undefined,
      });
      if (onLogSuccess) onLogSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`relative rounded-3xl bg-gradient-to-br from-[#0B1020]/95 via-[#070C18]/95 to-[#040710]/98 border-2 border-cyan-500/30 p-6 md:p-8 shadow-2xl overflow-hidden backdrop-blur-xl ${className}`}
    >
      {/* Ambient background radiance */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
            <Moon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                <HeartPulse className="w-3.5 h-3.5 text-cyan-400" />
                BIOMETRIC RESTORATION PROTOCOL
              </span>
              <Badge className="bg-indigo-950/80 text-indigo-300 border-indigo-500/40 text-[9.5px] font-mono">
                8.0h Golden Standard
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-wide mt-0.5">
              Log Sleep Duration & Regenerate
            </h2>
          </div>
        </div>

        {todayLogged && (
          <Badge className="bg-emerald-950/80 text-emerald-300 border-emerald-500/50 text-xs font-mono px-3 py-1 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            TODAY LOGGED
          </Badge>
        )}
      </div>

      {/* Main Interactive Form */}
      <form onSubmit={handleSubmit} className="space-y-6 pt-6 relative z-10">
        {/* Hours Slept Target Slider & Dial */}
        <div className="p-5 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                Sleep Duration (Hours)
              </span>
              <span className="text-[11px] text-slate-400 font-sans">
                {isOptimal
                  ? "✦ Target Golden Zone (7.5h - 8.5h): Maximum Recovery Multiplier"
                  : diffFrom8 > 2.0
                  ? "⚠ Severe Sleep Discrepancy: Recovery penalty applied"
                  : "Moderate Recovery Range"}
              </span>
            </div>
            <div className="text-right font-mono">
              <span className="text-3xl sm:text-4xl font-black text-cyan-300">
                {hours.toFixed(2)}
              </span>
              <span className="text-sm text-slate-400 ml-1">hrs</span>
            </div>
          </div>

          {/* Slider with 8h tick marker */}
          <div className="space-y-2">
            <div className="relative flex items-center">
              <input
                type="range"
                min="3.0"
                max="14.0"
                step="0.25"
                value={hours}
                onChange={(e) => {
                  setHours(parseFloat(e.target.value));
                }}
                className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />
            </div>

            {/* Quick Select Pill Buttons */}
            <div className="flex items-center justify-between gap-2 pt-1">
              {[6.0, 7.0, 7.5, 8.0, 8.5, 9.0].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    playUIMenuSFX("confirm");
                    setHours(val);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    hours === val
                      ? "bg-cyan-500 text-slate-950 font-black shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                      : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800"
                  }`}
                >
                  {val === 8.0 ? "⭐ 8.0h" : `${val}h`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Circadian Bedtime & Wake Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Bedtime
            </label>
            <input
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Wake Time
            </label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Sleep Quality Selector */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
            Sleep Quality & Sensation
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {QUALITY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  playUIMenuSFX("confirm");
                  setQuality(opt.id);
                }}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  quality === opt.id
                    ? "bg-gradient-to-br from-indigo-950/80 to-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] text-white"
                    : "bg-slate-950/60 hover:bg-slate-900 border-slate-800/80 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{opt.icon}</span>
                  <span className="text-xs font-bold font-mono text-white">{opt.label}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-sans mt-1 line-clamp-1">
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Recovery Telemetry Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-cyan-950/40 to-slate-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
              PREDICTED REGENERATION YIELD
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-black text-white">{score}% Rest Score</span>
              <span className="text-xs text-emerald-400 font-bold">({ratingLabel})</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="text-right">
              <span className="text-[9px] text-slate-400 uppercase block">REC Stat</span>
              <span className="text-emerald-400 font-black">+{recoveryGain} REC</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 uppercase block">EXP Reward</span>
              <span className="text-cyan-300 font-black">+{exp} EXP</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 uppercase block">Gold</span>
              <span className="text-amber-300 font-black">+{gold} G</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-mono font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer transition-all"
        >
          <Moon className="w-4 h-4 mr-2" />
          {todayLogged ? "UPDATE SLEEP LOG & SYNC RECOVERY" : "RECORD SLEEP & CLAIM STAT BOOST"}
        </Button>
      </form>
    </div>
  );
};
