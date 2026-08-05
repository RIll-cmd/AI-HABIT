import { Exercise } from './exercise';

export interface ExerciseLog {
  id: string;
  sessionId: string;
  exerciseId: string;
  set: number;
  weight: number;
  reps: number;
  rpe?: number | null;
  restTime?: number | null;
  notes?: string | null;
  createdAt: string | Date;
  exercise?: Exercise | null;
}

export interface WorkoutSession {
  id: string;
  characterId: string;
  planId?: string | null;
  duration?: number | null;
  completed: boolean;
  startedAt: string | Date;
  finishedAt?: string | Date | null;
  exerciseLogs?: ExerciseLog[];
}
