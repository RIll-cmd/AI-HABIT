"use client";

import React from "react";
import { Target, Sparkles, Plus, ShieldCheck, Flame, Zap, Compass, CheckCircle2 } from "lucide-react";
import { KanbanQuestBoard } from "@/features/habits/components/KanbanQuestBoard";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";

export default function MissionsPage() {
  return (
    <div className="space-y-6 pb-12 text-slate-100 font-sans animate-in fade-in duration-300 relative">
      {/* Background Floating Runes & Particle Field */}
      <FloatingRuneField density="low" className="opacity-60" />

      {/* ========================================================= */}
      {/* HEADER SECTION: SYSTEM MISSION & DIRECTIVE HUB */}
      {/* ========================================================= */}
      <div className="relative rounded-[28px] bg-gradient-to-br from-[#0B1126]/95 via-[#070D1E]/95 to-[#040814]/98 border border-cyan-500/20 p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl">
        {/* Floating Runes & Ambient Particles */}
        <FloatingRuneField density="high" />

        {/* Animated Cyber Accent Lines */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent pointer-events-none" />

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

        {/* Subtle Runes & Grid Overlay */}
        <div className="absolute inset-0 bg-repeating-linear-gradient pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(6,182,212,0.02) 3px, rgba(6,182,212,0.02) 6px)' }} />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Glowing Holographic Directive Icon */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#0f1a3d] to-[#070c20] border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] shrink-0 relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none" />
              <Target className="w-8 h-8 drop-shadow-[0_0_12px_rgba(6,182,212,0.7)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  SYSTEM DIRECTIVE MATRIX
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold shadow-[0_0_10px_rgba(6,182,212,0.25)] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE TELEMETRY
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                Missions & Quest Directives
              </h1>
              <p className="text-xs text-slate-300 max-w-xl font-sans leading-relaxed">
                Track and execute active daily habits, high-value bounties, and system milestones across interactive Kanban battle lanes to unlock massive EXP, Gold, and Stat Points.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* KANBAN QUEST BOARD ENGINE */}
      {/* ========================================================= */}
      <KanbanQuestBoard />
    </div>
  );
}

