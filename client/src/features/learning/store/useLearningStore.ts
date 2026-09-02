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
export type StatBonusType = "INTELLIGENCE" | "STRENGTH" | "PERCEPTION" | "AGILITY" | "VITALITY" | "CREATIVITY";
export type SigilArchetype = "ARCH" | "ALCHEMY" | "CROSS" | "GLYPH" | "TREE" | "KEY" | "EYE" | "FILIGREE";

export interface CustomStudyTome {
  id: string;
  title: string;
  category: FocusCategory;
  statBonus: StatBonusType;
  sigilType: SigilArchetype;
  height: number;
  width: number;
  targetMinutes: number;
  totalMinutesStudied: number;
  totalSessionsCompleted: number;
  notes?: string;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  category: FocusCategory;
  linkedHabitId?: string;
  linkedHabitName?: string;
  linkedTomeId?: string;
  linkedTomeTitle?: string;
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
  
  // Custom Study Tomes on Bookshelf
  customTomes: CustomStudyTome[];
  selectedTomeId: string | null;
  
  isArchivistMode: boolean;
  sessionIntent: string;
  chronometerType: "CANDLE" | "HOURGLASS";
  
  // Actions
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setIsArchivistMode: (active: boolean) => void;
  toggleArchivistMode: () => void;
  setSessionIntent: (intent: string) => void;
  setChronometerType: (type: "CANDLE" | "HOURGLASS") => void;
  setMode: (mode: PomodoroMode, customMins?: number) => void;
  setCategory: (cat: FocusCategory) => void;
  setLinkedHabit: (id: string | null, name?: string | null) => void;
  setAmbientSound: (type: AmbientSoundType) => void;
  setAmbientVolume: (vol: number) => void;
  
  // Tome CRUD Actions
  addCustomTome: (tome: Omit<CustomStudyTome, "id" | "totalMinutesStudied" | "totalSessionsCompleted" | "createdAt" | "height" | "width"> & { height?: number; width?: number }) => CustomStudyTome;
  updateCustomTome: (id: string, updates: Partial<CustomStudyTome>) => void;
  deleteCustomTome: (id: string) => void;
  setSelectedTomeId: (id: string | null) => void;
  startStudyOnTome: (tomeId: string) => void;
  
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
const TOMES_STORAGE_KEY = "ascend_custom_study_tomes_v1";

const DEFAULT_DURATIONS: Record<PomodoroMode, number> = {
  FOCUS: 25 * 60,
  SHORT_BREAK: 5 * 60,
  LONG_BREAK: 15 * 60,
  CUSTOM: 30 * 60,
};

/**
 * Calculates physical tome dimensions based on session duration:
 * - 15m -> Slim Folio (Width: 16px, Height: 76px)
 * - 25m -> Standard Grimoire (Width: 22px, Height: 88px)
 * - 45m -> Study Volume (Width: 26px, Height: 100px)
 * - 60m -> Heavy Treatise (Width: 32px, Height: 110px)
 * - 90m+ -> Monumental Codex (Width: 38px, Height: 120px)
 */
export function getTomeDimensions(targetMinutes: number = 25) {
  const m = Number(targetMinutes) || 25;
  if (m <= 15) return { height: 76, width: 16, volumeLabel: "Slim Folio" };
  if (m <= 25) return { height: 88, width: 22, volumeLabel: "Standard Grimoire" };
  if (m <= 45) return { height: 100, width: 26, volumeLabel: "Study Volume" };
  if (m <= 60) return { height: 110, width: 32, volumeLabel: "Heavy Treatise" };
  return { height: 120, width: 38, volumeLabel: "Monumental Codex" };
}

const DEFAULT_INITIAL_TOMES: CustomStudyTome[] = [
  {
    id: "tome-neural-logic",
    title: "Codex of Neural Logic",
    category: "CODING",
    statBonus: "INTELLIGENCE",
    sigilType: "KEY",
    height: 110,
    width: 32,
    targetMinutes: 60,
    totalMinutesStudied: 60,
    totalSessionsCompleted: 1,
    notes: "Deep algorithmic reasoning and architecture design.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tome-iron-discipline",
    title: "Treatise on Iron Will",
    category: "WORK",
    statBonus: "STRENGTH",
    sigilType: "CROSS",
    height: 88,
    width: 22,
    targetMinutes: 25,
    totalMinutesStudied: 25,
    totalSessionsCompleted: 1,
    notes: "Unbroken focus rites and physical mastery.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tome-unseen-mind",
    title: "Grimoire of the Unseen Mind",
    category: "READING",
    statBonus: "PERCEPTION",
    sigilType: "EYE",
    height: 76,
    width: 16,
    targetMinutes: 15,
    totalMinutesStudied: 0,
    totalSessionsCompleted: 0,
    notes: "Perception, research, and deep cognitive awareness.",
    createdAt: new Date().toISOString(),
  },
];

const loadInitialTomes = (): CustomStudyTome[] => {
  if (typeof window === "undefined") return DEFAULT_INITIAL_TOMES;
  try {
    const raw = localStorage.getItem(TOMES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((t) => {
          const dims = getTomeDimensions(t.targetMinutes || 25);
          return {
            ...t,
            height: dims.height,
            width: dims.width,
          };
        });
      }
    }
  } catch (e) {
    console.error("Error loading custom study tomes", e);
  }
  return DEFAULT_INITIAL_TOMES;
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
  customTomes: loadInitialTomes(),
  selectedTomeId: null,
  isArchivistMode: false,
  sessionIntent: "",
  chronometerType: "CANDLE",

  openDrawer: () => {
    playUIMenuSFX("confirm");
    set({ isDrawerOpen: true });
  },

  closeDrawer: () => set({ isDrawerOpen: false }),

  toggleDrawer: () => {
    playUIMenuSFX("confirm");
    set((state) => ({ isDrawerOpen: !state.isDrawerOpen }));
  },

  setIsArchivistMode: (isArchivistMode) => set({ isArchivistMode }),

  toggleArchivistMode: () => {
    playUIMenuSFX("confirm");
    set((state) => ({ isArchivistMode: !state.isArchivistMode }));
  },

  setSessionIntent: (sessionIntent) => set({ sessionIntent }),

  setChronometerType: (chronometerType) => {
    playUIMenuSFX("confirm");
    set({ chronometerType });
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

  // Tome CRUD Actions
  addCustomTome: (tomeData) => {
    playBuffSFX("buff");
    const targetMinutes = tomeData.targetMinutes || 25;
    const dims = getTomeDimensions(targetMinutes);

    const newTome: CustomStudyTome = {
      id: `tome-${Date.now()}`,
      title: tomeData.title.trim() || "Untitled Inscription",
      category: tomeData.category,
      statBonus: tomeData.statBonus,
      sigilType: tomeData.sigilType,
      height: dims.height,
      width: dims.width,
      targetMinutes,
      totalMinutesStudied: 0,
      totalSessionsCompleted: 0,
      notes: tomeData.notes?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    const updated = [...get().customTomes, newTome];
    set({ customTomes: updated, selectedTomeId: newTome.id });

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(TOMES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving custom tomes", e);
      }
    }

    toast.success(`Inscribed "${newTome.title}" onto Shelf!`, {
      description: `${dims.volumeLabel} (${newTome.targetMinutes}m) bound to enhance +${newTome.statBonus.slice(0, 3)}.`,
    });

    return newTome;
  },

  updateCustomTome: (id, updates) => {
    playUIMenuSFX("confirm");
    const updated = get().customTomes.map((t) => {
      if (t.id !== id) return t;
      const targetMins = updates.targetMinutes ?? t.targetMinutes;
      const dims = getTomeDimensions(targetMins);
      return {
        ...t,
        ...updates,
        height: dims.height,
        width: dims.width,
      };
    });
    set({ customTomes: updated });

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(TOMES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Error updating custom tomes", e);
      }
    }

    toast.success("Tome Inscription Updated");
  },

  deleteCustomTome: (id) => {
    playUIMenuSFX("click");
    const target = get().customTomes.find((t) => t.id === id);
    const updated = get().customTomes.filter((t) => t.id !== id);
    const newSelectedId = get().selectedTomeId === id ? null : get().selectedTomeId;
    set({ customTomes: updated, selectedTomeId: newSelectedId });

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(TOMES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Error deleting custom tome", e);
      }
    }

    toast.info(`Removed "${target?.title || "Tome"}" from Shelf.`);
  },

  setSelectedTomeId: (selectedTomeId) => {
    playUIMenuSFX("confirm");
    set({ selectedTomeId });
  },

  startStudyOnTome: (tomeId) => {
    const tome = get().customTomes.find((t) => t.id === tomeId);
    if (!tome) return;

    playBuffSFX("buff");
    set({
      selectedTomeId: tomeId,
      sessionIntent: tome.title,
      selectedCategory: tome.category,
      mode: "FOCUS",
      status: "IDLE",
      timeLeft: (tome.targetMinutes || 25) * 60,
      totalDuration: (tome.targetMinutes || 25) * 60,
    });

    toast.success(`Active Study Tome Bound: "${tome.title}"`, {
      description: `Target: ${tome.targetMinutes}m • Enhances +${tome.statBonus}`,
    });
  },

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
    const { totalDuration } = get();
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
    const {
      mode,
      totalDuration,
      selectedCategory,
      linkedHabitId,
      linkedHabitName,
      selectedTomeId,
      customTomes,
      completedCycles,
      focusSessions,
      sessionIntent,
    } = get();
    const durationMins = Math.round(totalDuration / 60);

    if (mode === "FOCUS") {
      const activeTome = customTomes.find((t) => t.id === selectedTomeId);

      // Base Stat gains
      let knoGain = selectedCategory === "STUDY" || selectedCategory === "CODING" || selectedCategory === "READING" ? 0.4 : 0.2;
      let focGain = 0.4;
      let disGain = 0.3;

      // Extra Stat bonus from custom tome archetype
      if (activeTome) {
        if (activeTome.statBonus === "INTELLIGENCE") knoGain += 0.3;
        else if (activeTome.statBonus === "STRENGTH") disGain += 0.3;
        else if (activeTome.statBonus === "PERCEPTION") focGain += 0.3;
        else if (activeTome.statBonus === "AGILITY") { focGain += 0.2; disGain += 0.2; }
        else if (activeTome.statBonus === "VITALITY") disGain += 0.3;
        else if (activeTome.statBonus === "CREATIVITY") knoGain += 0.3;
      }

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
        linkedTomeId: activeTome ? activeTome.id : undefined,
        linkedTomeTitle: activeTome ? activeTome.title : undefined,
        knoGain,
        focGain,
        disGain,
        expAwarded,
        goldAwarded,
        notes: sessionIntent.trim() || undefined,
        completedAt: new Date().toISOString(),
      };

      const updatedSessions = [newSession, ...focusSessions];

      // Update Active Custom Tome Stats
      let updatedTomes = customTomes;
      if (activeTome) {
        updatedTomes = customTomes.map((t) =>
          t.id === activeTome.id
            ? {
                ...t,
                totalMinutesStudied: t.totalMinutesStudied + durationMins,
                totalSessionsCompleted: t.totalSessionsCompleted + 1,
              }
            : t
        );
      }

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
          localStorage.setItem(TOMES_STORAGE_KEY, JSON.stringify(updatedTomes));
        } catch (e) {
          console.error("Error saving learning data", e);
        }
      }

      // Upgrade Character Stats in Real-Time
      const charStore = useCharacterStore.getState();
      charStore.addStat("focus", focGain);
      charStore.addStat("knowledge", knoGain);
      charStore.addStat("discipline", disGain);
      charStore.gainExp(
        expAwarded,
        isDoubleBoosted
          ? `🧠 [2X BOOST] ${activeTome ? activeTome.title : selectedCategory} (${durationMins}m)`
          : `Pomodoro Focus (${durationMins}m): ${activeTome ? activeTome.title : selectedCategory}`
      );
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
        customTomes: updatedTomes,
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
