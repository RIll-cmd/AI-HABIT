import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { API_BASE_URL } from "@/constants";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { useBeastStore } from "@/features/beasts/store/useBeastStore";

export interface DailyBonusState {
  lastResetDate: string; // YYYY-MM-DD
  lastWeekResetDate: string; // YYYY-[W]WW

  // 1. Habit Double Boost (5 charges daily)
  habitBoostCharges: number;
  maxHabitBoostCharges: number;

  // 2. Learning Double Boost (1 charge daily)
  learningBoostCharges: number;
  maxLearningBoostCharges: number;

  // 3. Workout Double Boost (1 charge daily)
  workoutBoostCharges: number;
  maxWorkoutBoostCharges: number;

  // 4. Daily Scaled Free Mystery Egg (1 claim daily)
  dailyEggClaimed: boolean;

  // 5. Free Shop Refreshes (5 charges daily)
  shopRefreshCharges: number;
  maxShopRefreshCharges: number;

  // Weekly Quest Tracking
  weeklyBossPrDefeated: boolean;
  weeklyBonusesClaimedCount: number;
  weeklyTowerFloorsCleared: number;
  weeklyStepsAccumulated: number;

  // Actions
  checkAndResetDaily: () => void;
  consumeHabitCharge: () => boolean;
  consumeLearningCharge: () => boolean;
  consumeWorkoutCharge: () => boolean;
  consumeShopRefresh: () => boolean;
  claimDailyEgg: (characterId: string, characterLevel: number) => Promise<boolean>;
  recordBossPrDefeat: () => void;
  recordTowerFloorClear: () => void;
  recordSteps: (steps: number) => void;
}

export function getDailyEggForLevel(level: number): {
  id: string;
  name: string;
  eggType: string;
  sprite: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY" | "HOLOGRAPHIC";
  targetSteps: number;
} {
  if (level >= 71) {
    return {
      id: "COSMIC",
      name: "Cosmic Void Egg",
      eggType: "VOID",
      sprite: "/eggs/egg_13.png",
      rarity: "HOLOGRAPHIC",
      targetSteps: 20000,
    };
  } else if (level >= 46) {
    return {
      id: "CYBER",
      name: "Neon Cyber Egg",
      eggType: "CYBER",
      sprite: "/eggs/egg_15.png",
      rarity: "LEGENDARY",
      targetSteps: 12000,
    };
  } else if (level >= 26) {
    return {
      id: "SOLAR",
      name: "Solar Flare Egg",
      eggType: "FIRE",
      sprite: "/eggs/egg_6.png",
      rarity: "EPIC",
      targetSteps: 8000,
    };
  } else if (level >= 11) {
    return {
      id: "FROST",
      name: "Glacial Cryo Egg",
      eggType: "FROST",
      sprite: "/eggs/egg_4.png",
      rarity: "RARE",
      targetSteps: 5000,
    };
  } else {
    return {
      id: "WOODLAND",
      name: "Woodland Earth Egg",
      eggType: "NATURE",
      sprite: "/eggs/egg_1.png",
      rarity: "COMMON",
      targetSteps: 3000,
    };
  }
}

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getCurrentWeekString(): string {
  const d = new Date();
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const pastDaysOfYear = (d.getTime() - startOfYear.getTime()) / 86400000;
  const weekNum = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${weekNum}`;
}

export const useDailyBonusStore = create<DailyBonusState>()(
  persist(
    (set, get) => ({
      lastResetDate: "",
      lastWeekResetDate: "",

      habitBoostCharges: 5,
      maxHabitBoostCharges: 5,

      learningBoostCharges: 1,
      maxLearningBoostCharges: 1,

      workoutBoostCharges: 1,
      maxWorkoutBoostCharges: 1,

      dailyEggClaimed: false,

      shopRefreshCharges: 5,
      maxShopRefreshCharges: 5,

      weeklyBossPrDefeated: false,
      weeklyBonusesClaimedCount: 0,
      weeklyTowerFloorsCleared: 0,
      weeklyStepsAccumulated: 0,

      checkAndResetDaily: () => {
        const today = getTodayString();
        const thisWeek = getCurrentWeekString();
        const state = get();

        const updates: Partial<DailyBonusState> = {};

        // Daily Reset Check
        if (state.lastResetDate !== today) {
          updates.lastResetDate = today;
          updates.habitBoostCharges = 5;
          updates.learningBoostCharges = 1;
          updates.workoutBoostCharges = 1;
          updates.dailyEggClaimed = false;
          updates.shopRefreshCharges = 5;
        }

        // Weekly Reset Check
        if (state.lastWeekResetDate !== thisWeek) {
          updates.lastWeekResetDate = thisWeek;
          updates.weeklyBossPrDefeated = false;
          updates.weeklyBonusesClaimedCount = 0;
          updates.weeklyTowerFloorsCleared = 0;
          updates.weeklyStepsAccumulated = 0;
        }

        if (Object.keys(updates).length > 0) {
          set(updates);
        }
      },

      consumeHabitCharge: () => {
        get().checkAndResetDaily();
        const current = get().habitBoostCharges;
        if (current > 0) {
          set((state) => ({
            habitBoostCharges: state.habitBoostCharges - 1,
            weeklyBonusesClaimedCount: state.weeklyBonusesClaimedCount + 1,
          }));
          playBuffSFX("speed");
          toast.success("⚡ 2X GOLD & EXP ACTIVE!", {
            description: `Mission rewards doubled! (${current - 1} / 5 charges remaining today)`,
          });
          return true;
        }
        return false;
      },

      consumeLearningCharge: () => {
        get().checkAndResetDaily();
        const current = get().learningBoostCharges;
        if (current > 0) {
          set((state) => ({
            learningBoostCharges: state.learningBoostCharges - 1,
            weeklyBonusesClaimedCount: state.weeklyBonusesClaimedCount + 1,
          }));
          playBuffSFX("levelup");
          toast.success("🧠 2X NEURAL LEARNING MULTIPLIER!", {
            description: "Study session EXP & Gold doubled!",
          });
          return true;
        }
        return false;
      },

      consumeWorkoutCharge: () => {
        get().checkAndResetDaily();
        const current = get().workoutBoostCharges;
        if (current > 0) {
          set((state) => ({
            workoutBoostCharges: state.workoutBoostCharges - 1,
            weeklyBonusesClaimedCount: state.weeklyBonusesClaimedCount + 1,
          }));
          playBuffSFX("buff");
          toast.success("⚔️ 2X KINETIC WORKOUT SURGE!", {
            description: "Workout gains & stat progression doubled!",
          });
          return true;
        }
        return false;
      },

      consumeShopRefresh: () => {
        get().checkAndResetDaily();
        const current = get().shopRefreshCharges;
        if (current > 0) {
          set((state) => ({
            shopRefreshCharges: state.shopRefreshCharges - 1,
            weeklyBonusesClaimedCount: state.weeklyBonusesClaimedCount + 1,
          }));
          playUIMenuSFX("confirm");
          toast.success("🔄 FREE SHOP REROLL USED!", {
            description: `${current - 1} / 5 free rerolls remaining today.`,
          });
          return true;
        }
        return false;
      },

      claimDailyEgg: async (characterId: string, characterLevel: number) => {
        get().checkAndResetDaily();
        if (get().dailyEggClaimed) {
          toast.error("You have already claimed today's Daily Mystery Egg!");
          return false;
        }

        const eggConfig = getDailyEggForLevel(characterLevel);
        playBuffSFX("levelup");

        try {
          const res = await fetch(`${API_BASE_URL}/api/beasts/eggs/claim-daily`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ characterId, level: characterLevel }),
          });

          if (res.ok) {
            set((state) => ({
              dailyEggClaimed: true,
              weeklyBonusesClaimedCount: state.weeklyBonusesClaimedCount + 1,
            }));
            await useBeastStore.getState().fetchCollection(characterId);
            toast.success(`🎁 Claimed Daily Free ${eggConfig.name}!`, {
              description: `Scaled to your Level ${characterLevel} (${eggConfig.rarity} tier). Ready in Incubator!`,
            });
            return true;
          } else {
            const err = await res.json().catch(() => ({ detail: "Failed to claim daily egg" }));
            toast.error(err.detail || "Failed to claim daily egg");
            return false;
          }
        } catch {
          // Fallback optimistic claim
          set((state) => ({
            dailyEggClaimed: true,
            weeklyBonusesClaimedCount: state.weeklyBonusesClaimedCount + 1,
          }));
          toast.success(`🎁 Claimed Daily Free ${eggConfig.name}!`);
          return true;
        }
      },

      recordBossPrDefeat: () => {
        set({ weeklyBossPrDefeated: true });
        toast.success("👑 WEEKLY QUEST OBJECTIVE CLEARED: Boss PR Defeated!");
      },

      recordTowerFloorClear: () => {
        set((state) => ({
          weeklyTowerFloorsCleared: state.weeklyTowerFloorsCleared + 1,
        }));
      },

      recordSteps: (steps: number) => {
        set((state) => ({
          weeklyStepsAccumulated: state.weeklyStepsAccumulated + steps,
        }));
      },
    }),
    {
      name: "ascend-daily-bonuses-v1",
    }
  )
);
