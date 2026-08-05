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

const INITIAL_QUESTS: KanbanQuest[] = [
  {
    id: "quest-1",
    characterId: "char-id-123",
    title: "Daily Gym Overload — Bench Press 80kg x 8",
    description: "Execute progressive overload training session. Ensure strictly logged weight and reps.",
    status: "In Progress",
    rank: "B",
    category: "Fitness",
    tags: ["#workout", "#daily", "#overload"],
    subtasks: [
      { id: "sub-1", title: "Warmup sets (50kg x 10)", isCompleted: true },
      { id: "sub-2", title: "Working sets (80kg x 8)", isCompleted: true },
      { id: "sub-3", title: "Log session in Fitness Engine", isCompleted: false },
    ],
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    expReward: 250,
    goldReward: 65,
    statReward: { stat: "strength", amount: 1 },
    activityLogs: [
      {
        id: "log-1",
        action: "CREATED",
        details: "Quest initialized in In Progress column.",
        timestamp: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "quest-2",
    characterId: "char-id-123",
    title: "Complete Algorithmic System Architecture",
    description: "Deep work session focused on data structure optimizations and telemetry pipelines.",
    status: "To Do",
    rank: "A",
    category: "Code",
    tags: ["#study", "#algorithms", "#deepwork"],
    subtasks: [
      { id: "sub-4", title: "Refactor graph traversal algorithms", isCompleted: false },
      { id: "sub-5", title: "Optimize memory complexity to O(1)", isCompleted: false },
    ],
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    expReward: 350,
    goldReward: 90,
    statReward: { stat: "knowledge", amount: 1 },
    activityLogs: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "quest-3",
    characterId: "char-id-123",
    title: "S-Rank Gate Bounty — Defeat Iron Golem",
    description: "Clear the weekly physical boss encounter in the fitness engine.",
    status: "Review",
    rank: "S",
    category: "Main Quest",
    tags: ["#boss", "#s-rank", "#bounty"],
    subtasks: [
      { id: "sub-6", title: "Summon Weekly Boss encounter", isCompleted: true },
      { id: "sub-7", title: "Hit 90% 1RM target weight", isCompleted: true },
      { id: "sub-8", title: "Verify Slay Completion in UI", isCompleted: false },
    ],
    dueDate: new Date(Date.now() + 259200000).toISOString(),
    expReward: 500,
    goldReward: 150,
    statReward: { stat: "strength", amount: 2 },
    activityLogs: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "quest-4",
    characterId: "char-id-123",
    title: "Hydration & Recovery Protocol",
    description: "Maintain 3.5L hydration target and 8 hours of restorative sleep.",
    status: "Completed",
    rank: "F",
    category: "Health",
    tags: ["#daily", "#recovery"],
    subtasks: [
      { id: "sub-9", title: "Drink 3.5L water", isCompleted: true },
      { id: "sub-10", title: "8 hours sleep", isCompleted: true },
    ],
    completedDate: new Date().toISOString(),
    expReward: 50,
    goldReward: 15,
    statReward: { stat: "discipline", amount: 1 },
    activityLogs: [],
    createdAt: new Date().toISOString(),
  },
];

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
  quests: INITIAL_QUESTS,
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
