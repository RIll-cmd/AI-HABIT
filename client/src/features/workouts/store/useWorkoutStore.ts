import { create } from 'zustand';
import { API_BASE_URL } from '@/constants';
import { 
  MuscleRecoveryStatusResponse, 
  EnrichedExercise, 
  LogWorkoutPayload 
} from '../types/muscleRecovery';

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  weight: number;
  reps: number;
  rpe?: number;
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  primaryMuscle: string;
  secondaryMuscles?: string[];
  category?: string;
  equipment: string;
}

export interface CustomWorkoutPlan {
  id: string;
  name: string;
  target: string;
  exercises: ExerciseDefinition[];
  createdAt: number;
}

interface WorkoutState {
  isWorkoutActive: boolean;
  sessionId: string | null;
  activeTemplateName: string | null;
  startTime: number | null;
  exercises: ExerciseDefinition[];
  sets: WorkoutSet[];
  restTimerEnd: number | null;
  customTemplates: CustomWorkoutPlan[];
  
  // Real-Time Muscle Recovery Engine State
  muscleRecovery: MuscleRecoveryStatusResponse | null;
  isLoadingRecovery: boolean;
  availableExercises: EnrichedExercise[];
  isLoadingExercises: boolean;

  // Actions
  startWorkout: (sessionId: string) => void;
  startWorkoutWithTemplate: (templateName: string, templateExercises: ExerciseDefinition[], sessionId: string) => void;
  endWorkout: () => void;
  addExercise: (exercise: ExerciseDefinition) => void;
  logSet: (set: Omit<WorkoutSet, 'id'>) => void;
  removeSet: (id: string) => void;
  startRestTimer: (seconds: number) => void;
  clearRestTimer: () => void;

  // Custom Workout Plans
  addCustomTemplate: (name: string, target: string, exercises: ExerciseDefinition[]) => void;
  deleteCustomTemplate: (id: string) => void;
  hydrateTemplates: () => void;

  // Real-Time Recovery & Logging API Calls
  fetchMuscleRecoveryStatus: (characterId: string) => Promise<MuscleRecoveryStatusResponse | null>;
  resetMuscleRecovery: (characterId: string) => Promise<void>;
  fetchAvailableExercises: () => Promise<EnrichedExercise[]>;
  logCompletedWorkout: (payload: LogWorkoutPayload) => Promise<any>;
}

const STORAGE_KEY = "ascend_os_custom_workout_plans";

const loadStoredCustomTemplates = (): CustomWorkoutPlan[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveCustomTemplates = (templates: CustomWorkoutPlan[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch (e) {}
};

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  isWorkoutActive: false,
  sessionId: null,
  activeTemplateName: null,
  startTime: null,
  exercises: [],
  sets: [],
  restTimerEnd: null,
  customTemplates: [],
  muscleRecovery: null,
  isLoadingRecovery: false,
  availableExercises: [],
  isLoadingExercises: false,

  hydrateTemplates: () => set({ customTemplates: loadStoredCustomTemplates() }),

  startWorkout: (sessionId) => set({
    isWorkoutActive: true,
    sessionId,
    activeTemplateName: "Custom Session",
    startTime: Date.now(),
    exercises: [],
    sets: [],
    restTimerEnd: null
  }),

  startWorkoutWithTemplate: (templateName, templateExercises, sessionId) => set({
    isWorkoutActive: true,
    sessionId,
    activeTemplateName: templateName,
    startTime: Date.now(),
    exercises: templateExercises,
    sets: [],
    restTimerEnd: null
  }),

  endWorkout: () => set({
    isWorkoutActive: false,
    sessionId: null,
    activeTemplateName: null,
    startTime: null,
    exercises: [],
    sets: [],
    restTimerEnd: null
  }),

  addExercise: (exercise) => set((state) => {
    if (!state.exercises.find(e => e.id === exercise.id)) {
      return { exercises: [...state.exercises, exercise] };
    }
    return state;
  }),

  logSet: (newSet) => set((state) => ({
    sets: [...state.sets, { ...newSet, id: crypto.randomUUID() }]
  })),

  removeSet: (id) => set((state) => ({
    sets: state.sets.filter(s => s.id !== id)
  })),

  startRestTimer: (seconds) => set({ restTimerEnd: Date.now() + seconds * 1000 }),
  clearRestTimer: () => set({ restTimerEnd: null }),

  addCustomTemplate: (name, target, exercises) => set((state) => {
    const newPlan: CustomWorkoutPlan = {
      id: `custom-plan-${Date.now()}`,
      name,
      target,
      exercises,
      createdAt: Date.now(),
    };
    const updated = [newPlan, ...state.customTemplates];
    saveCustomTemplates(updated);
    return { customTemplates: updated };
  }),

  deleteCustomTemplate: (id) => set((state) => {
    const updated = state.customTemplates.filter((p) => p.id !== id);
    saveCustomTemplates(updated);
    return { customTemplates: updated };
  }),

  // API Calls
  fetchMuscleRecoveryStatus: async (characterId: string) => {
    if (!characterId) return null;
    set({ isLoadingRecovery: true });
    try {
      const res = await fetch(`${API_BASE_URL}/api/workouts/muscle-status/${characterId}`);
      if (!res.ok) throw new Error("Failed to fetch muscle recovery status");
      const data: MuscleRecoveryStatusResponse = await res.json();
      set({ muscleRecovery: data, isLoadingRecovery: false });
      return data;
    } catch (error) {
      console.error("Error fetching muscle recovery:", error);
      set({ isLoadingRecovery: false });
      return null;
    }
  },

  resetMuscleRecovery: async (characterId: string) => {
    if (!characterId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/workouts/reset-recovery/${characterId}`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        set({ muscleRecovery: data.status });
      }
    } catch (error) {
      console.error("Error resetting muscle recovery:", error);
    }
  },

  fetchAvailableExercises: async () => {
    set({ isLoadingExercises: true });
    try {
      const res = await fetch(`${API_BASE_URL}/api/workouts/exercises`);
      if (!res.ok) throw new Error("Failed to fetch exercises");
      const data: EnrichedExercise[] = await res.json();
      set({ availableExercises: data, isLoadingExercises: false });
      return data;
    } catch (error) {
      console.error("Error fetching available exercises:", error);
      set({ isLoadingExercises: false });
      return [];
    }
  },

  logCompletedWorkout: async (payload: LogWorkoutPayload) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/workouts/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to log workout session");
      const data = await res.json();
      if (data.recoveryStatus) {
        set({ muscleRecovery: data.recoveryStatus });
      } else {
        get().fetchMuscleRecoveryStatus(payload.characterId);
      }
      return data;
    } catch (error) {
      console.error("Error logging workout session:", error);
      throw error;
    }
  }
}));
