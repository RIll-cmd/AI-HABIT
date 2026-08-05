export type ExerciseCategory =
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Biceps'
  | 'Triceps'
  | 'Core'
  | 'Cardio'
  | 'Mobility';

export type EquipmentType =
  | 'Barbell'
  | 'Dumbbell'
  | 'Cable'
  | 'Machine'
  | 'Bodyweight'
  | 'Resistance Band';

export type ExerciseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory | string;
  muscleGroup: string;
  equipment: EquipmentType | string;
  difficulty: ExerciseDifficulty | string;
  description?: string | null;
  instructions?: string | null;
  videoUrl?: string | null;
  image?: string | null;
  createdAt: string | Date;
}

export interface WeeklyBoss {
  id: string;
  characterId: string;
  name: string;
  targetExercise: string;
  targetWeight: number;
  targetReps: number;
  rewards: string; // JSON string
  isDefeated: boolean;
  expiresAt: string | Date;
  createdAt: string | Date;
}
