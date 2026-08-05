export type WorkoutGoal =
  | 'Build Muscle'
  | 'Strength'
  | 'Lose Weight'
  | 'General Fitness';

export interface WorkoutPlan {
  id: string;
  characterId: string;
  name: string;
  goal: WorkoutGoal | string;
  difficulty: string;
  estimatedDuration: number;
  createdAt: string | Date;
}
