import { create } from "zustand";
import { Exercise, ExerciseCategory, WorkoutSession, ExerciseLog, PersonalRecord, WeeklyBoss } from "../types";
import {
  getExercises,
  startSession,
  logExercise,
  logTextExercise,
  finishSession,
  fetchActiveSession,
  getPersonalRecords,
  getWorkoutHistory,
  getWeeklyBoss,
  ExerciseLogPayload,
  FinishSessionResult,
  WorkoutRewards,
} from "../services/fitness.service";
import { useCharacterStore } from "@/store/useCharacterStore";
import { playConfirmedSound, playNoticeSound, playSuccessfulSound, playEvolutionSound } from "@/features/audio/useSystemAudio";

const DEFAULT_CHARACTER_ID = "char-id-123";

export interface FitnessStore {
  // Exercise database state
  exercises: Exercise[];
  isLoadingExercises: boolean;
  selectedCategory: ExerciseCategory | "All";
  searchQuery: string;

  // Active workout session state
  activeSession: WorkoutSession | null;
  activeExercises: Exercise[];
  sessionLogs: ExerciseLog[];
  sessionSeconds: number;

  // Rest Timer state
  restTimerSeconds: number | null;
  restTimerInitial: number;
  isRestTimerActive: boolean;
  restTimerCompletedBanner: boolean;

  // Personal Records & Gamified Popup
  personalRecords: PersonalRecord[];
  newPRsPopupList: PersonalRecord[];

  // Workout History & Rewards Summary
  workoutHistory: WorkoutSession[];
  isLoadingHistory: boolean;
  latestRewardsSummary: WorkoutRewards | null;

  // Weekly Boss Capstone state
  activeBoss: WeeklyBoss | null;
  isLoadingBoss: boolean;

  // Exercise Database Actions
  loadExercises: () => Promise<void>;
  setSelectedCategory: (category: ExerciseCategory | "All") => void;
  setSearchQuery: (query: string) => void;
  getFilteredExercises: () => Exercise[];

  // Workout Session Actions
  startWorkout: (characterId?: string, planId?: string) => Promise<WorkoutSession | null>;
  logSet: (payload: ExerciseLogPayload) => Promise<ExerciseLog | null>;
  logSetFromText: (text: string) => Promise<ExerciseLog | null>;
  finishWorkout: () => Promise<FinishSessionResult | null>;
  recoverActiveSession: (characterId?: string) => Promise<void>;
  addExerciseToWorkout: (exercise: Exercise) => void;
  removeExerciseFromWorkout: (exerciseId: string) => void;
  incrementSessionTimer: () => void;

  // Rest Timer Actions
  startRestTimer: (seconds: number) => void;
  tickRestTimer: () => void;
  cancelRestTimer: () => void;
  dismissRestBanner: () => void;

  // Personal Records & History Actions
  loadPersonalRecords: (characterId?: string) => Promise<void>;
  loadWorkoutHistory: (characterId?: string) => Promise<void>;
  loadWeeklyBoss: (characterId?: string) => Promise<void>;
  dismissPRPopup: () => void;
  dismissRewardsSummary: () => void;
}

export const useFitnessStore = create<FitnessStore>((set, get) => ({
  exercises: [],
  isLoadingExercises: false,
  selectedCategory: "All",
  searchQuery: "",

  activeSession: null,
  activeExercises: [],
  sessionLogs: [],
  sessionSeconds: 0,

  restTimerSeconds: null,
  restTimerInitial: 60,
  isRestTimerActive: false,
  restTimerCompletedBanner: false,

  personalRecords: [],
  newPRsPopupList: [],

  workoutHistory: [],
  isLoadingHistory: false,
  latestRewardsSummary: null,

  activeBoss: null,
  isLoadingBoss: false,

  loadExercises: async () => {
    if (get().exercises.length > 0) return;
    set({ isLoadingExercises: true });
    try {
      const exercises = await getExercises();
      set({ exercises, isLoadingExercises: false });
    } catch (error) {
      console.error("[useFitnessStore] Error loading exercises:", error);
      set({ isLoadingExercises: false });
    }
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  getFilteredExercises: () => {
    const { exercises, selectedCategory, searchQuery } = get();
    return exercises.filter((exercise) => {
      const matchesCategory =
        selectedCategory === "All" || exercise.category === selectedCategory;
      const matchesQuery =
        searchQuery === "" ||
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.equipment.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesQuery;
    });
  },

  startWorkout: async (characterId?: string, planId?: string) => {
    const targetCharId = characterId || DEFAULT_CHARACTER_ID;
    try {
      const session = await startSession(targetCharId, planId);
      if (session) {
        const existingLogs = session.exerciseLogs || [];
        const uniqueExercises: Exercise[] = [];
        const seenIds = new Set<string>();

        existingLogs.forEach((log) => {
          if (log.exercise && !seenIds.has(log.exercise.id)) {
            seenIds.add(log.exercise.id);
            uniqueExercises.push(log.exercise);
          }
        });

        const startedTime = new Date(session.startedAt).getTime();
        const now = new Date().getTime();
        const initialSeconds = Math.max(0, Math.floor((now - startedTime) / 1000));

        set({
          activeSession: session,
          sessionLogs: existingLogs,
          activeExercises: uniqueExercises,
          sessionSeconds: initialSeconds,
        });

        playConfirmedSound();
      }
      return session;
    } catch (error) {
      console.error("[useFitnessStore] Error starting workout:", error);
      return null;
    }
  },

  logSet: async (payload: ExerciseLogPayload) => {
    const session = get().activeSession;
    if (!session) return null;

    try {
      const newLog = await logExercise(session.id, payload);
      if (newLog) {
        set((state) => ({
          sessionLogs: [...state.sessionLogs, newLog],
        }));

        const restSecs = payload.restTime && payload.restTime > 0 ? payload.restTime : 60;
        get().startRestTimer(restSecs);
      }
      return newLog;
    } catch (error) {
      console.error("[useFitnessStore] Error logging set:", error);
      return null;
    }
  },

  logSetFromText: async (text: string) => {
    const session = get().activeSession;
    if (!session) return null;

    try {
      const newLog = await logTextExercise(session.id, text);
      if (newLog) {
        set((state) => {
          const updatedLogs = [...state.sessionLogs, newLog];
          const updatedExercises = [...state.activeExercises];
          if (newLog.exercise && !updatedExercises.some((e) => e.id === newLog.exercise!.id)) {
            updatedExercises.push(newLog.exercise);
          }
          return {
            sessionLogs: updatedLogs,
            activeExercises: updatedExercises,
          };
        });

        get().startRestTimer(60);
      }
      return newLog;
    } catch (error) {
      console.error("[useFitnessStore] Error logging set from text:", error);
      return null;
    }
  },

  finishWorkout: async () => {
    const session = get().activeSession;
    if (!session) return null;

    try {
      const result = await finishSession(session.id);
      if (result) {
        const newPRs = result.newPRs || [];
        const rewards = result.rewards || null;
        const bossDefeated = result.bossDefeated || false;

        // Dispatch session rewards to global Character store
        if (rewards) {
          const charStore = useCharacterStore.getState();
          if (rewards.exp > 0) {
            charStore.gainExp(rewards.exp, `Workout Session Completed`);
          }
          if (rewards.gold > 0) {
            charStore.gainGold(rewards.gold, `Workout Session Reward`);
          }
          if (rewards.statsEarned) {
            Object.entries(rewards.statsEarned).forEach(([statName, val]) => {
              if (val && val > 0) {
                charStore.addStat(statName, val);
              }
            });
          }
        }

        // If Weekly Boss was slain during session
        if (bossDefeated) {
          playEvolutionSound();
        } else if (newPRs.length > 0) {
          playSuccessfulSound();
        } else {
          playConfirmedSound();
        }

        set({
          activeSession: null,
          activeExercises: [],
          sessionLogs: [],
          sessionSeconds: 0,
          isRestTimerActive: false,
          restTimerSeconds: null,
          newPRsPopupList: newPRs,
          latestRewardsSummary: rewards,
        });

        await Promise.all([
          get().loadPersonalRecords(session.characterId),
          get().loadWorkoutHistory(session.characterId),
          get().loadWeeklyBoss(session.characterId),
        ]);
      }
      return result;
    } catch (error) {
      console.error("[useFitnessStore] Error finishing workout:", error);
      return null;
    }
  },

  recoverActiveSession: async (characterId?: string) => {
    const targetId = characterId || DEFAULT_CHARACTER_ID;
    try {
      const active = await fetchActiveSession(targetId);
      if (active) {
        const existingLogs = active.exerciseLogs || [];
        const uniqueExercises: Exercise[] = [];
        const seenIds = new Set<string>();

        existingLogs.forEach((log) => {
          if (log.exercise && !seenIds.has(log.exercise.id)) {
            seenIds.add(log.exercise.id);
            uniqueExercises.push(log.exercise);
          }
        });

        const startedTime = new Date(active.startedAt).getTime();
        const now = new Date().getTime();
        const initialSeconds = Math.max(0, Math.floor((now - startedTime) / 1000));

        set({
          activeSession: active,
          sessionLogs: existingLogs,
          activeExercises: uniqueExercises,
          sessionSeconds: initialSeconds,
        });
      }
    } catch (error) {
      console.error("[useFitnessStore] Error recovering session:", error);
    }
  },

  addExerciseToWorkout: (exercise: Exercise) => {
    set((state) => {
      if (state.activeExercises.some((e) => e.id === exercise.id)) {
        return state;
      }
      return {
        activeExercises: [...state.activeExercises, exercise],
      };
    });
  },

  removeExerciseFromWorkout: (exerciseId: string) => {
    set((state) => ({
      activeExercises: state.activeExercises.filter((e) => e.id !== exerciseId),
    }));
  },

  incrementSessionTimer: () => {
    set((state) => ({
      sessionSeconds: state.sessionSeconds + 1,
    }));
  },

  startRestTimer: (seconds: number) => {
    set({
      restTimerInitial: seconds,
      restTimerSeconds: seconds,
      isRestTimerActive: true,
      restTimerCompletedBanner: false,
    });
  },

  tickRestTimer: () => {
    const { restTimerSeconds, isRestTimerActive } = get();
    if (!isRestTimerActive || restTimerSeconds === null) return;

    if (restTimerSeconds <= 1) {
      set({
        restTimerSeconds: 0,
        isRestTimerActive: false,
        restTimerCompletedBanner: true,
      });
      playNoticeSound();
    } else {
      set({ restTimerSeconds: restTimerSeconds - 1 });
    }
  },

  cancelRestTimer: () => {
    set({
      isRestTimerActive: false,
      restTimerSeconds: null,
      restTimerCompletedBanner: false,
    });
  },

  dismissRestBanner: () => {
    set({ restTimerCompletedBanner: false });
  },

  loadPersonalRecords: async (characterId?: string) => {
    const targetId = characterId || DEFAULT_CHARACTER_ID;
    try {
      const prs = await getPersonalRecords(targetId);
      set({ personalRecords: prs });
    } catch (error) {
      console.error("[useFitnessStore] Error loading personal records:", error);
    }
  },

  loadWorkoutHistory: async (characterId?: string) => {
    const targetId = characterId || DEFAULT_CHARACTER_ID;
    set({ isLoadingHistory: true });
    try {
      const history = await getWorkoutHistory(targetId);
      set({ workoutHistory: history, isLoadingHistory: false });
    } catch (error) {
      console.error("[useFitnessStore] Error loading workout history:", error);
      set({ isLoadingHistory: false });
    }
  },

  loadWeeklyBoss: async (characterId?: string) => {
    const targetId = characterId || DEFAULT_CHARACTER_ID;
    set({ isLoadingBoss: true });
    try {
      const boss = await getWeeklyBoss(targetId);
      set({ activeBoss: boss, isLoadingBoss: false });
    } catch (error) {
      console.error("[useFitnessStore] Error loading weekly boss:", error);
      set({ isLoadingBoss: false });
    }
  },

  dismissPRPopup: () => {
    set({ newPRsPopupList: [] });
  },

  dismissRewardsSummary: () => {
    set({ latestRewardsSummary: null });
  },
}));
