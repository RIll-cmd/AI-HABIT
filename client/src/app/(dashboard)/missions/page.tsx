"use client";

import React from "react";
import { Target, Sparkles, Plus, ShieldCheck, Flame, Zap } from "lucide-react";
import Link from "next/link";
import { KanbanQuestBoard } from "@/features/habits/components/KanbanQuestBoard";

export default function MissionsPage() {
  return (
    <div className="space-y-8 pb-12 text-slate-100">
      {/* HEADER SECTION */}
      <div className="relative rounded-[24px] bg-[#151C33] border border-white/10 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-[20px] bg-blue-600/20 border border-blue-500/40 text-blue-400">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                  SYSTEM KANBAN QUEST ENGINE
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono font-bold">
                  LIVE
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold font-heading text-white tracking-tight mt-1">
                Missions & Quest Log
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-lg">
                Manage active daily habits, weekly bounties, and system challenges across interactive Kanban status swimlanes to earn EXP, Gold, and Stat Points.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KANBAN QUEST BOARD ENGINE */}
      <KanbanQuestBoard />
    </div>
  );
}
