import { create } from 'zustand';

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

export const useWorkoutStore = create<WorkoutState>((set) => ({
  isWorkoutActive: false,
  sessionId: null,
  activeTemplateName: null,
  startTime: null,
  exercises: [],
  sets: [],
  restTimerEnd: null,
  customTemplates: [],

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
}));
