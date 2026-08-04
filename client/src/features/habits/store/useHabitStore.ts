import { create } from "zustand";
import { Habit, Mission, CompletionType } from "../types";
import { getBaseReward, calculateFinalReward } from "../utils";
import {
  createHabit,
  fetchHabits,
  fetchTodayMissions,
  completeMission,
  HabitCreatePayload,
} from "../services/habit.service";
import { useCharacterStore } from "@/store/useCharacterStore";

export interface HabitStore {
  habits: Habit[];
  todayMissions: Mission[];
  isLoading: boolean;
  loadHabits: (characterId?: string) => Promise<void>;
  loadTodayMissions: (characterId?: string) => Promise<void>;
  createNewHabit: (characterId: string, payload: HabitCreatePayload) => Promise<Habit | null>;
  executeMissionCompletion: (
    missionId: string,
    habit: Habit,
    completionType: CompletionType
  ) => Promise<void>;
}

const MOCK_CHARACTER_ID = "char-id-123";

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  todayMissions: [],
  isLoading: false,

  loadHabits: async (characterId?: string) => {
    const targetId = characterId || MOCK_CHARACTER_ID;
    set({ isLoading: true });
    try {
      const habits = await fetchHabits(targetId);
      set({ habits, isLoading: false });
    } catch (error) {
      console.error("[useHabitStore] Error loading habits:", error);
      set({ isLoading: false });
    }
  },

  loadTodayMissions: async (characterId?: string) => {
    const targetId = characterId || MOCK_CHARACTER_ID;
    set({ isLoading: true });
    try {
      const todayMissions = await fetchTodayMissions(targetId);
      set({ todayMissions, isLoading: false });
    } catch (error) {
      console.error("[useHabitStore] Error loading today missions:", error);
      set({ isLoading: false });
    }
  },

  createNewHabit: async (characterId: string, payload: HabitCreatePayload) => {
    const targetId = characterId || MOCK_CHARACTER_ID;
    set({ isLoading: true });
    try {
      const newHabit = await createHabit(targetId, payload);
      if (newHabit) {
        set((state) => ({
          habits: [...state.habits, newHabit],
          isLoading: false,
        }));
        // Refresh today's missions to include instance for newly created habit
        await get().loadTodayMissions(targetId);
      } else {
        set({ isLoading: false });
      }
      return newHabit;
    } catch (error) {
      console.error("[useHabitStore] Error creating new habit:", error);
      set({ isLoading: false });
      return null;
    }
  },

  executeMissionCompletion: async (
    missionId: string,
    habit: Habit,
    completionType: CompletionType
  ) => {
    // Step 1: Calculate rewards using pure math utilities
    const baseReward = getBaseReward(habit.difficulty);
    const finalReward = calculateFinalReward(baseReward, completionType);

    // Step 2: Optimistically update local todayMissions state
    set((state) => ({
      todayMissions: state.todayMissions.map((m) =>
        m.id === missionId
          ? {
              ...m,
              status: "COMPLETED" as const,
              completionType,
              expEarned: finalReward.exp,
              statsEarned: finalReward.stat,
              completedAt: new Date().toISOString(),
            }
          : m
      ),
    }));

    // Step 3: Trigger Character Engine progression integration
    useCharacterStore
      .getState()
      .gainExp(finalReward.exp, `Completed Mission: ${habit.name}`);

    // Step 4: Asynchronous background database persistence
    completeMission(missionId, {
      completionType,
      expEarned: finalReward.exp,
      statsEarned: finalReward.stat,
    }).catch((err) => {
      console.error("[useHabitStore] Background mission completion failed:", err);
    });
  },
}));
