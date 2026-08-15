import { create } from "zustand";
import { toast } from "sonner";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useHabitStore } from "@/features/habits/store";
import { useDailyBonusStore } from "@/store/useDailyBonusStore";
import { playBuffSFX, playUIMenuSFX, playAIRASound } from "@/utils/audio";

export type PomodoroMode = "FOCUS" | "SHORT_BREAK" | "LONG_BREAK" | "CUSTOM";
export type PomodoroStatus = "IDLE" | "RUNNING" | "PAUSED" | "COMPLETED";
export type FocusCategory = "STUDY" | "CODING" | "READING" | "WORK" | "CREATIVE" | "GENERAL";
export type AmbientSoundType = "NONE" | "RAIN" | "SPACE_DRONE" | "LOFI_NOISE" | "BINARY_PULSE";

export interface FocusSession {
  id: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  category: FocusCategory;
  linkedHabitId?: string;
  linkedHabitName?: string;
  knoGain: number;
  focGain: number;
  disGain: number;
  expAwarded: number;
  goldAwarded: number;
  notes?: string;
  completedAt: string;
}

export interface LearningState {
  isDrawerOpen: boolean;
  mode: PomodoroMode;
  status: PomodoroStatus;
  timeLeft: number; // in seconds
  totalDuration: number; // in seconds
  customMinutes: number;
  completedCycles: number;
  selectedCategory: FocusCategory;
  linkedHabitId: string | null;
  linkedHabitName: string | null;
  ambientSound: AmbientSoundType;
  ambientVolume: number;
  focusSessions: FocusSession[];
  
  // Actions
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setMode: (mode: PomodoroMode, customMins?: number) => void;
  setCategory: (cat: FocusCategory) => void;
  setLinkedHabit: (id: string | null, name?: string | null) => void;
  setAmbientSound: (type: AmbientSoundType) => void;
  setAmbientVolume: (vol: number) => void;
  
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
  tick: () => void;
  completeSession: () => void;

  getTotalFocusMinutes: () => number;
  getTodayFocusMinutes: () => number;
  getFocusStreak: () => number;
}

const STORAGE_KEY = "ascend_focus_sessions_v1";

const DEFAULT_DURATIONS: Record<PomodoroMode, number> = {
  FOCUS: 25 * 60,
  SHORT_BREAK: 5 * 60,
  LONG_BREAK: 15 * 60,
  CUSTOM: 30 * 60,
};

const loadInitialSessions = (): FocusSession[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Error loading focus sessions", e);
  }
  return [
    {
      id: "focus-sample-1",
      date: new Date().toISOString().split("T")[0],
      durationMinutes: 25,
      category: "STUDY",
      linkedHabitName: "Deep Work / Study Block",
      knoGain: 0.4,
      focGain: 0.4,
      disGain: 0.3,
      expAwarded: 75,
      goldAwarded: 35,
      completedAt: new Date().toISOString(),
    }
  ];
};

export const useLearningStore = create<LearningState>((set, get) => ({
  isDrawerOpen: false,
  mode: "FOCUS",
  status: "IDLE",
  timeLeft: DEFAULT_DURATIONS.FOCUS,
  totalDuration: DEFAULT_DURATIONS.FOCUS,
  customMinutes: 30,
  completedCycles: 0,
  selectedCategory: "STUDY",
  linkedHabitId: null,
  linkedHabitName: null,
  ambientSound: "NONE",
  ambientVolume: 0.5,
  focusSessions: loadInitialSessions(),

  openDrawer: () => {
    playUIMenuSFX("confirm");
    set({ isDrawerOpen: true });
  },

  closeDrawer: () => set({ isDrawerOpen: false }),

  toggleDrawer: () => {
    playUIMenuSFX("confirm");
    set((state) => ({ isDrawerOpen: !state.isDrawerOpen }));
  },

  setMode: (mode, customMins) => {
    const duration =
      mode === "CUSTOM" && customMins
        ? customMins * 60
        : DEFAULT_DURATIONS[mode];

    set({
      mode,
      status: "IDLE",
      timeLeft: duration,
      totalDuration: duration,
      customMinutes: customMins || get().customMinutes,
    });
  },

  setCategory: (selectedCategory) => set({ selectedCategory }),

  setLinkedHabit: (linkedHabitId, linkedHabitName = null) => {
    set({ linkedHabitId, linkedHabitName });
    if (linkedHabitId) {
      toast.info(`Timer linked to habit: ${linkedHabitName || "Habit"}`);
    }
  },

  setAmbientSound: (ambientSound) => set({ ambientSound }),
  setAmbientVolume: (ambientVolume) => set({ ambientVolume }),

  startTimer: () => {
    playUIMenuSFX("confirm");
    set({ status: "RUNNING" });
  },

  pauseTimer: () => {
    playUIMenuSFX("click");
    set({ status: "PAUSED" });
  },

  resumeTimer: () => {
    playUIMenuSFX("confirm");
    set({ status: "RUNNING" });
  },

  resetTimer: () => {
    const { mode, totalDuration } = get();
    set({ status: "IDLE", timeLeft: totalDuration });
  },

  skipTimer: () => {
    const { mode, completedCycles } = get();
    if (mode === "FOCUS") {
      const nextMode = (completedCycles + 1) % 4 === 0 ? "LONG_BREAK" : "SHORT_BREAK";
      get().setMode(nextMode);
    } else {
      get().setMode("FOCUS");
    }
  },

  tick: () => {
    const { status, timeLeft } = get();
    if (status !== "RUNNING") return;

    if (timeLeft > 1) {
      set({ timeLeft: timeLeft - 1 });
    } else {
      // Completed current timer!
      get().completeSession();
    }
  },

  completeSession: () => {
    const { mode, totalDuration, selectedCategory, linkedHabitId, linkedHabitName, completedCycles, focusSessions } = get();
    const durationMins = Math.round(totalDuration / 60);

    if (mode === "FOCUS") {
      const knoGain = selectedCategory === "STUDY" || selectedCategory === "CODING" || selectedCategory === "READING" ? 0.4 : 0.2;
      const focGain = 0.4;
      const disGain = 0.3;

      // 2X Daily Learning Double Boost
      const isDoubleBoosted = useDailyBonusStore.getState().consumeLearningCharge();
      const multiplier = isDoubleBoosted ? 2 : 1;

      const baseExp = Math.round(durationMins * 3.5);
      const baseGold = Math.round(durationMins * 1.5);
      const expAwarded = baseExp * multiplier;
      const goldAwarded = baseGold * multiplier;

      const todayStr = new Date().toISOString().split("T")[0];

      const newSession: FocusSession = {
        id: `focus-${Date.now()}`,
        date: todayStr,
        durationMinutes: durationMins,
        category: selectedCategory,
        linkedHabitId: linkedHabitId || undefined,
        linkedHabitName: linkedHabitName || undefined,
        knoGain,
        focGain,
        disGain,
        expAwarded,
        goldAwarded,
        completedAt: new Date().toISOString(),
      };

      const updatedSessions = [newSession, ...focusSessions];

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
        } catch (e) {
          console.error("Error saving focus sessions", e);
        }
      }

      // Upgrade Character Stats in Real-Time
      const charStore = useCharacterStore.getState();
      charStore.addStat("focus", focGain);
      charStore.addStat("knowledge", knoGain);
      charStore.addStat("discipline", disGain);
      charStore.gainExp(expAwarded, isDoubleBoosted ? `🧠 [2X BOOST] Focus (${durationMins}m): ${selectedCategory}` : `Pomodoro Focus (${durationMins}m): ${selectedCategory}`);
      charStore.gainGold(goldAwarded, isDoubleBoosted ? `🧠 [2X BOOST] Cognitive Bounty` : "Cognitive Output Bounty");

      // Advance linked habit if applicable
      if (linkedHabitId) {
        const habitStore = useHabitStore.getState();
        const linkedHabit = habitStore.habits.find((h) => h.id === linkedHabitId);
        const matchingMission = habitStore.todayMissions.find(
          (m) => m.habitId === linkedHabitId && m.status !== "COMPLETED"
        );
        if (linkedHabit && matchingMission) {
          habitStore.executeMissionCompletion(matchingMission.id, linkedHabit, "NORMAL").catch(() => {});
        }
      }

      playBuffSFX("levelup");
      playAIRASound("SUCCESSFUL");

      toast.success(`Pomodoro Completed (${durationMins}m Focus)`, {
        description: `+${focGain} FOC, +${knoGain} KNO, +${disGain} DIS, +${expAwarded} EXP, +${goldAwarded} Gold!`,
      });

      const nextCycles = completedCycles + 1;
      const nextMode = nextCycles % 4 === 0 ? "LONG_BREAK" : "SHORT_BREAK";

      set({
        status: "COMPLETED",
        completedCycles: nextCycles,
        focusSessions: updatedSessions,
      });

      // Switch to break
      get().setMode(nextMode);
    } else {
      // Break finished
      toast.info("Break complete! Ready to enter Focus State.");
      playAIRASound("NEW_RESISTANCE");
      get().setMode("FOCUS");
    }
  },

  getTotalFocusMinutes: () => {
    return get().focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  },

  getTodayFocusMinutes: () => {
    const today = new Date().toISOString().split("T")[0];
    return get()
      .focusSessions.filter((s) => s.date === today)
      .reduce((acc, s) => acc + s.durationMinutes, 0);
  },

  getFocusStreak: () => {
    const sessions = [...get().focusSessions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (sessions.length === 0) return 0;

    const uniqueDates = Array.from(new Set(sessions.map((s) => s.date)));
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < uniqueDates.length; i++) {
      const date = new Date(uniqueDates[i]);
      date.setHours(0, 0, 0, 0);

      const diffDays = Math.round((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === i || diffDays === i + 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  },
}));
