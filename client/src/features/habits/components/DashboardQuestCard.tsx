"use client";

import React, { useState } from "react";
import { CheckCircle2, Check, ListTodo } from "lucide-react";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { KanbanQuest } from "../types/kanban";
import { useKanbanMissionStore } from "../store/useKanbanMissionStore";
import { toast } from "sonner";
import { playUISound } from "@/utils/audio";
import { PixelButton } from "@/components/ui/pixel/PixelButton";
import { PixelBadge } from "@/components/ui/pixel/PixelBadge";
import { PixelProgress } from "@/components/ui/pixel/PixelProgress";

export interface DashboardQuestCardProps {
  quest: KanbanQuest;
}

export const DashboardQuestCard: React.FC<DashboardQuestCardProps> = ({
  quest,
}) => {
  const { updateQuestStatus } = useKanbanMissionStore();
  const [showBurst, setShowBurst] = useState(false);
  const isCompleted = quest.status === "Completed";

  // Subtask progress
  const totalSubtasks = quest.subtasks?.length || 0;
  const completedSubtasks =
    quest.subtasks?.filter((st) => st.isCompleted).length || 0;
  const subtaskPercent =
    totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : 0;

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBurst(true);
    playUISound("/sounds/General/8_Buffs_Heals_SFX/02_Heal_02.wav");
    updateQuestStatus(quest.id, "Completed");
    toast.success(
      `Mission Cleared: ${quest.title}! +${quest.expReward} EXP, +${quest.goldReward}g`
    );
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
          <div className="font-pixel text-xs sm:text-sm font-bold text-white drop-shadow-[0_2px_4px_#000] animate-[pixel-burst_1.2s_steps(8)_forwards]">
            +{quest.expReward} EXP! +{quest.goldReward}g!
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
              <PixelBadge variant="warning" className="text-xs">
                {quest.rank}-RANK
              </PixelBadge>
              <PixelBadge variant="purple" className="text-xs">
                {quest.category || "Mission"}
              </PixelBadge>
            </div>

            <h3
              className={`font-pixel text-xs sm:text-sm font-bold truncate ${
                isCompleted ? "text-white/60 line-through" : "text-white"
              }`}
            >
              {quest.title}
            </h3>
          </div>

          <div>
            {isCompleted ? (
              <div className="flex items-center gap-1 font-pixel text-xs text-white font-bold bg-[#0f241a] border border-emerald-500/40 px-2 py-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>CLEARED</span>
              </div>
            ) : (
              <span className="font-pixel text-xs text-white font-bold bg-[#120824] border border-[#3b1861] px-2 py-0.5">
                {quest.status}
              </span>
            )}
          </div>
        </div>

        {/* Subtask checklist progress */}
        {totalSubtasks > 0 && (
          <div className="space-y-1 font-pixel text-xs text-white font-bold">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ListTodo className="w-3.5 h-3.5 text-white" />
                CHECKLIST ({completedSubtasks}/{totalSubtasks})
              </span>
              <span>{subtaskPercent}%</span>
            </div>
            <PixelProgress
              value={subtaskPercent}
              max={100}
              variant="primary"
              height="sm"
            />
          </div>
        )}

        {/* Rewards & Quick Action Button */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#3b1861]">
          {/* Rewards */}
          <div className="flex items-center gap-3 font-pixel text-xs text-white font-bold">
            <span className="flex items-center gap-1">
              <CurrencyIcon type="EXP" size="xs" /> +{quest.expReward} EXP
            </span>
            <span className="flex items-center gap-1">
              <CurrencyIcon type="GOLD" size="xs" /> +{quest.goldReward}g
            </span>
          </div>

          {/* Action Button */}
          {!isCompleted && (
            <PixelButton
              size="sm"
              variant="primary"
              onClick={handleComplete}
              className="text-xs"
            >
              <Check className="w-3.5 h-3.5 mr-1" /> Clear
            </PixelButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardQuestCard;
