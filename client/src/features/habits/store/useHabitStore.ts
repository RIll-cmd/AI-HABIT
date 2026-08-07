import { create } from "zustand";
import { Habit, Mission, CompletionType, HabitStatus } from "../types";
import { getBaseReward, calculateFinalReward } from "../utils";
import {
  createHabit,
  fetchHabits,
  generateTodayMissions,
  fetchTodayMissions,
  completeMission,
  updateHabitStatus,
  HabitCreatePayload,
} from "../services/habit.service";
import { eventBus } from "@/features/progression/services/EventBus";
import "@/features/progression/services/ProgressionEngine";
import { playConfirmedSound } from "@/features/audio/useSystemAudio";

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
  updateHabitStatus: (habitId: string, status: HabitStatus) => Promise<void>;
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
      await generateTodayMissions(targetId);
      const todayMissions = await fetchTodayMissions(targetId);
      set({ todayMissions, isLoading: false });
    } catch (error) {
      console.error("[useHabitStore] Error loading today's missions:", error);
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
        await get().loadTodayMissions(targetId);
      } else {
        console.error(
          `[useHabitStore] createNewHabit failed for targetId '${targetId}'. Service returned null.`
        );
        set({ isLoading: false });
      }
      return newHabit;
    } catch (error) {
      console.error("[useHabitStore] Exception in createNewHabit:", error);
      set({ isLoading: false });
      return null;
    }
  },

  executeMissionCompletion: async (
    missionId: string,
    habit: Habit,
    completionType: CompletionType
  ) => {
    const baseReward = getBaseReward(habit.difficulty);
    const finalReward = calculateFinalReward(baseReward, completionType);

    playConfirmedSound();

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

    // Dispatch MISSION_COMPLETED event to central Progression Engine
    eventBus.publish("MISSION_COMPLETED", {
      baseReward,
      completionType,
      habit,
    });

    completeMission(missionId, {
      completionType,
      expEarned: finalReward.exp,
      statsEarned: finalReward.stat,
    }).catch((err) => {
      console.error("[useHabitStore] Background mission completion failed:", err);
    });
  },

  updateHabitStatus: async (habitId: string, status: HabitStatus) => {
    // Optimistic update
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === habitId ? { ...h, status } : h
      ),
    }));

    // Service call
    const updated = await updateHabitStatus(habitId, status);
    if (!updated) {
      console.error("[useHabitStore] Failed to update habit status, rolling back is not implemented yet");
    }
  },
}));
