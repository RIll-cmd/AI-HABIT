export type MuscleGroupKey =
  | "CHEST"
  | "FRONT_DELTS"
  | "SHOULDERS"
  | "REAR_DELTS"
  | "TRAPS"
  | "LATS"
  | "LOWER_BACK"
  | "BICEPS"
  | "TRICEPS"
  | "FOREARMS"
  | "ABS"
  | "OBLIQUES"
  | "QUADS"
  | "HAMSTRINGS"
  | "GLUTES"
  | "CALVES";

export type RecoveryStatus = "FRESH" | "RECOVERING" | "FATIGUED";

export interface MuscleData {
  id: MuscleGroupKey;
  name: string;
  view: "front" | "back" | "both";
  category: "UPPER_PUSH" | "UPPER_PULL" | "LEGS" | "CORE" | "CORE_POSTERIOR" | "ARMS";
  freshness: number; // 0.0 - 100.0%
  fatigue: number; // 0.0 - 100.0%
  hoursRemaining: number; // e.g. 14.5 hours
  status: RecoveryStatus;
  lastTrainedAt: string | null;
  fullRecoveryHours: number;
}

export interface MuscleRecoverySummary {
  freshCount: number;
  recoveringCount: number;
  fatiguedCount: number;
  totalCount: number;
  overallFreshness: number;
  daysSinceLastWorkout: number;
  lastWorkoutDate: string | null;
}

export interface MuscleRecoveryStatusResponse {
  muscles: Record<MuscleGroupKey, MuscleData>;
  summary: MuscleRecoverySummary;
}

export interface EnrichedExercise {
  id: string;
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  category: "STRENGTH" | "HYPERTROPHY" | "ENDURANCE";
  instructions?: string | null;
  equipment: string;
  trackingMetrics: string;
}

export interface LoggedSetInput {
  exerciseId: string;
  weight: number;
  reps: number;
  rpe?: number;
}

export interface LogWorkoutPayload {
  characterId: string;
  durationSeconds: number;
  sets: LoggedSetInput[];
  sex?: string;
  bodyweight?: number;
  notes?: string;
}
