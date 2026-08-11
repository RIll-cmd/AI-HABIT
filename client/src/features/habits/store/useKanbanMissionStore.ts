import { create } from "zustand";
import { KanbanQuest, QuestRank, QuestStatus, QuestSubtask } from "../types/kanban";
import { useCharacterStore } from "@/store/useCharacterStore";
import { playSuccessfulSound, playConfirmedSound, playEvolutionSound } from "@/features/audio/useSystemAudio";

export const RANK_REWARDS: Record<QuestRank, { exp: number; gold: number; stat: string; statAmount: number }> = {
  F: { exp: 50, gold: 15, stat: "discipline", statAmount: 1 },
  D: { exp: 100, gold: 25, stat: "discipline", statAmount: 1 },
  C: { exp: 150, gold: 40, stat: "focus", statAmount: 1 },
  B: { exp: 250, gold: 65, stat: "strength", statAmount: 1 },
  A: { exp: 350, gold: 90, stat: "knowledge", statAmount: 1 },
  S: { exp: 500, gold: 150, stat: "strength", statAmount: 2 },
};

const INITIAL_QUESTS: KanbanQuest[] = [];

export interface KanbanMissionStore {
  quests: KanbanQuest[];
  searchQuery: string;
  selectedTag: string | null;
  selectedRank: QuestRank | null;

  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  setSelectedRank: (rank: QuestRank | null) => void;

  addQuest: (quest: Omit<KanbanQuest, "id" | "createdAt" | "activityLogs">) => void;
  updateQuestStatus: (questId: string, newStatus: QuestStatus) => void;
  toggleSubtask: (questId: string, subtaskId: string) => void;
  updateProgressOverride: (questId: string, progress: number) => void;
  deleteQuest: (questId: string) => void;
}

export const useKanbanMissionStore = create<KanbanMissionStore>((set, get) => ({
  quests: [],
  searchQuery: "",
  selectedTag: null,
  selectedRank: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  setSelectedRank: (rank) => set({ selectedRank: rank }),

  addQuest: (payload) => {
    const rewards = RANK_REWARDS[payload.rank] || RANK_REWARDS.C;
    const newQuest: KanbanQuest = {
      ...payload,
      id: `quest-${Date.now()}`,
      expReward: payload.expReward || rewards.exp,
      goldReward: payload.goldReward || rewards.gold,
      statReward: payload.statReward || { stat: rewards.stat, amount: rewards.statAmount },
      activityLogs: [
        {
          id: `log-${Date.now()}`,
          action: "CREATED",
          details: `Quest created in '${payload.status}' status with Rank ${payload.rank}.`,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      quests: [newQuest, ...state.quests],
    }));
    playConfirmedSound();
  },

  updateQuestStatus: (questId, newStatus) => {
    const quest = get().quests.find((q) => q.id === questId);
    if (!quest || quest.status === newStatus) return;

    const oldStatus = quest.status;
    const isNowCompleted = newStatus === "Completed";
    const completedDate = isNowCompleted ? new Date().toISOString() : undefined;

    // Handle RPG Character Engine rewards upon status transition to Completed
    if (isNowCompleted && oldStatus !== "Completed") {
      const charStore = useCharacterStore.getState();
      charStore.gainExp(quest.expReward, `Quest Cleared: ${quest.title}`);
      charStore.gainGold(quest.goldReward, `Quest Completion Loot`);
      charStore.addStat(quest.statReward.stat, quest.statReward.amount);

      if (quest.rank === "S" || quest.rank === "A") {
        playEvolutionSound();
      } else {
        playSuccessfulSound();
      }
    } else {
      playConfirmedSound();
    }

    set((state) => ({
      quests: state.quests.map((q) => {
        if (q.id !== questId) return q;
        const newLogs = [
          ...q.activityLogs,
          {
            id: `log-${Date.now()}`,
            action: "STATUS_CHANGE",
            details: `Status changed from '${oldStatus}' to '${newStatus}'.`,
            timestamp: new Date().toISOString(),
          },
        ];
        return {
          ...q,
          status: newStatus,
          completedDate: completedDate || q.completedDate,
          activityLogs: newLogs,
        };
      }),
    }));
  },

  toggleSubtask: (questId, subtaskId) => {
    set((state) => ({
      quests: state.quests.map((q) => {
        if (q.id !== questId) return q;
        const updatedSubtasks = q.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
        );
        return {
          ...q,
          subtasks: updatedSubtasks,
        };
      }),
    }));
  },

  updateProgressOverride: (questId, progress) => {
    set((state) => ({
      quests: state.quests.map((q) =>
        q.id === questId ? { ...q, progressOverride: Math.min(100, Math.max(0, progress)) } : q
      ),
    }));
  },

  deleteQuest: (questId) => {
    set((state) => ({
      quests: state.quests.filter((q) => q.id !== questId),
    }));
  },
}));
