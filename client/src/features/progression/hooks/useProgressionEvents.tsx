"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Trophy, Sparkles, Zap } from "lucide-react";
import { eventBus } from "../services/EventBus";
import { useCharacterStore } from "@/store/useCharacterStore";
import { playEvolutionSound, playSkillSound } from "@/features/audio/useSystemAudio";

export function useProgressionEvents() {
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);
  const [rankModalData, setRankModalData] = useState<{
    oldRank: string;
    newRank: string;
  }>({
    oldRank: "F",
    newRank: "F",
  });

  const closeRankModal = useCallback(() => {
    setIsRankModalOpen(false);
  }, []);

  useEffect(() => {
    // 1. RANK_ASCENDED Listener
    const unsubRank = eventBus.subscribe("RANK_ASCENDED", (payload) => {
      playEvolutionSound();
      const currentRank = useCharacterStore.getState().character?.rank || "F";
      setRankModalData({
        oldRank: currentRank,
        newRank: payload.newRank,
      });
      setIsRankModalOpen(true);
    });

    // 2. ACHIEVEMENT_UNLOCKED Listener
    const unsubAchievement = eventBus.subscribe("ACHIEVEMENT_UNLOCKED", (payload) => {
      playSkillSound();
      toast.success(
        `ACHIEVEMENT UNLOCKED: ${payload.achievementName || "Milestone Cleared"}!`,
        {
          description: payload.rewardAmount
            ? `Reward: +${payload.rewardAmount} Gold!`
            : "Achievement recorded in your Ascendant Matrix.",
          icon: <Trophy className="w-5 h-5 text-amber-400" />,
        }
      );
    });

    // 3. LEVEL_UP Listener
    const unsubLevel = eventBus.subscribe("LEVEL_UP", (payload) => {
      playEvolutionSound();
      toast.success(`LEVEL UP! You reached Level ${payload.newLevel}!`, {
        description: "Your combat power and stat capacity have expanded!",
        icon: <Zap className="w-5 h-5 text-blue-400" />,
      });
    });

    return () => {
      unsubRank();
      unsubAchievement();
      unsubLevel();
    };
  }, []);

  return {
    isRankModalOpen,
    closeRankModal,
    rankModalData,
  };
}
