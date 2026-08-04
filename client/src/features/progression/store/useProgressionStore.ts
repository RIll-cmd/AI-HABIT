import { create } from "zustand";
import { EconomyLog } from "../types";
import {
  fetchEconomyHistory,
  fetchWeeklyAnalytics,
  WeeklyExpDataPoint,
} from "../services";

export interface ProgressionStore {
  goldLogs: EconomyLog[];
  weeklyExpData: WeeklyExpDataPoint[];
  isLoading: boolean;
  loadGoldHistory: (characterId?: string) => Promise<void>;
  loadWeeklyAnalytics: (characterId?: string) => Promise<void>;
}

const MOCK_CHARACTER_ID = "char-id-123";

export const useProgressionStore = create<ProgressionStore>((set) => ({
  goldLogs: [],
  weeklyExpData: [],
  isLoading: false,

  loadGoldHistory: async (characterId?: string) => {
    const targetId = characterId || MOCK_CHARACTER_ID;
    set({ isLoading: true });
    try {
      const logs = await fetchEconomyHistory(targetId);
      set({ goldLogs: logs, isLoading: false });
    } catch (error) {
      console.error("[useProgressionStore] Error loading gold history:", error);
      set({ isLoading: false });
    }
  },

  loadWeeklyAnalytics: async (characterId?: string) => {
    const targetId = characterId || MOCK_CHARACTER_ID;
    set({ isLoading: true });
    try {
      const data = await fetchWeeklyAnalytics(targetId);
      set({ weeklyExpData: data, isLoading: false });
    } catch (error) {
      console.error("[useProgressionStore] Error loading weekly analytics:", error);
      set({ isLoading: false });
    }
  },
}));
