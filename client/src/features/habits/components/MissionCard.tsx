"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Target,
  Dumbbell,
  HeartPulse,
  BookOpen,
  Shield,
  Zap,
  Activity,
} from "lucide-react";
import { Mission, Habit, CompletionType, HabitDifficulty } from "../types";
import { getBaseReward, calculateFinalReward } from "../utils";
import { playUISound } from "@/utils/audio";
import { PixelButton } from "@/components/ui/pixel/PixelButton";
import { PixelBadge } from "@/components/ui/pixel/PixelBadge";

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
  const [showBurst, setShowBurst] = useState(false);
  const [burstExp, setBurstExp] = useState(0);

  const habit =
    mission.habit ||
    ({
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

  const handleComplete = (type: CompletionType, exp: number) => {
    setBurstExp(exp);
    setShowBurst(true);
    playUISound("/sounds/General/8_Buffs_Heals_SFX/02_Heal_02.wav");
    onComplete(mission.id, habit, type);
    setTimeout(() => setShowBurst(false), 2000);
  };

  return (
    <div
      className={`p-3.5 bg-[#1A0D2E] border border-[#3b1861] relative overflow-hidden select-none ${
        isCompleted
          ? "border-emerald-500/60 bg-[#14291e]"
          : "hover:border-white/40"
      }`}
    >
      {/* Task Completion Burst Particles & Floating Text */}
      {showBurst && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="font-pixel text-sm font-bold text-white drop-shadow-[0_2px_4px_#000] animate-[pixel-burst_1.2s_steps(8)_forwards]">
            +{burstExp} EXP!
          </div>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white border border-black animate-[pixel-burst_0.8s_steps(6)_forwards]"
              style={{
                top: `${40 + (i % 3) * 10}%`,
                left: `${30 + (i * 7) % 50}%`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="space-y-2.5 relative z-10">
        {/* Header Badges & Title */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <PixelBadge variant="purple" className="text-xs">
                {habit.category || "General"}
              </PixelBadge>
              <PixelBadge
                variant={
                  difficulty === "HARD"
                    ? "warning"
                    : difficulty === "MEDIUM"
                    ? "primary"
                    : "success"
                }
                className="text-xs"
              >
                {difficulty}
              </PixelBadge>
            </div>
            <h4 className="font-pixel text-xs sm:text-sm font-bold text-white truncate">
              {habit.name}
            </h4>
          </div>

          <div className="flex items-center gap-1.5 bg-[#120824] px-2 py-1 border border-[#3b1861] text-xs font-pixel text-white font-bold">
            <StatIcon className="w-3.5 h-3.5 text-white" />
            <span className="capitalize">{habit.primaryStat}</span>
          </div>
        </div>

        {/* COMPLETED STATE */}
        {isCompleted ? (
          <div className="p-2.5 bg-[#0f241a] border border-emerald-500/40 flex items-center justify-between font-pixel text-xs">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>CLEARED ({mission.completionType || "NORMAL"})</span>
            </div>
            <div className="flex items-center gap-2 text-white font-bold">
              <span>+{mission.expEarned || normalReward.exp} EXP</span>
              <span>+{mission.statsEarned || normalReward.stat} STAT</span>
            </div>
          </div>
        ) : (
          /* PENDING TIER BUTTONS */
          <div className="pt-2 border-t border-[#3b1861] space-y-1">
            <div className="grid grid-cols-3 gap-2">
              <PixelButton
                size="sm"
                variant="dark"
                onClick={() => handleComplete("MINI", miniReward.exp)}
                className="flex flex-col py-1.5 h-auto text-xs"
              >
                <span>MINI (40%)</span>
                <span className="text-white mt-0.5">+{miniReward.exp} EXP</span>
              </PixelButton>

              <PixelButton
                size="sm"
                variant="primary"
                onClick={() => handleComplete("NORMAL", normalReward.exp)}
                className="flex flex-col py-1.5 h-auto text-xs"
              >
                <span>NORMAL</span>
                <span className="text-white mt-0.5">+{normalReward.exp} EXP</span>
              </PixelButton>

              <PixelButton
                size="sm"
                variant="warning"
                onClick={() => handleComplete("ELITE", eliteReward.exp)}
                className="flex flex-col py-1.5 h-auto text-xs"
              >
                <span>ELITE (170%)</span>
                <span className="text-white mt-0.5">+{eliteReward.exp} EXP</span>
              </PixelButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MissionCard;
