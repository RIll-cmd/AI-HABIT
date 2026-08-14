import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { evaluateRank } from "../utils/rankEngine";
import { Trophy, Zap, Target } from "lucide-react";

interface ExerciseRankCardProps {
  exerciseName: string;
  e1rm: number;
  currentRank: string;
  nextRank: string;
  nextThreshold: number;
  progress: number;
}

export function ExerciseRankCard({
  exerciseName,
  e1rm,
  currentRank,
  nextRank,
  nextThreshold,
  progress,
}: ExerciseRankCardProps) {
  const rankInfo = evaluateRank(e1rm, exerciseName);
  const isMax = nextRank === "MAX";

  return (
    <div className="relative group p-4 rounded-2xl bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] flex flex-col justify-between overflow-hidden backdrop-blur-xl">
      {/* Ambient Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Target className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-200 truncate font-sans group-hover:text-white transition-colors">
            {exerciseName}
          </span>
        </div>

        <Badge
          className={`${rankInfo.badgeBg} ${rankInfo.badgeBorder} border font-mono font-black text-[10px] uppercase px-2 py-0.5 shadow-[0_0_10px_rgba(0,0,0,0.5)] shrink-0`}
        >
          {currentRank || rankInfo.rank} RANK
        </Badge>
      </div>

      {/* Stats Body */}
      <div className="pt-3 space-y-3 font-mono">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[9.5px] text-slate-400 uppercase tracking-widest block">Est. 1RM</span>
            <div className="text-lg font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] flex items-baseline gap-1">
              <span>{e1rm}</span>
              <span className="text-[10px] text-slate-400 font-normal">kg</span>
            </div>
          </div>

          {!isMax && (
            <div className="text-right">
              <span className="text-[9.5px] text-slate-500 uppercase tracking-widest block">
                Next Target ({nextRank})
              </span>
              <div className="text-xs font-bold text-purple-300 flex items-baseline justify-end gap-0.5">
                <span>{nextThreshold}</span>
                <span className="text-[9px] text-slate-500 font-normal">kg</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {!isMax ? (
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-indigo-400 rounded-full shadow-[0_0_8px_#06b6d4] transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-cyan-400" /> Rank Progress
              </span>
              <span className="text-cyan-300 font-bold">{progress}%</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-amber-500/40 p-[1px]">
              <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full shadow-[0_0_10px_#f59e0b] w-full" />
            </div>
            <div className="flex items-center justify-between text-[9px] text-amber-300 font-mono font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" /> Pinnacle Master
              </span>
              <span>MAX RANK</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

