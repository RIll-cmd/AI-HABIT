"use client";

import React from "react";
import {
  Flame,
  CheckCircle2,
  Star,
  Target,
  Dumbbell,
  HeartPulse,
  BookOpen,
  Shield,
  Zap,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mission, Habit, CompletionType, HabitDifficulty } from "../types";
import { getBaseReward, calculateFinalReward } from "../utils";
import { playUISound } from "@/utils/audio";

export interface MissionCardProps {
  mission: Mission;
  onComplete: (
    missionId: string,
    habit: Habit,
    completionType: CompletionType
  ) => void;
}

const STAT_ICONS: Record<string, any> = {
  strength: Dumbbell,
  knowledge: BookOpen,
  discipline: Shield,
  focus: Target,
  endurance: Zap,
  recovery: HeartPulse,
  consistency: Activity,
};

export function MissionCard({ mission, onComplete }: MissionCardProps) {
  const habit = mission.habit || ({
    id: mission.habitId || "habit-default",
    characterId: mission.characterId,
    name: "Daily Routine Mission",
    category: "General",
    difficulty: "EASY" as HabitDifficulty,
    primaryStat: "discipline",
    status: "ACTIVE",
    scheduleType: "DAILY",
    startDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Habit);

  const difficulty = (habit.difficulty || "EASY") as HabitDifficulty;
  const baseReward = getBaseReward(difficulty);
  const miniReward = calculateFinalReward(baseReward, "MINI");
  const normalReward = calculateFinalReward(baseReward, "NORMAL");
  const eliteReward = calculateFinalReward(baseReward, "ELITE");

  const StatIcon = STAT_ICONS[habit.primaryStat?.toLowerCase()] || Target;

  const isCompleted = mission.status === "COMPLETED";

  return (
    <Card className={`bg-[#0B1020] border-white/10 transition-all duration-200 hover:border-white/20 relative overflow-hidden ${
      isCompleted ? "border-emerald-500/30 bg-emerald-950/10" : ""
    }`}>
      {/* Top accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isCompleted
            ? "bg-emerald-500"
            : difficulty === "HARD"
            ? "bg-amber-500"
            : difficulty === "MEDIUM"
            ? "bg-blue-500"
            : "bg-emerald-500"
        }`}
      />

      <CardContent className="p-4 pt-5 space-y-3">
        {/* Header Badges & Title */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-[10px]">
                {habit.category || "General"}
              </Badge>
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  difficulty === "HARD"
                    ? "border-amber-500/40 text-amber-400 bg-amber-500/10"
                    : difficulty === "MEDIUM"
                    ? "border-blue-500/40 text-blue-400 bg-blue-500/10"
                    : "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                }`}
              >
                {difficulty}
              </Badge>
            </div>
            <h4 className="text-base font-bold text-white font-heading truncate">
              {habit.name}
            </h4>
            {habit.description && (
              <p className="text-xs text-slate-400 line-clamp-1">
                {habit.description}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-1 shrink-0 bg-slate-800/80 px-2 py-1 rounded-lg border border-white/5">
            <StatIcon className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px] font-medium text-slate-300 capitalize">
              {habit.primaryStat}
            </span>
          </div>
        </div>

        {/* COMPLETED STATE DISPLAY */}
        {isCompleted ? (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed ({mission.completionType || "NORMAL"})</span>
            </div>
            <div className="flex items-center space-x-3 font-mono font-bold">
              <span className="text-blue-400 flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5" />
                <span>+{mission.expEarned || normalReward.exp} EXP</span>
              </span>
              <span className="text-purple-400 flex items-center space-x-1">
                <Star className="w-3.5 h-3.5" />
                <span>+{mission.statsEarned || normalReward.stat} Stat</span>
              </span>
            </div>
          </div>
        ) : (
          /* PENDING ACTION TIER BUTTONS */
          <div className="space-y-2 pt-1 border-t border-white/5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Select Completion Tier:</span>
              <span className="text-slate-500 font-mono">100% Rewards</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  playUISound("/sounds/General/8_Buffs_Heals_SFX/02_Heal_02.wav");
                  onComplete(mission.id, habit, "MINI");
                }}
                className="border-white/10 hover:border-slate-400 hover:bg-slate-800/80 flex flex-col items-center py-2.5 h-auto text-slate-300"
              >
                <span className="text-xs font-bold text-slate-200">MINI (40%)</span>
                <span className="text-[10px] text-blue-400 font-mono font-semibold">
                  +{miniReward.exp} EXP
                </span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  playUISound("/sounds/General/8_Buffs_Heals_SFX/02_Heal_02.wav");
                  onComplete(mission.id, habit, "NORMAL");
                }}
                className="border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-white flex flex-col items-center py-2.5 h-auto"
              >
                <span className="text-xs font-bold text-blue-300">NORMAL (100%)</span>
                <span className="text-[10px] text-blue-400 font-mono font-semibold">
                  +{normalReward.exp} EXP
                </span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  playUISound("/sounds/General/8_Buffs_Heals_SFX/02_Heal_02.wav");
                  onComplete(mission.id, habit, "ELITE");
                }}
                className="border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-white flex flex-col items-center py-2.5 h-auto"
              >
                <span className="text-xs font-bold text-amber-300">ELITE (170%)</span>
                <span className="text-[10px] text-amber-400 font-mono font-semibold">
                  +{eliteReward.exp} EXP
                </span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
