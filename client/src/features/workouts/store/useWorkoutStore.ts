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

interface WorkoutState {
  isWorkoutActive: boolean;
  startTime: number | null;
  exercises: ExerciseDefinition[]; // Queue of exercises for this session
  sets: WorkoutSet[];
  restTimerEnd: number | null; // Timestamp when rest ends
  
  startWorkout: () => void;
  endWorkout: () => void;
  addExercise: (exercise: ExerciseDefinition) => void;
  logSet: (set: Omit<WorkoutSet, 'id'>) => void;
  removeSet: (id: string) => void;
  startRestTimer: (seconds: number) => void;
  clearRestTimer: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  isWorkoutActive: false,
  startTime: null,
  exercises: [],
  sets: [],
  restTimerEnd: null,

  startWorkout: () => set({ isWorkoutActive: true, startTime: Date.now(), exercises: [], sets: [], restTimerEnd: null }),
  endWorkout: () => set({ isWorkoutActive: false, startTime: null, exercises: [], sets: [], restTimerEnd: null }),
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
  clearRestTimer: () => set({ restTimerEnd: null })
}));
